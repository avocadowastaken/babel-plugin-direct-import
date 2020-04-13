import { sync as resolveSync } from 'resolve';
import { format } from 'util';

export function resolveModule(
  fileName: string,
  basedir = process.cwd(),
): null | string {
  try {
    return resolveSync(fileName, {
      basedir,
      packageFilter(pkg) {
        pkg.main = pkg.module || pkg.esnext || pkg['jsnext:main'] || pkg.main;

        return pkg;
      },
    });
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      // eslint-disable-next-line no-console
      console.warn(format('babel-plugin-direct-import: %s', error.message));

      return null;
    }

    throw error;
  }
}
