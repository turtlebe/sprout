import { MutableRefObject } from 'react';

interface UseInitCanvas {
  ref: MutableRefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  scaleSize: number;
}

/**
 * Initiate and setup canvas and return the "canvas context"
 * Setup includes setting the sharpness of the canvas renderer for retina screens
 */
export const useInitCanvas = ({ ref, width, height, scaleSize }: UseInitCanvas): CanvasRenderingContext2D => {
  // No DOM ref? get outta here!
  if (!ref.current) {
    return;
  }

  // Canvas settings for "retina" screens (*scale)
  const retinaWidth = width * scaleSize;
  const retinaHeight = height * scaleSize;

  // Set attributes for canvas
  ref.current.setAttribute('width', `${retinaWidth}`);
  ref.current.setAttribute('height', `${retinaHeight}`);
  ref.current.style['width'] = `${width}px`;
  ref.current.style['height'] = `${height}px`;

  // Context & 2x support for retina
  const canvasCtx = ref.current.getContext('2d');
  canvasCtx.scale(scaleSize, scaleSize);

  return canvasCtx;
};
