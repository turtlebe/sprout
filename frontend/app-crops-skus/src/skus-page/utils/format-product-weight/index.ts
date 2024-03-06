/**
 * Format a given weight value in ounces into pounds and ounces.
 */
export function formatProductWeight(weightOz: number) {
  const oz = weightOz % 16;
  const lbs = Math.floor(weightOz / 16);
  return ((lbs > 0 ? `${lbs} lb ` : '') + (oz > 0 ? `${oz} oz` : '')).trim();
}
