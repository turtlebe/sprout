import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { SEARCH_POSTHARVEST_AUDIT_SUMMARY } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockPackagingLot } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';

import { mockSku } from '../../test-helpers/mock-skus';

import { dataTestIdsLinkToPHQA as dataTestIds, LinkToPHQA } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
jest.mock('@plentyag/brand-ui/src/components/plenty-link');
const MockPlentyLink = PlentyLink as jest.Mock;

describe('LinkToPHQA', () => {
  const mockPostharvestAuditSummary = { data: [{ sample: 1 }] };

  function renderLinkToPHQA(props?: LinkToPHQA) {
    return render(<LinkToPHQA lot={mockPackagingLot} sku={mockSku} {...props} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  beforeEach(() => {
    MockPlentyLink.mockImplementation(({ 'data-testid': dataTestId }) => <div data-testid={dataTestId}></div>);
    mockCurrentUser({ permissions: { HYP_QUALITY: 'READ_AND_LIST' } });
    mockUseSwrAxios.mockImplementation((_, { onSuccess }) => {
      onSuccess({ data: mockPostharvestAuditSummary });
      return {
        isValidating: false,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderLinkToPHQA();

    // ASSERT
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: SEARCH_POSTHARVEST_AUDIT_SUMMARY,
        method: 'POST',
        data: {
          limit: 1,
          offset: 0,
          lot: mockPackagingLot.lotName,
          sku: mockSku.name,
          site: 'LAX1',
          farm: 'LAX1',
        },
      }),
      expect.anything()
    );
    expect(MockPlentyLink).toHaveBeenCalledWith(
      expect.objectContaining({
        openInNewTab: true,
        children: 'Open Postharvest',
        to: '/quality/sites/LAX1/farms/LAX1/postharvest?lot=filterType-text-*type-contains-*filter-5-LAX1-C11-219&sku=filterType-text-*type-contains-*filter-C11Case6Clamshell4o5oz',
      }),
      expect.anything()
    );
  });

  it('should show loader if loading', () => {
    // ARRANGE
    mockUseSwrAxios.mockImplementation(() => {
      return {
        isValidating: true,
      };
    });

    // ACT
    const { queryByTestId } = renderLinkToPHQA();

    // ASSERT
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('should not render if user does not have permission', () => {
    // ARRANGE
    mockCurrentUser({ permissions: {} });

    // ACT
    const { queryByTestId } = renderLinkToPHQA();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('should not render if there are no data for this lot and sku', () => {
    // ARRANGE
    mockUseSwrAxios.mockReturnValue({
      makeRequest: jest.fn(),
    });

    // ACT
    const { queryByTestId } = renderLinkToPHQA();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});
