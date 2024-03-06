import { SupportedAreaClass, SupportedLineClass } from '../../types';

export const isSupportedGerminationLine = (areaClass?, lineClass?): boolean => {
  if (!areaClass || !lineClass) {
    return false;
  }
  return areaClass === SupportedAreaClass.Germination && lineClass === SupportedLineClass.GerminationLine;
};

export const isSupportedPropagationRack = (areaClass?, lineClass?): boolean => {
  if (!areaClass || !lineClass) {
    return false;
  }
  return (
    areaClass === SupportedAreaClass.Propagation &&
    (lineClass === SupportedLineClass.PropRack || lineClass === SupportedLineClass.PropagationRack)
  );
};

export const isSupportedVerticalGrowRoom = (areaClass?, lineClass?): boolean => {
  if (!areaClass || !lineClass) {
    return false;
  }
  return areaClass === SupportedAreaClass.VerticalGrow && lineClass === SupportedLineClass.GrowRoom;
};

export const isSupportedAreaAndLine = (areaClass?, lineClass?): boolean => {
  return (
    isSupportedGerminationLine(areaClass, lineClass) ||
    isSupportedPropagationRack(areaClass, lineClass) ||
    isSupportedVerticalGrowRoom(areaClass, lineClass)
  );
};
