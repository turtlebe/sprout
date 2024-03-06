import { UPDATE_STATUS_URL } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { OverrideReleaseDetails, PackagingLotTestStatus, ReleaseDetails } from '@plentyag/core/src/types';
import { toQueryParams } from '@plentyag/core/src/utils';
import * as yup from 'yup';

import {
  TEST_STATUS_SKU_PREFIX,
  TestStatus,
  TestStatusEditTitle,
  TestStatusProperties,
  TestStatusType,
} from '../../constants';
import { TestStatusField } from '../../types';

const inputContainerStyle = { width: '900px' };

export interface UseFinishedGoodsTestStatusFormGenConfig {
  lotName: string;
  skuName?: string;
  field: TestStatusField;
  username: string;
  netSuiteItem?: string;
}

export interface UseFinishedGoodsTestStatusFormGenConfigReturn extends FormGen.Config {}

export const useFinishedGoodsTestStatusFormGenConfig = ({
  lotName,
  skuName,
  field,
  username,
  netSuiteItem,
}: UseFinishedGoodsTestStatusFormGenConfig): UseFinishedGoodsTestStatusFormGenConfigReturn => {
  // determine title
  const title = `${TestStatusEditTitle[field]} for ${lotName}${skuName ? ` (${skuName} / ${netSuiteItem})` : ''}`;

  // query params
  const queryMap = {
    statusType: `${TEST_STATUS_SKU_PREFIX}${TestStatusType[field]}`,
    netSuiteItem: netSuiteItem,
  };

  // endpoint
  const updateEndpoint = `${UPDATE_STATUS_URL}/${lotName}${toQueryParams(queryMap, { encodeKeyUsingSnakeCase: true })}`;

  // create key/value pair for status dropdown from enum
  const statusOptions = Object.keys(PackagingLotTestStatus).map(value => {
    return {
      value,
      label: TestStatus[value],
    };
  });

  return {
    title,
    updateEndpoint,
    serialize: (values): OverrideReleaseDetails => {
      const now = new Date().toISOString();
      return {
        status: values.status,
        author: values.username,
        notes: values.notes,
        updatedAt: now,
      };
    },
    deserialize: (values: ReleaseDetails) => {
      const status =
        !values[TestStatusProperties[field].overriddenStatus] ||
        values[TestStatusProperties[field].overriddenStatus] === PackagingLotTestStatus.NONE
          ? values[TestStatusProperties[field].passedStatus]
          : values[TestStatusProperties[field].overriddenStatus];

      const notes = values[TestStatusProperties[field].overriddenNotes];
      const lastUpdatedAt = values[TestStatusProperties[field].overriddenUpdatedAt];

      return {
        status,
        notes,
        username,
        lastUpdatedAt,
      };
    },
    fields: [
      {
        type: 'TextField',
        name: 'username',
        label: 'User',
        textFieldProps: { disabled: true },
        inputContainerStyle,
      },
      {
        type: 'Select',
        name: 'status',
        label: 'Status',
        options: statusOptions,
        validate: yup.string().required(),
        inputContainerStyle,
      },
      {
        type: 'TextField',
        name: 'notes',
        label: 'Notes',
        validate: yup.string().required(),
        inputContainerStyle,
      },
    ],
  };
};
