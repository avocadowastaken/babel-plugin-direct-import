import { prepareConfig } from '../prepareConfig';

it('creates normalized config', () => {
  expect(prepareConfig('lodash')).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "lodash",
      },
    ]
  `);

  expect(prepareConfig({ name: 'lodash', indexFile: 'lodash/index' }))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "indexFile": "lodash/index",
        "name": "lodash",
      },
    ]
  `);
});

it('throws when there are unknown keys', () => {
  expect(() => {
    prepareConfig({ name: 'lodash-es', foo: 'bar', baz: 10 } as any);
  }).toThrow('babel-plugin-direct-import: contains unknown keys { foo, baz }');
});

it('throws when `name` is not a string', () => {
  const names: any[] = [10, {}, [], null];

  for (const name of names) {
    expect(() => {
      prepareConfig({ name });
    }).toThrow('babel-plugin-direct-import: { name } expected to be a string');
  }
});

it('throws when `name` is empty', () => {
  expect(() => {
    prepareConfig({ name: '' });
  }).toThrow('babel-plugin-direct-import: { name } is empty');
});

it('throws when `indexFile` is defined and not a string', () => {
  const indexFiles: any[] = [10, {}, []];

  for (const indexFile of indexFiles) {
    expect(() => {
      prepareConfig({ name: 'lodash', indexFile });
    }).toThrow(
      'babel-plugin-direct-import: { indexFile } expected to be a string',
    );
  }
});

it('not throws when `indexFile` is null or undefined', () => {
  expect(() => {
    prepareConfig({ name: 'lodash' });
  }).not.toThrow();

  expect(() => {
    prepareConfig({ name: 'lodash', indexFile: null });
  }).not.toThrow();
});

it('throws when `indexFile` is an empty string', () => {
  expect(() => {
    prepareConfig({ name: 'lodash', indexFile: '' });
  }).toThrow('babel-plugin-direct-import: { indexFile } is empty');
});

it('throws when `indexFile` does not belongs to package', () => {
  expect(() => {
    prepareConfig({ name: 'lodash', indexFile: 'lodash-es/index' });
  }).toThrow(
    "babel-plugin-direct-import: index file 'lodash-es/index' must belong to 'lodash' package",
  );
});
