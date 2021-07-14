"use strict";

const PluginOptions = require("./internal/PluginOptions");
const getModuleExports = require("./internal/getModuleExports");

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
module.exports = function plugin(babel) {
  const { types: t } = babel;

  /**
   * @type {Map<
   *   string,
   *   Map<string, import("./internal/getModuleExports").ModuleExport>
   * >}
   */
  const moduleExportsCache = new Map();

  /**
   * @param {string} name
   * @param {import('./internal/NodeModule')} nodeModule
   * @returns {Map<
   *   string,
   *   import("./internal/getModuleExports").ModuleExport
   * >}
   */
  function getCachedModuleExports(name, nodeModule) {
    let moduleExports = moduleExportsCache.get(name);

    if (!moduleExports) {
      moduleExports = getModuleExports(nodeModule, babel);
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

        const pluginOptions = PluginOptions.parse(opts);
        const nodeModule = pluginOptions.modules.get(source.value);
        if (!nodeModule) return;

        const moduleExports = getCachedModuleExports(source.value, nodeModule);

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
