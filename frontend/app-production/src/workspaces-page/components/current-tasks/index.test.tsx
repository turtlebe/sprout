import { usePageVisibility } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { useLoadWorkbinInstances } from '../../hooks';
import { mockWorkbinInstanceData } from '../../test-helpers';
import { CardItemTasks } from '../card-item-tasks';

import { CurrentTasks } from '.';

jest.mock('../../hooks/use-load-workbin-instances');
const mockUseLoadWorkbinInstances = useLoadWorkbinInstances as jest.Mock;
const mockLoadData = jest.fn();
mockUseLoadWorkbinInstances.mockReturnValue({
  isLoading: false,
  unifiedWorkbinInstanceData: mockWorkbinInstanceData,
  loadData: mockLoadData,
});

jest.mock('@plentyag/core/src/hooks/use-page-visibility');
const mockUsePageVisibility = usePageVisibility as jest.Mock<VisibilityState>;

jest.mock('../card-item-tasks');
const mockCardItemsTasks = CardItemTasks as jest.Mock;
mockCardItemsTasks.mockReturnValue(<div>mock card item tasks</div>);

const mockFarm = 'sites/SSF2/farms/Tigris';
const mockWorkspace = 'Grower';
const mockSearchText = 'TEST';
const mockSearchResultCount = jest.fn();

