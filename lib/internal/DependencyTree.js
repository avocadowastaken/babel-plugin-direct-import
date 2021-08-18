"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const NodeModule = require("./NodeModule");

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

class Dependency {
  /**
   * @param {string} filename
   * @param {string} id
   * @param {string} [internalID]
   */
  constructor(filename, id, internalID = id) {
    this.id = id;
    this.filename = filename;
    this.internalID = internalID;
  }

  /**
   * @param {Partial<Dependency>} values
   * @returns {Dependency}
   */
  update(values) {
    const {
      id = this.id,
      filename = this.filename,
      internalID = this.internalID,
    } = values;

    return new Dependency(filename, id, internalID);
  }

  get source() {
    const chunks = this.filename.split(path.sep);
    return chunks.slice(chunks.lastIndexOf("node_modules") + 1).join("/");
  }
}

/** @type {Map<string, DependencyTree>} */
const cache = new Map();

class DependencyTree {
  /**
   * @param {import('./NodeModule')} nodeModule
   * @param {import('@babel/core')} babel
   * @returns {DependencyTree}
   */
  static create(nodeModule, babel) {
    let tree = cache.get(nodeModule.id);
    if (!tree) {
      tree = new DependencyTree(nodeModule, babel);
      cache.set(nodeModule.id, tree);
    }
    return tree;
  }

  /**
   * @param {import('./NodeModule')} nodeModule
   * @param {import('@babel/core')} babel
   */
  constructor(nodeModule, babel) {
    /**
     * @readonly
     * @protected
     */
    this.babel = babel;

    /**
     * @readonly
     * @protected
     */
    this.nodeModule = nodeModule;

    /**
     * @type {null | Map<string, Dependency>}
     * @protected
     */
    this.items = null;

    /**
     * @type {Map<string, Array<import('@babel/types').Statement>>}
     * @readonly
     * @protected
     */
    this.fileCache = new Map();
  }

  /**
   * @param {string} filename
   * @returns {Array<import('@babel/types').Statement>}
   */
  visitFile(filename) {
    let statements = this.fileCache.get(filename);

    if (!statements) {
      const content = fs.readFileSync(filename, "utf-8");
      const ast = this.babel.parse(content, {
        filename,
        ast: true,
        babelrc: false,
        configFile: false,
        sourceType: "module",
      });
      assert.ok(this.babel.types.isFile(ast));
      statements = ast.program.body;
      this.fileCache.set(filename, statements);
    }

    return statements;
  }

  /**
   * @param {string} filename
   * @param {import('@babel/types').ExportAllDeclaration} node
   * @returns {Generator<Dependency, void, *>}
   */
  *visitExportAllDeclaration(filename, node) {
    const dir = path.dirname(filename);
    const sourcePath = NodeModule.resolve(node.source.value, dir);

    assert.ok(
      sourcePath,
      `failed to resolve '${node.source.value}' from '${dir}'`
    );

    for (const dependency of this.collectDependencies(sourcePath)) {
      if (dependency.id !== "default") yield dependency;
    }
  }

  /**
   * @param {import('@babel/types').VariableDeclaration} node
   * @returns {Generator<string, void, *>}
   */
  *visitVariableDeclaration(node) {
    const { types: t } = this.babel;

    for (const declaration of node.declarations) {
      if (t.isIdentifier(declaration.id)) {
        yield declaration.id.name;
      }
    }
  }

