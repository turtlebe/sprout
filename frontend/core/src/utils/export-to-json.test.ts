import { exportToJson } from './export-to-json';

const appendChild = jest.spyOn(document.body, 'appendChild');

describe('exportToJson', () => {
  beforeEach(() => {
    appendChild.mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download a JSON file', () => {
    const jsonObject = { foo: 'bar' };
    const filename = 'filename';

    exportToJson(filename, jsonObject);

    const a = document.createElement('a');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonObject));
    a.setAttribute('href', dataStr);
    a.setAttribute('download', filename + '.json');

    expect(appendChild).toHaveBeenCalledWith(a);
  });
});
