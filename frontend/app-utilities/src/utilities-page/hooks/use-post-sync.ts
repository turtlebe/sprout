import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';

export const usePostSync = () => usePostRequest({ url: '/api/utilities/sync-tigris-nutrient-dosing' });
