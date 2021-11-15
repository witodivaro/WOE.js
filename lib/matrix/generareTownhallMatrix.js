const { getBuildCostsByType, calculateNextBuildCost } = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function generateTownhallMatrix({ buildLvls, gainMultiplier }) {
  const { townhall, houses } = buildLvls;

  const MAX_TOWNHALL_INDEX = townhall < 20 ? 50 : 100;
  const MAX_HOUSES_INDEX = houses < 100 ? 100 : 500;
  const TAX_POLICY_RATE = 4;
  const LVL_PER_INDEX = townhall < 20 ? 1 : 5;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;
  let housesLvl = null;
  let townhallLvl = null;
  let storageLvl = null;
  let townhallCost = null;

  for (let housesIndex = 0; housesIndex < MAX_HOUSES_INDEX; housesIndex++) {
    housesLvl = housesIndex * LVL_PER_INDEX;

    const goldRow = [housesLvl];
    const roiRow = [housesLvl];
    const costRow = [housesLvl];

    for (let townhallIndex = 0; townhallIndex < MAX_TOWNHALL_INDEX; townhallIndex++) {
      townhallLvl = townhallIndex * LVL_PER_INDEX;
      townhallCost = calculateNextBuildCost(townhallLvl, "townhall");

      expectedStorageCapacity = townhallCost / 4;
      storageLvl = getStorageLvlByCapacity(expectedStorageCapacity);

      if (!goldMatrix[0][townhallIndex + 1]) {
        goldMatrix[0].push(townhallLvl);
      }

      if (!roiMatrix[0][townhallIndex + 1]) {
        roiMatrix[0].push(townhallLvl);
      }

      if (!costMatrix[0][townhallIndex + 1]) {
        costMatrix[0].push(townhallLvl);
      }

      const buildLVLs = {
        mine: 0,
        farm: 0,
        houses: housesLvl,
        townhall: townhallLvl,
        storage: storageLvl,
        sawmill: 0,
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

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile(`townhall-gold-max-taxes-${gainMultiplier}x.csv`, goldCsv);
  writeDataFile(`townhall-roi-max-taxes-${gainMultiplier}x.csv`, roiCsv);
  writeDataFile(`townhall-cost-max-taxes-${gainMultiplier}x.csv`, costCsv);
}

module.exports = {
  generateTownhallMatrix,
};
