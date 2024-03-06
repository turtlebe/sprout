import { axiosRequest } from '@plentyag/core/src/utils/request';

export function deleteTests(
  itemsToDelete: LT.SampleResult[],
  onDeleteSuccess: () => void,
  onDeleteFail: (err: string) => void
) {
  const ids = itemsToDelete.map(item => `ids[]=${item.labTestSampleId}`).join('&');
  // to send array, for example ['1', '2', '3'], query args should be in format:
  // ?ids[]=1&ids[]=2&ids[]=3
  const url = encodeURI(`/api/lab-testing/delete?${ids}`);
  axiosRequest({ url, method: 'delete' })
    .then(onDeleteSuccess)
    .catch(err => {
      if (err.isAxiosError && err.response) {
        const errCode = err.response.status;
        const errMsg = err.response?.data.toString();
        const errStr = `${errCode} ${errMsg}`;
        onDeleteFail(errStr);
      } else {
        onDeleteFail(err.toString());
      }
    });
}
