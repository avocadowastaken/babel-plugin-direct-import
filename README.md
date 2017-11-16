# babel-plugin-direct-import

[![build status](https://img.shields.io/travis/umidbekkarimov/babel-plugin-direct-import/master.svg?style=flat-square)](https://travis-ci.org/umidbekkarimov/babel-plugin-direct-import)
[![npm version](https://img.shields.io/npm/v/babel-plugin-direct-import.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-direct-import.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![Codecov](https://img.shields.io/codecov/c/gh/umidbekkarimov/babel-plugin-direct-import.svg?style=flat-square)](https://codecov.io/gh/umidbekkarimov/babel-plugin-direct-import)

Babel plugin to cherry pick imports of es6 modules.

## Heads Up

Webpack 4 comes with `sideEffects` flag
[support](https://github.com/webpack/webpack/tree/next/examples/side-effects)!

## Motivation

[Tree shaking](https://webpack.js.org/guides/tree-shaking/) is awesome! And
[Rollup](https://rollupjs.org/) with [webpack](https://webpack.js.org) teams
doing great job making it more better! But still not all libs can be "tree
shaked" right now and as a developer I don't want to wait, I want to use sweet
`import { module } from "package"` syntax right now without caring about final
bundle size.

> "But we already have
> [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) and
> [babel-transform-imports](https://bitbucket.org/amctheatres/babel-transform-imports)!"

Right! And this plugins are awesome! But they does not work with complicated
structures like
[material-ui@next](https://github.com/callemall/material-ui/blob/next/src/index.js)
has. I started in
[babel-plugin-material-ui@next](https://github.com/umidbekkarimov/babel-plugin-material-ui/tree/next)
but soon this idea has grow up to create generic plugin that will work with any
es6 package.

## Installation

```bash
npm install --save-dev babel-plugin-direct-import
```

## Example

**In**

```javascript
import { TextField, SelectField, FlatButton } from "material-ui";
import {
  ActionAccessibility,
  ActionAccessible,
  ActionAccountBalance as BalanceIcon,
} from "material-ui/svg-icons";
```

**Out**

```javascript
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import FlatButton from "material-ui/FlatButton";
import ActionAccessibility from "material-ui/svg-icons/action/accessibility";
import ActionAccessible from "material-ui/svg-icons/action/accessible";
import BalanceIcon from "material-ui/svg-icons/action/account-balance";
```

## Usage

### **Via .babelrc (Recommended)**

**.babelrc**

```json
{
  "plugins": [
    [
      "direct-import",
      [
        "my-package-name",
        {
          "name": "my-package-name/sub-package",
          "indexFile": "my-package-name/sub-package/index.es.js"
        }
      ]
    ]
  ]
}
```

### **Via Node API**

```javascript
require("babel-core").transform("code", {
  plugins: [
    [
      "direct-import",
      [
        "my-package-name",
        {
          name: "my-package-name/sub-package",
          indexFile: "my-package-name/sub-package/index.es.js",
        },
      ],
    ],
  ],
});
```

## Limitations

Since this plugin just started to operate, It has it's limitations (PRs or
suggestions are welcomed).

#### Transformation of namespace imports:

To keep it simple currently it ignores namespace imports.

```javascript
import * as MUI from "material-ui";

return props => <MUI.Checkbox {...props} />;
```

#### Mapping of variable exports:

If index file of package exports a variable - you will have to disable mapping
for it, otherwise plugin will throw `package does not contain module` errors.

e.g:

```javascript
import foo from "./foo";

export const bar = foo.bar;
export const baz = foo.baz;
export const noop = () => {};
```

## Tested Packages

#### [Material UI](https://github.com/callemall/material-ui)

```json
{
  "plugins": [
    [
      "direct-import",
      [
        "material-ui",
        {
          "name": "material-ui/svg-icons",
          "indexFile": "material-ui/svg-icons/index.es"
        }
      ]
    ]
  ]
}
```

#### [Material UI Next](https://github.com/callemall/material-ui/tree/next)

```json
{
  "plugins": [["direct-import", ["material-ui"]]]
}
```

#### [React Virtualized](https://github.com/bvaughn/react-virtualized)

```json
{
  "plugins": [["direct-import", ["react-virtualized"]]]
}
```

#### [React Router 3](https://github.com/ReactTraining/react-router/tree/v3)

```json
{
  "plugins": [["direct-import", ["react-router"]]]
}
```

#### [React Router 4](https://github.com/ReactTraining/react-router)

```json
{
  "plugins": [["direct-import", ["react-router", "react-router-dom"]]]
}
```

#### [Redux Form](https://github.com/erikras/redux-form) (Partial support)

```json
{
  "plugins": [
    [
      "direct-import",
      [
        "redux-form",
        {
          "name": "redux-form/immutable",
          "indexFile": "redux-form/es/immutable"
        }
      ]
    ]
  ]
}
```

## Thanks

Heavily inspired by:

* [babel-plugin-date-fns](https://github.com/date-fns/babel-plugin-date-fns)
* [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
* [babel-plugin-recharts](https://github.com/recharts/babel-plugin-recharts)
* [babel-transform-imports](https://bitbucket.org/amctheatres/babel-transform-imports)
* [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
