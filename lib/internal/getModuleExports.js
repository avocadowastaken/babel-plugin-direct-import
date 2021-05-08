"use strict";

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const babel = require("@babel/core");
const resolveModule = require("./resolveModule");
const resolvePackageEntry = require("./resolvePackageEntry");

const { types: t } = babel;

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
 * @returns {Generator<ModuleExport, void, any>}
 */
function* traverseDeep(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = babel.parse(content, {
    filename,
    ast: true,
    babelrc: false,
    configFile: false,
    sourceType: "module",
  });

  assert.ok(babel.types.isFile(ast));

  const dir = path.dirname(filename);

  /** @type {Map<string, { name: string; source: string }>} */
  const imports = new Map();

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
              yield {
                source: imported.source,
                internal: imported.name,
                external: declaration.id.name,
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

      yield* traverseDeep(sourcePath);
    }
  }
}

/**
 * @param {string} name
 * @param {string} [indexFile]
 * @returns {Map<string, ModuleExport>}
 */
module.exports = function getModuleExports(name, indexFile) {
  /** @type {Map<string, ModuleExport>} */
  const exports = new Map();
  const packageEntry = resolvePackageEntry(name, indexFile);

  for (const entry of traverseDeep(packageEntry)) {
    exports.set(entry.external, entry);
  }

  return exports;
};
