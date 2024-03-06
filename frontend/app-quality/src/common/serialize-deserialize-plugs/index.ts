import { cloneDeep } from 'lodash';

function createPropertyFromValue(plugName: string, value: string): SeedlingQA.Property {
  return {
    name: plugName,
    type: '',
    value: value,
  };
}

interface SerializeDeserializeParams {
  values: any;
  plugs: string[];
  percentages: string[];
  plug_defects: string[];
  processing_defects: string[];
  plant_defects: string[];
}

export function serializePlugsFromValues(params: SerializeDeserializeParams): SeedlingQA.Plug[] {
  const serializedPlugs = [];
  let index = 0;

  // copying, since code here modifies.
  const _values = cloneDeep(params.values);

  for (const plug of params.plugs) {
    const newPlug: SeedlingQA.Plug = {
      location: plug,
      properties: [],
    };

    const seedlingCount = _values['seedlingCount']['seedlingCount'][index];
    newPlug.properties.push(createPropertyFromValue('Seedling Count', seedlingCount === undefined ? 0 : seedlingCount));

    if (_values.packagingCondensationLevels === undefined) {
      _values.packagingCondensationLevels = new Array(params.plugs.length);
    }
    newPlug.properties.push(createPropertyFromValue('Gaps in Plugs', _values.packagingCondensationLevels[index]));

    for (const plugName of params.plug_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.plugIntegrity[plugName][index]));
    }

    for (const plugName of params.processing_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.processingDefects[plugName][index]));
    }

    for (const plugName of params.plant_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.plantHealth[plugName][index]));
    }
    serializedPlugs.push(newPlug);
    index++;
  }

  for (const plug of params.percentages) {
    const newPlug: SeedlingQA.Plug = {
      location: plug,
      properties: [],
    };

    for (const plugName of params.plug_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.plugIntegrity[plugName][index]));
    }

    for (const plugName of params.processing_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.processingDefects[plugName][index]));
    }

    for (const plugName of params.plant_defects) {
      newPlug.properties.push(createPropertyFromValue(plugName, _values.plantHealth[plugName][index]));
    }

    serializedPlugs.push(newPlug);
    index++;
  }
  return serializedPlugs;
}

export function deserializeDataFromPlugs(params: SerializeDeserializeParams) {
  const seedlingCount = new Array(params.plugs.length);
  const packagingCondensationLevels = new Array(params.plugs.length);
  const plugIntegrity = {};
  const PLUGS_PERCENTAGES = [...params.plugs, ...params.percentages];
  for (const plugName of params.plug_defects) {
    plugIntegrity[plugName] = new Array(PLUGS_PERCENTAGES.length);
  }
  const processing = {};
  for (const plugName of params.processing_defects) {
    processing[plugName] = new Array(PLUGS_PERCENTAGES.length);
  }
  const plantHealth = {};
  for (const plugName of params.plant_defects) {
    plantHealth[plugName] = new Array(PLUGS_PERCENTAGES.length);
  }

  for (let plug of params.values.plugs) {
    const properties = plug.properties;
    for (const property of properties) {
      if (property.name === 'Seedling Count') {
        seedlingCount[params.plugs.indexOf(plug.location)] = property.value;
      }
      if (property.name === 'Gaps in Plugs') {
        packagingCondensationLevels[params.plugs.indexOf(plug.location)] = property.value;
      }
      if (params.plug_defects.includes(property.name)) {
        for (const plugName of params.plug_defects) {
          if (property.name === plugName) {
            plugIntegrity[plugName][PLUGS_PERCENTAGES.indexOf(plug.location)] = property.value === 'true';
          }
        }
      }
      if (params.processing_defects.includes(property.name)) {
        for (const plugName of params.processing_defects) {
          if (property.name === plugName) {
            processing[plugName][PLUGS_PERCENTAGES.indexOf(plug.location)] = property.value === 'true';
          }
        }
      }
      if (params.plant_defects.includes(property.name)) {
        for (const plugName of params.plant_defects) {
          if (property.name === plugName) {
            plantHealth[plugName][PLUGS_PERCENTAGES.indexOf(plug.location)] = property.value === 'true';
          }
        }
      }
    }
  }

  return {
    createdAt: params.values['createdAt'],
    cultivar: params.values['cultivar'],
    cultivarName: params.values['cultivarName'],
    id: params.values['id'],
    notes: params.values['notes'],
    room: params.values['room'],
    s3Bucket: params.values['s3Bucket'],
    s3Key: params.values['s3Key'],
    site: params.values['site'],
    trayId: params.values['trayId'],
    updatedAt: params.values['updatedAt'],
    username: params.values['username'],
    seedlingCount: { seedlingCount },
    packagingCondensationLevels: packagingCondensationLevels,
    plugIntegrity: plugIntegrity,
    processingDefects: processing,
    plantHealth: plantHealth,
  };
}
