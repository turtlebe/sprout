import { PermissionLevels } from '@plentyag/core/src/core-store/types';
import { useGetFarmOsModules } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsHelpPage as dataTestIds, HelpPage } from '.';

const mockFarmOsModules = {
  farmOsModules: [
    {
      label: 'API Docs',
      permission_level: PermissionLevels.READ_AND_LIST,
      resource: 'HYP_API_DOCS',
      url: '/api-docs',
    },
    {
      label: 'Crops',
      permission_level: PermissionLevels.READ_AND_LIST,
      resource: 'HYP_CROPS',
      url: '/crops-skus',
    },
  ],
};

jest.mock('@plentyag/core/src/hooks/use-get-farmos-modules');
const mockUseGetFarmOsModules = useGetFarmOsModules as jest.Mock;
mockUseGetFarmOsModules.mockReturnValue({
  data: mockFarmOsModules,
});

describe('HelpPage', () => {
  it('shows no FarmOS module list when data has not yet loaded', () => {
    const mockUseGetFarmOsModules = useGetFarmOsModules as jest.Mock;
    mockUseGetFarmOsModules.mockReturnValue({
      data: undefined,
    });

    const { queryAllByTestId } = render(<HelpPage />);

    const modulesLabels = queryAllByTestId(dataTestIds.moduleLabel);
    expect(modulesLabels).toHaveLength(0);
  });

  it('shows list of all FarmOS modules', () => {
    const mockUseGetFarmOsModules = useGetFarmOsModules as jest.Mock;
    mockUseGetFarmOsModules.mockReturnValue({
      data: mockFarmOsModules,
    });

    const { queryAllByTestId } = render(<HelpPage />);

    const modulesLabels = queryAllByTestId(dataTestIds.moduleLabel);
    expect(modulesLabels).toHaveLength(2);
    expect(modulesLabels[0]).toHaveTextContent(mockFarmOsModules.farmOsModules[0].label);
    expect(modulesLabels[1]).toHaveTextContent(mockFarmOsModules.farmOsModules[1].label);
  });

  it('shows working and link to knowledge base', () => {
    const mockUseGetFarmOsModules = useGetFarmOsModules as jest.Mock;
    mockUseGetFarmOsModules.mockReturnValue({
      data: mockFarmOsModules,
    });

    const { queryByTestId } = render(<HelpPage />);

    const modulesLabels = queryByTestId(dataTestIds.knowledgeBaseSection);
    expect(modulesLabels).toBeInTheDocument();
    expect(modulesLabels.querySelector('a')).toBeInTheDocument();
    expect(modulesLabels.querySelector('a').getAttribute('href')).toBe(
      'https://plentyag.atlassian.net/wiki/spaces/FOS/overview'
    );
  });
});
