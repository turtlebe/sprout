/**
 * Simple method to just define the ID of a specific Postharvest QA item
 * @param { sku: string, lot: string } obj
 * @returns
 */
export const getPostharvestQaId = (obj: { sku: string; lot: string }): string => {
  return `${obj.lot}_${obj.sku}`;
};
