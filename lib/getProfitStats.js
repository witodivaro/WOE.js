const { ONE_DAY_IN_MINUTES } = require("./constants");

function getProfitStats(totalGoldProfit, totalBuildsCost) {
  const totalGoldProfitInRealDays = totalGoldProfit * ONE_DAY_IN_MINUTES;
  const ROI = totalGoldProfitInRealDays / totalBuildsCost;
  const daysToReturnCost = Math.ceil(totalBuildsCost / totalGoldProfitInRealDays);
  return { ROI, daysToReturnCost };
}

module.exports = {
  getProfitStats,
};
