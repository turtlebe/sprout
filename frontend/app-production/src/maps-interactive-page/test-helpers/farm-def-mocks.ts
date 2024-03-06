import { FarmDefArea, FarmDefFarm, FarmDefLine } from '@plentyag/core/src/farm-def/types';

export const mockFarm: FarmDefFarm = {
  id: '123-abc',
  kind: 'farm',
  displayName: 'Tigris',
  class: 'Farm',
  path: 'sites/SSF2/farms/Tigris',
  name: 'Farm',
  properties: {},
  workCenters: {},
};

export const mockGerminationLine: FarmDefLine = {
  id: '123-abc',
  kind: 'line',
  displayName: 'Germination Line',
  class: 'GerminationLine',
  path: 'sites/SSF2/areas/Germination/lines/GerminationLine',
  name: 'GerminationLine',
  properties: {},
};

export const mockAreaWithGerminationLine: FarmDefArea = {
  id: '123-abc',
  kind: 'area',
  displayName: 'Germination',
  class: 'Germination',
  path: 'sites/SSF2/areas/Germination',
  name: 'Germination',
  lines: { GerminationLine: mockGerminationLine },
  properties: {},
};

export const mockPropagationLine: FarmDefLine = {
  id: '123-abc',
  kind: 'line',
  displayName: 'Propagation Rack',
  class: 'PropagationRack',
  path: 'sites/SSF2/areas/Propagation/lines/PropagationRack',
  name: 'PropagationRack',
  properties: {},
};

export const mockAreaWithPropagationLine: FarmDefArea = {
  id: '123-abc',
  kind: 'area',
  displayName: 'Propagation',
  class: 'Propagation',
  path: 'sites/SSF2/areas/Propagation',
  name: 'Propagation',
  lines: { PropagationRack: mockPropagationLine },
  properties: {},
};

export const mockPropLine: FarmDefLine = {
  ...mockPropagationLine,
  class: 'PropRack',
  path: 'sites/SSF2/areas/Propagation/lines/PropRack',
  name: 'PropRack',
};

export const mockAreaWithPropLine: FarmDefArea = {
  ...mockAreaWithPropagationLine,
  path: 'sites/SSF2/areas/Propagation',
  lines: { PropRack: mockPropLine },
};

export const mockVerticalGrowLineGrowRoom1: FarmDefLine = {
  id: '123-abc',
  kind: 'line',
  displayName: 'Grow Room 1',
  class: 'GrowRoom',
  path: 'sites/SSF2/areas/Propagation/lines/GrowRoom1',
  name: 'GrowRoom1',
  properties: {},
};

export const mockVerticalGrowLineGrowRoom2: FarmDefLine = {
  id: '123-abc',
  kind: 'line',
  displayName: 'Grow Room 2',
  class: 'GrowRoom',
  path: 'sites/SSF2/areas/Propagation/lines/GrowRoom2',
  name: 'GrowRoom2',
  properties: {},
};

export const mockAreaWithVerticalGrowLine: FarmDefArea = {
  id: '123-abc',
  kind: 'area',
  displayName: 'Vertical Grow',
  class: 'VerticalGrow',
  path: 'sites/SSF2/areas/VerticalGrow',
  name: 'VerticalGrow',
  lines: { GrowRoom1: mockVerticalGrowLineGrowRoom1 },
  properties: {},
};
