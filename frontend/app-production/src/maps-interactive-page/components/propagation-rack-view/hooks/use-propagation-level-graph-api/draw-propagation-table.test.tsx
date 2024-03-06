import { FADED_OPACITY } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';
import * as d3 from 'd3';

import {
  CONFLICT_CLASS,
  CONFLICT_ICON_CLASS,
  dataTestIdsDrawPropagationTable as dataTestIds,
  drawPropagationTable,
} from './draw-propagation-table';

describe('drawPropagationTable', () => {
  let node, el;

  function getElementWithDataTestId(node: HTMLElement, dataTestId: string) {
    return node.querySelector<HTMLElement>(`[data-testid='${dataTestId}']`);
  }

  const commonProps = {
    x: 12,
    y: 15,
    width: 100,
    height: 200,
    baseColor: 'gray',
    tableOpacity: 1.0,
  };

  beforeEach(() => {
    // ARRANGE
    node = document.createElement('svg');
    el = d3.select(node);
  });

  it('draws a propagation slot with table', () => {
    // ACT
    drawPropagationTable({
      el,
      ...commonProps,
      tableColor: 'green',
    });
    // ASSERT
    expect(node.innerHTML).toContain(
      '<g transform="translate(12, 15)"><rect width="100" height="200" rx="3" stroke="gray" fill="green" style="opacity: 1;"></rect></g><g data-testid="draw-propagation-table-highlight" transform="translate(12, 15)" style="visibility: hidden;"><rect width="100" height="200" stroke-linejoin="round" stroke-width="3" stroke="gray" fill="green"></rect></g>'
    );
  });

  it('draws a table with a triangle to represent second color when there are multiple crops', () => {
    // ACT
    drawPropagationTable({
      el,
      ...commonProps,
      secondTableColor: 'red',
      tableColor: 'green',
    });

    // ASSERT - draw triangle in lower right-hand corner with second table color
    const patternEl = getElementWithDataTestId(node, dataTestIds.triangle);
    expect(patternEl.innerHTML).toContain('<path d="M100,0L100,200L0,200Z" fill="red" style="opacity: 1;"></path>');
  });

  it('draws a table with reduced opactiy', () => {
    drawPropagationTable({
      el,
      ...commonProps,
      tableOpacity: 0.1,
      secondTableColor: 'red',
      tableColor: 'green',
    });

    // main crop color has reduced opacity
    expect(node.innerHTML).toContain(
      '<g transform="translate(12, 15)"><rect width="100" height="200" rx="3" stroke="gray" fill="green" style="opacity: 0.1;"></rect></g><g data-testid="draw-propagation-table-highlight" transform="translate(12, 15)" style="visibility: hidden;"><rect width="100" height="200" stroke-linejoin="round" stroke-width="3" stroke="gray" fill="green"></rect></g><g data-testid="draw-propagation-table-triangle" transform="translate(12, 15)"><path d="M100,0L100,200L0,200Z" fill="red" style="opacity: 0.1;"></path></g>'
    );

    // second crop color has reduced opacity
    const patternEl = getElementWithDataTestId(node, dataTestIds.triangle);
    expect(patternEl.innerHTML).toContain('<path d="M100,0L100,200L0,200Z" fill="red" style="opacity: 0.1;"></path>');
  });

  it('draws a propgation slot with table and lift', () => {
    // ACT
    drawPropagationTable({
      el,
      ...commonProps,
      tableColor: 'green',
      showLift: true,
    });

    // ASSERT
    const liftIconEl = getElementWithDataTestId(node, dataTestIds.liftIcon);
    expect(liftIconEl.innerHTML).toContain('<image transform="translate(62, -83)" href="prop-rack-lift.svg"></image>');
  });

  it('draws an unoccupied propagation slot', () => {
    // ACT
    drawPropagationTable({
      el,
      ...commonProps,
      xColor: 'red',
    });

    // ASSERT
    const xMarkerEl = getElementWithDataTestId(node, dataTestIds.xMarker);
    expect(xMarkerEl.innerHTML).toContain(
      '<path d="M10,20L90,180Z" stroke="red" stroke-width="2"></path><path d="M10,180L90,20Z" stroke="red" stroke-width="2"></path>'
    );
  });

  it('shows highlight state on mouseenter event interaction', () => {
    // ACT - initial render
    drawPropagationTable({
      el,
      ...commonProps,
      xColor: 'red',
      tableColor: 'green',
      highlightStrokeColor: 'blue',
      highlightFillColor: 'pink',
    });

    const highlightEl = getElementWithDataTestId(node, dataTestIds.highlight);

    // ASSERT
    expect(highlightEl.style.visibility).toEqual('hidden');

    // ACT 2 - mouse over highlighting the element
    node.dispatchEvent(new Event('mouseenter'));

    // ASSERT 2
    expect(highlightEl.style.visibility).toEqual('visible');

    // ACT 3 - mouse out restoring element to initial attrs
    node.dispatchEvent(new Event('mouseleave'));

    // ASSERT 3
    expect(highlightEl.style.visibility).toEqual('hidden');
  });

  it('shows highlight state by "toHighlight" property', () => {
    // ACT - initial render
    drawPropagationTable({
      el,
      ...commonProps,
      xColor: 'red',
      tableColor: 'green',
      toHighlight: true,
      highlightStrokeColor: 'blue',
      highlightFillColor: 'pink',
    });

    const highlightEl = getElementWithDataTestId(node, dataTestIds.highlight);

    expect(highlightEl.style.visibility).toEqual('visible');
  });

  it('draws a table with an error', () => {
    drawPropagationTable({
      el,
      ...commonProps,
      errorColor: 'red',
      hasError: true,
    });

    const conflictTop = node.querySelector(`.${CONFLICT_CLASS}`);
    const conflictIcon = node.querySelector(`.${CONFLICT_ICON_CLASS} path`);
    expect(conflictTop).toBeDefined();
    expect(conflictIcon).toBeDefined();
    expect(conflictIcon.getAttribute('fill')).toEqual('red');
  });

  it('draws a table error with reduced opacity when there is an error', () => {
    drawPropagationTable({
      el,
      ...commonProps,
      tableOpacity: FADED_OPACITY,
      errorColor: 'red',
      hasError: true,
    });

    const conflictIcon = node.querySelector(`.${CONFLICT_ICON_CLASS} path`);
    expect(conflictIcon.getAttribute('style')).toEqual(`opacity: ${FADED_OPACITY};`);
  });
});
