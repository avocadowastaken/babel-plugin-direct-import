const fs = require("fs");
const fp = require("lodash/fp");
const path = require("path");
const babylon = require("babylon");
const { format } = require("util");
const { resolveFilename } = require("./resolver");

function getFileRoot(indexFilePath, packageName) {
  const packageRoot = packageName.split("/")[0];
  const absPath = indexFilePath.split(path.sep).join("/");
  const idx = absPath.indexOf(packageRoot);

  return path.dirname(absPath.slice(idx));
}

/**
 * @param config
 * @param {String} config.name
 * @param {String} [config.indexFile]
 * @param {String} [config.indexFileContent]
 * @param {Object} [config.exports]
 * @returns {{exports: {}, name: String, indexFile: String}}
 */
function fulfillConfigExports(config) {
  if (config.exports) {
    return config;
  }

  const { programPath } = config;
  let { indexFile, indexFileContent } = config;

  const exports = {};

  if (!fp.isString(indexFileContent)) {
    if (!fp.isString(indexFile)) {
      const packageJsonPath = resolveFilename(
        `${config.name}/package.json`,
        programPath
      );
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      if (fp.isString(packageJson.module)) {
        indexFile = path.posix.join(config.name, packageJson.module);
      } else if (fp.isString(packageJson["jsnext:main"])) {
        indexFile = path.posix.join(config.name, packageJson["jsnext:main"]);
      } else {
        throw new Error(
          format(
            `babel-plugin-direct-import: no indexFile specified for %s and its package.json does not specify "module" or "jsnext:main"`,
            config.name
          )
        );
      }
    }
    const indexFilePath = resolveFilename(indexFile, programPath);
    indexFileContent = fs.readFileSync(indexFilePath, "utf-8");
  }

  const imports = {};
  const fileRoot = getFileRoot(indexFile, config.name);
  const ast = babylon.parse(indexFileContent, { sourceType: "module" });

  ast.program.body.forEach(node => {
    if (node.type === "ImportDeclaration") {
      const source = path.posix.join(fileRoot, node.source.value);

      node.specifiers.forEach(specifier => {
        if (specifier.type === "ImportSpecifier") {
          imports[specifier.local.name] = {
            source,
            local: specifier.local.name,
            imported: specifier.imported.name,
          };
        }

        if (specifier.type === "ImportDefaultSpecifier") {
          imports[specifier.local.name] = {
            source,
            imported: "default",
            local: specifier.local.name,
          };
        }

        if (specifier.type === "ImportNamespaceSpecifier") {
          imports[specifier.local.name] = {
            source,
            imported: "*",
            local: specifier.local.name,
          };
        }
      });
    }

    if (node.type === "ExportNamedDeclaration") {
      const exportSource = !node.source
        ? null
        : path.posix.join(fileRoot, node.source.value);

      if (node.declaration) {
        if (node.declaration.type === "VariableDeclaration") {
          node.declaration.declarations.forEach(declaration => {
            if (
              declaration.type === "VariableDeclarator" &&
              declaration.init &&
              declaration.init.type === "Identifier"
            ) {
              const {
                init: { name: local },
                id: { name: exported },
              } = declaration;

              if (imports[local]) {
                exports[exported] = {
                  exported,
                  source: imports[local].source,
                  local: imports[local].imported,
                };
              }
            }
          });
        }
      }

      node.specifiers.forEach(specifier => {
        const {
          local: { name: local },
          exported: { name: exported },
        } = specifier;

        if (exportSource) {
          exports[exported] = {
            local,
            exported,
            source: exportSource,
          };
        } else if (imports[local]) {
          exports[exported] = {
            exported,
            source: imports[local].source,
            local: imports[local].imported,
          };
        }
      });
    }
  });

  return {
    exports,
    name: config.name,
    indexFile,
  };
}

module.exports = { fulfillConfigExports };
