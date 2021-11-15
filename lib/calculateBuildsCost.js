const { FIRST_LVL_BUILD_COST_BY_TYPE } = require("./constants");

function buildLvlCostCounter(firstLvlCost) {
  function countLvlCost(lvl) {
    let nextLvlCost = 0;
    let totalCost = 0;

    for (let i = 1; i <= lvl; i++) {
      nextLvlCost += i * firstLvlCost;
      totalCost += nextLvlCost;
    }

    return { totalCost, nextLvlCost };
  }

  return countLvlCost;
}

function calculateNextBuildCost(buildLvl, buildType) {
  const firstLvlCost = FIRST_LVL_BUILD_COST_BY_TYPE[buildType];

  const countBuildLvlCost = buildLvlCostCounter(firstLvlCost);

  const { nextLvlCost } = countBuildLvlCost(buildLvl);

  return nextLvlCost;
}

function calculateNextBuildResourcesCost(buildLvl, buildType) {
  if (buildType !== "townhall") {
    return calculateNextBuildCost(buildLvl, buildType) / 4;
  }

  let nextDifference = 600;
  const DIFFERENCE_UP_PER_LVL = 200;

  let currentLvl = 1;
  let currentCost = 600;

  while (currentLvl < buildLvl) {
    currentLvl++;
    currentCost += nextDifference;
    nextDifference += DIFFERENCE_UP_PER_LVL;
  }

  return currentCost;
}

function calculateBuildCost(buildLvl, buildType) {
  const firstLvlCost = FIRST_LVL_BUILD_COST_BY_TYPE[buildType];

  const countBuildLvlCost = buildLvlCostCounter(firstLvlCost);

  const { totalCost } = countBuildLvlCost(buildLvl);

  return totalCost;
}

function getBuildCostsByType(buildLvls) {
  const buildsCostByType = Object.keys(buildLvls).reduce((costByType, buildType) => {
    const buildLvl = buildLvls[buildType];
    const buildCost = calculateBuildCost(buildLvl, buildType);

    costByType[buildType] = buildCost;

    return costByType;
  }, {});

  const totalCost = Object.values(buildsCostByType).reduce((total, current) => total + current);

  return { buildsCostByType, totalCost };
}

module.exports = {
  buildLvlCostCounter,
  getBuildCostsByType,
  calculateBuildCost,
  calculateNextBuildCost,
  calculateNextBuildResourcesCost,
};
