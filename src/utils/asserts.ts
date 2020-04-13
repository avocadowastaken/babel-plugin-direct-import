import { format } from 'util';

export function assert(
  expression: boolean,
  message: string,
  ...args: unknown[]
): void {
  if (!expression) {
    throw new Error(format(`babel-plugin-direct-import: ${message}`, ...args));
  }
}

export function assertNotNull<T>(
  value: T,
  message: string,
  ...args: unknown[]
): asserts value is NonNullable<T> {
  assert(value != null, message, ...args);
}
