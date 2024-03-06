import { FarmDefMeasurementType } from '@plentyag/core/src/farm-def/types';

export const mockMeasurementTypes: FarmDefMeasurementType[] = [
  {
    name: 'ApparentPower',
    description: 'Apparent Power',
    path: 'measurementTypes/ApparentPower',
    kind: 'measurementType',
    properties: {},
    key: 'APPARENT_POWER',
    defaultUnit: 'KVA',
    supportedUnits: {
      KVA: {
        kind: 'measurementUnit',
        unit: 'KVA',
        symbol: 'kVA',
        description: 'kilovolt amps',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'KVA',
      },
    },
  },
  {
    name: 'Area',
    description: 'Area',
    path: 'measurementTypes/Area',
    kind: 'measurementType',
    properties: {},
    key: 'AREA',
    defaultUnit: 'CM2',
    supportedUnits: {
      CM2: {
        kind: 'measurementUnit',
        unit: 'CM2',
        symbol: 'cm²',
        description: 'square centimeters',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'CM2',
      },
    },
  },
  {
    name: 'BinaryState',
    description: 'Binary state',
    path: 'measurementTypes/BinaryState',
    kind: 'measurementType',
    properties: {},
    key: 'BINARY_STATE',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'CategoricalState',
    description: 'Categorical state',
    path: 'measurementTypes/CategoricalState',
    kind: 'measurementType',
    properties: {},
    key: 'CATEGORICAL_STATE',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'Concentration',
    description: 'Concentration',
    path: 'measurementTypes/Concentration',
    kind: 'measurementType',
    properties: {},
    key: 'CONCENTRATION',
    defaultUnit: 'PPM',
    supportedUnits: {
      ML_PER_GALLON: {
        kind: 'measurementUnit',
        unit: 'ML_PER_GALLON',
        symbol: 'ml/gal',
        description: 'milliliter per gallon',
        conversionToDefaultUnit: 'X*210.865',
        conversionFromDefaultUnit: 'X/210.865',
        protoEnumMapping: 'ML_PER_GALLON',
      },
      PPM: {
        kind: 'measurementUnit',
        unit: 'PPM',
        symbol: 'ppm',
        description: 'parts per million',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'PPM',
      },
    },
  },
  {
    name: 'Count',
    description: 'Count',
    path: 'measurementTypes/Count',
    kind: 'measurementType',
    properties: {},
    key: 'COUNT',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'Current',
    description: 'Current',
    path: 'measurementTypes/Current',
    kind: 'measurementType',
    properties: {},
    key: 'CURRENT',
    defaultUnit: 'A',
    supportedUnits: {
      A: {
        kind: 'measurementUnit',
        unit: 'A',
        symbol: 'A',
        description: 'amper',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'A',
      },
    },
  },
  {
    name: 'DissolvedOxygen',
    description: 'Dissolved oxygen',
    path: 'measurementTypes/DissolvedOxygen',
    kind: 'measurementType',
    properties: {},
    key: 'DISSOLVED_OXYGEN',
    defaultUnit: 'MILLIGRAM_PER_LITER',
    supportedUnits: {
      MILLIGRAM_PER_LITER: {
        kind: 'measurementUnit',
        unit: 'MILLIGRAM_PER_LITER',
        symbol: 'mg/l',
        description: 'milligram per liter',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'MILLIGRAM_PER_LITER',
      },
    },
  },
  {
    name: 'DutyCycle',
    description: 'Duty Cycle',
    path: 'measurementTypes/DutyCycle',
    kind: 'measurementType',
    properties: {},
    key: 'DUTY_CYCLE',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'ElectricalConductivity',
    description: 'Electrical conductivity',
    path: 'measurementTypes/ElectricalConductivity',
    kind: 'measurementType',
    properties: {},
    key: 'ELECTRICAL_CONDUCTIVITY',
    defaultUnit: 'MSIEMENS_PER_CM',
    supportedUnits: {
      MSIEMENS_PER_CM: {
        kind: 'measurementUnit',
        unit: 'MSIEMENS_PER_CM',
        symbol: 'mS/cm',
        description: 'milli siemens per cm',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'MSIEMENS_PER_CM',
      },
      SIEMENS_PER_CM: {
        kind: 'measurementUnit',
        unit: 'SIEMENS_PER_CM',
        symbol: 'S/cm',
        description: 'siemens per cm',
        conversionToDefaultUnit: 'X*1000',
        conversionFromDefaultUnit: 'X/1000',
        protoEnumMapping: 'SIEMENS_PER_CM',
      },
      USIEMENS_PER_CM: {
        kind: 'measurementUnit',
        unit: 'USIEMENS_PER_CM',
        symbol: 'μS/cm',
        description: 'micro siemens per cm',
        conversionToDefaultUnit: 'X/1000',
        conversionFromDefaultUnit: 'X*1000',
        protoEnumMapping: 'USIEMENS_PER_CM',
      },
    },
  },
  {
    name: 'Energy',
    description: 'Energy',
    path: 'measurementTypes/Energy',
    kind: 'measurementType',
    properties: {},
    key: 'ENERGY',
    defaultUnit: 'KWH',
    supportedUnits: {
      KWH: {
        kind: 'measurementUnit',
        unit: 'KWH',
        symbol: 'kWh',
        description: 'kilowatt per hour',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'KWH',
      },
    },
  },
  {
    name: 'FlowRate',
    description: 'Flow rate',
    path: 'measurementTypes/FlowRate',
    kind: 'measurementType',
    properties: {},
    key: 'FLOW_RATE',
    defaultUnit: 'LITERS_PER_SECOND',
    supportedUnits: {
      FT3_PER_HOUR: {
        kind: 'measurementUnit',
        unit: 'FT3_PER_HOUR',
        symbol: 'ft³/hour',
        description: 'cubic feet per hour',
        conversionToDefaultUnit: 'X/127.133',
        conversionFromDefaultUnit: 'X*127.133',
        protoEnumMapping: 'FT3_PER_HOUR',
      },
      FT3_PER_MINUTE: {
        kind: 'measurementUnit',
        unit: 'FT3_PER_MINUTE',
        symbol: 'ft³/min',
        description: 'cubic feet per minute',
        conversionToDefaultUnit: 'X/2.119',
        conversionFromDefaultUnit: 'X*2.119',
        protoEnumMapping: 'FT3_PER_MINUTE',
      },
      GALLONS_PER_MINUTE: {
        kind: 'measurementUnit',
        unit: 'GALLONS_PER_MINUTE',
        symbol: 'gal/min',
        description: 'gallons per minute',
        conversionToDefaultUnit: 'X/15.85',
        conversionFromDefaultUnit: 'X*15.85',
        protoEnumMapping: 'GALLONS_PER_MINUTE',
      },
      LITERS_PER_MINUTE: {
        kind: 'measurementUnit',
        unit: 'LITERS_PER_MINUTE',
        symbol: 'l/s',
        description: 'liters per minute',
        conversionToDefaultUnit: 'X/60',
        conversionFromDefaultUnit: 'X*60',
        protoEnumMapping: 'LITERS_PER_MINUTE',
      },
      LITERS_PER_SECOND: {
        kind: 'measurementUnit',
        unit: 'LITERS_PER_SECOND',
        symbol: 'l/s',
        description: 'litres per second',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'LITERS_PER_SECOND',
      },
    },
  },
  {
    name: 'Force',
    description: 'Force',
    path: 'measurementTypes/Force',
    kind: 'measurementType',
    properties: {},
    key: 'FORCE',
    defaultUnit: 'GF',
    supportedUnits: {
      GF: {
        kind: 'measurementUnit',
        unit: 'GF',
        symbol: 'gf',
        description: 'gram-force',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'GF',
      },
    },
  },
  {
    name: 'Frequency',
    description: 'Frequency',
    path: 'measurementTypes/Frequency',
    kind: 'measurementType',
    properties: {},
    key: 'FREQUENCY',
    defaultUnit: 'HZ',
    supportedUnits: {
      HZ: {
        kind: 'measurementUnit',
        unit: 'Hz',
        symbol: 'Hz',
        description: 'hertz',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'HZ',
      },
    },
  },
  {
    name: 'Length',
    description: 'Length',
    path: 'measurementTypes/Length',
    kind: 'measurementType',
    properties: {},
    key: 'LENGTH',
    defaultUnit: 'CM',
    supportedUnits: {
      CM: {
        kind: 'measurementUnit',
        unit: 'CM',
        symbol: 'cm',
        description: 'centimeter',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'CM',
      },
      M: {
        kind: 'measurementUnit',
        unit: 'M',
        symbol: 'm',
        description: 'meter',
        conversionToDefaultUnit: 'X*100',
        conversionFromDefaultUnit: 'X/100',
        protoEnumMapping: 'M',
      },
      MM: {
        kind: 'measurementUnit',
        unit: 'MM',
        symbol: 'mm',
        description: 'millimeter',
        conversionToDefaultUnit: 'X/10',
        conversionFromDefaultUnit: 'X*10',
        protoEnumMapping: 'MM',
      },
    },
  },
  {
    name: 'LightIntensity',
    description: 'Light intensity',
    path: 'measurementTypes/LightIntensity',
    kind: 'measurementType',
    properties: {},
    key: 'LIGHT_INTENSITY',
    defaultUnit: 'LM',
    supportedUnits: {
      LM: {
        kind: 'measurementUnit',
        unit: 'LM',
        symbol: 'lm',
        description: 'lumens',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'LM',
      },
      LX: {
        kind: 'measurementUnit',
        unit: 'LX',
        symbol: 'lx',
        description: 'luminous flux',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'LX',
      },
    },
  },
  {
    name: 'Mass',
    description: 'Mass',
    path: 'measurementTypes/Mass',
    kind: 'measurementType',
    properties: {},
    key: 'MASS',
    defaultUnit: 'KG',
    supportedUnits: {
      G: {
        kind: 'measurementUnit',
        unit: 'G',
        symbol: 'g',
        description: 'gram',
        conversionToDefaultUnit: 'X/1000',
        conversionFromDefaultUnit: 'X*1000',
        protoEnumMapping: 'G',
      },
      KG: {
        kind: 'measurementUnit',
        unit: 'KG',
        symbol: 'kg',
        description: 'kilogram',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'KG',
      },
      LB: {
        kind: 'measurementUnit',
        unit: 'LB',
        symbol: 'lb',
        description: 'pound',
        conversionToDefaultUnit: 'X*0.453592',
        conversionFromDefaultUnit: 'X/0.453592',
        protoEnumMapping: 'LB',
      },
    },
  },
  {
    name: 'Orp',
    description: 'Oxidation reduction potential',
    path: 'measurementTypes/Orp',
    kind: 'measurementType',
    properties: {},
    key: 'ORP',
    defaultUnit: 'MV',
    supportedUnits: {
      MV: {
        kind: 'measurementUnit',
        unit: 'MV',
        symbol: 'mV',
        description: 'millivolts',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'MV',
      },
    },
  },
  {
    name: 'PH',
    description: 'Ph',
    path: 'measurementTypes/PH',
    kind: 'measurementType',
    properties: {},
    key: 'PH',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'Percentage',
    description: 'Percentage',
    path: 'measurementTypes/Percentage',
    kind: 'measurementType',
    properties: {},
    key: 'PERCENTAGE',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '%',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'Power',
    description: 'Power',
    path: 'measurementTypes/Power',
    kind: 'measurementType',
    properties: {},
    key: 'POWER',
    defaultUnit: 'W',
    supportedUnits: {
      KW: {
        kind: 'measurementUnit',
        unit: 'KW',
        symbol: 'kW',
        description: 'kilowatt',
        conversionToDefaultUnit: 'X*1000',
        conversionFromDefaultUnit: 'X/1000',
        protoEnumMapping: 'KW',
      },
      W: {
        kind: 'measurementUnit',
        unit: 'W',
        symbol: 'W',
        description: 'watt',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'W',
      },
    },
  },
  {
    name: 'Pressure',
    description: 'Pressure',
    path: 'measurementTypes/Pressure',
    kind: 'measurementType',
    properties: {},
    key: 'PRESSURE',
    defaultUnit: 'KPA',
    supportedUnits: {
      BAR: {
        kind: 'measurementUnit',
        unit: 'BAR',
        symbol: 'bar',
        description: 'bar',
        conversionToDefaultUnit: 'X*100',
        conversionFromDefaultUnit: 'X/100',
        protoEnumMapping: 'BAR',
      },
      KPA: {
        kind: 'measurementUnit',
        unit: 'KPA',
        symbol: 'kPa',
        description: 'kilopascal',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'KPA',
      },
      MBAR: {
        kind: 'measurementUnit',
        unit: 'MBAR',
        symbol: 'mbar',
        description: 'millibar',
        conversionToDefaultUnit: 'X/10',
        conversionFromDefaultUnit: 'X*10',
        protoEnumMapping: 'MBAR',
      },
      PSI: {
        kind: 'measurementUnit',
        unit: 'PSI',
        symbol: 'psi',
        description: 'pound per square inch',
        conversionToDefaultUnit: 'X*6.895',
        conversionFromDefaultUnit: 'X/6.895',
        protoEnumMapping: 'PSI',
      },
      PSIG: {
        kind: 'measurementUnit',
        unit: 'PSIG',
        symbol: 'psig',
        description: 'PSI gauge',
        conversionToDefaultUnit: 'X*6.895',
        conversionFromDefaultUnit: 'X/6.895',
        protoEnumMapping: 'PSIG',
      },
    },
  },
  {
    name: 'Probability',
    description: 'Probability',
    path: 'measurementTypes/Probability',
    kind: 'measurementType',
    properties: {},
    key: 'PROBABILITY',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '%',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'RelativeHumidity',
    description: 'Relative humidity',
    path: 'measurementTypes/RelativeHumidity',
    kind: 'measurementType',
    properties: {},
    key: 'RELATIVE_HUMIDITY',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '%',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'Salinity',
    description: 'Salinity',
    path: 'measurementTypes/Salinity',
    kind: 'measurementType',
    properties: {},
    key: 'SALINITY',
    defaultUnit: 'PPT',
    supportedUnits: {
      PPT: {
        kind: 'measurementUnit',
        unit: 'PPT',
        symbol: 'ppt',
        description: 'parts per thousand',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'PPT',
      },
    },
  },
  {
    name: 'Temperature',
    description: 'Temperature',
    path: 'measurementTypes/Temperature',
    kind: 'measurementType',
    properties: {},
    key: 'TEMPERATURE',
    defaultUnit: 'C',
    supportedUnits: {
      C: {
        kind: 'measurementUnit',
        unit: 'C',
        symbol: 'C',
        description: 'celsius',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'C',
      },
      F: {
        kind: 'measurementUnit',
        unit: 'F',
        symbol: 'F',
        description: 'fahrenheit',
        conversionToDefaultUnit: '(X-32)*5/9',
        conversionFromDefaultUnit: 'X*9/5+32',
        protoEnumMapping: 'F',
      },
    },
  },
  {
    name: 'Turbidity',
    description: 'Turbidity',
    path: 'measurementTypes/Turbidity',
    kind: 'measurementType',
    properties: {},
    key: 'TURBIDITY',
    defaultUnit: 'NTU',
    supportedUnits: {
      NTU: {
        kind: 'measurementUnit',
        unit: 'NTU',
        symbol: 'ntu',
        description: 'nephelometric turbidity',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NTU',
      },
    },
  },
  {
    name: 'Unknown',
    description: 'Unknown',
    path: 'measurementTypes/Unknown',
    kind: 'measurementType',
    properties: {},
    key: 'UNKNOWN_MEASUREMENT_TYPE',
    defaultUnit: 'NONE',
    supportedUnits: {
      NONE: {
        kind: 'measurementUnit',
        unit: 'None',
        symbol: '',
        description: 'dimensionless',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'NONE',
      },
    },
  },
  {
    name: 'VPD',
    description: 'Vapor pressure deficit',
    path: 'measurementTypes/VPD',
    kind: 'measurementType',
    properties: {},
    key: 'VPD',
    defaultUnit: 'KPA',
    supportedUnits: {
      KPA: {
        kind: 'measurementUnit',
        unit: 'KPA',
        symbol: 'kPa',
        description: 'kilopascal',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'KPA',
      },
    },
  },
  {
    name: 'Velocity',
    description: 'Velocity',
    path: 'measurementTypes/Velocity',
    kind: 'measurementType',
    properties: {},
    key: 'VELOCITY',
    defaultUnit: 'M_PER_SECOND',
    supportedUnits: {
      MM_PER_SECOND: {
        kind: 'measurementUnit',
        unit: 'MM_PER_SECOND',
        symbol: 'mm/s',
        description: 'millimeters per second',
        conversionToDefaultUnit: 'X/1000',
        conversionFromDefaultUnit: 'X*1000',
        protoEnumMapping: 'MM_PER_SECOND',
      },
      M_PER_SECOND: {
        kind: 'measurementUnit',
        unit: 'M_PER_SECOND',
        symbol: 'm/s',
        description: 'meters per second',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'M_PER_SECOND',
      },
    },
  },
  {
    name: 'Voltage',
    description: 'Voltage',
    path: 'measurementTypes/Voltage',
    kind: 'measurementType',
    properties: {},
    key: 'VOLTAGE',
    defaultUnit: 'V',
    supportedUnits: {
      MV: {
        kind: 'measurementUnit',
        unit: 'MV',
        symbol: 'mV',
        description: 'millivolts',
        conversionToDefaultUnit: 'X/1000',
        conversionFromDefaultUnit: 'X*1000',
        protoEnumMapping: 'MV',
      },
      V: {
        kind: 'measurementUnit',
        unit: 'V',
        symbol: 'V',
        description: 'volts',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'V',
      },
    },
  },
  {
    name: 'Volume',
    description: 'Volume',
    path: 'measurementTypes/Volume',
    kind: 'measurementType',
    properties: {},
    key: 'VOLUME',
    defaultUnit: 'L',
    supportedUnits: {
      CM3: {
        kind: 'measurementUnit',
        unit: 'CM3',
        symbol: 'cm³',
        description: 'cubic centimeters',
        conversionToDefaultUnit: 'X/1000',
        conversionFromDefaultUnit: 'X*1000',
        protoEnumMapping: 'CM3',
      },
      GALLON: {
        kind: 'measurementUnit',
        unit: 'GALLON',
        symbol: 'gal',
        description: 'gallon',
        conversionToDefaultUnit: 'X*3.78541',
        conversionFromDefaultUnit: 'X/3.78541',
        protoEnumMapping: 'GALLON',
      },
      L: {
        kind: 'measurementUnit',
        unit: 'L',
        symbol: 'l',
        description: 'liter',
        conversionToDefaultUnit: 'X',
        conversionFromDefaultUnit: 'X',
        protoEnumMapping: 'L',
      },
    },
  },
];