import 'jest-canvas-mock';
import { drawRoundedRect } from './draw-rounded-rect';

describe('drawRoundedRect', () => {
  it('draws with default radius and fill', () => {
    // ARRANGE
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');

    // ACT
    drawRoundedRect(canvasCtx, {
      x: 10,
      y: 20,
      width: 100,
      height: 150,
    });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(19);
    expect(events.find(event => event.type === 'fillStyle').props.value).toEqual('#ffffff');
  });

  it('draws with specified radius, fill, and shadow color', () => {
    // ARRANGE
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');

    // ACT
    drawRoundedRect(canvasCtx, {
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      radius: 10,
      upperLeftHalfFillColor: '#ff0000',
      lowerRightHalfFillColor: '#ff0000',
      shadowColor: '#0000ff',
    });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(19);

    expect(events.find(event => event.type === 'fillStyle').props.value).toEqual('#ff0000');
    expect(events.find(event => event.type === 'shadowColor').props.value).toEqual('#0000ff');
  });

  it('draws with two colors: upper left half and lower right half', () => {
    // ARRANGE
    const canvasEl = document.createElement('canvas');
    const canvasCtx = canvasEl.getContext('2d');
    const upperLeftHalfFillColor = '#ff0000';
    const lowerRightHalfFillColor = '#00ff00';

    // ACT
    drawRoundedRect(canvasCtx, {
      x: 10,
      y: 20,
      width: 100,
      height: 150,
      radius: 10,
      upperLeftHalfFillColor,
      lowerRightHalfFillColor,
      shadowColor: '#0000ff',
    });

    // ASSERT
    const events = canvasCtx.__getEvents();
    expect(events.length).toEqual(20);

    const fillStyleEvent = events.find(event => event.type === 'fillStyle');
    expect(fillStyleEvent.props.value instanceof CanvasGradient).toEqual(true);
    // get ref to addColorStop function (mock function)
    const addGradientColorStop = fillStyleEvent.props.value.addColorStop;
    expect(addGradientColorStop).toHaveBeenCalledTimes(4);
    expect(addGradientColorStop).toHaveBeenNthCalledWith(1, 0.0, upperLeftHalfFillColor);
    expect(addGradientColorStop).toHaveBeenNthCalledWith(2, 0.5, upperLeftHalfFillColor);
    expect(addGradientColorStop).toHaveBeenNthCalledWith(3, 0.5, lowerRightHalfFillColor);
    expect(addGradientColorStop).toHaveBeenNthCalledWith(4, 1.0, lowerRightHalfFillColor);
  });
});
