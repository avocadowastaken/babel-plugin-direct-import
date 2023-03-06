"use strict";

const fs = require("node:fs");
const assert = require("node:assert");
const path = require("node:path");
const Dependency = require("./Dependency.js");
const resolveModule = require("../utils/resolveModule.js");
const memoize = require("../utils/memoize.js");

class Parser {
  /** @readonly */
  #parse;
  /** @readonly */
  #types;
  /**
   * @type {(filename: string) => import("@babel/types").Statement[]}
   * @readonly
   */
  #visitFile = memoize((filename) => {
    const content = fs.readFileSync(filename, "utf-8");
    const ast = this.#parse(content, {
      filename,
      ast: true,
      babelrc: false,
      configFile: false,
      sourceType: "module",
    });
    assert.ok(this.#types.isFile(ast));
    return ast.program.body;
  });
  /**
   * @type {(input: [id: string, directory?: string]) => string}
   * @readonly
   */
  #resolveModule = memoize(([id, basedir]) => resolveModule(id, basedir), {
    serializeKey: JSON.stringify,
  });

  /**
   * @param {import("@babel/core").parse} parse
   * @param {import("@babel/types")} types
   */
  constructor(parse, types) {
    this.#parse = parse;
    this.#types = types;
  }

  /**
   * @param {string} filename
   * @param {import("@babel/types").ExportAllDeclaration} node
   * @returns {Generator<Dependency, void>}
   */
  *#visitExportAllDeclaration(filename, node) {
    const sourcePath = this.#resolveModule([
      node.source.value,
      path.dirname(filename),
    ]);
    for (const dependency of this.#collectDependencies(sourcePath)) {
      if (dependency.id !== "default") yield dependency;
    }
  }

  /**
   * @param {import("@babel/types").VariableDeclaration} node
   * @returns {Generator<string, void, any>}
   */
  *#visitVariableDeclaration(node) {
    for (const declaration of node.declarations) {
      /* istanbul ignore else */
      if (this.#types.isIdentifier(declaration.id)) {
        yield declaration.id.name;
      }
    }
  }

  /**
   * @param {string} filename
   * @param {import("@babel/types").ImportDeclaration} node
   * @returns {Generator<Dependency, void>}
   */
  *#visitImportDeclaration(filename, node) {
    const t = this.#types;

    if (!node.source.value.startsWith(".")) return;

    const sourcePath = this.#resolveModule([
      node.source.value,
      path.dirname(filename),
    ]);

    for (const specifier of node.specifiers) {
      if (t.isImportNamespaceSpecifier(specifier)) {
        yield new Dependency(sourcePath, specifier.local.name, "*");
        break;
      }

      if (t.isImportDefaultSpecifier(specifier)) {
        yield new Dependency(sourcePath, specifier.local.name, "default");
      } else {
        assert.ok(t.isIdentifier(specifier.imported));
        yield new Dependency(
          sourcePath,
          specifier.local.name,
          specifier.imported.name
        );
      }
    }
  }

  /**
   * @param {string} filename
   * @param {import("@babel/types").ExportNamedDeclaration} node
   * @param {Map<string, Dependency>} imports
   * @returns {Generator<Dependency, void>}
   */
  *#visitExportNamedDeclaration(filename, node, imports) {
    const t = this.#types;

    if (node.source) {
      if (!node.source.value.startsWith(".")) {
        for (const specifier of node.specifiers) {
          assert.ok(t.isExportSpecifier(specifier));
          assert.ok(t.isIdentifier(specifier.local));
          assert.ok(t.isIdentifier(specifier.exported));
          yield new Dependency(
            node.source.value,
            specifier.exported.name,
            specifier.local.name
          );
        }
      } else {
        const sourcePath = this.#resolveModule([
          node.source.value,
          path.dirname(filename),
        ]);

        const specifiers = new Map(
          node.specifiers.map((specifier) => {
            assert.ok(t.isExportSpecifier(specifier));
            return [specifier.local.name, specifier];
          })
        );

        for (const dependency of this.#collectDependencies(sourcePath)) {
          const specifier = specifiers.get(dependency.id);

          if (specifier) {
            specifiers.delete(dependency.id);
            assert.ok(t.isIdentifier(specifier.exported));

            if (specifier.exported.name === "default") {
              yield dependency.update(
                specifier.exported.name,
                specifier.exported.name
              );
            } else {
              yield dependency.update(specifier.exported.name);
            }
          }
        }
      }
    } else {
      for (const specifier of node.specifiers) {
        assert.ok(t.isExportSpecifier(specifier));
        assert.ok(t.isIdentifier(specifier.exported));

        const importedDependency = imports.get(specifier.local.name);

        if (importedDependency) {
          yield importedDependency.update(specifier.exported.name);
        } else {
          yield new Dependency(
            filename,
            specifier.exported.name,
            specifier.local.name
          );
        }
      }
    }

    if (node.declaration) {
      if (t.isVariableDeclaration(node.declaration)) {
        for (const id of this.#visitVariableDeclaration(node.declaration)) {
          yield new Dependency(filename, id);
        }
      }

      if (t.isFunctionDeclaration(node.declaration)) {
        assert.ok(node.declaration.id);
        yield new Dependency(filename, node.declaration.id.name);
      }
    }
  }

  /**
   * @param {string} filename
   * @returns {Generator<Dependency, void>}
   */
  *#collectDependencies(filename) {
    const t = this.#types;
    /** @type {Map<string, Dependency>} */
    const imports = new Map();

    for (const node of this.#visitFile(filename)) {
      if (t.isImportDeclaration(node)) {
        for (const dependency of this.#visitImportDeclaration(filename, node)) {
          imports.set(dependency.id, dependency);
        }
      } else if (t.isExportDefaultDeclaration(node)) {
        yield new Dependency(filename, "default");
      } else if (t.isExportAllDeclaration(node)) {
        yield* this.#visitExportAllDeclaration(filename, node);
      } else if (t.isExportNamedDeclaration(node)) {
        yield* this.#visitExportNamedDeclaration(filename, node, imports);
      }
    }
  }

  /**
   * @param {string} id
   * @returns {Map<string, Dependency>}
   */
  getDependenciesMap(id) {
    /** @type {Map<string, Dependency>} */
    const dependencies = new Map();
    const entry = this.#resolveModule([id]);
    for (const dependency of this.#collectDependencies(entry)) {
      dependencies.set(dependency.id, dependency);
    }
    return dependencies;
  }
}

module.exports = Parser;
