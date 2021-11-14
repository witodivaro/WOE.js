const { calculateBuildCost, getBuildCostsByType, calculateNextBuildCost } = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function generateFarmMatrix(buildLvls) {
  const { farm, mine } = buildLvls;

  const MAX_FARM_INDEX = farm < 100 ? 100 : 500;
  const MAX_RESOURCE_INDEX = mine < 100 ? 100 : 500;
  const TAX_POLICY_RATE = 1;
  const LVL_PER_INDEX = farm < 20 ? 1 : 5;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;
  let farmLVL = null;
  let resourceLVL = null;
  let storageLVL = null;
  let resourceCost = null;
  let farmCost = null;

  for (let resourceIndex = 0; resourceIndex < MAX_RESOURCE_INDEX; resourceIndex++) {
    resourceLVL = resourceIndex * LVL_PER_INDEX;
    resourceCost = calculateBuildCost(resourceLVL, "mine");

    const goldRow = [resourceLVL];
    const roiRow = [resourceLVL];
    const costRow = [resourceLVL];

    for (let farmIndex = 0; farmIndex < MAX_FARM_INDEX; farmIndex++) {
      farmLVL = farmIndex * LVL_PER_INDEX;
      farmCost = calculateNextBuildCost(farmLVL, "farm");
      expectedStorageCapacity = Math.max(farmCost, resourceCost) / 4;

      storageLVL = getStorageLvlByCapacity(expectedStorageCapacity);

      if (!goldMatrix[0][farmIndex + 1]) {
        goldMatrix[0].push(farmLVL);
      }

      if (!roiMatrix[0][farmIndex + 1]) {
        roiMatrix[0].push(farmLVL);
      }

      if (!costMatrix[0][farmIndex + 1]) {
        costMatrix[0].push(farmLVL);
      }

      const buildLVLs = {
        mine: resourceLVL,
        farm: farmLVL,
        houses: 0,
        townhall: 0,
        storage: storageLVL,
        sawmill: resourceLVL,
      };
      const { totalGoldProfit } = calculateGoldProfit(buildLVLs, TAX_POLICY_RATE);
      const { totalCost } = getBuildCostsByType(buildLVLs);
      const { ROI } = getProfitStats(totalGoldProfit, totalCost);

      goldRow.push(totalGoldProfit);
      roiRow.push((ROI * 100).toFixed(2));
      costRow.push(totalCost);
    }

    goldMatrix.push(goldRow);
    roiMatrix.push(roiRow);
    costMatrix.push(costRow);
  }

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile("farm-gold-min-taxes.csv", goldCsv);
  writeDataFile("farm-roi-min-taxes.csv", roiCsv);
  writeDataFile("farm-cost-min-taxes.csv", costCsv);
}

module.exports = {
  generateFarmMatrix,
};
