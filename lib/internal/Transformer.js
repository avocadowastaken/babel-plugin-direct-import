"use strict";

const memoize = require("../utils/memoize");

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
 * @typedef {object} BabelAPI
 * @property {import("@babel/core").parse} parse
 * @property {import("@babel/core").types} types
 */

class Transformer {
  /** @readonly */
  #types;
  /** @readonly */
  #config;
  /** @readonly */
  #parser;
  /**
   * @type {(id: string) => Map<string, import("./Dependency")>}
   * @readonly
   */
  #getDependenciesMap = memoize((id) => this.#parser.getDependenciesMap(id));

  /**
   * @param {import('../config').PluginConfig} config
   * @param {import("./Parser")} parser
   * @param {import("@babel/core").types} types
   */
  constructor(config, parser, types) {
    this.#types = types;
    this.#parser = parser;
    this.#config = config;
  }

  /**
   * @param {import("@babel/core").NodePath<
   *   import("@babel/types").ImportDeclaration
   * >} declaration
   * @returns {void}
   */
  transform(declaration) {
    const t = this.#types;
    const {
      specifiers,
      importKind,
      source: { value: id },
    } = declaration.node;
    if (
      importKind === "type" ||
      !specifiers.length ||
      !this.#config.modules.has(id)
    ) {
      return;
    }

    const dependencies = this.#getDependenciesMap(id);
    if (!dependencies.size) {
      return;
    }

    /** @type {Set<import("@babel/types").Node>} */
    const removedSpecifiers = new Set();

    for (const specifier of specifiers) {
      if (t.isImportNamespaceSpecifier(specifier)) {
        warnNamespaceImport(specifier.local.name, id);
        continue;
      }

      const moduleName = t.isImportDefaultSpecifier(specifier)
        ? "default"
        : t.isIdentifier(specifier.imported)
        ? specifier.imported.name
        : specifier.imported.value;
      const dependency = dependencies.get(moduleName);

      if (!dependency) {
        continue;
      }

      const localName = t.identifier(specifier.local.name);
      const replacement = t.importDeclaration(
        [
          dependency.internalID === "*"
            ? t.importNamespaceSpecifier(localName)
            : dependency.internalID === "default"
            ? t.importDefaultSpecifier(localName)
            : t.importSpecifier(localName, t.identifier(dependency.internalID)),
        ],
        t.stringLiteral(dependency.source)
      );

      removedSpecifiers.add(specifier);
      declaration.insertBefore(replacement);
    }

    if (removedSpecifiers.size === declaration.node.specifiers.length) {
      declaration.remove();
    } else {
      declaration.node.specifiers = declaration.node.specifiers.filter(
        (specifier) => !removedSpecifiers.has(specifier)
      );
    }
  }
}

module.exports = Transformer;
