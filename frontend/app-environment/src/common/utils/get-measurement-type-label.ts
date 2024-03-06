import { titleCase } from 'voca';

export function getMeasurementTypeLabel(measurementType: string): string {
  return titleCase(measurementType).replace(/_/g, ' ');
}
