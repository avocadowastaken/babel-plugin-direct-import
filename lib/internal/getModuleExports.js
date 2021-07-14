"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const resolveModule = require("./resolveModule");
const resolvePackageEntry = require("./resolvePackageEntry");

/**
 * @typedef {object} ModuleExport
 * @property {string} source
 * @property {string} external
 * @property {string} internal
 */

/**
 * @param {string} source
 * @returns {string}
 */
function makeRelativeSource(source) {
  const chunks = source.split(path.sep);
  return chunks.slice(chunks.lastIndexOf("node_modules") + 1).join("/");
}

/**
 * @param {string} filename
 * @param {import('@babel/core')} babel
 * @returns {Generator<ModuleExport, void, any>}
 */
function* traverseDeep(filename, babel) {
  const { types: t } = babel;
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babel.parse(content, {
    filename,
    ast: true,
    babelrc: false,
    configFile: false,
    sourceType: "module",
  });

  assert.ok(t.isFile(ast));

  const dir = path.dirname(filename);

  /** @type {Map<string, { name: string; source: string }>} */
  const imports = new Map();

  /** @type {Set<string>} */
  const exportedNames = new Set();

  /** @type {Set<string>} */
  const reexportedModules = new Set();

  for (const node of ast.program.body) {
    if (t.isImportDeclaration(node)) {
      const sourcePath = resolveModule(node.source.value, dir);

      if (sourcePath) {
        for (const specifier of node.specifiers) {
          imports.set(specifier.local.name, {
            source: makeRelativeSource(sourcePath),
            name: t.isImportNamespaceSpecifier(specifier)
              ? "*"
              : t.isImportDefaultSpecifier(specifier)
              ? "default"
              : t.isIdentifier(specifier.imported)
              ? specifier.imported.name
              : specifier.imported.value,
          });
        }
      }
    } else if (t.isExportNamedDeclaration(node)) {
      if (t.isVariableDeclaration(node.declaration)) {
        for (const declaration of node.declaration.declarations) {
          if (
            t.isIdentifier(declaration.id) &&
            t.isIdentifier(declaration.init)
          ) {
            const internal = declaration.init.name;
            const imported = imports.get(internal);

            if (imported) {
              const external = declaration.id.name;

              exportedNames.add(external);

              yield {
                external,
                source: imported.source,
                internal: imported.name,
              };
            }
          }
        }
      }

      const sourcePath = node.source && resolveModule(node.source.value, dir);

      for (const specifier of node.specifiers) {
        if (t.isExportSpecifier(specifier)) {
          const internal = specifier.local.name;
          const external = t.isIdentifier(specifier.exported)
            ? specifier.exported.name
            : specifier.exported.value;

          exportedNames.add(external);

          if (sourcePath) {
            yield {
              internal,
              external,
              source: makeRelativeSource(sourcePath),
            };
          } else {
            const imported = imports.get(internal);

            if (imported) {
              yield {
                external,
                source: imported.source,
                internal: imported.name,
              };
            }
          }
        }
      }
    } else if (t.isExportAllDeclaration(node)) {
      const sourcePath = resolveModule(node.source.value, dir);

      assert.ok(
        sourcePath,
        `failed to resolve '${node.source.value}' from '${dir}'`
      );

      reexportedModules.add(sourcePath);
    }
  }

  for (const reexportedModule of reexportedModules) {
    // https://262.ecma-international.org/6.0/#sec-getexportednames
    for (const entry of traverseDeep(reexportedModule, babel)) {
      if (
        // https://exploringjs.com/es6/leanpub-endnotes.html#fn-modules_2
        entry.external !== "default" &&
        !exportedNames.has(entry.external)
      ) {
        yield entry;
      }
    }
  }
}

/**
 * @param {string} name
 * @param {import('@babel/core')} babel
 * @returns {Map<string, ModuleExport>}
 */
module.exports = function getModuleExports(name, babel) {
  /** @type {Map<string, ModuleExport>} */
  const exports = new Map();
  const packageEntry = resolvePackageEntry(name);

  for (const entry of traverseDeep(packageEntry, babel)) {
    exports.set(entry.external, entry);
  }

  return exports;
};
