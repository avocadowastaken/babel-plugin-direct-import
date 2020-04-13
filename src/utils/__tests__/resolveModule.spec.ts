import path from 'path';

import { resolveModule } from '../resolveModule';

it('should resolve package path', () => {
  const filePath = resolveModule('lodash');

  expect(filePath).toContain(path.join('node_modules', 'lodash', 'lodash.js'));
});

it('should throw errors from `Module` package', () => {
  expect(() => resolveModule(null as any)).toThrowErrorMatchingInlineSnapshot(
    '"Path must be a string."',
  );
});

it('should not throw when module is not installed', () => {
  const filePath = resolveModule('foo');

  expect(filePath).toBeNull();
});
