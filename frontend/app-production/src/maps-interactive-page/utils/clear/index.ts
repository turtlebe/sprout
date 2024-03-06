import * as d3 from 'd3';

export function clear<T extends d3.BaseType>(ref: React.MutableRefObject<T>) {
  if (!ref.current) {
    return;
  }

  d3.select(ref.current).selectAll('svg > *').remove();
}
