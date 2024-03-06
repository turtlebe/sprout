import { getMaterialCommentableId } from '@plentyag/app-production/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { isEmpty, reduce } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';

import { ContainerType, MapsState, SupportedAreaClass } from '../../types';
import { useLoadCommentables } from '../use-load-commentables';
import { useMapsDateRange } from '../use-maps-date-range';

export interface UseLoadMapsState {
  linePath: string;
  selectedDate: DateTime;
  containerId?: string;
  containerType?: ContainerType;
  showWarningWhenMapsStateIsEmpty?: boolean;
}

export interface UseLoadMapsStateReturn {
  isLoading: boolean;
  mapsState: MapsState;
}

export const useLoadMapsState = (props: UseLoadMapsState): UseLoadMapsStateReturn => {
  const site = getKindFromPath(props?.linePath, 'sites');
  const area = getKindFromPath(props?.linePath, 'areas');
  const line = getKindFromPath(props?.linePath, 'lines');

  const snackbar = useGlobalSnackbar();

  const dates = useMapsDateRange(site, area && SupportedAreaClass[area], props?.selectedDate || DateTime.now());

  /**
   * The start date and end date are attributes used for only gathering the "lastLoadOperation",
   * For the LAX1 site, we no longer rely on sifting through history of Operations within a time frame (
   * hence the need for the start and end date) in order to figure out the "load date".  Instead,
   * for LAX1 the load date will be found inside the resource state object itself under "materialAttributes".
   * Because of this we do not need the startDate/endDate attributes and the flag to show last load operations for
   * the LAX1 site.
   */
  const params =
    site && site === 'LAX1'
      ? {
          showLastLoadOperation: false,
          selectedDate: props?.selectedDate?.toISO(),
        }
      : {
          startDate: dates.startDate,
          endDate: dates.endDate,
          showLastLoadOperation: true,
        };

  const {
    data: rawMapsState,
    isValidating,
    error,
  } = useSwrAxios<MapsState>(
    site &&
      area &&
      line && {
        url: '/api/production/maps/state',
        params: {
          site,
          area,
          line,
          ...params,
          containerId: props.containerId,
          containerType: props.containerType,
        },
      }
  );

  const { commentables, isLoading: isLoadingCommentables } = useLoadCommentables(rawMapsState);

  // Append `hasComments` to MapsState
  const mapsState = React.useMemo(() => {
    if (commentables.length > 0) {
      return reduce(
        rawMapsState,
        (result, value, key) => {
          const hasComments = Boolean(
            commentables.find(commentable => commentable.id === getMaterialCommentableId(value.resourceState))
          );

          result[key] = { ...value, hasComments };

          return result;
        },
        {}
      );
    }

    return rawMapsState;
  }, [rawMapsState, commentables]);

  React.useEffect(() => {
    if (props?.showWarningWhenMapsStateIsEmpty && mapsState && isEmpty(mapsState)) {
      snackbar.warningSnackbar(
        `We have no historical data for the selected date of ${props.selectedDate.toFormat(DateTimeFormat.US_DEFAULT)}`
      );
    }
  }, [mapsState]);

  useLogAxiosErrorInSnackbar(error);

  return { isLoading: isValidating || isLoadingCommentables, mapsState };
};
