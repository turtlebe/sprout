import { omit } from 'lodash';

export interface SerializeTagOptions {
  username: string;
  isUpdating?: boolean;
}
export function serializeTag(tag, { username, isUpdating }: SerializeTagOptions) {
  const createdOrUpdatedBy = isUpdating ? 'updatedBy' : 'createdBy';
  return {
    ...omit(tag, ['measurementType', 'min', 'max']),
    measurementType: tag['measurementType'].key,
    deviceType: '',
    [createdOrUpdatedBy]: username,
  };
}
