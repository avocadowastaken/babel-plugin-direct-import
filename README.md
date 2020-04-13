# babel-plugin-direct-import

[![Build](https://github.com/umidbekkarimov/babel-plugin-direct-import/workflows/Build/badge.svg?branch=master)](https://github.com/umidbekkarimov/babel-plugin-direct-import/actions)
[![npm version](https://img.shields.io/npm/v/babel-plugin-direct-import.svg)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-direct-import.svg)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![Codecov](https://img.shields.io/codecov/c/gh/umidbekkarimov/babel-plugin-direct-import.svg?style=flat-square)](https://codecov.io/gh/umidbekkarimov/babel-plugin-direct-import)

Babel plugin to cherry pick imports of ES modules.

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

Right! And these plugins are awesome! But they does not work with complicated structures like [material-ui](https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/index.js) has.
I started in [babel-plugin-material-ui](https://www.npmjs.com/package/babel-plugin-material-ui), but soon this idea has grown up to create a generic plugin that will work with any es6 package.

## Installation

```bash
npm install --save-dev babel-plugin-direct-import
```

## Example

**In**

```javascript
import {
  Button,
  colors,
  makeStyles,
  ServerStyleSheets,
} from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
```

**Out**

```javascript
import Button from '@material-ui/core/esm/Button/index.js';
import * as colors from '@material-ui/core/esm/colors/index.js';
import makeStyles from '@material-ui/core/esm/styles/makeStyles.js';
import { ServerStyleSheets } from '@material-ui/styles/esm/index.js';
import ChevronLeft from '@material-ui/icons/esm/ChevronLeft.js';
import ChevronRight from '@material-ui/icons/esm/ChevronRight.js';
```

## Usage

### **Via .babelrc (Recommended)**

**.babelrc**

```json
{
  "plugins": [
    [
      "babel-plugin-direct-import",
      [{ "modules": ["luxon", "@material-ui/core", "@material-ui/icons"] }]
    ]
  ]
}
```

### **Via Node API**

```javascript
require('babel-core').transform('code', {
  plugins: [
    [
      'babel-plugin-direct-import',
      [{ modules: ['luxon', '@material-ui/core', '@material-ui/icons'] }],
    ],
  ],
});
```

## Limitations

#### Transformation of namespace imports:

To keep it simple currently it ignores namespace imports.

```jsx
import * as MUI from 'material-ui';

return (props) => <MUI.Checkbox {...props} />;
```

#### Mapping of variable exports:

```js
import foo from './foo';

export const bar = foo.bar;
export const baz = foo.baz;
export const noop = () => {};
```

## Tested Packages

#### [Luxon](https://github.com/moment/luxon)

```json
{
  "plugins": [["babel-plugin-direct-import", [{ "modules": ["luxon"] }]]]
}
```

#### [Material UI](https://github.com/mui-org/material-ui)

```json
{
  "plugins": [
    [
      "babel-plugin-direct-import",
      [
        {
          "modules": [
            "@material-ui/core",
            "@material-ui/icons",
            "@material-ui/styles"
          ]
        }
      ]
    ]
  ]
}
```

## Thanks

Heavily inspired by:

- [babel-plugin-date-fns](https://github.com/date-fns/babel-plugin-date-fns)
- [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
- [babel-plugin-recharts](https://github.com/recharts/babel-plugin-recharts)
- [babel-transform-imports](https://bitbucket.org/amctheatres/babel-transform-imports)
- [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
