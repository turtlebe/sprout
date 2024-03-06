export interface GetCoordY {
  y: d3.ScaleLinear<number, number>;
  i: number;
  min: number;
  max: number;
}

export function getCoordY({ y, i, min, max }: GetCoordY): number {
  if (y.invert(i) > max) {
    return y(max);
  }

  if (y.invert(i) < min) {
    return y(min);
  }

  return i;
}
