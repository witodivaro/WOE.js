function getProfitStats(totalGoldProfit, totalBuildsCost) {
  const ROI = totalGoldProfit / totalBuildsCost;
  const daysToReturnCost = Math.ceil(totalBuildsCost / totalGoldProfit);
  return { ROI, daysToReturnCost };
}

module.exports = {
  getProfitStats,
};
