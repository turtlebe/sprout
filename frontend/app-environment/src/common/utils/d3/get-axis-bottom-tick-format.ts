import moment from 'moment';

export function getAxisBottomTickFormat(d: Date, startDateTime: Date, isEditing: boolean) {
  const additionalDays = Math.floor(moment.duration(moment(d).diff(moment(startDateTime))).as('days'));

  return isEditing
    ? `${moment(d).format('hh:mm A')} ${additionalDays > 0 ? `(+${additionalDays})` : ''}`
    : moment(d).format('MM/DD, hh:mm A');
}
