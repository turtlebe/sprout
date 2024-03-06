/**
 * RoundRectOptions
 * @type {Number} x The top left x coordinate
 * @type {Number} y The top left y coordinate
 * @type {Number} width The width of the rectangle
 * @type {Number} height The height of the rectangle
 * @type {Number} [radius = 5] The corner radius; It can also be an object
 *                   to specify different radii for corners
 * @type {string} [color] upperLeftHalfFillColor The color of the upper left half of the rectangle.
 * @type {string} [color] lowerRightHalfFillColor The color of the lower right half of the rectangle.
 * @type {string} [color] Shadow Color
 * @type {Number} {opacity} Rectangle opacity (default 1.0)
 */
interface RoundRectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  upperLeftHalfFillColor?: string; // upper left half color of rectangle
  lowerRightHalfFillColor?: string; // lower right half of rectangle
  shadowColor?: string;
  opacity?: number;
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * The rectangle is filled with a diagonal color gradient such that the
 * upper left half is upperLeftHalfFillColor and the lower right half
 * is another color given by lowerRightHalfFillColor.
 * If you either of the fill colors is not provided, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {RoundRectOptions} options
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  {
    x,
    y,
    width,
    height,
    radius = 5,
    upperLeftHalfFillColor,
    lowerRightHalfFillColor,
    shadowColor,
    opacity = 1,
  }: RoundRectOptions
): void {
  // Set opacity
  ctx.save();
  ctx.globalAlpha = opacity;

  // draw entire rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (shadowColor) {
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 2;
  }

  if (upperLeftHalfFillColor && upperLeftHalfFillColor) {
    if (lowerRightHalfFillColor !== upperLeftHalfFillColor) {
      const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
      gradient.addColorStop(0.0, upperLeftHalfFillColor);
      gradient.addColorStop(0.5, upperLeftHalfFillColor);
      gradient.addColorStop(0.5, lowerRightHalfFillColor);
      gradient.addColorStop(1.0, lowerRightHalfFillColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = upperLeftHalfFillColor;
    }
    ctx.fill();
  } else {
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  // Restore opacity
  ctx.restore();
}

export { drawRoundedRect };
