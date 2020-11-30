import { NodePath, types, Visitor } from '@babel/core';
import { format } from 'util';

import {
  getConfigExports,
  PluginConfigExports,
} from './utils/getConfigExports';
import { PluginConfig, prepareConfig } from './utils/prepareConfig';

const configsCache = new Map<string, PluginConfig>();
const exportsCache = new Map<string, Map<string, PluginConfigExports>>();

function getConfigs(modules: unknown[]): Map<string, PluginConfig> {
  if (configsCache.size === 0) {
    for (const config of prepareConfig(modules as PluginConfig[])) {
      configsCache.set(config.name, config);
    }
  }

  return configsCache;
}

function getExports(
  name: string,
  modules: unknown[],
): Map<string, PluginConfigExports> {
  let pkgExports = exportsCache.get(name);

  if (!pkgExports) {
    const config = getConfigs(modules).get(name);

    if (!config) {
      pkgExports = new Map();
    } else {
      pkgExports = getConfigExports(config);
    }

    exportsCache.set(name, pkgExports);
  }

  return pkgExports;
}

export default function plugin(): {
  visitor: Visitor<{
    file: { path: NodePath };
    opts?: { modules?: unknown[] };
  }>;
} {
  return {
    visitor: {
      ImportDeclaration(declaration, { opts }) {
        const { source, specifiers, importKind } = declaration.node;

        if (
          !opts ||
          !opts.modules ||
          !Array.isArray(opts.modules) ||
          opts.modules.length === 0
        ) {
          return;
        }

        if (importKind === 'type') {
          return;
        }

        if (specifiers.length === 0) {
          return;
        }

        const exports = getExports(source.value, opts.modules);

        if (exports.size === 0) {
          return;
        }

        for (const specifier of specifiers) {
          if (types.isImportNamespaceSpecifier(specifier)) {
            console.warn(
              format(
                'babel-plugin-direct-import: Can not optimize `import * as %s from "%s"`.'.concat(
                  '\n',
                  'See plugin limitations https://git.io/vFDOO for more details.',
                ),
                specifier.local.name,
                source.value,
              ),
            );

            continue;
          }

          const moduleName = types.isImportDefaultSpecifier(specifier)
            ? 'default'
            : types.isIdentifier(specifier.imported)
            ? specifier.imported.name
            : specifier.imported.value;
          const moduleExports = exports.get(moduleName);

          if (moduleExports) {
            declaration.node.specifiers = declaration.node.specifiers.filter(
              (x) => x !== specifier,
            );

            declaration.insertBefore(
              types.importDeclaration(
                [
                  moduleExports.internal === '*'
                    ? types.importNamespaceSpecifier(
                        types.identifier(specifier.local.name),
                      )
                    : moduleExports.internal === 'default'
                    ? types.importDefaultSpecifier(
                        types.identifier(specifier.local.name),
                      )
                    : types.importSpecifier(
                        types.identifier(specifier.local.name),
                        types.identifier(moduleExports.external),
                      ),
                ],
                types.stringLiteral(moduleExports.source),
              ),
            );
          }
        }

        if (declaration.node.specifiers.length === 0) {
          declaration.remove();
        }
      },
    },
  };
}
