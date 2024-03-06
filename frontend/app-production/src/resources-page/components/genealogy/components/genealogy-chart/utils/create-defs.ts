const NS = 'http://www.w3.org/2000/svg';

import { colors } from '../../../constants';

function createArrowPath(color: colors) {
  const arrow = document.createElementNS(NS, 'path');
  arrow.setAttribute('d', 'M2,2 L8,5 L2,8 L5,5 L2,2');
  arrow.setAttribute('style', `fill: ${color};`);
  return arrow;
}

function createMarker({
  id,
  color,
  width,
  height,
  refX,
  refY,
  viewBox,
}: {
  id: string;
  color: colors;
  width: string;
  height: string;
  refX: string;
  refY: string;
  viewBox: string;
}) {
  const markerObj = document.createElementNS(NS, 'marker');
  markerObj.setAttribute('id', `${id}-${color}`);
  markerObj.setAttribute('markerUnits', 'strokeWidth');
  markerObj.setAttribute('markerWidth', width);
  markerObj.setAttribute('markerHeight', height);
  markerObj.setAttribute('viewBox', viewBox);
  markerObj.setAttribute('refX', refX);
  markerObj.setAttribute('refY', refY);
  markerObj.setAttribute('orient', 'auto');
  return markerObj;
}

function createArrowMarker(color: colors) {
  const markerObj = createMarker({
    id: 'arrow',
    color,
    width: '10',
    height: '10',
    refX: '5',
    refY: '5',
    viewBox: '0 0 10 10',
  });
  markerObj.appendChild(createArrowPath(color));

  return markerObj;
}

function createPolyLine(points: string, stroke: colors) {
  const polyline = document.createElementNS(NS, 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('strokeWidth', '1');
  polyline.setAttribute('stroke', stroke);
  return polyline;
}

function createLine({ x1, y1, x2, y2, stroke }: { x1: string; y1: string; x2: string; y2: string; stroke: colors }) {
  const line = document.createElementNS(NS, 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('strokeWidth', '1');
  line.setAttribute('stroke', stroke);
  return line;
}

function createArrowWithBracketMarker(color: colors) {
  const markerObj = createMarker({
    id: 'arrow-with-bracket',
    color,
    width: '10',
    height: '10',
    refX: '5',
    refY: '5',
    viewBox: '0 0 16 10',
  });
  markerObj.appendChild(createArrowPath(color));

  markerObj.appendChild(createLine({ x1: '9', y1: '5', x2: '14', y2: '5', stroke: color }));
  markerObj.appendChild(createPolyLine('14,5 14,3 16,3', color));
  markerObj.appendChild(createPolyLine('14,5 14,7 16,7', color));

  return markerObj;
}

function createBracketMarker(color: colors) {
  const markerObj = createMarker({
    id: 'bracket',
    color,
    width: '16',
    height: '16',
    refX: '0',
    refY: '5',
    viewBox: '0 0 16 10',
  });

  markerObj.appendChild(createLine({ x1: '1', y1: '5', x2: '5', y2: '5', stroke: color }));
  markerObj.appendChild(createPolyLine('5,5 5,3 7,3', color));
  markerObj.appendChild(createPolyLine('5,5 5,7 7,7', color));

  return markerObj;
}

function createDiagonalHatch() {
  const patternObj = document.createElementNS(NS, 'pattern');
  patternObj.setAttribute('id', 'diagonalHatch');
  patternObj.setAttribute('patternUnits', 'userSpaceOnUse');
  patternObj.setAttribute('width', '4');
  patternObj.setAttribute('height', '4');

  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2');
  path.setAttribute('style', 'stroke: black; strokeWidth: 1');
  patternObj.appendChild(path);

  return patternObj;
}

/**
 * Append common genealogy svg defs to the given svg element.
 * Generating defs in code rather than in mark-up because we want
 * different colors for each marker and this not support in chrome.
 * @param svg Svg element to which the defs get added.
 */
export function createDefs(svg: SVGElement) {
  if (!svg) {
    return;
  }

  const defs = document.createElementNS(NS, 'defs');

  defs.append(createDiagonalHatch());

  colors.forEach(color => {
    defs.appendChild(createArrowMarker(color));
    defs.appendChild(createArrowWithBracketMarker(color));
    defs.appendChild(createBracketMarker(color));
  });

  svg.appendChild(defs);
}
