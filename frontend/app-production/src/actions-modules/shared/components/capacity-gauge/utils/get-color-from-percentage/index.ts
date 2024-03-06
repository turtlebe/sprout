/**
 * Color definition by a percentage number
 * @param percentage percentage number 0-100.
 * @returns hex color
 */
export const getColorFromPercentage = (percentage: number): string => {
  if (percentage >= 100) {
    return '#9C072A';
  } else if (percentage >= 93) {
    return '#F58604';
  } else if (percentage >= 79) {
    return '#FFD57E';
  } else {
    return '#15C370';
  }
};
