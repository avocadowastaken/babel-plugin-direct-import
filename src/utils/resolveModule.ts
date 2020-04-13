import { sync as resolveSync } from 'resolve';

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
      return null;
    }

    throw error;
  }
}
