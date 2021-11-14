function calculateStorageCapacity(lvl) {
  let totalStorageCapacity = 0;

  for (let i = 1; i <= lvl; i++) {
    totalStorageCapacity += 950 * 100 * lvl;
  }

  return totalStorageCapacity;
}

function getStorageLvlByCapacity(capacity) {
  let totalStorageCapacity = 950;

  let currentLvl = 1;

  while (totalStorageCapacity < capacity) {
    currentLvl++;
    totalStorageCapacity += 950 + 100 * currentLvl;
  }

  return currentLvl;
}

module.exports = {
  calculateStorageCapacity,
  getStorageLvlByCapacity,
};
