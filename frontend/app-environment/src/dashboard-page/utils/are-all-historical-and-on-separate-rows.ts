import { Widget, WidgetType } from '@plentyag/core/src/types/environment';
import { uniq } from 'lodash';

export function areAllHistoricalAndOnSeparateRows(widgets: Widget[]) {
  if (!widgets?.length) {
    return false;
  }

  const rowStartAndEnd = uniq(
    widgets.map(widget => `${widget.rowStart}${widget.rowEnd}`).sort((a, b) => a.localeCompare(b))
  );

  return (
    widgets.every(widgets => widgets.widgetType === WidgetType.historical) && rowStartAndEnd.length === widgets.length
  );
}
