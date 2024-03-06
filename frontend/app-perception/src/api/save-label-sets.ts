import { LabelSet } from '@plentyag/app-perception/src/common/types/interfaces';
import { axiosRequest } from '@plentyag/core/src/utils/request';

export async function addLabelSet(uuid: string, labelSet: LabelSet): Promise<{ status: boolean; error?: string }> {
  const url = '/api/perception/add-label-set';

  const data = { uuid: uuid, labelSet: labelSet };
  try {
    const result = await axiosRequest({ url, method: 'post', data });
    const ok = 200;
    if (result.status !== ok) {
      return {
        status: false,
        error: `${result.status}: ${result.statusText} ${result.data}`,
      };
    } else {
      return {
        status: true,
        error: null,
      };
    }
  } catch (err) {
    let errMsg = err.message;
    if (err.response) {
      const data = (err.response.data && err.response.data.toString()) || err.response.statusText || '';
      errMsg = `${err.response.status}: ${data}`;
    }
    return {
      status: false,
      error: errMsg,
    };
  }
}

export async function updateLabelSet(
  uuid: string,
  labelSetId: number,
  labelSet: LabelSet
): Promise<{ status: boolean; error?: string }> {
  const url = '/api/perception/update-label-set';

  const data = { uuid: uuid, labelSetId: labelSetId, labelSet: labelSet };
  try {
    const result = await axiosRequest({ url, method: 'put', data });
    const ok = 200;
    if (result.status !== ok) {
      return {
        status: false,
        error: `${result.status}: ${result.statusText} ${result.data}`,
      };
    } else {
      return {
        status: true,
        error: null,
      };
    }
  } catch (err) {
    let errMsg = err.message;
    if (err.response) {
      const data = (err.response.data && err.response.data.toString()) || err.response.statusText || '';
      errMsg = `${err.response.status}: ${data}`;
    }
    return {
      status: false,
      error: errMsg,
    };
  }
}
