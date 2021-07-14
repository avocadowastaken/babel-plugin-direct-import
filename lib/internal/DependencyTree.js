"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const NodeModule = require("./NodeModule");

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
   * @param {string} id
   * @returns {Dependency}
   */
  setID(id) {
    return new Dependency(this.filename, id, this.internalID);
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
     * @type {Map<string, Dependency>}
     * @readonly
     * @protected
     */
    this.items = new Map();

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
          yield dependency.setID(specifier.exported.name);
        }
      }

      assert.ok(!specifiers.size);
    } else if (node.specifiers.length) {
      for (const specifier of node.specifiers) {
        assert.ok(t.isExportSpecifier(specifier));
        assert.ok(t.isIdentifier(specifier.exported));

        const importedDependency = imports.get(specifier.local.name);

        if (importedDependency) {
          yield importedDependency.setID(specifier.exported.name);
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
  get dependencies() {
    if (!this.items.size) {
      for (const dependency of this.collectDependencies()) {
        this.items.set(dependency.id, dependency);
      }
    }

    return this.items;
  }
}

module.exports = DependencyTree;
