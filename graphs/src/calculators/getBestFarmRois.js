import FARM_ROI from "../../../data/farm-roi.json";
import FARM_PRICE from "../../../data/farm-cost.json";
import FARM_GOLD from "../../../data/farm-gold.json";

function getBestFARMRois() {
  const bestThRois = [];
  let farmLvl = 1;
  let resourceLvl = 1;

  while (bestThRois.length < FARM_ROI.length) {
    const currentRoi = FARM_ROI[resourceLvl + 1][farmLvl + 1];
    const currentCost = FARM_PRICE[resourceLvl + 1][farmLvl + 1];
    const currentGold = FARM_GOLD[resourceLvl + 1][farmLvl + 1];
    bestThRois.push({
      roi: currentRoi,
      gold: currentGold,
      cost: currentCost,
      farmLvl: farmLvl,
      resourceLvl: resourceLvl,
    });

    try {
      const [farmUpgradeRoi] = FARM_ROI[resourceLvl + 1][farmLvl + 2].split(" | ");
      const [resourceUpgradeRoi] = FARM_ROI[resourceLvl + 2][farmLvl + 1].split(" | ");

      if (farmUpgradeRoi > resourceUpgradeRoi) {
        farmLvl++;
      } else {
        resourceLvl++;
      }
    } catch (err) {
      break;
    }
  }
  return bestThRois;
}

export default getBestFARMRois;