  /**
   * @param {string} filename
   * @param {import('@babel/types').ImportDeclaration} node
   * @returns {Generator<*, void, *>}
   */
  *visitImportDeclaration(filename, node) {
    if (!node.source.value.startsWith(".")) return;

    const { types: t } = this.babel;
    const dir = path.dirname(filename);
    const sourcePath = NodeModule.resolve(node.source.value, dir);

    assert.ok(
      sourcePath,
      `failed to resolve '${node.source.value}' from '${dir}'`
    );

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
   * @param {import('@babel/types').ExportNamedDeclaration} node
   * @param {Map<string, Dependency>} imports
   * @returns {Generator<Dependency, void, *>}
   */
  *visitExportNamedDeclaration(filename, node, imports) {
    const { types: t } = this.babel;

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
        const dir = path.dirname(filename);
        const sourcePath = NodeModule.resolve(node.source.value, dir);

        assert.ok(
          sourcePath,
          `failed to resolve '${node.source.value}' from '${dir}'`
        );

        const specifiers = new Map(
          node.specifiers.map((specifier) => {
            assert.ok(t.isExportSpecifier(specifier));
            return [specifier.local.name, specifier];
          })
        );

        for (const dependency of this.collectDependencies(sourcePath)) {
          const specifier = specifiers.get(dependency.id);

          if (specifier) {
            specifiers.delete(dependency.id);
            assert.ok(t.isIdentifier(specifier.exported));

            if (specifier.exported.name === "default") {
              yield dependency.update({
                id: specifier.exported.name,
                internalID: "default",
              });
            } else {
              yield dependency.update({ id: specifier.exported.name });
            }
          }
        }
      }
    } else if (node.specifiers.length) {
      for (const specifier of node.specifiers) {
        assert.ok(t.isExportSpecifier(specifier));
        assert.ok(t.isIdentifier(specifier.exported));

        const importedDependency = imports.get(specifier.local.name);

        if (importedDependency) {
          yield importedDependency.update({ id: specifier.exported.name });
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
        for (const id of this.visitVariableDeclaration(node.declaration)) {
          yield new Dependency(filename, id);
        }
      } else if (t.isFunctionDeclaration(node.declaration)) {
        assert.ok(node.declaration.id);
        yield new Dependency(filename, node.declaration.id.name);
      }
    }
  }

  /**
   * @param {string} filename
   * @returns {Generator<Dependency, void, *>}
   * @protected
   */
  *collectDependencies(filename = this.nodeModule.entry) {
    const { types: t } = this.babel;

    /** @type {Map<string, Dependency>} */
    const imports = new Map();

    for (const node of this.visitFile(filename)) {
      if (t.isImportDeclaration(node)) {
        for (const dependency of this.visitImportDeclaration(filename, node)) {
          imports.set(dependency.id, dependency);
        }
      } else if (t.isExportDefaultDeclaration(node)) {
        yield new Dependency(filename, "default");
      } else if (t.isExportAllDeclaration(node)) {
        yield* this.visitExportAllDeclaration(filename, node);
      } else if (t.isExportNamedDeclaration(node)) {
        yield* this.visitExportNamedDeclaration(filename, node, imports);
      }
    }
  }

  /** @returns {Map<string, Dependency>} */
  getDependencies() {
    if (!this.items) {
      this.items = new Map();
      for (const dependency of this.collectDependencies()) {
        this.items.set(dependency.id, dependency);
      }
    }

    return this.items;
  }

  /**
   * @param {import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier} node
   * @returns {null | import("@babel/types").ImportDeclaration}
   */
  findReplacement(node) {
    const { types: t } = this.babel;

    if (t.isImportNamespaceSpecifier(node)) {
      warnNamespaceImport(node.local.name, this.nodeModule.id);
      return null;
    }

    const moduleName = t.isImportDefaultSpecifier(node)
      ? "default"
      : t.isIdentifier(node.imported)
      ? node.imported.name
      : node.imported.value;

    const dependency = this.getDependencies().get(moduleName);

    if (dependency) {
      const localName = t.identifier(node.local.name);

      return t.importDeclaration(
        [
          dependency.internalID === "*"
            ? t.importNamespaceSpecifier(localName)
            : dependency.internalID === "default"
            ? t.importDefaultSpecifier(localName)
            : t.importSpecifier(localName, t.identifier(dependency.internalID)),
        ],
        t.stringLiteral(dependency.source)
      );
    }

    return null;
  }
}

module.exports = DependencyTree;
