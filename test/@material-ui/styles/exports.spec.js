"use strict";

const testExports = require("../../testExports");

test("exports", () => {
  expect(testExports("@material-ui/styles")).toMatchInlineSnapshot(`
Array [
  Array [
    "createGenerateClassName",
    "default",
    "@material-ui/styles/esm/createGenerateClassName/createGenerateClassName.js",
  ],
  Array [
    "createStyles",
    "default",
    "@material-ui/styles/esm/createStyles/createStyles.js",
  ],
  Array [
    "getThemeProps",
    "default",
    "@material-ui/styles/esm/getThemeProps/getThemeProps.js",
  ],
  Array [
    "jssPreset",
    "default",
    "@material-ui/styles/esm/jssPreset/jssPreset.js",
  ],
  Array [
    "makeStyles",
    "default",
    "@material-ui/styles/esm/makeStyles/makeStyles.js",
  ],
  Array [
    "mergeClasses",
    "default",
    "@material-ui/styles/esm/mergeClasses/mergeClasses.js",
  ],
  Array [
    "ServerStyleSheets",
    "default",
    "@material-ui/styles/esm/ServerStyleSheets/ServerStyleSheets.js",
  ],
  Array [
    "styled",
    "default",
    "@material-ui/styles/esm/styled/styled.js",
  ],
  Array [
    "StylesProvider",
    "default",
    "@material-ui/styles/esm/StylesProvider/StylesProvider.js",
  ],
  Array [
    "sheetsManager",
    "sheetsManager",
    "@material-ui/styles/esm/StylesProvider/StylesProvider.js",
  ],
  Array [
    "StylesContext",
    "StylesContext",
    "@material-ui/styles/esm/StylesProvider/StylesProvider.js",
  ],
  Array [
    "ThemeProvider",
    "default",
    "@material-ui/styles/esm/ThemeProvider/ThemeProvider.js",
  ],
  Array [
    "useTheme",
    "default",
    "@material-ui/styles/esm/useTheme/useTheme.js",
  ],
  Array [
    "withStyles",
    "default",
    "@material-ui/styles/esm/withStyles/withStyles.js",
  ],
  Array [
    "withTheme",
    "default",
    "@material-ui/styles/esm/withTheme/withTheme.js",
  ],
  Array [
    "withThemeCreator",
    "withThemeCreator",
    "@material-ui/styles/esm/withTheme/withTheme.js",
  ],
]
`);
});
