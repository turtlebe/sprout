import { PartialColDefs } from '../../common/types';

export const cropsTableCols: PartialColDefs = {
  displayName: {
    headerName: 'Display Name',
    field: 'displayName',
    colId: 'displayName',
    headerTooltip:
      'This Display Name is derived from: 3-letter Name, Crop Common Name, Cultivar Name, and Media if available. Display Name must be unique and is not directly editable.',
  },
  name: {
    headerName: 'Name',
    field: 'name',
    colId: 'name',
    headerTooltip:
      'Unique short code for the crop. For new crops, use a 3 - 5 letter abbreviation that is unique and readable, e.g. STB. To create a trial version of a crop, use crop code plus a colon, and then the trial name e.g. STB:MEDIA001',
  },
  commonName: {
    headerName: 'Common Name',
    field: 'commonName',
    colId: 'commonName',
    headerTooltip:
      'This entry shows in the Display Name and should be the familiar name of this crop, e.g. Tomato, Kale, Raspberry.',
  },
  displayAbbreviation: {
    headerName: 'Display Abbreviation',
    field: 'displayAbbreviation',
    colId: 'displayAbbreviation',
    headerTooltip:
      'This code shows in the Display Name. It should be the same as the unique name, unless the unique name is not human readable, in which case, this code may be more user friendly version.  Arbitrary (user determined). Must be unique, e.g. TMT, STB, ARG.',
  },
  isSeedable: {
    headerName: 'Seedable',
    field: 'isSeedable',
    colId: 'isSeedable',
    headerTooltip:
      'A checked/true entry means that this crop can be seeded directly. Crops that are not seedable are likely to be crops blended post seeding.',
  },
  growConfiguration: {
    headerName: 'Grow Configuration',
    field: 'growConfiguration',
    colId: 'growConfiguration',
    headerTooltip: 'Grow configuration.',
  },
  media: {
    headerName: 'Media',
    field: 'media',
    colId: 'media',
    headerTooltip: 'The type of grow media (dirt, to the layperson) that this crop is grown in.',
  },
  childCrops: {
    headerName: 'Child Crops',
    field: 'childCrops',
    colId: 'childCrops',
    headerTooltip: 'Crops listed here are the suggested set of crops that comprise blends.',
  },
  skus: {
    headerName: 'SKUs',
    field: 'skus',
    colId: 'skus',
    headerTooltip: 'The Stock-Keeping-Units associated with the crop.',
  },
  cropTypeName: {
    headerName: 'Crop Type Name',
    field: 'cropTypeName',
    colId: 'cropTypeName',
    headerTooltip:
      'One of the types from the specific set of crop types that Plenty supports, e.g. "Strawberries" or "LeafyGreens".',
  },
  trialDescription: {
    headerName: 'Trial Description',
    field: 'trialDescription',
    colId: 'trialDescription',
    headerTooltip: 'The description of the particular trial that this trial crop represents.',
  },
  cultivar: {
    headerName: 'Cultivar',
    field: 'cultivar',
    colId: 'cultivar',
    headerTooltip: 'The technical cultivar name of the crop. Only relevant if the crop is not a blend--null otherwise.',
  },
  scientificName: {
    headerName: 'Scientific Name',
    field: 'scientificName',
    colId: 'scientificName',
    headerTooltip: 'The scientific name of the species.',
  },
  propIrrigationSchedule: {
    headerName: 'Tigris Propagation Irrigation Schedule',
    field: 'propIrrigationSchedule',
    colId: 'propIrrigationSchedule',
    headerTooltip: 'The schedule entered here will drive FarmOS irrigation events for this crop in Tigris.',
  },
  componentCrops: {
    headerName: 'Component Crops',
    field: 'componentCrops',
    colId: 'componentCrops',
    headerTooltip: 'Component crop options are any crops that are also assigned to the same farm as this current crop.',
  },
};
