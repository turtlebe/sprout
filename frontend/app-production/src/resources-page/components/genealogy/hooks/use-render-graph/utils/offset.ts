/**
 * Generates offset relative to focused resource index such that
 * index 0 --> 1
 * index 1 --> -1
 * index 2 --> 2
 * index 3 --> -2
 * index 4 --> 3
 * index 5 --> -3
 * and so on.
 * The return value is used to render y axis value for resource lines.
 * @param index Positive integer value.
 * @return Integer value with offset applied.
 */
export const offSet = index => (Math.floor(index / 2) + 1) * (index % 2 > 0 ? -1 : 1);
