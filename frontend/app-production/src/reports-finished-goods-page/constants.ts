import { PackagingLotTestStatus } from '@plentyag/core/src/types';

import { TestStatusField, TestStatusOverrideFields } from './types';

export const TestStatus: Record<PackagingLotTestStatus, string> = {
  [PackagingLotTestStatus.NONE]: 'None',
  [PackagingLotTestStatus.HOLD]: 'Hold',
  [PackagingLotTestStatus.PASS]: 'Pass',
  [PackagingLotTestStatus.FAIL]: 'Fail',
};

export const TestStatusProperties: Record<TestStatusField, TestStatusOverrideFields> = {
  [TestStatusField.QA]: {
    passedStatus: 'passedQaStatus',
    overriddenStatus: 'overriddenQaStatus',
    overriddenAuthor: 'overriddenQaAuthor',
    overriddenNotes: 'overriddenQaNotes',
    overriddenUpdatedAt: 'overriddenQaUpdatedAt',
  },
  [TestStatusField.LAB_TESTING]: {
    passedStatus: 'passedLtStatus',
    overriddenStatus: 'overriddenLtStatus',
    overriddenAuthor: 'overriddenLtAuthor',
    overriddenNotes: 'overriddenLtNotes',
    overriddenUpdatedAt: 'overriddenLtUpdatedAt',
  },
};

export const TestStatusEditTitle: Record<TestStatusField, string> = {
  [TestStatusField.QA]: 'Edit QA Status',
  [TestStatusField.LAB_TESTING]: 'Edit Lab Testing Status',
};

export const TEST_STATUS_SKU_PREFIX = 'SKU_';

export const TestStatusType: Record<TestStatusField, string> = {
  [TestStatusField.QA]: 'QA_OVERRIDDEN',
  [TestStatusField.LAB_TESTING]: 'LT_OVERRIDDEN',
};

/**
 * This is a little bit of a hack for lot products that have been
 * deprecated and moved to a new product (crop).  This purpose of this
 * is to fix the mapping from the old crop code to new crop code.
 * We should manage this code and add new alternatives as needed but
 * remember to delete them when is not needed
 */
export const ProductAlternativesMap: Record<string, string> = {};
