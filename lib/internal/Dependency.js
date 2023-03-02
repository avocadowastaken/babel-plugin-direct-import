"use strict";

const path = require("node:path");

class Dependency {
  /**
   * @param {string} filename
   * @returns {string}
   */
  static #getSource(filename) {
    const chunks = filename.split(path.sep);
    const nodeModulesIdx = chunks.lastIndexOf("node_modules");
    return chunks.slice(nodeModulesIdx + 1).join("/");
  }

  #id;
  #internalID;
  /** @readonly */
  #source;

  /**
   * @param {string} filename
   * @param {string} id
   * @param {string} [internalID]
   */
  constructor(filename, id, internalID = id) {
    this.#id = id;
    this.#internalID = internalID;
    this.#source = Dependency.#getSource(filename);
  }

  /** @returns {string} */
  get id() {
    return this.#id;
  }

  /** @returns {string} */
  get internalID() {
    return this.#internalID;
  }

  /** @returns {string} */
  get source() {
    return this.#source;
  }

  /**
   * @param {string} id
   * @param {string} [internalID]
   * @returns {Dependency}
   */
  update(id, internalID = this.#internalID) {
    this.#id = id;
    this.#internalID = internalID;
    return this;
  }
}

module.exports = Dependency;
