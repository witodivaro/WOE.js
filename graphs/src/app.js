import { Chart, registerables } from "chart.js";

import getBestFarmRois from "./calculators/getBestFarmRois";
import getBestTHRois from "./calculators/getBestTHRois";

const [minPrice, maxPrice] = [1000000, 400000000];
function priceFilter({ cost }) {
  return cost > minPrice && cost < maxPrice;
}

const bestFarmRois = getBestFarmRois().filter(priceFilter);
const bestThRois = getBestTHRois().filter(priceFilter);

Chart.register(...registerables);
const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "TH ROI",
        data: bestThRois.map(({ cost, roi }) => {
          return {
            x: cost,
            y: roi,
          };
        }),
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(0, 0, 0)",
      },
      {
        label: "FARM ROI",
        data: bestFarmRois.map(({ cost, roi }) => {
          return { x: cost, y: roi };
        }),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  },
});

// const chart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: Array.from({ length: lastLvl - firstLvl }, (_, i) => i),
//     datasets: [
//       {
//         label: "FARM ROI",
//         data: farmRois.map(({ roi }) => roi),
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.2,
//       },
//       {
//         label: "TH ROI",
//         data: thRois.map(({ roi }) => roi),
//         fill: false,
//         borderColor: "rgb(0, 0, 0)",
//         tension: 0.2,
//       },
//     ],
//   },
//   options: {
//     interaction: {
//       mode: "point",
//     },
//   },
// });
