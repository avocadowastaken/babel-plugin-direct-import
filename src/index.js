const _ = require("lodash");
const { format } = require("util");
const { dirname } = require("path");
const { prepareConfig } = require("./config");
const { fulfillConfigExports } = require("./mapper");

// note: memoize uses the first argument as key, so programPath is ignored here, which is expected
const fulfillConfigs = _.memoize(
  (opts, programPath) =>
    prepareConfig(opts).reduce((acc, x) => {
      const config = fulfillConfigExports(Object.assign(x, { programPath }));

      acc[config.name] = config;

      return acc;
    }, {}),
  opts => JSON.stringify(opts)
);

let configs;

function getSpecName(spec) {
  switch (spec.type) {
    case "ImportDefaultSpecifier":
      return "default";
    default:
      return spec.imported.name;
  }
}

module.exports = babel => ({
  visitor: {
    Program(path, state) {
      configs = fulfillConfigs(state.opts, dirname(state.file.opts.filename));
    },
    ImportDeclaration(declaration) {
      const { specifiers, importKind } = declaration.node;

      if (importKind === "type") {
        return;
      }

      if (specifiers.length === 0) {
        return;
      }

      const settings = configs[declaration.node.source.value];

      if (!settings) {
        return;
      }

      const namespaceSpec = specifiers.find(
        x => x.type === "ImportNamespaceSpecifier"
      );

      if (namespaceSpec) {
        console.warn(
          format(
            [
              'babel-plugin-direct-import: Can not optimize `import * as %s from "%s"`.',
              "See plugin limitations https://git.io/vFDOO for more details.",
            ].join("\n"),
            namespaceSpec.local.name,
            settings.name
          )
        );

        return;
      }

      const unknownSpec = specifiers.find(
        x => !settings.exports[getSpecName(x)]
      );

      if (unknownSpec) {
        const name = getSpecName(unknownSpec);

        console.warn(
          format(
            [
              'babel-plugin-direct-import: Can not optimize `import { %s } from "%s"`.',
              "This could be because of two reasons:",
              "1. `%s` does not exports `%s` member.",
              "2. `%s` exports `%s` the way it can not be optimized.",
              "See plugin limitations https://git.io/vFDOO for more details.",
            ].join("\n"),
            name,
            settings.name,
            settings.name,
            name,
            settings.name,
            name
          )
        );

        return;
      }

      const { types } = babel;

      specifiers.forEach(spec => {
        const name = getSpecName(spec);
        const moduleSettings = settings.exports[name];

        declaration.insertBefore(
          types.importDeclaration(
            [
              moduleSettings.local === "*"
                ? types.importNamespaceSpecifier(
                    types.identifier(spec.local.name)
                  )
                : moduleSettings.local === "default"
                  ? types.importDefaultSpecifier(
                      types.identifier(spec.local.name)
                    )
                  : types.importSpecifier(
                      types.identifier(spec.local.name),
                      types.identifier(moduleSettings.local)
                    ),
            ],
            types.stringLiteral(moduleSettings.source)
          )
        );
      });

      declaration.remove();
    },
  },
});
