const fp = require("lodash/fp");

const RAW = Symbol.for("raw");

module.exports = {
  print: fp.get(RAW),
  test: fp.flow(fp.get(RAW), fp.isString)
};
