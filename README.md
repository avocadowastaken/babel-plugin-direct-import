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
import { Button, colors, ThemeProvider } from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
```

**Out**

```javascript
import Button from "@mui/material/Button/Button.js";
import * as colors from "@mui/material/colors/index.js";
import ThemeProvider from "@mui/system/esm/ThemeProvider/ThemeProvider.js";
import ChevronLeftIcon from "@mui/icons-material/esm/ChevronLeft.js";
import ChevronRightIcon from "@mui/icons-material/esm/ChevronRight.js";
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
        "modules": ["@mui/system", "@mui/material", "@mui/icons-material"]
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
        modules: ["@mui/system", "@mui/material", "@mui/icons-material"],
      },
    ],
  ],
});
```

### Limitations

##### Transformation of namespace imports:

Namespace imports are hard to analyze, that's why we skip them.

```jsx
import * as MUI from "@mui/material";

return (props) => <MUI.Checkbox {...props} />;
```

##### Mapping of variable exports:

```js
import * as colors from "./colors";

export const blue = colors.blue;
export const cyan = colors.cyan;
export const getDefaultColor = () => red;
```

### Tested Packages

##### [Material UI (v4)](https://github.com/mui-org/material-ui/tree/v4.12.3)

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

##### [Material UI (v5)](https://github.com/mui-org/material-ui/tree/v5.0.0-rc.0)

```json
{
  "plugins": [
    [
      "babel-plugin-direct-import",
      {
        "modules": [
          "@mui/lab",
          "@mui/system",
          "@mui/material",
          "@mui/icons-material"
        ]
      }
    ]
  ]
}
```

### Integrations

#### Next.js

```js
// babel.config.js

module.exports = (api) => {
  const target = api.caller((caller) => caller.target);

  api.cache.using(() => JSON.stringify({ target }));

  const presets = ["next/babel"];
  const plugins = [];

  // Enable optimizations only for the `web` bundle.
  if (target === "web") {
    plugins.push([
      "babel-plugin-direct-import",
      { modules: ["@mui/lab", "@mui/material", "@mui/icons-material"] },
    ]);
  }

  return { presets, plugins };
};
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
