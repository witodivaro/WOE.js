const { program } = require("commander");
require("colors");

const { calculateGoldProfit } = require("./lib/calculateGoldProfit");
const { getBuildCostsByType } = require("./lib/calculateBuildsCost");
const { getNumberWithCommas } = require("./lib/formatters");
const { getProfitStats } = require("./lib/getProfitStats");
const { generateTownhallMatrix } = require("./lib/matrix/generareTownhallMatrix");
const { generateFarmMatrix } = require("./lib/matrix/generateFarmMatrix");
const { generate3DTownhallMatrix } = require("./lib/matrix/generate3DTownhallMatrix");
const { generate4DFarmMatrix } = require("./lib/matrix/generate4DFarmMatrix");

program
  .requiredOption("-tl --townhall-level <number>", "Townhall LVL")
  .requiredOption("-ml --mine-level <number>", "Mine LVL")
  .requiredOption("-sml --sawmill-level <number>", "Sawmill LVL")
  .requiredOption("-hl --houses-level <number>", "Houses LVL")
  .requiredOption("-fl --farm-level <number>", "Farm LVL")
  .requiredOption("-sl --storage-level <number>", "Storage LVL")
  .requiredOption("-tm --taxes-multiplier <number>", "Taxes multiplier (1-4)")
  .option("-x2 --double-gain", "Calculate with double gain enabled")
  .option("-2d --two-dimensions", "Generate 2d profit matrixes")
  .option("-3d --three-dimensions", "Generate 3d profit matrixes")
  .option("-4d --four-dimensions", "Generate 4d profit matrixes");

program.parse(process.argv);

const options = program.opts();

const gainMultiplier = options.doubleGain ? 2 : 1;

const buildLvls = {
  sawmill: Number(options.sawmillLevel),
  mine: Number(options.mineLevel),
  townhall: Number(options.townhallLevel),
  houses: Number(options.housesLevel),
  farm: Number(options.farmLevel),
  storage: Number(options.storageLevel),
};

const taxesMultiplier = Number(options.taxesMultiplier);

const {
  goldGainedFromFood,
  totalGoldProfitInDays,
  goldGainedFromTaxes,
  goldRequiredForFood,
  goldInGainedResources,
  totalGoldProfit,
} = calculateGoldProfit(buildLvls, taxesMultiplier, gainMultiplier);

const { totalCost: totalBuildCost, buildsCostByType } = getBuildCostsByType(buildLvls);

const buildsCost = Object.keys(buildsCostByType).reduce((cost, key) => {
  const buildCost = buildsCostByType[key];
  cost[key] = getNumberWithCommas(buildCost);
  return cost;
}, {});

const { ROI, daysToReturnCost } = getProfitStats(totalGoldProfit, totalBuildCost);
const totalBuildsCost = getNumberWithCommas(totalBuildCost);

console.log(`\n\n\n`);
console.log(`--- SUMMARY ---`.bold);
console.log(`\n`);
console.log("Gain multiplier:".bold, gainMultiplier);
console.log(`\n`);
console.log("Gold gained from food:".bold, goldGainedFromFood);
console.log("Gold gained from taxes:".bold, goldGainedFromTaxes);
console.log("Gold in gained resources:".bold, goldInGainedResources);
console.log("Gold required for food:".bold, goldRequiredForFood);
console.log(`\n`);

console.log("TOTAL GOLD PROFIT IN MINUTE:".bold, String(totalGoldProfit).green);
console.log(`\n`);

console.log(`--- BUILD COST ---`.bold);
console.log("Townhall build cost:".bold, buildsCost.townhall.yellow);
console.log("Houses build cost:".bold, buildsCost.houses.yellow);
console.log("Storage build cost:".bold, buildsCost.storage.yellow);
console.log("Farm build cost:".bold, buildsCost.farm.yellow);
console.log("Mine build cost:".bold, buildsCost.mine.yellow);
console.log("Sawmill build cost:".bold, buildsCost.sawmill.yellow);

console.log(`\n`);
console.log("TOTAL BUILDS COST:".bold, totalBuildsCost.red);

console.log(`\n`);
console.log(`--- PROFIT ---`.bold);
console.log("Gold per Real Day:".bold, getNumberWithCommas(totalGoldProfitInDays).green);
console.log("Return on Investments:".bold, `${(ROI * 100).toFixed(2)} %`.magenta);
console.log("Cost will return in:".bold, `${daysToReturnCost} days`.magenta);

console.log(`\n\n\n`);

if (options.twoDimensions) {
  console.log("Generating Townhall Profit Matrix..".italic);
  generateTownhallMatrix({ buildLvls, taxesMultiplier, gainMultiplier });

  console.log("Generating Farm Profit Matrix..".italic);
  generateFarmMatrix({ buildLvls, gainMultiplier });
}

if (options.threeDimensions) {
  console.log("Generating Townhall 3D Matrix..".italic);
  generate3DTownhallMatrix({ buildLvls, gainMultiplier });
}

if (options.fourDimensions) {
  console.log("Generating Farm 4D Matrix..".italic);
  generate4DFarmMatrix({ buildLvls, gainMultiplier });
}
