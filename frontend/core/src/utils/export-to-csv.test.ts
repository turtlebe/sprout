import { exportToCSV } from './export-to-csv';

const Blob = jest.spyOn(global, 'Blob');
// const createObjectURL = jest.spyOn(global.URL, 'createObjectURL');

describe('exportToCSV', () => {
  let originalCreateObjectURL;

  beforeEach(() => {
    Blob.mockImplementation(jest.fn());

    // eslint-disable-next-line @typescript-eslint/unbound-method
    originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it('should create a blob from a CSV format', () => {
    const mockDate = [
      ['column 1', 'column 2'],
      ['123', '456'],
    ];

    exportToCSV('download.csv', mockDate);

    expect(Blob).toHaveBeenCalledWith(['column 1,column 2\n123,456\n'], expect.anything());
  });

  it('should filter out quotes and commas', () => {
    const mockDate = [
      ['column 1', 'column "Two" 2'],
      ['123,123,222', '456'],
    ];

    exportToCSV('download.csv', mockDate);

    expect(Blob).toHaveBeenCalledWith(['column 1,"column ""Two"" 2"\n"123,123,222",456\n'], expect.anything());
  });
});
