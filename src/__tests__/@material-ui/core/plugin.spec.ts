import { runPlugin } from '../../../__testutils__/runPlugin';

it('transforms imports from `@material-ui/core`', () => {
  expect(
    runPlugin(
      'import { Button, Card, Dialog, makeStyles } from "@material-ui/core"',
      ['@material-ui/core'],
    ),
  ).toMatchInlineSnapshot(`
    import Button from "@material-ui/core/esm/Button/index.js";
    import Card from "@material-ui/core/esm/Card/index.js";
    import Dialog from "@material-ui/core/esm/Dialog/index.js";
    import { makeStyles } from "@material-ui/core";
  `);
});