describe('CurrentTasks', () => {
  beforeEach(() => {
    mockUsePageVisibility.mockReturnValue('visible');
  });

  afterEach(() => {
    mockLoadData.mockReset();
    jest.clearAllTimers();
    jest.useRealTimers();
    mockSearchResultCount.mockClear();
    mockCardItemsTasks.mockClear();
  });

  function expectMockLoadToHaveBeenCalled(farm: string, workspace: string) {
    expect(mockLoadData).toHaveBeenCalledWith({
      farm: farm,
      workbin: workspace,
      statuses: ['NOT_STARTED'],
    });
  }

  it('loads data initially', () => {
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);
  });

  it('reloads data after 15 seconds', () => {
    jest.useFakeTimers();
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    // initial call
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);

    mockLoadData.mockClear();
    jest.advanceTimersByTime(14900);
    expect(mockLoadData).not.toHaveBeenCalled();

    jest.advanceTimersByTime(101);
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);

    mockLoadData.mockClear();
    jest.advanceTimersByTime(15000);
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);
  });

  it('does not reload if existing request is still loading', () => {
    const mockLoadData = jest.fn();
    mockUseLoadWorkbinInstances
      .mockReturnValueOnce({
        isLoading: false,
        unifiedWorkbinInstanceData: mockWorkbinInstanceData,
        loadData: mockLoadData,
        clearData: () => {},
      })
      .mockReturnValueOnce({
        isLoading: true,
        unifiedWorkbinInstanceData: mockWorkbinInstanceData,
        loadData: mockLoadData,
        clearData: () => {},
      })
      .mockReturnValueOnce({
        isLoading: false,
        unifiedWorkbinInstanceData: mockWorkbinInstanceData,
        loadData: mockLoadData,
        clearData: () => {},
      });

    jest.useFakeTimers();
    const { rerender } = render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    // initial call to load
    expect(mockLoadData).toHaveBeenCalledWith({
      farm: mockFarm,
      workbin: mockWorkspace,
      statuses: ['NOT_STARTED'],
    });

    rerender(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    mockLoadData.mockClear();
    jest.advanceTimersByTime(15001);
    // won't load, because still loading.
    expect(mockLoadData).not.toHaveBeenCalled();

    rerender(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    jest.advanceTimersByTime(15001);
    expect(mockLoadData).toHaveBeenCalledWith({
      farm: mockFarm,
      workbin: mockWorkspace,
      statuses: ['NOT_STARTED'],
    });
  });

  it('does not reload when visibility is "hidden"', () => {
    mockUsePageVisibility.mockReturnValue('hidden');

    jest.useFakeTimers();
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    expect(mockLoadData).not.toHaveBeenCalled();

    jest.advanceTimersByTime(15001);
    expect(mockLoadData).not.toHaveBeenCalled();
  });

  it('loads data when farmPath changed', () => {
    const { rerender } = render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);

    const newMockFarm = 'sites/LAX1/farms/LAX1';
    mockLoadData.mockClear();
    rerender(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={newMockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expectMockLoadToHaveBeenCalled(newMockFarm, mockWorkspace);
  });

  it('loads data when workspace changed', () => {
    const { rerender } = render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expectMockLoadToHaveBeenCalled(mockFarm, mockWorkspace);

    const newMockWorkspace = 'TEST-WS';
    mockLoadData.mockClear();
    rerender(
      <CurrentTasks
        workspace={newMockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expectMockLoadToHaveBeenCalled(mockFarm, newMockWorkspace);
  });

  it('loads data when visibility changes to "visible"', () => {
    mockUsePageVisibility.mockReturnValueOnce('hidden').mockReturnValueOnce('visible');

    const { rerender } = render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    expect(mockLoadData).not.toHaveBeenCalled();

    rerender(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );

    expect(mockLoadData).toHaveBeenCalled();
  });

  it('loads all data when search text passed as empty', () => {
    const urgentScheduledTask = mockWorkbinInstanceData
      .filter(x => x.workbinTaskDefinition.priority === 'URGENT')
      .map(function (a) {
        return a.workbinTaskDefinition;
      });
    const shiftScheduledTask = mockWorkbinInstanceData
      .filter(x => x.workbinTaskDefinition.priority === 'SHIFT')
      .map(function (a) {
        return a.workbinTaskDefinition;
      });
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={''}
        searchResultCount={mockSearchResultCount}
      />
    );

    // expect to see urgent scheduled task is in the urgent card tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cardTitle: 'Urgent',
        onTaskCompleted: expect.anything(),
        tasks: expect.arrayContaining([
          expect.objectContaining({
            workbinTaskDefinition: urgentScheduledTask[0],
          }),
        ]),
      }),
      expect.anything()
    );
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cardTitle: 'Regular',
        onTaskCompleted: expect.anything(),
      }),
      expect.anything()
    );
    // expect to see shift scheduled task is in the shift card tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cardTitle: 'Shift',
        onTaskCompleted: expect.anything(),
        tasks: expect.arrayContaining([
          expect.objectContaining({
            workbinTaskDefinition: shiftScheduledTask[0],
          }),
        ]),
      }),
      expect.anything()
    );
    expect(mockSearchResultCount).toHaveBeenLastCalledWith(urgentScheduledTask.length + shiftScheduledTask.length);
  });

  it('loads only urgent task when search text filter is appropriate for it', () => {
    const urgentScheduledTask = mockWorkbinInstanceData
      .filter(x => x.workbinTaskDefinition.priority === 'URGENT')
      .map(function (a) {
        return a.workbinTaskDefinition;
      });

    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={'WorkbinDef_UrgentPri_TestDescription'}
        searchResultCount={mockSearchResultCount}
      />
    );

    // expect to see urgent scheduled task is in the urgent card tasks. Since filter is for urgent tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cardTitle: 'Urgent',
        onTaskCompleted: expect.anything(),
        tasks: expect.arrayContaining([
          expect.objectContaining({
            workbinTaskDefinition: urgentScheduledTask[0],
          }),
        ]),
      }),
      expect.anything()
    );
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cardTitle: 'Regular',
        onTaskCompleted: expect.anything(),
      }),
      expect.anything()
    );
    // expect to NOT see any shift scheduled task is in the shift card tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cardTitle: 'Shift',
        onTaskCompleted: expect.anything(),
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    expect(mockSearchResultCount).toHaveBeenLastCalledWith(urgentScheduledTask.length);
  });

  it('shows matching workbinTaskinstance with given description', () => {
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={'test-description'}
        searchResultCount={mockSearchResultCount}
      />
    );

    // expect to NOT see any urgent scheduled tasks
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cardTitle: 'Urgent',
        onTaskCompleted: expect.anything(),
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    // expect to NOT see any regular scheduled tasks
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cardTitle: 'Regular',
        onTaskCompleted: expect.anything(),
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    // should see one matching task here since searchText matches description
    // in one the workbinInstances
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cardTitle: 'Shift',
        onTaskCompleted: expect.anything(),
        tasks: expect.arrayContaining([
          expect.objectContaining({
            workbinTaskDefinition: mockWorkbinInstanceData[0].workbinTaskDefinition,
            workbinTaskInstance: mockWorkbinInstanceData[0].workbinTaskInstance,
          }),
        ]),
      }),
      expect.anything()
    );
  });

  it('loads none of the tasks when search text filter does not exist for any tasks', () => {
    render(
      <CurrentTasks
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={'Non-existing search text'}
        searchResultCount={mockSearchResultCount}
      />
    );

    // expect to NOT see any urgent scheduled task is in the urgent card tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cardTitle: 'Urgent',
        onTaskCompleted: expect.anything(),
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cardTitle: 'Regular',
        onTaskCompleted: expect.anything(),
      }),
      expect.anything()
    );
    // expect to NOT see any shift scheduled task is in the shift card tasks.
    expect(mockCardItemsTasks).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cardTitle: 'Shift',
        onTaskCompleted: expect.anything(),
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    expect(mockSearchResultCount).toHaveBeenLastCalledWith(0);
  });
});
