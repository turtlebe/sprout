import { OBSERVATION_PATH } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';

export interface BuildPostharvestIngestRequest {
  username: string;
  siteName: string;
  farmName: string;
  lotName: string;
  skuName: string;
}

export interface PostharvestIngestRequest {
  createdBy: string;
  lot: string;
  site: string;
  farm: string;
  sku: string;
  path: string;
}

export const buildPostharvestIngestRequest = ({
  username,
  siteName,
  farmName,
  lotName,
  skuName,
}: BuildPostharvestIngestRequest): PostharvestIngestRequest => ({
  createdBy: username,
  lot: lotName,
  site: siteName,
  farm: farmName,
  sku: skuName,
  path: OBSERVATION_PATH,
});
