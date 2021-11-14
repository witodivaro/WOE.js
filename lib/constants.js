const PEOPLE_PER_LVL_BY_BUILD_TYPE = {
  mine: 10,
  farm: 10,
  houses: 20,
  townhall: 0,
  storage: 10,
  sawmill: 10,
};

const RESOURCE_GAIN_PER_HUMAN_BY_BUILD_TYPE = {
  mine: 1,
  farm: 3,
  houses: 0,
  townhall: 0,
  storage: 0,
  sawmill: 1,
};

const FOOD_CONSUMPTION_BY_HUMAN_BY_BUILD_TYPE = {
  mine: 0.2,
  farm: 0,
  houses: 0.5,
  storage: 0,
  townhall: 0,
  sawmill: 0.2,
};

const MARKET_BUY_PRICES_BY_RESOURCE_TYPE = {
  food: 1,
  wood: 1,
  rock: 1,
};

const MARKET_SELL_PRICES_BY_RESOURCE_TYPE = {
  food: 0.5,
  wood: 0.5,
  rock: 0.5,
};

const RESOURCE_BY_BUILD_TYPE = {
  sawmill: "wood",
  mine: "rock",
  farm: "food",
};

const IS_RESOURCE_BUILD_BY_BUILD_TYPE = {
  mine: true,
  farm: true,
  sawmill: true,
  houses: false,
  townhall: false,
  storage: false,
};

const DEFAULT_TAXES_RATE = 0.2;

const FIRST_LVL_BUILD_COST_BY_TYPE = {
  mine: 200,
  sawmill: 200,
  farm: 200,
  houses: 400,
  storage: 400,
  townhall: 900,
};

module.exports = {
  FOOD_CONSUMPTION_BY_HUMAN_BY_BUILD_TYPE,
  RESOURCE_GAIN_PER_HUMAN_BY_BUILD_TYPE,
  PEOPLE_PER_LVL_BY_BUILD_TYPE,
  IS_RESOURCE_BUILD_BY_BUILD_TYPE,
  DEFAULT_TAXES_RATE,
  MARKET_SELL_PRICES_BY_RESOURCE_TYPE,
  MARKET_BUY_PRICES_BY_RESOURCE_TYPE,
  RESOURCE_BY_BUILD_TYPE,
  FIRST_LVL_BUILD_COST_BY_TYPE,
};
