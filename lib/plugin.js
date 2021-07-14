"use strict";

const PluginOptions = require("./internal/PluginOptions");
const DependencyTree = require("./internal/DependencyTree");

/**
 * @param {import("@babel/core")} babel
 * @returns {import("@babel/core").PluginObj}
 */
module.exports = function plugin(babel) {
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
          const replacement = tree.process(specifier);

          if (replacement) {
            declaration.node.specifiers = declaration.node.specifiers.filter(
              (x) => x !== specifier
            );

            declaration.insertBefore(replacement);
          }
        }

        if (!declaration.node.specifiers.length) declaration.remove();
      },
    },
  };
};
