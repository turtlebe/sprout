import { SearchResult } from '../../../common/types/interfaces';

/**
 * Download the image and metadata for a search result
 *
 * @param result Search result object
 */
export const downloadResult = (result: SearchResult) => {
  const a = document.createElement('a');
  const file: Blob = new Blob([JSON.stringify(result)], { type: 'applicationjson' });
  const metadataUrl: string = URL.createObjectURL(file);

  // download metadata json
  a.href = metadataUrl;
  a.download = `${result.uuid}.json`;
  a.click();

  //download png image
  a.href = result.s3Url;
  a.download = `${result.uuid}.png`;
  a.click();

  URL.revokeObjectURL(metadataUrl);
};
