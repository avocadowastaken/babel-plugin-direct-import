import { parse, types } from '@babel/core';
import { readFileSync } from 'fs';
import { dirname, join, sep } from 'path';

import { assertNotNull } from './asserts';
import { PluginConfig } from './prepareConfig';
import { resolveModule } from './resolveModule';

function toRelativeSource(filePath: string): string {
  const pathChunks = filePath.split(sep);

  const relativeChunks = pathChunks.slice(
    pathChunks.lastIndexOf('node_modules') + 1,
  );

  return relativeChunks.join('/');
}

function resolveIndexPath(
  name: string,
  pkgJSONPath: string,
  file: null | undefined | string,
): string {
  if (!file) {
    const pkgJSON = JSON.parse(readFileSync(pkgJSONPath, 'utf-8'));
    const mainField =
      pkgJSON.module ||
      pkgJSON.esnext ||
      pkgJSON['jsnext:main'] ||
      pkgJSON.main;

    assertNotNull(mainField, "failed to find 'indexFile' of '%s'.", name);

    return join(dirname(pkgJSONPath), mainField);
  }

  const indexFilePath = resolveModule(file, dirname(pkgJSONPath));

  assertNotNull(
    indexFilePath,
    "failed to resolve 'indexFile' specified for '%s'.",
    name,
  );

  return indexFilePath;
}

function fulfillExports(
  exports: Map<string, PluginConfigExports>,
  filePath: string,
): void {
  const content = readFileSync(filePath, 'utf-8');
  const ast = parse(content, { sourceType: 'module' });
  const program = !ast ? null : ast.type === 'File' ? ast.program : ast;

  assertNotNull(program, "failed to parse '%s'.", filePath);

  const fileDir = dirname(filePath);
  const imports = new Map<string, PluginConfigExports>();

  for (const node of program.body) {
    if (types.isImportDeclaration(node)) {
      const sourcePath = resolveModule(node.source.value, fileDir);

      if (!sourcePath) {
        continue;
      }

      for (const specifier of node.specifiers) {
        imports.set(specifier.local.name, {
          external: types.isImportNamespaceSpecifier(specifier)
            ? '*'
            : types.isImportDefaultSpecifier(specifier)
            ? 'default'
            : specifier.imported.name,
          internal: specifier.local.name,
          source: toRelativeSource(sourcePath),
        });
      }
    } else if (types.isExportNamedDeclaration(node)) {
      const nodeDeclaration = node.declaration;

      if (types.isVariableDeclaration(nodeDeclaration)) {
        for (const declaration of nodeDeclaration.declarations) {
          if (
            types.isIdentifier(declaration.id) &&
            types.isIdentifier(declaration.init)
          ) {
            const external = declaration.id.name;
            const internal = declaration.init.name;
            const imported = imports.get(internal);

            if (imported) {
              exports.set(external, {
                external,
                source: imported.source,
                internal: imported.external,
              });
            }
          }
        }
      }

      const sourcePath = !node.source
        ? null
        : resolveModule(node.source.value, fileDir);

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ExportSpecifier') {
          const internal = specifier.local.name;
          const external = specifier.exported.name;

          if (sourcePath) {
            exports.set(external, {
              internal,
              external,
              source: toRelativeSource(sourcePath),
            });
          } else {
            const imported = imports.get(internal);

            if (imported) {
              exports.set(external, { ...imported, external });
            }
          }
        }
      }
    } else if (types.isExportAllDeclaration(node)) {
      const sourcePath = resolveModule(node.source.value, fileDir);

      assertNotNull(sourcePath, 'failed to resolve %s', sourcePath);

      fulfillExports(exports, sourcePath);
    }
  }
}

export interface PluginConfigExports {
  source: string;
  internal: string;
  external: string;
}

export function getConfigExports(
  config: PluginConfig,
): Map<string, PluginConfigExports> {
  const pkgJSONPath = resolveModule(`${config.name}/package.json`);

  if (!pkgJSONPath) {
    return new Map();
  }

  const indexPath = resolveIndexPath(
    config.name,
    pkgJSONPath,
    config.indexFile,
  );

  const exports = new Map<string, PluginConfigExports>();

  fulfillExports(exports, indexPath);

  return exports;
}
