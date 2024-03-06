import { PartialColDefs } from '../../common/types';

export const skusTableCols: PartialColDefs = {
  productName: {
    headerName: 'Product Name',
    field: 'productName',
    colId: 'productName',
    headerTooltip: 'The common, display name for the product in question. Has nothing to do with the packaging.',
  },
  name: {
    headerName: 'Name',
    field: 'name',
    colId: 'name',
    headerTooltip:
      'This is derived from the crop and the packaging type. This field must be unique and is not directly editable.',
  },
  displayName: {
    headerName: 'Display Name',
    field: 'displayName',
    colId: 'displayName',
    headerTooltip:
      'This Display Name is derived from the Product Name and the SKU Name. Display Name must be unique and is not directly editable.',
  },
  brand: {
    headerName: 'Brand',
    field: 'brandTypeName',
    colId: 'brandTypeName',
    headerTooltip: 'Brand associated with Product Name. Only associated with Clamshells and Case packages.',
  },
  productWeightOz: {
    headerName: 'Product Weight',
    field: 'productWeightOz',
    colId: 'productWeightOz',
    headerTooltip:
      'Target weight of product content within the package. Only associated with Clamshells or Bulk packages.',
  },
  caseQuantityPerPallet: {
    headerName: 'Case Quantity per Pallet',
    field: 'caseQuantityPerPallet',
    colId: 'caseQuantityPerPallet',
    headerTooltip: 'Target quantity of cases per pallet. Only associated with Case packages.',
  },
  displayAbbreviation: {
    headerName: 'Display Abbreviation',
    field: 'displayAbbreviation',
    colId: 'displayAbbreviation',
    headerTooltip: 'SKU Abbreviation.',
  },
  skuTypeName: {
    headerName: 'Package Type',
    field: 'skuTypeName',
    colId: 'skuTypeName',
    headerTooltip: 'The type of the packaging should be one of the enumerated possible values.',
  },
  packagingLotCropCode: {
    headerName: 'Packaging Lot Crop Code',
    field: 'packagingLotCropCode',
    colId: 'packagingLotCropCode',
    headerTooltip:
      'This 3 letter code will be the unique code associated with the finished good lot, e.g. 4-TIGRIS-PPS-291.',
  },
  allowedCropNames: {
    headerName: 'Allowed Associated Crops',
    field: 'allowedCropNames',
    colId: 'allowedCropNames',
    headerTooltip: 'The list of all crops that could be used to make this SKU.',
  },
  childSkuName: {
    headerName: 'Child SKU Name',
    field: 'childSkuName',
    colId: 'childSkuName',
    headerTooltip: 'Optional - the SKUs that are constituents of this SKU.',
  },
  labelPrimaryColor: {
    headerName: 'Label Primary Color',
    field: 'labelPrimaryColor',
    colId: 'labelPrimaryColor',
    headerTooltip: 'The primary color of the physical package label of this SKU.',
  },
  labelSecondaryColor: {
    headerName: 'Label Secondary Color',
    field: 'labelSecondaryColor',
    colId: 'labelSecondaryColor',
    headerTooltip: 'The secondary color of the physical package label of this SKU.',
  },
  internalExpirationDays: {
    headerName: 'Internal Storage Life',
    field: 'internalExpirationDays',
    colId: 'internalExpirationDays',
    headerTooltip: 'Number of days product can be held at Plenty before shipping.',
  },
  externalExpirationDays: {
    headerName: 'External Shelf-Life',
    field: 'externalExpirationDays',
    colId: 'externalExpirationDays',
    headerTooltip: 'Number of days product can be held at a retailer',
  },
  bestByDate: {
    headerName: 'Best by Date',
    field: 'bestByDate',
    colId: 'bestByDate',
    headerTooltip:
      'Shelf-life and date marking format (harvest day: Day 0). This is the value that will be printed on clamshells.',
  },
  netsuiteItem: {
    headerName: 'NetSuite Item',
    field: 'netsuiteItem',
    colId: 'netsuiteItem',
    headerTooltip: 'This is the item number in NetSuite.',
  },
  gtin: {
    headerName: 'GTIN',
    field: 'gtin',
    colId: 'gtin',
    headerTooltip: 'This is the global GTIN.',
  },
  packageImagery: {
    headerName: 'Package Imagery',
    field: 'packageImagery',
    colId: 'packageImagery',
    headerTooltip: 'Sample images of the packages.',
  },
  description: {
    headerName: 'Description',
    field: 'description',
    colId: 'description',
    headerTooltip: 'The description of the SKU.',
  },
};
