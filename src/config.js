const fp = require("lodash/fp");

const getUnknownKeys = fp.flow(
  fp.omit(["name", "indexFile", "indexFileContent"]),
  fp.keys
);

const prepareConfig = fp.flow(
  fp.castArray,
  fp.map(options => {
    if (fp.isString(options)) {
      return {
        name: options,
        indexFile: null,
        indexFileContent: null,
      };
    }
    const { name, indexFile, indexFileContent } = options;
    const unknownKeys = getUnknownKeys(options);

    const config = {};

    if (unknownKeys.length > 0) {
      const keys = unknownKeys.join(", ");

      throw new Error(
        `babel-plugin-direct-import: contains unknown keys { ${keys} }`
      );
    }

    if (!fp.isString(name)) {
      throw new Error(
        "babel-plugin-direct-import: { name } expected to be a string"
      );
    } else if (fp.isEmpty(name)) {
      throw new Error("babel-plugin-direct-import: { name } is empty");
    }

    config.name = name;

    if (indexFile != null) {
      if (!fp.isString(indexFile)) {
        throw new Error(
          "babel-plugin-direct-import: { indexFile } expected to be a string"
        );
      }

      if (fp.isEmpty(indexFile)) {
        throw new Error("babel-plugin-direct-import: { indexFile } is empty");
      }

      config.indexFile = indexFile;
    }

    if (
      indexFile != null &&
      config.indexFile !== config.name &&
      config.indexFile.split("/")[0] !== config.name.split("/")[0]
    ) {
      throw new Error(
        `babel-plugin-direct-import: Index file "${config.indexFile}" must belong to "${config.name}" package`
      );
    }

    if (fp.isUndefined(indexFileContent)) {
      config.indexFileContent = null;
    } else {
      if (!fp.isString(indexFileContent)) {
        throw new Error(
          "babel-plugin-direct-import: { indexFileContent } expected to be a string"
        );
      }

      if (fp.isEmpty(indexFileContent)) {
        throw new Error(
          "babel-plugin-direct-import: { indexFileContent } is empty"
        );
      }

      config.indexFileContent = indexFileContent;
    }

    return config;
  })
);

module.exports = { prepareConfig };
