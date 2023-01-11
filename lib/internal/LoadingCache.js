"use strict";

/**
 * @template T
 * @typedef {object} MapAPI
 * @property {(key: any) => undefined | T} get
 * @property {(key: any, value: T) => void} set
 */

/**
 * @template TKey
 * @template TValue
 * @typedef {object} LoadingCacheOptions
 * @property {MapAPI<TValue>} [map]
 * @property {(value: TKey) => unknown} [serializeKey]
 */

/**
 * @template TKey
 * @template TValue
 */
class LoadingCache {
  /** @readonly */
  #map;
  /** @readonly */
  #loader;
  /** @readonly */
  #serializeKey;

  /**
   * @param {(key: TKey) => TValue} loader
   * @param {LoadingCacheOptions<TKey, TValue>} [options]
   */
  constructor(loader, options = {}) {
    const { map = new Map(), serializeKey = (x) => x } = options;
    this.#map = map;
    this.#loader = loader;
    this.#serializeKey = serializeKey;
  }

  /** @param {TKey} key */
  load(key) {
    const cacheKey = this.#serializeKey(key);
    let value = this.#map.get(cacheKey);
    if (value === undefined) {
      value = this.#loader(key);
      this.#map.set(cacheKey, value);
    }
    return value;
  }
}

module.exports = LoadingCache;
