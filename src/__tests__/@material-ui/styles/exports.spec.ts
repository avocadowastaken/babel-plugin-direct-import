import { getConfigExports } from '../../../utils/getConfigExports';

it('resolves exports for `@material-ui/styles`', () => {
  expect(getConfigExports({ name: '@material-ui/styles' }))
    .toMatchInlineSnapshot(`
    Map {
      "createGenerateClassName" => Object {
        "external": "createGenerateClassName",
        "internal": "default",
        "source": "@material-ui/styles/esm/createGenerateClassName/index.js",
      },
      "default" => Object {
        "external": "default",
        "internal": "default",
        "source": "@material-ui/styles/esm/withTheme/withTheme.js",
      },
      "createStyles" => Object {
        "external": "createStyles",
        "internal": "default",
        "source": "@material-ui/styles/esm/createStyles/index.js",
      },
      "getThemeProps" => Object {
        "external": "getThemeProps",
        "internal": "default",
        "source": "@material-ui/styles/esm/getThemeProps/index.js",
      },
      "jssPreset" => Object {
        "external": "jssPreset",
        "internal": "default",
        "source": "@material-ui/styles/esm/jssPreset/index.js",
      },
      "makeStyles" => Object {
        "external": "makeStyles",
        "internal": "default",
        "source": "@material-ui/styles/esm/makeStyles/index.js",
      },
      "mergeClasses" => Object {
        "external": "mergeClasses",
        "internal": "default",
        "source": "@material-ui/styles/esm/mergeClasses/index.js",
      },
      "ServerStyleSheets" => Object {
        "external": "ServerStyleSheets",
        "internal": "default",
        "source": "@material-ui/styles/esm/ServerStyleSheets/index.js",
      },
      "styled" => Object {
        "external": "styled",
        "internal": "default",
        "source": "@material-ui/styles/esm/styled/index.js",
      },
      "StylesProvider" => Object {
        "external": "StylesProvider",
        "internal": "default",
        "source": "@material-ui/styles/esm/StylesProvider/index.js",
      },
      "ThemeProvider" => Object {
        "external": "ThemeProvider",
        "internal": "default",
        "source": "@material-ui/styles/esm/ThemeProvider/index.js",
      },
      "useTheme" => Object {
        "external": "useTheme",
        "internal": "default",
        "source": "@material-ui/styles/esm/useTheme/index.js",
      },
      "withStyles" => Object {
        "external": "withStyles",
        "internal": "default",
        "source": "@material-ui/styles/esm/withStyles/index.js",
      },
      "withTheme" => Object {
        "external": "withTheme",
        "internal": "default",
        "source": "@material-ui/styles/esm/withTheme/index.js",
      },
    }
  `);
});
