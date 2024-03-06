function getPlugIntegrityArray(plugValues) {
  return {
    'Dry Plug': plugValues,
    Leggy: plugValues,
    'Plug integrity': plugValues,
    'Underdeveloped roots': plugValues,
  };
}

function getProcessingArray(plugValues) {
  return {
    'Canopy damage': plugValues,
    'Coco husk': plugValues,
    'High seed germination': plugValues,
    'Incorrect SKU': plugValues,
    'Injurious foreign material': plugValues,
    'Low seed germination': plugValues,
    Oversaturated: plugValues,
  };
}

function getPlanHealthArray(plugValues) {
  return {
    'Abnormal growth': plugValues,
    'Damp off': plugValues,
    Mold: plugValues,
    Necrosis: plugValues,
    'Root discoloration': plugValues,
    'Root rot': plugValues,
    'Stem lesions': plugValues,
    'Underdeveloped shoot': plugValues,
    Wilting: plugValues,
    'Browning in canopy': plugValues,
    'Purpling in canopy': plugValues,
    'Yellowing in canopy': plugValues,
    Stunting: plugValues,
    'Dead Plugs': plugValues,
  };
}

export const MOCK_SEEDLING_COUNT_EUPHRATES = {
  seedlingCount: [1, 1, 1, 1],
};

const MOCK_EUPHRATES_VALUES = [false, false, false, false, false, false, false, false, false];

export const MOCK_PACKAGING_EUPHRATES = ['low', 'low', 'low', 'low'];

export const MOCK_PLUG_INTEGRITY_EUPHRATES = getPlugIntegrityArray(MOCK_EUPHRATES_VALUES);

export const MOCK_PROCESSING_DEFECTS_EUPHRATES = getProcessingArray(MOCK_EUPHRATES_VALUES);

export const MOCK_PLANT_HEALTH_EUPHRATES = getPlanHealthArray(MOCK_EUPHRATES_VALUES);

export const MOCK_PLUGS_PROPERTIES_DEFECTS = [
  { name: 'Dry Plug', type: '', value: false },
  { name: 'Leggy', type: '', value: false },
  { name: 'Plug integrity', type: '', value: false },
  { name: 'Underdeveloped roots', type: '', value: false },
  { name: 'Canopy damage', type: '', value: false },
  { name: 'Coco husk', type: '', value: false },
  { name: 'High seed germination', type: '', value: false },
  { name: 'Incorrect SKU', type: '', value: false },
  { name: 'Injurious foreign material', type: '', value: false },
  { name: 'Low seed germination', type: '', value: false },
  { name: 'Oversaturated', type: '', value: false },
  { name: 'Abnormal growth', type: '', value: false },
  { name: 'Damp off', type: '', value: false },
  { name: 'Mold', type: '', value: false },
  { name: 'Necrosis', type: '', value: false },
  { name: 'Root discoloration', type: '', value: false },
  { name: 'Root rot', type: '', value: false },
  { name: 'Stem lesions', type: '', value: false },
  { name: 'Underdeveloped shoot', type: '', value: false },
  { name: 'Wilting', type: '', value: false },
  { name: 'Browning in canopy', type: '', value: false },
  { name: 'Purpling in canopy', type: '', value: false },
  { name: 'Yellowing in canopy', type: '', value: false },
  { name: 'Stunting', type: '', value: false },
  { name: 'Dead Plugs', type: '', value: false },
];

export const MOCK_PLUGS_PROPERTIES = [
  { name: 'Seedling Count', type: '', value: 1 },
  { name: 'Gaps in Plugs', type: '', value: 'low' },
  ...MOCK_PLUGS_PROPERTIES_DEFECTS,
];

export const MOCK_PLUGS_VALUE_EUPHRATES = [
  { location: 'C4', properties: MOCK_PLUGS_PROPERTIES },
  { location: 'H4', properties: MOCK_PLUGS_PROPERTIES },
  { location: 'C13', properties: MOCK_PLUGS_PROPERTIES },
  { location: 'H13', properties: MOCK_PLUGS_PROPERTIES },
  { location: '10-20%', properties: MOCK_PLUGS_PROPERTIES_DEFECTS },
  { location: '20-30%', properties: MOCK_PLUGS_PROPERTIES_DEFECTS },
  { location: '30-40%', properties: MOCK_PLUGS_PROPERTIES_DEFECTS },
  { location: '40-50%', properties: MOCK_PLUGS_PROPERTIES_DEFECTS },
  { location: '>50%', properties: MOCK_PLUGS_PROPERTIES_DEFECTS },
];

export const MOCK_SEEDLING_ACTION_RESPONSE_EUPHRATES = { status: true, ErrorType: null };

