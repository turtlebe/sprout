import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';

export function useProductCodes(location?: LT.Location): {
  productCodes: LT.ProductCode[];
  isLoading: boolean;
  errorMsg: string;
} {
  const farmDefPath = location?.path;
  const url = farmDefPath && `/api/lab-testing/products/${farmDefPath}`;
  const {
    data: productCodes,
    error,
    isValidating,
  } = useSwrAxios<LT.ProductCode[]>(
    { url },
    {
      shouldRetryOnError: true,
    }
  );

  const hasError = !!error;
  const isLoading = !hasError && ((farmDefPath && !productCodes) || isValidating);

  const errorMsg = hasError ? parseErrorMessage(error) || 'please try again or contact FarmOS support for help.' : '';

  return { productCodes, isLoading, errorMsg };
}
