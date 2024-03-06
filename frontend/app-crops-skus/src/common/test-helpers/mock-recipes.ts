import { Recipes } from '@plentyag/core/src/farm-def/types';

export const mockRecipes: Recipes = {
  seederModule: {
    moduleUuid: 'fakefake-fake-fake-fake-fakefakefake',
    moduleEnabled: false,
    moduleSeedName: 'BRN',
    moduleNumPasses: 1,
    moduleDrumConfigNum: 1,
    moduleBlowoffPressure: 50.0,
    moduleSeedFeedDuration: 50.0,
    moduleFeedVibrationIntensity: 20.0,
    moduleTrayVibrationIntensity: 50.0,
  },
  propIrrigationSchedule: {
    '1': 300,
    '3': 300,
    '5': 300,
    '7': 300,
    '9': 300,
    '11': 300,
    '12': 300,
    '13': 300,
    '14': 300,
    '15': 300,
    '16': 300,
    '17': 300,
    '18': 300,
  },
  harvesterSettings: {
    washSpeed: {
      units: 'mm/s',
      value: 280,
    },
    toteWeight: {
      units: 'g',
      value: 1750,
    },
    harvestDepth: {
      units: 'mm',
      value: 20,
    },
    harvestSpeed: {
      units: 'mm/s',
      value: 450,
    },
    breakawaySpeed: {
      units: 'mm/s',
      value: 450,
    },
  },
  propIrrigationMinVolume: 300,
};
