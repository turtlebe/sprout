import { adjustColor } from './adjust-color';

describe('adjustColor', () => {
  it('returns variation of the color', () => {
    expect(adjustColor('#000000', 0)).toBe('#000000');
    expect(adjustColor('#000000', 1)).toBe('#191919');
    expect(adjustColor('#000000', 2)).toBe('#2c2c2c');
    expect(adjustColor('#000000', 3)).toBe('#404040');
    expect(adjustColor('#000000', 4)).toBe('#200001');
    expect(adjustColor('#000000', 5)).toBe('#30181a');
    expect(adjustColor('#000000', 6)).toBe('#452b2c');
    expect(adjustColor('#000000', 7)).toBe('#5b3f40');
  });
});