export const MOCK_FARM_DEF_SEARCH_CROPS = [
  {
    childCrops: [],
    cropTypeName: 'LeafyGreens',
    description: ' ',
    displayAbbreviation: 'CRC:EXP',
    displayName: 'Cristabel - CRC:EXP - Cristabel - coir',
    group: ' ',
    isSeedable: true,
    kind: 'crop',
    name: 'CRC:EXP',
    path: 'crops/CRC:EXP',
    properties: {
      commonName: 'Arugula',
      cultivar: 'Eruca',
      media: 'coir',
      plannedGrowDays: 12.0,
      scientificName: 'Eruca sativa',
    },
    seedPartNumbers: [],
  },
  {
    childCrops: [
      {
        allowedCropNames: ['BTC'],
        defaultCropName: 'BTC',
        maxRatio: 0.0,
        minRatio: 0.0,
        targetRatio: 0.0,
      },
      {
        allowedCropNames: ['FNC'],
        defaultCropName: 'FNC',
        maxRatio: 0.0,
        minRatio: 0.0,
        targetRatio: 0.0,
      },
    ],
    cropTypeName: 'LeafyGreens',
    description: ' ',
    displayAbbreviation: 'BFC',
    displayName: 'BFC - Beet + Fennel -  - coir',
    group: ' ',
    isSeedable: true,
    kind: 'crop',
    name: 'BFC',
    path: 'crops/BFC',
    properties: {
      commonName: 'Beet + Fennel',
      media: 'coir',
      plannedGrowDays: 12.0,
    },
    seedPartNumbers: [],
  },
];

export const MOCK_GET_USER = { firstName: 'Stringer', lastName: 'Bell', username: 'sbell' };

// Mock representing the state of the form when the 1st crop is selected.
export const MOCK_FORM_VALUES_EUPHRATES = {
  id: '1',
  cultivar: MOCK_FARM_DEF_SEARCH_CROPS[0].name,
  trayId: '800-00000000:TRY:000-000-016',
  site: 'LAX1_LAX1',
  notes: 'Cristabel - CRC:EXP - Cristabel - coir',
  seedlingCount: MOCK_SEEDLING_COUNT_EUPHRATES,
  packagingCondensationLevels: MOCK_PACKAGING_EUPHRATES,
  plugIntegrity: MOCK_PLUG_INTEGRITY_EUPHRATES,
  processingDefects: MOCK_PROCESSING_DEFECTS_EUPHRATES,
  plantHealth: MOCK_PLANT_HEALTH_EUPHRATES,
};

export const MOCK_TRAY_ID_RECORD = {
  id: '800-00000000:TRY:000-000-016',
  materialObj: {
    id: '64b3367c-dff3-489a-9e5c-840c1f663d65',
    lotName: '124783a1-b407-4698-b2ae-27614a529c60',
    materialType: 'LOADED_TRAY',
    product: 'CRC:EXP',
    createdAt: '2021-11-16T15:41:47.551Z',
    updatedAt: '2021-11-16T15:41:47.551Z',
    properties: {},
  },
};

export const MOCK_TRAY_ID_EDITED = {
  id: 'P900-0008529A:1XO5-H0OW-SA',
  materialObj: {
    id: '64b3367c-dff3-489a-9e5c-840c1f663d65',
    lotName: '124783a1-b407-4698-b2ae-27614a529c60',
    materialType: 'LOADED_TRAY',
    product: 'BFC',
    createdAt: '2021-11-16T15:41:47.551Z',
    updatedAt: '2021-11-16T15:41:47.551Z',
    properties: {},
  },
};

// Mock representing the state of the form when the 2nd crop is selected.
export const MOCK_FORM_VALUES_EDIT = {
  ...MOCK_FORM_VALUES_EUPHRATES,
  trayId: 'P900-0008529A:1XO5-H0OW-SA',
  cultivar: MOCK_TRAY_ID_EDITED.materialObj.product,
};

export const MOCK_GET_SEEDLING_QA_RECORD = {
  id: '1',
  cultivar: MOCK_FARM_DEF_SEARCH_CROPS[0].name,
  trayId: '800-00000000:TRY:000-000-016',
  site: 'LAX1_LAX1',
  notes: 'Cristabel - CRC:EXP - Cristabel - coir',
  plugs: MOCK_PLUGS_VALUE_EUPHRATES,
  username: MOCK_GET_USER.username,
  createdAt: '2020-06-04T17:07:26.912018Z',
  updatedAt: '2020-06-04T17:07:26.912018Z',
  seedlingQAActionResponse: MOCK_SEEDLING_ACTION_RESPONSE_EUPHRATES,
};

export const MOCK_GET_SEEDLING_QA_RECORD_EUPHRATES = {
  id: '1',
  cultivar: MOCK_FARM_DEF_SEARCH_CROPS[0].name,
  trayId: '800-00000000:TRY:000-000-016',
  site: 'LAX1_LAX1',
  notes: 'Cristabel - CRC:EXP - Cristabel - coir',
  plugs: MOCK_PLUGS_VALUE_EUPHRATES,
  username: MOCK_GET_USER.username,
  createdAt: '2020-06-04T17:07:26.912018Z',
  updatedAt: '2020-06-04T17:07:26.912018Z',
  seedlingQAActionResponse: MOCK_SEEDLING_ACTION_RESPONSE_EUPHRATES,
};
