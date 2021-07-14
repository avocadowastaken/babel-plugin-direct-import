"use strict";

const PluginOptions = require("./internal/PluginOptions");
const DependencyTree = require("./internal/DependencyTree");

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

  return {
    name: "babel-plugin-direct-import",
    visitor: {
      ImportDeclaration(declaration, { opts }) {
        const { source, specifiers, importKind } = declaration.node;
        if (!specifiers.length || importKind === "type") return;

        const pluginOptions = PluginOptions.parse(opts);
        const nodeModule = pluginOptions.modules.get(source.value);
        if (!nodeModule) return;
        const tree = DependencyTree.create(nodeModule, babel);

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
          const dependency = tree.dependencies.get(moduleName);

          if (dependency) {
            declaration.node.specifiers = declaration.node.specifiers.filter(
              (x) => x !== specifier
            );

            const localName = t.identifier(specifier.local.name);

            declaration.insertBefore(
              t.importDeclaration(
                [
                  dependency.internalID === "*"
                    ? t.importNamespaceSpecifier(localName)
                    : dependency.internalID === "default"
                    ? t.importDefaultSpecifier(localName)
                    : t.importSpecifier(
                        localName,
                        t.identifier(dependency.internalID)
                      ),
                ],
                t.stringLiteral(dependency.source)
              )
            );
          }
        }

        if (!declaration.node.specifiers.length) declaration.remove();
      },
    },
  };
};
