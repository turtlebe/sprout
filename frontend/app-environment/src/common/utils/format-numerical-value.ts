import numeral from 'numeral';

export function formatNumericalValue(value: number | string, unitSymbol?: string) {
  const formattedValue = Number.isInteger(value) ? value : numeral(value).format('0,0,0.00');

  return unitSymbol ? `${formattedValue} ${unitSymbol}` : formattedValue;
}
