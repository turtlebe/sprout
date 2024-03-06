import { useQueryParam } from '@plentyag/core/src/hooks';

export function useGetSampleIdQueryParameter() {
  return useQueryParam().get('lab_test_sample_id');
}
