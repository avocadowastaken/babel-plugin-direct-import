"use strict";

const getModuleExports = require("./internal/getModuleExports");
const parsePluginOptions = require("./internal/parsePluginOptions");

/**
 * @param {string} localName
 * @param {string} source
 */
function warnNamespaceImport(localName, source) {
  console.warn(
    `
babel-plugin-direct-import: Can not optimize 'import * as ${localName} from "${source}"'.
See plugin limitations https://git.io/vFDOO for more details.    
`.trim()
  );
}

/**
 * @param {import("@babel/core")} babel
 * @returns {import("@babel/core").PluginObj}
 */
module.exports = function plugin({ types: t }) {
  /** @type {Map<string, string | undefined>} */
  const modulesCache = new Map();

  /**
   * @type {Map<
   *   string,
   *   Map<string, import("./internal/getModuleExports").ModuleExport>
   * >}
   */
  const moduleExportsCache = new Map();

  /**
   * @param {string} name
   * @param {import("@babel/core").PluginOptions} opts
   * @returns {Map<
   *   string,
   *   import("./internal/getModuleExports").ModuleExport
   * >}
   */
  function getCachedModuleExports(name, opts) {
    let moduleExports = moduleExportsCache.get(name);

    if (!moduleExports) {
      if (!modulesCache.size) {
        const { modules } = parsePluginOptions(opts);

        for (const module of modules) {
          modulesCache.set(module.name, module.indexFile);
        }
      }

      if (!modulesCache.has(name)) {
        moduleExports = new Map();
      } else {
        moduleExports = getModuleExports(name, modulesCache.get(name));
      }

      moduleExportsCache.set(name, moduleExports);
    }

    return moduleExports;
  }

  return {
    name: "babel-plugin-direct-import",
    visitor: {
      ImportDeclaration(declaration, { opts }) {
        const { source, specifiers, importKind } = declaration.node;
        if (!specifiers.length || importKind === "type") return;
        const moduleExports = getCachedModuleExports(source.value, opts);
        if (!moduleExports.size) return;

        for (const specifier of specifiers) {
          if (t.isImportNamespaceSpecifier(specifier)) {
            warnNamespaceImport(specifier.local.name, source.value);
            continue;
          }

          const moduleName = t.isImportDefaultSpecifier(specifier)
            ? "default"
            : t.isIdentifier(specifier.imported)
            ? specifier.imported.name
            : specifier.imported.value;
          const exports = moduleExports.get(moduleName);

          if (exports) {
            declaration.node.specifiers = declaration.node.specifiers.filter(
              (x) => x !== specifier
            );

            const localName = t.identifier(specifier.local.name);

            declaration.insertBefore(
              t.importDeclaration(
                [
                  exports.internal === "*"
                    ? t.importNamespaceSpecifier(localName)
                    : exports.internal === "default"
                    ? t.importDefaultSpecifier(localName)
                    : t.importSpecifier(
                        localName,
                        t.identifier(exports.internal)
                      ),
                ],
                t.stringLiteral(exports.source)
              )
            );
          }
        }

        if (!declaration.node.specifiers.length) declaration.remove();
      },
    },
  };
};
