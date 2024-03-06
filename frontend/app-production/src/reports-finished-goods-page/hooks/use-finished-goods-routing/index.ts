import { useQueryParam } from '@plentyag/core/src/hooks';
import { toQueryParams } from '@plentyag/core/src/utils';
import { useHistory, useParams } from 'react-router-dom';

export enum ReportTabs {
  FINISHED_GOODS = 'finishedGoods',
  SKUS = 'skus',
}

interface FinishedGoodsUrlParams {
  reportName?: string;
}

export interface UseFinishedGoodsRouting {
  tab: ReportTabs;
  goTo: (chosenTab: ReportTabs, additionalParams?: Record<string, string>) => void;
  getLink: (chosenTab: ReportTabs, additionalParams?: Record<string, string>) => string;
}

/**
 * This hook manages the routing (going through tabs). Currently, there are two
 * possible routes:
 *   /[basepath]/reports/finished-goods  -- finished goods tab
 *   /[basepath]/reports/finished-goods/skus -- skus tab
 * @param {string} basePath
 * @returns {UseFinishedGoodsRouting}
 */
export const useFinishedGoodsRouting = (basePath: string): UseFinishedGoodsRouting => {
  const queryParams = useQueryParam();
  const endDateTimeString = queryParams.get('endDateTime');
  const startDateTimeString = queryParams.get('startDateTime');

  const history = useHistory();
  const params = useParams<FinishedGoodsUrlParams>();

  const tab = params?.reportName === ReportTabs.SKUS ? ReportTabs.SKUS : ReportTabs.FINISHED_GOODS;

  function getLink(chosenTab, additionalParams = {}) {
    const newBasePath = chosenTab === ReportTabs.SKUS ? `${basePath}/${ReportTabs.SKUS}` : basePath;

    // only keep date parameters otherwise replace all the parameters
    const queryParamObj: Record<string, string> = { ...additionalParams };
    if (startDateTimeString) {
      queryParamObj.startDateTime = startDateTimeString;
    }
    if (endDateTimeString) {
      queryParamObj.endDateTime = endDateTimeString;
    }

    return `${newBasePath}${toQueryParams(queryParamObj)}`;
  }

  function goTo(chosenTab, additionalParams = {}) {
    history.push(getLink(chosenTab, additionalParams));
  }

  return { tab, goTo, getLink };
};
