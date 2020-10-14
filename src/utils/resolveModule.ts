import { sync as resolveSync } from 'resolve';

export function resolveModule(
  fileName: string,
  basedir = process.cwd(),
): null | string {
  try {
    return resolveSync(fileName, {
      basedir,
      packageFilter(pkg: {
        main?: string;
        module?: string;
        esnext?: string;
        'jsnext:main'?: string;
      }) {
        pkg.main = pkg.module || pkg.esnext || pkg['jsnext:main'] || pkg.main;

        return pkg;
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND'
    ) {
      return null;
    }

    throw error;
  }
}
