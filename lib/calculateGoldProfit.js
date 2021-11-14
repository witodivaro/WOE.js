const { calculateTaxes } = require("./calculateTaxes");
const {
  PEOPLE_PER_LVL_BY_BUILD_TYPE,
  RESOURCE_GAIN_PER_HUMAN_BY_BUILD_TYPE,
  FOOD_CONSUMPTION_BY_HUMAN_BY_BUILD_TYPE,
  IS_RESOURCE_BUILD_BY_BUILD_TYPE,
  MARKET_SELL_PRICES_BY_RESOURCE_TYPE,
  MARKET_BUY_PRICES_BY_RESOURCE_TYPE,
  RESOURCE_BY_BUILD_TYPE,
  ONE_DAY_IN_MINUTES,
} = require("./constants");

/**
 *
 * @param {*} buildLvls
 * @param {number} buildLvls.mine - number
 * @param {number} buildLvls.farm - number
 * @param {number} buildLvls.houses - number
 * @param {number} buildLvls.townhall - number
 * @param {number} buildLvls.storage - number
 * @param {number} buildLvls.sawmill - number
 *
 * @param {*} taxesMultiplier
 */
function calculateGoldProfit(buildLvls, taxesMultiplier) {
  const peopleCountByBuildType = getPeopleCountByBuildType(buildLvls);

  const resourceGainByType = getResourceGainByType(peopleCountByBuildType, taxesMultiplier);
  const foodConsumption = calculateFoodConsumption(peopleCountByBuildType, taxesMultiplier);
  const taxes = calculateTaxes(taxesMultiplier, buildLvls.townhall);

  const foodGain = resourceGainByType.food;

  const foodForConsumptionCount = foodGain > foodConsumption ? foodConsumption : foodGain;
  const goldRequiredForFood = foodForConsumptionCount < foodConsumption ? foodConsumption - foodForConsumptionCount : 0;
  const goldGainedFromTaxes = Math.floor(peopleCountByBuildType.houses * taxes);

  const { food: foodSellPrice } = MARKET_SELL_PRICES_BY_RESOURCE_TYPE;
  const goldGainedFromFood = (foodGain - foodForConsumptionCount) * foodSellPrice;

  const { rock: rockGained, wood: woodGained } = resourceGainByType;
  const { rock: rockBuyPrice, wood: woodBuyPrice } = MARKET_BUY_PRICES_BY_RESOURCE_TYPE;
  const goldInGainedResources = rockBuyPrice * rockGained + woodBuyPrice * woodGained;

  const totalGoldProfit = goldGainedFromFood + goldInGainedResources + goldGainedFromTaxes - goldRequiredForFood;
  const totalGoldProfitInDays = totalGoldProfit * ONE_DAY_IN_MINUTES;

  return {
    totalGoldProfit,
    totalGoldProfitInDays,
    goldInGainedResources,
    goldRequiredForFood,
    goldGainedFromFood,
    goldGainedFromTaxes,
  };
}

function getPeopleCountByBuildType(resourceLvls) {
  const peopleCountByResourceType = Object.keys(resourceLvls).reduce((people, resourceType) => {
    const resourceLvl = resourceLvls[resourceType];
    const resourcePeoplePerLvl = PEOPLE_PER_LVL_BY_BUILD_TYPE[resourceType];
    const peopleOnResource = resourceLvl * resourcePeoplePerLvl;

    people[resourceType] = peopleOnResource;

    return people;
  }, {});

  return peopleCountByResourceType;
}

function getResourceGainByType(peopleCountByBuildType, taxesMultiplier) {
  const resourceGainPerType = Object.keys(peopleCountByBuildType).reduce((resourceGain, buildType) => {
    if (!IS_RESOURCE_BUILD_BY_BUILD_TYPE[buildType]) return resourceGain;
    const resourceType = RESOURCE_BY_BUILD_TYPE[buildType];

    const peopleCount = peopleCountByBuildType[buildType];
    const resourcePerHuman = RESOURCE_GAIN_PER_HUMAN_BY_BUILD_TYPE[buildType] / taxesMultiplier;

    const totalResourceGain = peopleCount * resourcePerHuman;
    resourceGain[resourceType] = totalResourceGain;

    return resourceGain;
  }, {});

  return resourceGainPerType;
}

function calculateFoodConsumption(peopleCountByBuildType, taxesMultiplier) {
  const foodConsumption = Object.keys(peopleCountByBuildType).reduce((foodConsumption, buildType) => {
    const resourceFoodConsumptionByHuman = FOOD_CONSUMPTION_BY_HUMAN_BY_BUILD_TYPE[buildType] * taxesMultiplier;
    const peopleCount = peopleCountByBuildType[buildType];

    const buildFoodConsumption = resourceFoodConsumptionByHuman * peopleCount;

    foodConsumption += buildFoodConsumption;
    return foodConsumption;
  }, 0);

  return foodConsumption;
}

module.exports = {
  calculateGoldProfit,
};
