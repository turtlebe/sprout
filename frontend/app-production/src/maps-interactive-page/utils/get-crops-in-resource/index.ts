/**
 * This function gets an array of crops names from a comma separated string.
 */
export function getCrops(crops: string) {
  return crops
    ? crops
        .split(',')
        .map(crop => crop.trim())
        .filter(Boolean)
    : [];
}

/**
 * The "product" field in a material obj contains a comma separated list of crops.
 * This function returns an array of crops (or empty array if product contains no crop names).
 * ex: "WHC,CRC" --> ["WHC", "CRC"]
 * ex: "," or "" or undefined --> []
 * ex: ",CRC" --> ["CRC"]
 * ex: "WHC" --> ["WHC"]
 */
export function getCropsInResource(resourceState: ProdResources.ResourceState) {
  return getCrops(resourceState?.materialObj?.product);
}
