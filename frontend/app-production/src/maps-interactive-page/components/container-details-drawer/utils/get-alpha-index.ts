const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Returning the index of a character
 *  i.e.  'A' === 0
 *  i.e.  'J' === 9
 * @param {string} char
 * @returns {number}
 */
export const getIndexByAlpha = (char: string): number => {
  return ALPHA.indexOf(char);
};

/**
 * Returning the character based on the index
 *  i.e.  0 === 'A'
 *  i.e.  9 === 'J'
 * @param {number} index
 * @returns {string}
 */
export const getAlphaByIndex = (index: number): string => {
  return ALPHA[index];
};
