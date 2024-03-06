import * as d3 from 'd3';

import { drawTray, TRAY_CLASS, X_CLASS } from './draw-tray';

describe('drawTray', () => {
  let el;

  beforeEach(() => {
    el = d3.select(document.createElement('svg'));
  });

  it('draws a tray given dimensions and tray color', () => {
    // ACT
    drawTray({
      el,
      x: 100,
      y: 150,
      width: 200,
      height: 300,
      trayColor: 'red',
      strokeWidth: 2,
      strokeColor: 'blue',
      xColor: 'pink',
    });

    // ASSERT
    expect(el.node().querySelector(`.${TRAY_CLASS}`)).toBeTruthy();
    expect(el.node().querySelector(`.${X_CLASS}`)).toBeNull();
    expect(el.node().innerHTML).toEqual(
      '<g class="tray-graph"><rect x="100" y="150" width="200" height="300" stroke-linejoin="round" stroke-width="2" stroke="blue" fill="red"></rect></g>'
    );
  });

  it('should support injected class name', () => {
    const mockClassName = 'testing-class';

    // ACT
    drawTray({
      el,
      className: mockClassName,
      x: 100,
      y: 150,
      width: 200,
      height: 300,
      trayColor: 'red',
      strokeWidth: 2,
      strokeColor: 'blue',
      xColor: 'pink',
    });

    // ASSERT
    expect(el.node().querySelector(`.${mockClassName}`)).toBeTruthy();
  });

  it('draws a tray with "x" marker if tray color not provided', () => {
    // ACT
    drawTray({
      el,
      x: 100,
      y: 150,
      width: 200,
      height: 300,
      xColor: 'red',
      strokeWidth: 2,
      strokeColor: 'blue',
    });

    // ASSERT
    expect(el.node().querySelector(`.${TRAY_CLASS}`)).toBeTruthy();
    expect(el.node().querySelector(`.${X_CLASS}`)).toBeTruthy();
    expect(el.node().innerHTML).toEqual(
      '<g class="tray-graph"><rect x="100" y="150" width="200" height="300" stroke-linejoin="round" stroke-width="2" stroke="blue" fill="white"></rect></g><g class="tray-x-marker" transform="translate(100, 150)"><path d="M19.9,30L180.1,270Z" stroke="red" stroke-width="2" stroke-linecap="round"></path><path d="M20.1,270L179.9,30Z" stroke="red" stroke-width="2" stroke-linecap="round"></path></g>'
    );
  });
});
