const { DEFAULT_TAXES_RATE } = require("./constants");

const DEFAULT_TAXES_PER_TOWNHALL_LEVEL = 1 / 30;

function calculateTaxes(taxesMultiplier, townhallLevel) {
  const taxesRateFromTownhallLevel = (townhallLevel - 1) * DEFAULT_TAXES_PER_TOWNHALL_LEVEL * taxesMultiplier;
  const totalTaxes = DEFAULT_TAXES_RATE * taxesMultiplier + taxesRateFromTownhallLevel;

  return totalTaxes;
}

module.exports = {
  calculateTaxes,
};
