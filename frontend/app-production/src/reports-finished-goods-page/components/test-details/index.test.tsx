import {
  mockPackagingLot,
  mockPackagingLotWithOverride,
  mockPackagingLotWithReleaseDetailsOverride,
} from '@plentyag/app-production/src/reports-finished-goods-page/test-helpers/mock-packaging-lots';
import { TestStatusField } from '@plentyag/app-production/src/reports-finished-goods-page/types';
import { mockSku } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTestingStatus } from '../test-status';

import { dataTestIdsTestDetails as dataTestIds, TestDetails } from '.';

describe('TestDetails', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2022-09-07T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('lot release', () => {
    it('renders QA Test details including the notes', () => {
      // ACT
      const { queryByTestId } = render(<TestDetails lot={mockPackagingLotWithOverride} field={TestStatusField.QA} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTestingStatus.current).textContent).toEqual('Hold');
      expect(queryByTestId(dataTestIds.notes).textContent).toEqual(
        'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view—Updated 4 days ago by otapia'
      );
    });

    it('renders Lab Testing details including the note', () => {
      // ACT
      const { queryByTestId } = render(
        <TestDetails lot={mockPackagingLotWithOverride} field={TestStatusField.LAB_TESTING} />
      );

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTestingStatus.current).textContent).toEqual('Fail');
      expect(queryByTestId(dataTestIds.notes).textContent).toEqual(
        'Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view—Updated 4 days ago by otapia'
      );
    });
  });

  describe('sku release', () => {
    it('renders QA Test details including the notes', () => {
      // ACT
      const { queryByTestId } = render(
        <TestDetails lot={mockPackagingLotWithReleaseDetailsOverride} sku={mockSku} field={TestStatusField.QA} />
      );

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTestingStatus.current).textContent).toEqual('Hold');
      expect(queryByTestId(dataTestIds.notes).textContent).toEqual(
        'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view—Updated 4 days ago by otapia'
      );
    });

    it('renders Lab Testing details including the note', () => {
      // ACT
      const { queryByTestId } = render(
        <TestDetails
          lot={mockPackagingLotWithReleaseDetailsOverride}
          sku={mockSku}
          field={TestStatusField.LAB_TESTING}
        />
      );

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTestingStatus.current).textContent).toEqual('Fail');
      expect(queryByTestId(dataTestIds.notes).textContent).toEqual(
        'Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view—Updated 4 days ago by otapia'
      );
    });
  });

  describe('no value', () => {
    it('renders no details if there none', () => {
      // ACT
      const { queryByTestId } = render(<TestDetails lot={mockPackagingLot} field={TestStatusField.LAB_TESTING} />);

      // ASSERT
      expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIdsTestingStatus.current).textContent).toEqual('None');
      expect(queryByTestId(dataTestIds.notes)).not.toBeInTheDocument();
    });
  });
});
