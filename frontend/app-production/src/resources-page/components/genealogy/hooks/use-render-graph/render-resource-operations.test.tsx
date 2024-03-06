import * as d3 from 'd3';

import { renderResourceOperations } from './render-resource-operations';

const width = 1000;
const height = 1000;
const startDate = new Date('2020-12-10T00:00:00.000Z');
const endDate = new Date('2020-12-20T00:00:00.000Z');
const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width]);

const scale: ProdResources.Scale = {
  xScale: xScale,
  yScale: yScale,
};

const viewBounds = {
  upperLeftX: 0,
  upperLeftY: 0,
  lowerRightX: 1000,
  lowerRightY: 1000,
};

function createSvg() {
  var el = window.document.querySelector('body');
  return d3.select(el).append('svg:svg').attr('width', 300).attr('height', 300).append('g');
}

function getOperation(id: string, date: string): ProdResources.Operation {
  return {
    id,
    type: 'Add Label',
    username: 'test user',
    startDt: date,
    endDt: date,
    machine: null,
    stateIn: null,
    stateOut: null,
    materialsCreated: [],
    materialsConsumed: [],
  };
}

describe('renderResourceOperations', () => {
  afterEach(() => {
    var el = window.document.querySelector('body');
    el.removeChild(el.firstChild);
  });

  function renderOperations(operations: ProdResources.Operation[]) {
    const svg = createSvg();

    renderResourceOperations({
      resource: null, // not needed for testing here.
      operations,
      yIndex: 0,
      search: null, // not needed for testing here.
      svg,
      scale,
      viewBounds,
    });

    return svg.selectAll('circle');
  }

  it('renders nothing since the operations are not in viewBounds', () => {
    // will be left of view bounds, since date is less than xScale range.
    const op1 = getOperation('1', '2020-12-01T00:00:00.000Z');

    // will be right of view bounds, since date is greater than xScale range
    const op2 = getOperation('2', '2020-12-21T00:00:00.000Z');

    const operations: ProdResources.Operation[] = [op1, op2];
    const allCircles = renderOperations(operations);

    expect(allCircles.size()).toBe(0);
  });

  it('renders two separate operations since none overlap and both are within viewBounds', () => {
    // both operations have dates within the xScale range but do not overlap.
    const op1 = getOperation('1', '2020-12-15T00:00:00.000Z');
    const op2 = getOperation('2', '2020-12-20T00:00:00.000Z');

    const operations: ProdResources.Operation[] = [op1, op2];

    const allCircles = renderOperations(operations);

    expect(allCircles.size()).toBe(2);
  });

  it('renders one operation since both overlap and are within viewBounds', () => {
    // both operations have dates within the xScale range and will overlap
    const op1 = getOperation('1', '2020-12-15T00:00:00.000Z');
    const op2 = getOperation('2', '2020-12-15T00:01:00.000Z');

    const operations: ProdResources.Operation[] = [op1, op2];

    const allCircles = renderOperations(operations);

    expect(allCircles.size()).toBe(1);
  });
});
