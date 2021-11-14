const path = require("path");
const fs = require("fs");

function writeDataFile(name, data) {
  const fullPath = path.resolve("data", name);

  fs.writeFileSync(fullPath, data);
}

module.exports = {
  writeDataFile,
};
