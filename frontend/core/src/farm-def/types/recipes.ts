// represents a set of recipes for a farm.
export interface Recipes {
  [recipeName: string]: Recipe;
}

// individual recipe can have a single setting or multiple settings
export type Recipe = RecipeSetting | RecipeSettings;

export interface RecipeSettings {
  [recipeSettingName: string]: RecipeSetting;
}

export type RecipeSetting = RecipeSettingWithPrimitiveType | RecipeSettingWithUnits;

export type RecipeSettingWithPrimitiveType = string | number | boolean;

export interface RecipeSettingWithUnits {
  value: RecipeSettingWithPrimitiveType;
  units: string;
  // for recipes with numeric value, can have min/max values
  minValue?: number;
  maxValue?: number;
}

// Lucky for us recipes come in wide variety of formats :-(
// Below shows an example taken from the crop: https://farmos.plenty-dev.tools/crops-skus/crops/BRN
//
// The first key is the name of the farm (here: LAX1, tigris).
//
// Within each farm there can be a number of individual recipes (seeder and seederModule for LAX1 here).
// A recipe has one or more settings. Here "propIrrigationMinVolume" is recipe with a single setting and
// "seeder" is recipe with multiple settings (list of settings).
//
// For a recipe that is an object there are three possible formats:
//  1. simple key/value pair like "seeder", where value is a string or number.
//  2. key/object pair like "harvesterSettings" where the object has details like units and value.
//  3. special table format like "propIrrigationSchedule" - this is intended to represent a table.
//
// {
//   "LAX1": {
//      "propagationIrrigationRecipe": {
//          "irrigationMinVolume": 210,
//          "irrigationSchedule": {
//             "0": 210,
//             "10": 210,
//             "11": 210,
//             "12": 210,
//             "13": 210,
//             "14": 210,
//             "15": 210,
//             "16": 210,
//             "3": 210,
//             "6": 210,
//             "8": 210,
//             "9": 210
//          },
//          "minimumIrrigationDuration": 180
//       },
//       "seeder": {
//           "dibbleDepth": 11.0,
//           "conveyorSpeed": 50.0,
//           "vacuumPressure": 50.0,
//           "irrigatorConveyorSpeed": 25.0,
//           "topCoaterVibrationIntensity": 20.0
//       },
//       "seederModule": {
//           "moduleUuid": "fakefake-fake-fake-fake-fakefakefake",
//           "moduleEnabled": false,
//           "moduleSeedName": "BRN",
//           "moduleNumPasses": 1,
//           "moduleDrumConfigNum": 1,
//           "moduleBlowoffPressure": 50.0,
//           "moduleSeedFeedDuration": 50.0,
//           "moduleFeedVibrationIntensity": 20.0,
//           "moduleTrayVibrationIntensity": 50.0
//       }
//   },
//   "tigris": {
//       "harvesterSettings": {
//           "washSpeed": {
//               "units": "mm/s",
//               "value": 280,
//               "maxValue": 300,
//               "minValue": 150
//           },
//           "toteWeight": {
//               "units": "g",
//               "value": 1750,
//               "maxValue": 1750,
//               "minValue": 150
//           },
//           "harvestDepth": {
//               "units": "mm",
//               "value": 20,
//               "maxValue": 135,
//               "minValue": 5
//           },
//           "harvestSpeed": {
//               "units": "mm/s",
//               "value": 450,
//               "maxValue": 450,
//               "minValue": 0
//           },
//           "breakawaySpeed": {
//               "units": "mm/s",
//               "value": 450,
//               "maxValue": 450,
//               "minValue": 150
//           }
//       },
//       "propIrrigationSchedule": {
//           "1": 300,
//           "3": 300,
//           "5": 300,
//           "7": 300,
//           "9": 300,
//           "11": 300,
//           "12": 300,
//           "13": 300,
//           "14": 300,
//           "15": 300,
//           "16": 300,
//           "17": 300,
//           "18": 300
//       },
//       "propIrrigationMinVolume": 300
//   }
// }
