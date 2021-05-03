import { PluginObj, PluginOptions, types } from '@babel/core';
import { format } from 'util';
import {
  getConfigExports,
  PluginConfigExports,
} from './utils/getConfigExports';
import { PluginConfig, prepareConfig } from './utils/prepareConfig';

const configsCache = new Map<string, PluginConfig>();
const exportsCache = new Map<string, Map<string, PluginConfigExports>>();

function getConfigs(modules: unknown[]): Map<string, PluginConfig> {
  if (!configsCache.size) {
    for (const config of prepareConfig(modules)) {
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
    pkgExports = !config ? new Map() : getConfigExports(config);
    exportsCache.set(name, pkgExports);
  }

  return pkgExports;
}

function getModules(opts: PluginOptions): unknown[] {
  if (opts && 'modules' in opts) {
    const { modules } = opts as { modules?: unknown };

    if (modules) {
      return Array.isArray(modules) ? modules : [modules];
    }
  }

  return [];
}

export default function plugin(): PluginObj {
  return {
    visitor: {
      ImportDeclaration(declaration, { opts }) {
        const modules = getModules(opts);
        if (!modules.length) return;

        const { source, specifiers, importKind } = declaration.node;
        if (!specifiers.length || importKind === 'type') return;

        const exports = getExports(source.value, modules);
        if (!exports.size) return;

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

        if (!declaration.node.specifiers.length) declaration.remove();
      },
    },
  };
}
