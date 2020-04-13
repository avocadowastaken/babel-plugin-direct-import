import { runPlugin } from '../../../__testutils__/runPlugin';

it('transforms imports from `@material-ui/core`', () => {
  expect(
    runPlugin(
      'import { Button, makeStyles, ServerStyleSheets } from "@material-ui/core"',
      ['@material-ui/core'],
    ),
  ).toMatchInlineSnapshot(`
    import Button from "@material-ui/core/esm/Button/index.js";
    import makeStyles from "@material-ui/core/esm/styles/makeStyles.js";
    import { ServerStyleSheets } from "@material-ui/styles/esm/index.js";
  `);
});
