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

  const indexContent =
    config.indexFileContent || readFileSync(indexPath, 'utf-8');

  const indexFileDir = dirname(indexPath);
  const ast = parse(indexContent, { sourceType: 'module' });
  const program = !ast ? null : ast.type === 'File' ? ast.program : ast;

  assertNotNull(program, "failed to parse index file of '%s'.", config.name);

  const imports = new Map<string, PluginConfigExports>();
  const exports = new Map<string, PluginConfigExports>();

  for (const node of program.body) {
    if (node.type === 'ImportDeclaration') {
      const sourcePath = resolveModule(node.source.value, indexFileDir);

      if (!sourcePath) {
        continue;
      }

      for (const specifier of node.specifiers) {
        imports.set(specifier.local.name, {
          external:
            specifier.type === 'ImportNamespaceSpecifier'
              ? '*'
              : specifier.type === 'ImportDefaultSpecifier'
              ? 'default'
              : specifier.imported.name,
          internal: specifier.local.name,
          source: toRelativeSource(sourcePath),
        });
      }
    } else if (node.type === 'ExportNamedDeclaration') {
      const nodeDeclaration: null | types.Statement = node.declaration;

      if (nodeDeclaration?.type === 'VariableDeclaration') {
        for (const declaration of nodeDeclaration.declarations) {
          if (
            declaration.id.type === 'Identifier' &&
            declaration.init?.type === 'Identifier'
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
        : resolveModule(node.source.value, indexFileDir);

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
    }
  }

  return exports;
}
