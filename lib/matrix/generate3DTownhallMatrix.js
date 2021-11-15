const { getBuildCostsByType, calculateNextBuildResourcesCost } = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function generate3DTownhallMatrix(buildLvls) {
  const { townhall, houses, farm } = buildLvls;

  const MAX_TOWNHALL_INDEX = 100;
  const MAX_HOUSES_INDEX = 200;
  const MAX_FARM_INDEX = 200;
  const TAX_POLICY_RATE = 4;
  const LVL_PER_INDEX = 1;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;
  let housesLvl = null;
  let townhallLvl = null;
  let farmLvl = null;
  let storageLvl = null;
  let farmResourcesCost = null;
  let townhallResourcesCost = null;
  let bestROIGoldProfit = null;
  let bestFarmLvl = null;
  let bestRoi = null;
  let bestROICost = null;

  for (let housesIndex = 0; housesIndex < MAX_HOUSES_INDEX; housesIndex++) {
    housesLvl = housesIndex * LVL_PER_INDEX;

    const goldRow = [housesLvl];
    const roiRow = [housesLvl];
    const costRow = [housesLvl];

    for (let townhallIndex = 0; townhallIndex < MAX_TOWNHALL_INDEX; townhallIndex++) {
      townhallLvl = townhallIndex * LVL_PER_INDEX;
      townhallResourcesCost = calculateNextBuildResourcesCost(townhallLvl, "townhall");

      if (!goldMatrix[0][townhallIndex + 1]) {
        goldMatrix[0].push(townhallLvl);
      }

      if (!roiMatrix[0][townhallIndex + 1]) {
        roiMatrix[0].push(townhallLvl);
      }

      if (!costMatrix[0][townhallIndex + 1]) {
        costMatrix[0].push(townhallLvl);
      }

      for (let farmIndex = 0; farmIndex < MAX_FARM_INDEX; farmIndex++) {
        farmLvl = farmIndex * LVL_PER_INDEX;
        farmResourcesCost = calculateNextBuildResourcesCost(farmLvl, "farm");

        expectedStorageCapacity = Math.max(farmResourcesCost, townhallResourcesCost);

        storageLvl = getStorageLvlByCapacity(expectedStorageCapacity);

        const buildLVLs = {
          mine: 0,
          farm: farmLvl,
          houses: housesLvl,
          townhall: townhallLvl,
          storage: storageLvl,
          sawmill: 0,
        };

        const { totalGoldProfit } = calculateGoldProfit(buildLVLs, TAX_POLICY_RATE);
        const { totalCost } = getBuildCostsByType(buildLVLs);
        const { ROI } = getProfitStats(totalGoldProfit, totalCost);

        if (!bestRoi || ROI > bestRoi) {
          bestRoi = ROI;
          bestROIGoldProfit = totalGoldProfit;
          bestROICost = totalCost;
          bestFarmLvl = farmLvl;
        }
      }

      goldRow.push([bestROIGoldProfit, bestFarmLvl].join(" | "));
      roiRow.push([(bestRoi * 100).toFixed(2), bestFarmLvl].join(" | "));
      costRow.push([bestROICost, bestFarmLvl].join(" | "));

      bestRoi = null;
      bestROICost = null;
      bestROIGoldProfit = null;
    }

    goldMatrix.push(goldRow);
    roiMatrix.push(roiRow);
    costMatrix.push(costRow);
  }

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile(`townhall-houses-farm-matrix-gold.csv`, goldCsv);
  writeDataFile(`townhall-houses-farm-matrix-roi.csv`, roiCsv);
  writeDataFile(`townhall-houses-farm-matrix-cost.csv`, costCsv);
}

module.exports = {
  generate3DTownhallMatrix,
};
