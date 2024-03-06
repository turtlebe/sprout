import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { ContainerTypes, LabelItem } from '@plentyag/core/src/types';
import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import React from 'react';

export interface UseGetLabelsReturn {
  containerLabels: string[];
  materialLabels: string[];
}

export const useGetLabels = (containerType?: ContainerTypes): UseGetLabelsReturn => {
  const snackbar = useGlobalSnackbar();
  const { data: labels, error } = useSwrAxios<LabelItem[]>({
    url: '/api/production/resources/labels',
  });

  React.useEffect(() => {
    if (error) {
      snackbar.errorSnackbar({ title: 'Error loading resource labels', message: parseErrorMessage(error) });
    }
  }, [error]);

  const containerLabels = React.useMemo(
    () =>
      labels
        ?.filter(
          label =>
            label.labelType === 'CONTAINER' && (containerType ? label.resourceTypes.includes(containerType) : true)
        )
        ?.map(label => label.name),
    [labels, containerType]
  );

  const materialLabels = React.useMemo(
    () => labels?.filter(label => label.labelType === 'MATERIAL')?.map(label => label.name),
    [labels]
  );

  return { containerLabels, materialLabels };
};
