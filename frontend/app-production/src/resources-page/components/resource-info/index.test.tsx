import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { dataTestIdsCard } from '@plentyag/brand-ui/src/components/card';
import { render } from '@testing-library/react';
import React from 'react';

import { useSearch } from '../../hooks/use-search';
import { FamilyResouresCard } from '../family-resources-card';
import {
  mockResult,
  mockResultContainerOnly,
  mockResultMaterialOnly,
  mockResultWithCarrier,
  mockResultWithParentAndChildren,
} from '../search/mock-search-result';

import { dataTestIds, ResourceInfo } from './index';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

jest.mock('../family-resources-card');
const mockFamilyResouresCard = FamilyResouresCard as jest.Mock;
const mockFamilyResouresCardDataTestId = 'mock-family-resources-card';
mockFamilyResouresCard.mockImplementation(() => <div data-testid={mockFamilyResouresCardDataTestId} />);

describe('ResourceInfo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderResourceInfo() {
    return render(<ResourceInfo />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders nothing if no search result data is provided', () => {
    mockUseSearch.mockReturnValue([null]);
    const { queryByTestId } = renderResourceInfo();
    expect(queryByTestId(dataTestIds.resourceInfo)).toBe(null);
  });

  it('renders family resources card', () => {
    mockUseSearch.mockReturnValue([mockResultWithParentAndChildren]);
    const { getByTestId } = renderResourceInfo();
    expect(getByTestId(mockFamilyResouresCardDataTestId)).toBeInTheDocument();
    expect(mockFamilyResouresCard).toHaveBeenCalled();
  });

  it('renders the link for the container serial', () => {
    mockUseSearch.mockReturnValue([mockResultWithParentAndChildren]);
    const { getByTestId } = renderResourceInfo();
    expect(getByTestId(dataTestIds.containerSerialLink)).toHaveTextContent(
      mockResultWithParentAndChildren.containerObj.serial
    );
    expect(getByTestId(dataTestIds.containerSerialLink).getAttribute('href')).toEqual(
      `${mockBasePath}/resources/info?q=${mockResultWithParentAndChildren.containerObj.serial}`
    );
  });

  it('renders empty "Container" card when resource has no container', () => {
    mockUseSearch.mockReturnValue([mockResultMaterialOnly]);

    const { getAllByTestId, getByTestId } = renderResourceInfo();

    const cardsHeader = getAllByTestId(dataTestIdsCard.cardHeader);
    expect(cardsHeader).toHaveLength(2);
    expect(cardsHeader[0]).toHaveTextContent('Container');
    expect(cardsHeader[1]).toHaveTextContent('Material');

    const cardsContent = getAllByTestId(dataTestIdsCard.cardContent);
    expect(cardsContent).toHaveLength(2);
    expect(cardsContent[0]).toHaveTextContent('Container is not present');
    expect(cardsContent[1]).not.toHaveTextContent('Material is not present');

    expect(getByTestId(dataTestIds.quantity)).toBeInTheDocument();
    expect(getByTestId(dataTestIds.units)).toBeInTheDocument();
  });

  it('renders empty "Material" card when resource has no material', () => {
    mockUseSearch.mockReturnValue([mockResultContainerOnly]);

    const { getAllByTestId } = renderResourceInfo();

    const cardsHeader = getAllByTestId(dataTestIdsCard.cardHeader);
    expect(cardsHeader).toHaveLength(2);
    expect(cardsHeader[0]).toHaveTextContent('Container');
    expect(cardsHeader[1]).toHaveTextContent('Material');

    const cardsContent = getAllByTestId(dataTestIdsCard.cardContent);
    expect(cardsContent).toHaveLength(2);
    expect(cardsContent[0]).not.toHaveTextContent('Container is not present');
    expect(cardsContent[1]).toHaveTextContent('Material is not present');
  });

  it('renders empty "Material" card with "Additional Attributes" when resource has no material, but "materialAttributes" are present', () => {
    const mockResultContainerOnlyWithMaterialAttributes = {
      ...mockResultContainerOnly,
      materialAttributes: mockResultWithCarrier.materialAttributes,
    };
    mockUseSearch.mockReturnValue([mockResultContainerOnlyWithMaterialAttributes]);

    const { getAllByTestId, getByTestId } = renderResourceInfo();

    const cardsHeader = getAllByTestId(dataTestIdsCard.cardHeader);
    expect(cardsHeader).toHaveLength(2);
    expect(cardsHeader[0]).toHaveTextContent('Container');
    expect(cardsHeader[1]).toHaveTextContent('Material');

    const cardsContent = getAllByTestId(dataTestIdsCard.cardContent);
    expect(cardsContent).toHaveLength(2);
    expect(cardsContent[0]).not.toHaveTextContent('Container is not present');
    expect(cardsContent[1]).not.toHaveTextContent('Material is not present');

    expect(getByTestId(dataTestIds.additionalAttributes)).toBeInTheDocument();
  });

  it('renders "Additional Status" in container card when resource has field: "containerAttributes"', () => {
    mockUseSearch.mockReturnValue([mockResultWithCarrier]);

    const { queryByTestId } = renderResourceInfo();

    expect(queryByTestId(dataTestIds.additionalStatus)).toBeInTheDocument();
  });

  it('does not render "Additional Status" in container card when resource has no field: "containerAttributes"', () => {
    mockUseSearch.mockReturnValue([mockResult]);

    const { queryByTestId } = renderResourceInfo();

    expect(queryByTestId(dataTestIds.additionalStatus)).not.toBeInTheDocument();
  });

  it('renders "Additional Attributes" in material card when resource has field: "materialAttributes"', () => {
    mockUseSearch.mockReturnValue([mockResultWithCarrier]);

    const { queryByTestId } = renderResourceInfo();

    expect(queryByTestId(dataTestIds.additionalAttributes)).toBeInTheDocument();
  });

  it('does not render "Additional Attributes" in material card when resource has no field: "materialAttributes"', () => {
    mockUseSearch.mockReturnValue([mockResult]);

    const { queryByTestId } = renderResourceInfo();

    expect(queryByTestId(dataTestIds.additionalAttributes)).not.toBeInTheDocument();
  });
});
