const {
  calculateBuildCost,
  getBuildCostsByType,
  cal,
  calculateNextBuildResourcesCostculateNextBuildResourcesCost,
  calculateNextBuildResourcesCost,
} = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function withBestLvls(data, townhallLvl, housesLvl) {
  return [data, townhallLvl, housesLvl].join(" | ");
}

function generate4DTownhallMatrix({ buildLvls, gainMultiplier }) {
  const { farm, mine } = buildLvls;

  const MAX_INDEX = 500;
  const TAX_POLICY_RATE = 1;
  const LVL_PER_INDEX = 1;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;

  let farmLVL = null;
  let resourcesLVL = null;
  let storageLVL = null;
  let townhallLVL = null;
  let housesLVL = null;

  let resourcesCost = null;
  let farmCost = null;
  let housesCost = null;
  let townhallCost = null;

  const besties = {
    resourceLVL: null,
    farmLVL: null,
    cost: null,
    roi: null,
    gold: null,
  };

  for (let housesIndex = 0; housesIndex < MAX_INDEX; housesIndex++) {
    console.log(`Generating 4D Townhall matrix... ${((housesIndex / MAX_INDEX) * 100).toFixed(2)} %`);
    housesLVL = housesIndex * LVL_PER_INDEX;
    housesCost = calculateBuildCost(resourcesLVL, "houses");

    const goldRow = [housesLVL];
    const roiRow = [housesLVL];
    const costRow = [housesLVL];

    for (let townhallIndex = 0; townhallIndex < MAX_INDEX; townhallIndex++) {
      console.log(
        `Generating 4D Townhall matrix... ${(
          ((townhallIndex + 1 + 100 * housesIndex) / (MAX_INDEX * MAX_INDEX)) *
          100
        ).toFixed(3)} %`
      );
      townhallLVL = townhallIndex * LVL_PER_INDEX;
      townhallCost = calculateNextBuildResourcesCost(townhallLVL, "townhall");

      if (!goldMatrix[0][townhallIndex + 1]) {
        goldMatrix[0].push(townhallLVL);
      }

      if (!roiMatrix[0][townhallIndex + 1]) {
        roiMatrix[0].push(townhallLVL);
      }

      if (!costMatrix[0][townhallIndex + 1]) {
        costMatrix[0].push(townhallLVL);
      }

      for (let farmIndex = 0; farmIndex < MAX_INDEX; farmIndex++) {
        farmLVL = farmIndex * LVL_PER_INDEX;
        farmCost = calculateNextBuildResourcesCost(farmLVL, "farm");

        for (let resourcesIndex = 0; resourcesIndex < MAX_INDEX; resourcesIndex++) {
          resourcesLVL = resourcesIndex * LVL_PER_INDEX;
          resourcesCost = calculateNextBuildResourcesCost(resourcesLVL, "mine");

          expectedStorageCapacity = Math.max(farmCost, resourcesCost, housesCost, townhallCost);

          storageLVL = getStorageLvlByCapacity(expectedStorageCapacity);

          const buildLVLs = {
            mine: resourcesLVL,
            farm: farmLVL,
            houses: housesLVL,
            townhall: townhallLVL,
            storage: storageLVL,
            sawmill: resourcesLVL,
          };

          const { totalGoldProfit } = calculateGoldProfit(buildLVLs, TAX_POLICY_RATE, gainMultiplier);
          const { totalCost } = getBuildCostsByType(buildLVLs);
          const { ROI } = getProfitStats(totalGoldProfit, totalCost);

          if (!besties.roi || ROI > besties.roi) {
            besties.cost = totalCost;
            besties.roi = ROI;
            besties.gold = totalGoldProfit;
            besties.resourceLVL = resourcesLVL;
            besties.farmLVL = farmLVL;
          }
        }
      }

      goldRow.push(withBestLvls(besties.gold, besties.farmLVL, besties.resourceLVL));
      roiRow.push(withBestLvls((besties.roi * 100).toFixed(2), besties.farmLVL, besties.resourceLVL));
      costRow.push(withBestLvls(besties.cost, besties.farmLVL, besties.resourceLVL));

      besties.cost = null;
      besties.roi = null;
      besties.gold = null;
      besties.resourceLVL = null;
      besties.farmLVL = null;
    }

    goldMatrix.push(goldRow);
    roiMatrix.push(roiRow);
    costMatrix.push(costRow);
  }

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile(`townhall-4d-gold-${gainMultiplier}x.csv`, goldCsv);
  writeDataFile(`townhall-4d-roi-${gainMultiplier}x.csv`, roiCsv);
  writeDataFile(`townhall-4d-cost-${gainMultiplier}x.csv`, costCsv);
}

module.exports = {
  generate4DTownhallMatrix,
};
