export function formatNonNumericalValue(value: number | string, unitSymbol?: string) {
  return unitSymbol ? `${value} ${unitSymbol}` : value;
}
