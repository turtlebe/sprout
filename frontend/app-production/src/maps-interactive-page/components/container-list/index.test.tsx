import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mocksResourcesState } from '../../test-helpers/mock-maps-state';

import { ContainerList, dataTestIdsContainerList as dataTestIds } from '.';

describe('ContainerList', () => {
  function renderContainerList(containers) {
    const mockGetCropColor = jest.fn();
    const mockResourcesPageBasePath = '/resources';

    return render(
      <ContainerList
        containers={containers}
        getCropColor={mockGetCropColor}
        resourcesPageBasePath={mockResourcesPageBasePath}
      />,
      {
        wrapper: props => <MemoryRouter {...props} />,
      }
    );
  }

  it('should render a list of containers with title and serial', () => {
    // ARRANGE
    const mockContainers = [
      {
        resourceState: mocksResourcesState[0],
      },
      {
        resourceState: mocksResourcesState[2],
      },
    ];

    // ACT
    const { queryByTestId } = renderContainerList(mockContainers);

    // ASSERT
    const serial1 = mocksResourcesState[0].containerObj.serial;
    const serial2 = mocksResourcesState[2].containerObj.serial;
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.containerTitle(serial1))).toHaveTextContent('Table with BAC');
    expect(queryByTestId(dataTestIds.containerTitle(serial2))).toHaveTextContent('Table with BAC/WHC');
    expect(queryByTestId(dataTestIds.serialLink(serial1))).toHaveAttribute(
      'href',
      '/resources?q=P900-0008046A:M0UO-2B2E-MU'
    );
    expect(queryByTestId(dataTestIds.serialLink(serial2))).toHaveAttribute(
      'href',
      '/resources?q=P900-0008046A:CWS6-7POV-3H'
    );
  });

  it('can render containers without material', () => {
    // ARRANGE
    const mockContainers = [
      {
        resourceState: mocksResourcesState[0],
      },
      {
        resourceState: {
          ...mocksResourcesState[2],
          materialObj: null,
        },
      },
    ];

    // ACT
    const { queryByTestId } = renderContainerList(mockContainers);

    // ASSERT
    const serial = mocksResourcesState[2].containerObj.serial;
    expect(queryByTestId(dataTestIds.containerTitle(serial))).toHaveTextContent('Empty table');
    expect(queryByTestId(dataTestIds.serialLink(serial))).toHaveTextContent(serial);
  });

  it('can render materials without containers', () => {
    // ARRANGE
    const mockContainers = [
      {
        resourceState: mocksResourcesState[0],
      },
      {
        resourceState: {
          ...mocksResourcesState[2],
          containerObj: null,
        },
      },
    ];

    // ACT
    const { queryByTestId } = renderContainerList(mockContainers);

    // ASSERT
    const lotName = mocksResourcesState[2].materialObj.lotName;
    expect(queryByTestId(dataTestIds.containerTitle(lotName))).toHaveTextContent('Uncontained BAC/WHC');
    expect(queryByTestId(dataTestIds.serialLink(lotName))).toHaveTextContent(lotName);
  });

  it('can render containers without serial', () => {
    // ARRANGE
    const mockContainers = [
      {
        resourceState: mocksResourcesState[0],
      },
      {
        resourceState: {
          ...mocksResourcesState[2],
          containerObj: null,
          materialObj: null,
        },
      },
    ];

    // ACT
    const { queryByTestId } = renderContainerList(mockContainers);

    // ASSERT
    const nonSerial = 'index_1';
    expect(queryByTestId(dataTestIds.containerTitle(nonSerial))).toBeInTheDocument();
  });
});
