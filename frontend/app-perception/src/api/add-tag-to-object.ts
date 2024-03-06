import { ObjectTag } from '@plentyag/app-perception/src/common/types/interfaces';
import { axiosRequest } from '@plentyag/core/src/utils/request';

interface AddTagResult {
  data: ObjectTag[];
}
/**
 * Add tag to a perception object
 *
 * @param uuid uuid for the perception object
 * @param tag tag name to add to the object
 */
export async function addTagToObject(uuid: string, tag: string) {
  const addTagUrl = `/api/perception/add-tag?uuid=${uuid}&tag=${tag}`;
  const result = await axiosRequest<AddTagResult>({ method: 'POST', url: addTagUrl });
  return result;
}
