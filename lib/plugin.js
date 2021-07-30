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
        const nodeModule = pluginOptions.findNodeModule(source.value);
        if (!nodeModule) return;
        const tree = DependencyTree.create(nodeModule, babel);

        /** @type {Set<import("@babel/types").Node>} */
        const removedSpecifiers = new Set();

        for (const specifier of specifiers) {
          const replacement = tree.findReplacement(specifier);

          if (replacement) {
            removedSpecifiers.add(specifier);
            declaration.insertBefore(replacement);
          }
        }

        if (removedSpecifiers.size === declaration.node.specifiers.length) {
          declaration.remove();
        } else {
          declaration.node.specifiers = declaration.node.specifiers.filter(
            (specifier) => !removedSpecifiers.has(specifier)
          );
        }
      },
    },
  };
};
