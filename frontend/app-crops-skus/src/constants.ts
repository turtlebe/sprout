export const BASE_ROUTE = '/crops-skus';

export const ROUTES = {
  home: BASE_ROUTE,
  crops: `${BASE_ROUTE}/crops`,
  skus: `${BASE_ROUTE}/skus`,
  crop: (cropName: string) => `${BASE_ROUTE}/crops/${cropName}`,
  sku: (skuName: string) => `${BASE_ROUTE}/skus/${skuName}`,
};
