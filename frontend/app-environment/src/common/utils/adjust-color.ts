import chroma from 'chroma-js';

export function adjustColor(color: string, index: number): string {
  return chroma(color)
    .saturate(Math.floor(index / 4))
    .brighten((index % 4) * 0.5)
    .hex();
}
