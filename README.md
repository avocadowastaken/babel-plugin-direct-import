## babel-plugin-direct-import

[![Main](https://github.com/umidbekk/babel-plugin-direct-import/workflows/Main/badge.svg?branch=master)](https://github.com/umidbekk/babel-plugin-direct-import/actions)
[![npm version](https://img.shields.io/npm/v/babel-plugin-direct-import.svg)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-direct-import.svg)](https://www.npmjs.com/package/babel-plugin-direct-import)
[![Codecov](https://img.shields.io/codecov/c/gh/umidbekk/babel-plugin-direct-import.svg)](https://codecov.io/gh/umidbekk/babel-plugin-direct-import)

Babel plugin to cherry-pick ES module imports.

### Installation

```bash
npm install --save-dev babel-plugin-direct-import
```

### Example

**In**

```javascript
import { Button, colors, ThemeProvider } from "@material-ui/core";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@material-ui/icons";
```

**Out**

```javascript
import Button from "@material-ui/core/Button/Button.js";
import * as colors from "@material-ui/core/colors/index.js";
import ThemeProvider from "@material-ui/system/esm/ThemeProvider/ThemeProvider.js";
import ChevronLeftIcon from "@material-ui/icons/esm/ChevronLeft.js";
import ChevronRightIcon from "@material-ui/icons/esm/ChevronRight.js";
```

### Usage

#### **Via .babelrc (Recommended)**

**.babelrc**

```json
{
  "plugins": [
    [
      "babel-plugin-direct-import",
      {
        "modules": [
          "luxon",
          "@material-ui/core",
          "@material-ui/icons",
          "@material-ui/system"
        ]
      }
    ]
  ]
}
```

#### **Via Node API**

```javascript
require("babel-core").transform("code", {
  plugins: [
    [
      "babel-plugin-direct-import",
      {
        modules: [
          "luxon",
          "@material-ui/core",
          "@material-ui/icons",
          "@material-ui/system",
        ],
      },
    ],
  ],
});
```

### Limitations

##### Transformation of namespace imports:

Namespace imports are hard to analyze, that's why we skip them.

```jsx
import * as MUI from "material-ui";

return (props) => <MUI.Checkbox {...props} />;
```

##### Mapping of variable exports:

```js
import foo from "./foo";

export const bar = foo.bar;
export const baz = foo.baz;
export const noop = () => {};
```

### Tested Packages

##### [Luxon](https://github.com/moment/luxon)

```json
{
  "plugins": [["babel-plugin-direct-import", { "modules": ["luxon"] }]]
}
```

##### [Material UI](https://github.com/mui-org/material-ui)

```json
{
  "plugins": [
    [
      "babel-plugin-direct-import",
      {
        "modules": [
          "@material-ui/lab",
          "@material-ui/core",
          "@material-ui/icons",
          "@material-ui/system"
        ]
      }
    ]
  ]
}
```

### Migration

#### 0.5.0 to 0.6.0

After migration to Babel v7 it's impossible to pass arrays as configs, and now you have to pass an object with `modules` property:

Before:

```json
{
  "plugins": [["babel-plugin-direct-import", ["@material-ui/core"]]]
}
```

After:

```json
{
  "plugins": [
    ["babel-plugin-direct-import", { "modules": ["@material-ui/core"] }]
  ]
}
```

### Heavily inspired by:

- [babel-plugin-date-fns](https://github.com/date-fns/babel-plugin-date-fns)
- [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
- [babel-plugin-recharts](https://github.com/recharts/babel-plugin-recharts)
- [babel-transform-imports](https://bitbucket.org/amctheatres/babel-transform-imports)
- [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
