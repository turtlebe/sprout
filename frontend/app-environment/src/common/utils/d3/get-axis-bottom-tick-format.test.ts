import { getAxisBottomTickFormat } from './get-axis-bottom-tick-format';

const date = new Date('2022-12-05T07:00:00Z');
const startDateTime = new Date('2022-12-01T07:00:00Z');

describe('getAxisBottomTickForma', () => {
  it('returns a MM/DD hh:mm A format', () => {
    const result = getAxisBottomTickFormat(date, startDateTime, false);

    expect(result).toContain('12/05');
    expect(result).not.toContain('(+');
  });

  it('returns the time and additional days', () => {
    const result = getAxisBottomTickFormat(date, startDateTime, true);

    expect(result).not.toContain('12/01');
    expect(result).toContain('(+4)');
  });

  it('returns the time and no additional days when the day is the same', () => {
    const date = new Date('2022-12-01T07:00:00Z');

    const result = getAxisBottomTickFormat(date, startDateTime, true);

    expect(result).not.toContain('12/01');
    expect(result).not.toContain('(+');
  });
});
