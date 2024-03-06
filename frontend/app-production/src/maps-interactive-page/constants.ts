import { AgeCohortDate, ContainerType, Sites, SupportedAreaClass, SupportedLineClass } from './types';

/**
 * Defined days per area
 */
export const DAYS_PER_AREA: Record<Sites, Record<SupportedAreaClass, number>> = {
  [Sites.SSF2]: {
    [SupportedAreaClass.Germination]: 2,
    [SupportedAreaClass.Propagation]: 13,
    [SupportedAreaClass.VerticalGrow]: 15,
  },
  [Sites.LAX1]: {
    [SupportedAreaClass.Germination]: 2,
    [SupportedAreaClass.Propagation]: 13,
    [SupportedAreaClass.VerticalGrow]: 15,
  },
};

/**
 * Shared style settings across all maps
 */
export const STYLE = {
  active: {
    fillColor: 'rgba(46, 118, 209, 0.10)',
    strokeColor: '#2E76D1',
    strokeWidth: 3,
  },
  hover: {
    fillColor: 'rgba(0,0,0, 0.10)',
    strokeWidth: 1,
    strokeColor: 'grey',
  },
};

export const ERROR_COLOR = '#d50032';

export const DRAWER_TRANSITION_SPEED = 250;

export const LOADED_IN_MATERIAL_ATTRIBUTE = {
  [SupportedAreaClass.Germination]: 'loadedInGermAt',
  [SupportedAreaClass.Propagation]: 'loadedInPropAt',
  [SupportedAreaClass.VerticalGrow]: 'loadedInGrowAt',
};

export const DEFAULT_CONTAINER_TYPE_BY_LINE = {
  [SupportedLineClass.GerminationLine]: ContainerType.TABLE,
  [SupportedLineClass.PropRack]: ContainerType.TABLE,
  [SupportedLineClass.PropagationRack]: ContainerType.TABLE,
  [SupportedLineClass.GrowRoom]: ContainerType.TOWER,
};

// controls the maximum number of crops that will be displayed before
// rendering an ellipse (ex: in crop legend: BAC/SAS/WHC --> BAC/SAS/...)
export const MAX_CROPS = 2;

export const DEFAULT_AGE_COHORT_DATE: AgeCohortDate = 'all';
