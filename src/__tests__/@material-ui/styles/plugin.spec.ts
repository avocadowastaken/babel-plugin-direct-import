import { runPlugin } from '../../../__testutils__/runPlugin';

it('transforms imports from `@material-ui/styles`', () => {
  expect(
    runPlugin(
      'import { makeStyles, ClassNameMap } from "@material-ui/styles";',
      ['@material-ui/styles'],
    ),
  ).toMatchInlineSnapshot(`
    import makeStyles from "@material-ui/styles/esm/makeStyles/index.js";
    import { ClassNameMap } from "@material-ui/styles";
  `);
});
