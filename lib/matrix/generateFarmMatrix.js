const { getBuildCostsByType, calculateNextBuildResourcesCost } = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function generateFarmMatrix({ buildLvls, gainMultiplier }) {
  const { farm, mine } = buildLvls;

  const MAX_FARM_INDEX = 1500;
  const MAX_RESOURCE_INDEX = 1500;
  const TAX_POLICY_RATE = 1;
  const LVL_PER_INDEX = 1;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;
  let farmLVL = null;
  let resourceLVL = null;
  let storageLVL = null;
  let resoureBuildResourceCost = null;
  let farmResourceCost = null;

  for (let resourceIndex = 0; resourceIndex < MAX_RESOURCE_INDEX; resourceIndex++) {
    resourceLVL = resourceIndex * LVL_PER_INDEX;
    resoureBuildResourceCost = calculateNextBuildResourcesCost(resourceLVL, "mine");

    const goldRow = [resourceLVL];
    const roiRow = [resourceLVL];
    const costRow = [resourceLVL];

    for (let farmIndex = 0; farmIndex < MAX_FARM_INDEX; farmIndex++) {
      farmLVL = farmIndex * LVL_PER_INDEX;
      farmResourceCost = calculateNextBuildResourcesCost(farmLVL, "farm");
      expectedStorageCapacity = Math.max(farmResourceCost, resoureBuildResourceCost) / 4;

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
      const { totalGoldProfit } = calculateGoldProfit(buildLVLs, TAX_POLICY_RATE, gainMultiplier);
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

  writeDataFile("farm-roi.json", JSON.stringify(roiMatrix, null, 2));
  writeDataFile("farm-gold.json", JSON.stringify(goldMatrix, null, 2));
  writeDataFile("farm-cost.json", JSON.stringify(costMatrix, null, 2));

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile(`farm-gold-min-taxes-${gainMultiplier}x.csv`, goldCsv);
  writeDataFile(`farm-roi-min-taxes-${gainMultiplier}x.csv`, roiCsv);
  writeDataFile(`farm-cost-min-taxes-${gainMultiplier}x.csv`, costCsv);
}

module.exports = {
  generateFarmMatrix,
};
