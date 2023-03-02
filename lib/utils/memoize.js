/**
 * @template T
 * @typedef {object} MapAPI
 * @property {(key: any) => undefined | T} get
 * @property {(key: any, value: T) => void} set
 */

/**
 * @template TKey
 * @template TValue
 * @typedef {object} MemoizeOptions
 * @property {MapAPI<TValue>} [map]
 * @property {(value: TKey) => unknown} [serializeKey]
 */

/**
 * @template TKey
 * @template TValue
 * @param {(key: TKey) => TValue} loader
 * @param {MemoizeOptions<TKey, TValue>} [options]
 * @returns {(key: TKey) => TValue}
 */
module.exports = function memoize(loader, options = {}) {
  const { map = new Map(), serializeKey = (x) => x } = options;
  return (key) => {
    const cacheKey = serializeKey(key);
    let value = map.get(cacheKey);
    if (value === undefined) {
      value = loader(key);
      map.set(cacheKey, value);
    }
    return value;
  };
};
