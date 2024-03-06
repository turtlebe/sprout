import { isChildOrParentPath } from '.';

describe('isChildOrParentPath', () => {
  it('returns false when allowPaths not provided', () => {
    expect(isChildOrParentPath(undefined, '')).toBe(false);
  });

  it('returns false when path is not allowed', () => {
    expect(isChildOrParentPath(['sites/SSF2'], 'sites/LAR1')).toBe(false);
    expect(isChildOrParentPath(['sites/SSF2'], 'sites/LAR1/areas/LAR1')).toBe(false);

    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/SSF2/area/BMP')).toBe(false);
    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/LAR1')).toBe(false);
  });

  it('returns true when path is allowed', () => {
    expect(isChildOrParentPath(['sites/SSF2'], 'sites/SSF2')).toBe(true);
    expect(isChildOrParentPath(['sites/SSF2'], 'sites/SSF2/area/VerticalGrow')).toBe(true);
    expect(isChildOrParentPath(['sites/SSF2'], 'sites/SSF2/area/BMP')).toBe(true);

    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/SSF2')).toBe(true);
    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/SSF2/area/VerticalGrow')).toBe(true);
    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/SSF2/area/VerticalGrow/lines/GrowLine1')).toBe(
      true
    );

    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow', 'sites/SSF2/area/BMP'], 'sites/SSF2')).toBe(true);
    expect(
      isChildOrParentPath(['sites/SSF2/area/VerticalGrow', 'sites/SSF2/area/BMP'], 'sites/SSF2/area/VerticalGrow')
    ).toBe(true);
    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow', 'sites/SSF2/area/BMP'], 'sites/SSF2/area/BMP')).toBe(
      true
    );
    expect(isChildOrParentPath(['sites/SSF2/area/VerticalGrow'], 'sites/SSF2/area/VerticalGrow/lines/GrowLine1')).toBe(
      true
    );

    expect(isChildOrParentPath(['sites/LAR1', 'sites/SSF2/area/VerticalGrow'], 'sites/SSF2')).toBe(true);
    expect(isChildOrParentPath(['sites/LAR1', 'sites/SSF2/area/VerticalGrow'], 'sites/LAR1')).toBe(true);
    expect(isChildOrParentPath(['sites/LAR1', 'sites/SSF2/area/VerticalGrow'], 'sites/SSF2/area/VerticalGrow')).toBe(
      true
    );
  });
});
