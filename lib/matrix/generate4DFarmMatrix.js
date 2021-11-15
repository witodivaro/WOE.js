const {
  calculateBuildCost,
  getBuildCostsByType,
  cal,
  calculateNextBuildResourcesCostculateNextBuildResourcesCost,
} = require("../calculateBuildsCost");
const { calculateGoldProfit } = require("../calculateGoldProfit");
const { getStorageLvlByCapacity } = require("../calculateStorageCapacity");
const { getProfitStats } = require("../getProfitStats");
const { writeDataFile } = require("../helpers");

function withBestLvls(data, townhallLvl, housesLvl) {
  return [data, townhallLvl, housesLvl].join(" | ");
}

function generate4DFarmMatrix(buildLvls) {
  const { farm, mine } = buildLvls;

  const MAX_INDEX = 100;
  const TAX_POLICY_RATE = 1;
  const LVL_PER_INDEX = 1;

  const goldMatrix = [[""]];
  const roiMatrix = [[""]];
  const costMatrix = [[""]];

  let expectedStorageCapacity = null;

  let farmLVL = null;
  let resourceLVL = null;
  let storageLVL = null;
  let townhallLVL = null;
  let housesLVL = null;

  let resourceCost = null;
  let farmCost = null;
  let housesCost = null;
  let townhallCost = null;

  const besties = {
    housesLVL: null,
    townhallLVL: null,
    cost: null,
    roi: null,
    gold: null,
  };

  for (let resourceIndex = 0; resourceIndex < MAX_INDEX; resourceIndex++) {
    console.log(`Generating 4D matrix... ${((resourceIndex / MAX_INDEX) * 100).toFixed(2)} %`);
    resourceLVL = resourceIndex * LVL_PER_INDEX;
    resourceCost = calculateBuildCost(resourceLVL, "mine");

    const goldRow = [resourceLVL];
    const roiRow = [resourceLVL];
    const costRow = [resourceLVL];

    for (let farmIndex = 0; farmIndex < MAX_INDEX; farmIndex++) {
      farmLVL = farmIndex * LVL_PER_INDEX;
      farmCost = calculateNextBuildResourcesCost(farmLVL, "farm");

      if (!goldMatrix[0][farmIndex + 1]) {
        goldMatrix[0].push(farmLVL);
      }

      if (!roiMatrix[0][farmIndex + 1]) {
        roiMatrix[0].push(farmLVL);
      }

      if (!costMatrix[0][farmIndex + 1]) {
        costMatrix[0].push(farmLVL);
      }

      for (let townhallIndex = 0; townhallIndex < MAX_INDEX; townhallIndex++) {
        townhallLVL = townhallIndex * LVL_PER_INDEX;
        townhallCost = calculateNextBuildResourcesCost(townhallLVL, "townhall");

        for (let housesIndex = 0; housesIndex < MAX_INDEX; housesIndex++) {
          housesLVL = housesIndex * LVL_PER_INDEX;
          housesCost = calculateNextBuildResourcesCost(housesCost, "houses");

          expectedStorageCapacity = Math.max(farmCost, resourceCost, housesCost, townhallCost);

          storageLVL = getStorageLvlByCapacity(expectedStorageCapacity);

          const buildLVLs = {
            mine: resourceLVL,
            farm: farmLVL,
            houses: housesLVL,
            townhall: townhallLVL,
            storage: storageLVL,
            sawmill: resourceLVL,
          };

          const { totalGoldProfit } = calculateGoldProfit(buildLVLs, TAX_POLICY_RATE);
          const { totalCost } = getBuildCostsByType(buildLVLs);
          const { ROI } = getProfitStats(totalGoldProfit, totalCost);

          if (!besties.roi || ROI > besties.roi) {
            besties.cost = totalCost;
            besties.roi = ROI;
            besties.gold = totalGoldProfit;
            besties.housesLVL = housesLVL;
            besties.townhallLVL = townhallLVL;
          }
        }
      }

      goldRow.push(withBestLvls(besties.gold, besties.townhallLVL, besties.housesLVL));
      roiRow.push(withBestLvls((besties.roi * 100).toFixed(2), besties.townhallLVL, besties.housesLVL));
      costRow.push(withBestLvls(besties.cost, besties.townhallLVL, besties.housesLVL));

      besties.cost = null;
      besties.roi = null;
      besties.gold = null;
      besties.housesLVL = null;
      besties.townhallLVL = null;
    }

    goldMatrix.push(goldRow);
    roiMatrix.push(roiRow);
    costMatrix.push(costRow);
  }

  const goldCsv = goldMatrix.map((row) => row.join(",")).join("\n");
  const roiCsv = roiMatrix.map((row) => row.join(",")).join("\n");
  const costCsv = costMatrix.map((row) => row.join(",")).join("\n");

  writeDataFile("farm-4d-gold.csv", goldCsv);
  writeDataFile("farm-4d-roi.csv", roiCsv);
  writeDataFile("farm-4d-cost.csv", costCsv);
}

module.exports = {
  generate4DFarmMatrix,
};
