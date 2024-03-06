import { FADED_OPACITY } from '@plentyag/app-production/src/maps-interactive-page/utils/get-container-opacity';
import * as d3 from 'd3';

import {
  CONFLICT_CLASS,
  CONFLICT_ICON_CLASS,
  dataTestIdsDrawGerminationTable as dataTestIds,
  drawGerminationTable,
  TABLE_HIGHLIGHT_CLASS,
  TABLE_SECOND_COLOR_CLASS,
  TABLE_SIDES_CLASS,
  TABLE_TOP_CLASS,
  X_CLASS,
} from './draw-germination-table';

describe('drawGerminationTable', () => {
  let node, el, partialProps;

  function getElementWithDataTestId(node: HTMLElement, dataTestId: string) {
    return node.querySelector<HTMLElement>(`[data-testid='${dataTestId}']`);
  }

  beforeEach(() => {
    // ARRANGE
    node = document.createElement('svg');
    el = d3.select(node);

    partialProps = {
      el,
      x: 12,
      y: 15,
      width: 100,
      height: 200,
      skew: 20,
      sideHeight: 5,
      sideOffset: 1,
      baseColor: 'gray',
    };
  });

  it('draws a table with a triangle to represent second color when there are multiple crops', () => {
    // ACT
    drawGerminationTable({
      ...partialProps,
      secondTableColor: 'red',
      tableColor: 'green',
    });

    // ASSERT - draw triangle in upper left-hand corner with second table color
    const patternEl = getElementWithDataTestId(node, dataTestIds.triangle);
    expect(patternEl.innerHTML).toContain('<path d="M0,200L100,200L120,0Z" fill="red" style="opacity: 1;"></path>');
  });

  it('draws a germination slot with table (should not show X marker)', () => {
    // ACT
    drawGerminationTable({
      ...partialProps,
      tableColor: 'green',
    });

    const tableSidesNode = node.querySelector(`.${TABLE_SIDES_CLASS} path`);
    const tableTopNode = node.querySelector(`.${TABLE_TOP_CLASS} path`);

    // ASSERT
    expect(node.innerHTML).toEqual(
      '<g class="germ-table-sides" transform="translate(12, 16)"><path d="M0,200L100,200L120,0L120,5L100,205L0,205Z" fill="gray" style="opacity: 1;"></path></g><g class="germ-table-top" transform="translate(12, 15)"><path d="M20,0L120,0L100,200L0,200Z" stroke-linejoin="round" stroke-width="1" stroke="gray" fill="green" style="opacity: 1;"></path></g><g class="germ-table-highlight-top" transform="translate(12, 15)" style="visibility: hidden;"><path d="M20,0L120,0L100,200L0,200Z" stroke-linejoin="round" stroke-width="3" stroke="gray" fill="green"></path></g>'
    );
    expect(tableTopNode.getAttribute('fill')).toEqual('green');
    expect(tableTopNode.style.opacity).toEqual('1'); // default opacity
    expect(tableSidesNode.style.opacity).toEqual('1'); // default opacity
    expect(node.querySelector(`.${X_CLASS}`)).toBeNull();

    // -- shouldn't have hightlight
    const highlightNode = node.querySelector(`.${TABLE_HIGHLIGHT_CLASS}`);
    expect(highlightNode.style.visibility).toEqual('hidden');
  });

  it('draws an unoccupied germination slot (should show X marker)', () => {
    // ACT
    drawGerminationTable({
      ...partialProps,
      xColor: 'red',
    });

    // ASSERT
    expect(node.innerHTML).toEqual(
      '<g class="germ-table-sides" transform="translate(12, 16)"><path d="M0,200L100,200L120,0L120,5L100,205L0,205Z" fill="gray" style="opacity: 1;"></path></g><g class="germ-table-top" transform="translate(12, 15)"><path d="M20,0L120,0L100,200L0,200Z" stroke-linejoin="round" stroke-width="1" stroke="gray" fill="white" style="opacity: 1;"></path></g><g class="germ-table-highlight-top" transform="translate(12, 15)" style="visibility: hidden;"><path d="M20,0L120,0L100,200L0,200Z" stroke-linejoin="round" stroke-width="3" stroke="gray" fill="white"></path></g><g class="germ-table-x-marker" transform="translate(12, 15)"><path d="M28,20L92,180Z" stroke="red" stroke-width="2" stroke-linecap="round"></path><path d="M12,180L108,20Z" stroke="red" stroke-width="2" stroke-linecap="round"></path></g>'
    );
    expect(node.querySelector(`.${X_CLASS}`)).not.toBeNull();
  });

  it('shows highlight state on mouseenter event interaction', () => {
    // ACT - initial render
    drawGerminationTable({
      ...partialProps,
      xColor: 'red',
      tableColor: 'green',
      highlightStrokeColor: 'blue',
      highlightFillColor: 'pink',
    });

    const highlightNode = node.querySelector(`.${TABLE_HIGHLIGHT_CLASS}`);

    // ASSERT
    expect(highlightNode.style.visibility).toEqual('hidden');

    // ACT 2 - mouse over highlighting the element
    node.dispatchEvent(new Event('mouseenter'));

    // ASSERT 2
    expect(highlightNode.style.visibility).toEqual('visible');

    // // ACT 3 - mouse out restoring element to initial attrs
    node.dispatchEvent(new Event('mouseleave'));

    // // ASSERT 3
    expect(highlightNode.style.visibility).toEqual('hidden');
  });

  it('shows highlight state by "toHighlight" property', () => {
    // ACT - initial render
    drawGerminationTable({
      ...partialProps,
      xColor: 'red',
      tableColor: 'green',
      toHighlight: true,
      highlightStrokeColor: 'blue',
      highlightFillColor: 'pink',
    });

    const highlightNode = node.querySelector(`.${TABLE_HIGHLIGHT_CLASS}`);

    expect(highlightNode.style.visibility).toEqual('visible');
  });

  it('draws a table with reduced opacity', () => {
    drawGerminationTable({
      ...partialProps,
      secondTableColor: 'red',
      tableOpacity: 0.25,
    });

    const tableSidesNode = node.querySelector(`.${TABLE_SIDES_CLASS} path`);
    const tableTopNode = node.querySelector(`.${TABLE_TOP_CLASS} path`);
    const secondTableColor = node.querySelector(`.${TABLE_SECOND_COLOR_CLASS} path`);

    expect(tableSidesNode.style.opacity).toEqual('0.25');
    expect(tableTopNode.style.opacity).toEqual('0.25');
    expect(secondTableColor.style.opacity).toEqual('0.25');
  });

  it('draws a table with an error', () => {
    drawGerminationTable({
      ...partialProps,
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
    drawGerminationTable({
      ...partialProps,
      tableOpacity: FADED_OPACITY,
      errorColor: 'red',
      hasError: true,
    });

    const conflictIcon = node.querySelector(`.${CONFLICT_ICON_CLASS} path`);
    expect(conflictIcon.getAttribute('style')).toEqual(`opacity: ${FADED_OPACITY};`);
  });
});
