import TH_ROI from "../../../data/th-3d-roi.json";
import TH_PRICE from "../../../data/th-3d-cost.json";
import TH_GOLD from "../../../data/th-3d-gold.json";

function getBestTHRois() {
  const bestThRois = [];
  let thLvl = 1;
  let houseLvl = 1;

  while (bestThRois.length < TH_ROI.length) {
    const [currentRoi] = TH_ROI[houseLvl + 1][thLvl + 1].split(" | ");
    const [currentCost] = TH_PRICE[houseLvl + 1][thLvl + 1].split(" | ");
    const [currentGold] = TH_GOLD[houseLvl + 1][thLvl + 1].split(" | ");
    bestThRois.push({ roi: currentRoi, thLvl, houseLvl, gold: currentGold, cost: currentCost });

    try {
      const [thUpgradeRoi] = TH_ROI[houseLvl + 1][thLvl + 2].split(" | ");
      const [houseUpgradeRoi] = TH_ROI[houseLvl + 2][thLvl + 1].split(" | ");

      if (thUpgradeRoi > houseUpgradeRoi) {
        thLvl++;
      } else {
        houseLvl++;
      }
    } catch (err) {
      break;
    }
  }
  return bestThRois;
}

export default getBestTHRois;
