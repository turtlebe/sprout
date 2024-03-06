import * as d3 from 'd3';

import { useScale } from '../use-scale';
import { useZoom } from '../use-zoom';

/**
 * Renders month and year at start of timeline (index 0) and first day of new month.
 * @param domainValue Value being rendered at current tick on the timeline.
 * @param index Index of tick rendered on the timeline (0 based).
 * @return formatted date string or empty string if no value should be rendered.
 */
const customFormatMonthAndYearTimeline = (domainValue: Date, index: number) => {
  if (index === 0 || domainValue.getDate() === 1) {
    return d3.timeFormat('%b %Y')(domainValue);
  }
  return '';
};

/**
 * Provides two different date formats... if given date is less than
 * day then formats in "hours:mins am/pm" format (ex: 02:01 AM),
 * otherwise gives format: day of week and day (ex: Sun 29)
 * @param date Date to be formatted.
 * @return formatted date string
 */
function getTickFormat(date: Date) {
  const formatHourMinute = d3.timeFormat('%I:%M %p');
  const formatDay = d3.timeFormat('%a %d');

  return (d3.timeDay(date) < date ? formatHourMinute : formatDay)(date);
}

function styleTick(svg: ProdResources.Selection<SVGElement>) {
  svg.selectAll('.tick line').style('opacity', '0.2');
}

export function useRenderTimeline(ref: ProdResources.ChartRef, focusedResource: ProdResources.FocusedResource) {
  const { x, height, width, timelineHeight } = useScale(ref, focusedResource);

  const { registerZoomListener } = useZoom(ref, focusedResource);

  /**
   * Renders an x axis timeline showing day of week (or hour:minutes at bigger scales)
   * with month and year on secondary timeline.
   * Example:
   *    Nov 2020              Dec 2020
   *     Sun 29     Mon 30    Tues 01    Wed 02
   *
   * Example when zoomed in:
   *    Nov 2020
   *     Mon 07     12:00 PM    Tues 08
   *
   */
  const renderTimeline = () => {
    const svg = d3.select(ref.current);

    const xAxisForMultiFormatTimline = d3
      .axisTop(x)
      .tickSize(-height)
      .tickSizeOuter(0)
      .tickFormat(getTickFormat)
      .ticks(width / 80);

    // primary axis format date depending on current scale.
    // at small scale displays: day of week and date.
    // at larger scales will show hour and minutes with am/pm.
    const svgMultiFormatTimeline = svg
      .append('g')
      .attr('transform', `translate(0,${timelineHeight})`)
      .call(xAxisForMultiFormatTimline)
      .call(styleTick);

    const xAxisForMonthAndYearTimeline = d3
      .axisTop(x)
      .tickSize(0)
      .tickFormat(customFormatMonthAndYearTimeline)
      .ticks(d3.timeDay.every(1));

    // secondary axis displays month and year.
    const svgMonthAndYearTimeline = svg
      .append('g')
      .attr('transform', `translate(0,${timelineHeight / 2})`)
      .call(xAxisForMonthAndYearTimeline);

    // hide line that is rendered under the secondary axis.
    svgMonthAndYearTimeline.select('path.domain').attr('display', 'none');

    registerZoomListener(newXScale => {
      svgMultiFormatTimeline.call(xAxisForMultiFormatTimline.scale(newXScale)).call(styleTick);
      svgMonthAndYearTimeline.call(xAxisForMonthAndYearTimeline.scale(newXScale));
    });
  };

  return {
    renderTimeline,
  };
}
