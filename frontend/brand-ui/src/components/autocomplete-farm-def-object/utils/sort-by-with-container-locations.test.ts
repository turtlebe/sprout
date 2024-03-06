import { ContainerLocation, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { sortByWithContainerLocations } from '.';

interface BuildContainerLocation {
  path: string;
  index: number;
}

function buildContainerLocation({ path, index }: BuildContainerLocation): ContainerLocation {
  return {
    ref: `fb489ba7-8570-429e-b3ee-b477b5b6856b:containerLocation-${path.split('/').slice(-1)[0]}`,
    kind: 'containerLocation',
    index,
    path,
  } as unknown as ContainerLocation;
}

const containerLocation1 = buildContainerLocation({ index: 1, path: 'sites/SSF2/containerLocations/T1' });
const containerLocation10 = buildContainerLocation({ index: 10, path: 'sites/SSF2/containerLocations/T10' });
const containerLocation3 = buildContainerLocation({ index: 3, path: 'sites/SSF2/containerLocations/T3' });

const ssf2 = {
  kind: 'site',
  path: 'sites/SSF2',
} as unknown as FarmDefObject;
const lar1 = {
  kind: 'site',
  path: 'sites/LAR1',
} as unknown as FarmDefObject;
const bmp = {
  kind: 'areas',
  path: 'sites/SSF2/areas/BMP',
} as unknown as FarmDefObject;

describe('sortByWithContainerLocations', () => {
  it('sorts by path first with an exception for deviceLocation being higher priority', () => {
    expect(sortByWithContainerLocations(ssf2, containerLocation1)).toBe(1);
    expect(sortByWithContainerLocations(containerLocation1, ssf2)).toBe(-1);
    expect(sortByWithContainerLocations(bmp, containerLocation1)).toBe(1);
    expect(sortByWithContainerLocations(containerLocation1, bmp)).toBe(-1);
  });

  it('sorts by path when there is no containerLocation', () => {
    expect(sortByWithContainerLocations(ssf2, lar1)).toBe(1);
    expect(sortByWithContainerLocations(lar1, ssf2)).toBe(-1);
    expect(sortByWithContainerLocations(bmp, ssf2)).toBe(1);
    expect(sortByWithContainerLocations(ssf2, bmp)).toBe(-1);
    expect(sortByWithContainerLocations(bmp, lar1)).toBe(1);
    expect(sortByWithContainerLocations(lar1, bmp)).toBe(-1);
  });

  it('sorts by index when there is only containerLocations', () => {
    const containerLocations = [containerLocation10, containerLocation3, containerLocation1];
    containerLocations.sort(sortByWithContainerLocations);

    expect(containerLocations[0]).toEqual(containerLocation1);
    expect(containerLocations[1]).toEqual(containerLocation3);
    expect(containerLocations[2]).toEqual(containerLocation10);
  });
});
