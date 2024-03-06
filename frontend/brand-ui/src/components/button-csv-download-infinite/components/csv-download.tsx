import { CSVDownload } from 'react-csv';

/**
 * having a hard time mocking react-csv in tests so using a proxy component.
 */
export const CsvDownload = props => <CSVDownload {...props} />;
