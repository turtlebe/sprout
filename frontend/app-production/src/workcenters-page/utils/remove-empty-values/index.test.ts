import { removeEmptyValues } from '.';

describe('removeEmptyValues', () => {
  it('removes values from flat object', () => {
    expect(removeEmptyValues({ x: null, y: 1, z: undefined, a: [], b: 'hello', c: 0 })).toEqual({
      y: 1,
      b: 'hello',
      c: 0,
    });
  });

  it('removes values in nested object', () => {
    expect(removeEmptyValues({ sub: { a: null, b: 1, c: undefined, d: [undefined, {}] } })).toEqual({ sub: { b: 1 } });
    expect(
      removeEmptyValues({ a: 1, b: undefined, c: null, d: [1, undefined, null, { x: undefined }], e: { f: undefined } })
    ).toEqual({ a: 1, d: [1] });
  });

  it('removes multiple items from an arrays', () => {
    expect(
      removeEmptyValues({
        value1: [{}, { x: undefined }, { y: 1 }],
      })
    ).toEqual({ value1: [{ y: 1 }] });
  });

  it('removes items from array', () => {
    expect(removeEmptyValues([{}, { x: undefined }, 1, undefined, null, { y: 1 }])).toEqual([1, { y: 1 }]);
  });

  it('removes empty values from action test case in jira ticket: https://plentyag.atlassian.net/browse/SD-21293', () => {
    expect(
      removeEmptyValues({
        priority_order_prop_rack_1: [
          {
            priority_order: 1,
            table_serial: {
              value: 'P900-0008046A:5WNV-JSM6-KB',
            },
          },
        ],
        priority_order_prop_rack_2: [
          {
            priority_order: null,
            table_serial: { value: undefined },
          },
        ],
      })
    ).toEqual({
      priority_order_prop_rack_1: [
        {
          priority_order: 1,
          table_serial: {
            value: 'P900-0008046A:5WNV-JSM6-KB',
          },
        },
      ],
    });
  });

  it('does not remove anything - since nothing to remove', () => {
    expect(removeEmptyValues({})).toEqual({});
    expect(removeEmptyValues([])).toEqual([]);
  });

  it('handles undefined, null values', () => {
    expect(removeEmptyValues(null)).toEqual(null);
    expect(removeEmptyValues(undefined)).toEqual(undefined);
  });

  it('does not touch objects such as functions and Sets if they are contained in given object', () => {
    const s = new Set();
    const m = new Map();
    const f = function () {};
    expect(removeEmptyValues([{}, s, m, { func: f }, 1])).toEqual([s, m, { func: f }, 1]);
  });
});
