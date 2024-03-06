export function getAdditionalDaysLabel(additionalDay: number) {
  return `+${additionalDay} ${additionalDay > 1 ? 'days' : 'day'}`;
}
