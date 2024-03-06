import { isGroupFieldFunction } from '@plentyag/brand-ui/src/components/form-gen/utils';

export const MAX = 1000;
export const MIN = 1;

export function getMinMax(formGenField: FormGen.FieldGroupArray | FormGen.FieldGroupFunction) {
  if (!isGroupFieldFunction(formGenField)) {
    return { min: undefined, max: undefined };
  }

  const min = formGenField.min;
  const max = formGenField.max;

  // if values are invalid, then use default range of [1,100]
  if (
    !Number.isInteger(min) ||
    !Number.isInteger(max) ||
    min > max ||
    min > MAX ||
    max > MAX ||
    min < MIN ||
    max < MIN
  ) {
    return { min: MIN, max: MAX };
  }

  return { min, max };
}
