const fp = require("lodash/fp");
const { prepareConfig } = require("./config");
const { fulfillConfigExports } = require("./mapper");

const fulfillConfigs = fp.memoize(
  fp.flow(
    x => JSON.parse(x),
    prepareConfig,
    fp.map(fp.flow(fulfillConfigExports, x => [x.name, x])),
    fp.fromPairs
  )
);

let configs;

module.exports = babel => ({
  visitor: {
    Program(path, state) {
      configs = fulfillConfigs(JSON.stringify(state.opts));
    },
    ImportDeclaration(declaration) {
      const specifiers = declaration.node.specifiers;

      if (specifiers.length === 0) {
        return;
      }

      const settings = configs[declaration.node.source.value];

      if (!settings) {
        return;
      }

      const types = babel.types;

      const importSpecifiers = specifiers.filter(
        spec =>
          spec.type === "ImportSpecifier" ||
          spec.type === "ImportDefaultSpecifier"
      );

      if (importSpecifiers.length !== specifiers.length) {
        return;
      }

      importSpecifiers.forEach(spec => {
        const name = spec.imported.name;
        const moduleSettings = settings.exports[name];

        if (!moduleSettings) {
          throw new Error(
            `babel-plugin-direct-import: ${settings.name} does not contain module "${name}"`
          );
        }

        declaration.insertBefore(
          types.importDeclaration(
            [
              types.importSpecifier(
                types.identifier(spec.local.name),
                types.identifier(moduleSettings.local)
              )
            ],
            types.stringLiteral(moduleSettings.source)
          )
        );
      });

      declaration.remove();
    }
  }
});
