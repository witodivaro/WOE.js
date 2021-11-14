const { FIRST_LVL_BUILD_COST_BY_TYPE } = require("./constants");

function buildLvlCostCounter(firstLvlCost) {
  function countLvlCost(lvl) {
    let nextLvlCost = 0;
    let totalCost = 0;

    for (let i = 1; i <= lvl; i++) {
      nextLvlCost += i * firstLvlCost;
      totalCost += nextLvlCost;
    }

    return totalCost;
  }

  return countLvlCost;
}

function calculateBuildCost(buildLvl, buildType) {
  const firstLvlCost = FIRST_LVL_BUILD_COST_BY_TYPE[buildType];

  const countBuildLvlCost = buildLvlCostCounter(firstLvlCost);

  return countBuildLvlCost(buildLvl);
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
};