export function validateMinMaxFieldValue(inputValue: string, minValue?: number, maxValue?: number) {
  let newValue = inputValue;
  if (minValue !== undefined && maxValue !== undefined) {
    /**
     * Enforces user typed in values are within min/max range, supporting HTML5 min/max inputs
     * If a user types in something larger than max range, the max range is assigned
     * If a user types in something less that min range, min range is assigned
     */
    if (Number(inputValue) < minValue) {
      newValue = minValue.toString();
    } else if (Number(inputValue) > maxValue) {
      newValue = maxValue.toString();
    } else {
      // User typed in a number that's in range
      // This extra cast to Number and back to string, is nice to have for cases when a user types a valid number with a leading 0 (e.g. "034")
      newValue = Number(inputValue).toString();
    }
  }
  return newValue;
}
