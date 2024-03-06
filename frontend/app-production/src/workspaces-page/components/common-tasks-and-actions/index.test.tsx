import { render } from '@testing-library/react';
import React from 'react';

import { useLoadWorkbinTaskDefinitions } from '../../../common/hooks';
import { mockWorkbinTaskDefinitionData } from '../../test-helpers';
import { CardItemTasks } from '../card-item-tasks';

import { CommonTasksAndActions } from '.';

const mockLoadData = jest.fn();

jest.mock('../../../common/hooks/use-load-workbin-task-definitions');
const mockUseLoadWorkbinTaskDefinitions = useLoadWorkbinTaskDefinitions as jest.Mock;
mockUseLoadWorkbinTaskDefinitions.mockReturnValue({
  loadData: mockLoadData,
  isLoading: false,
  workbinTaskDefinitions: mockWorkbinTaskDefinitionData,
});

jest.mock('../card-item-tasks');
const mockCardItemsTasks = CardItemTasks as jest.Mock;
mockCardItemsTasks.mockImplementation(({ tasks }: { tasks: CardItemTasks['tasks'] }) => {
  return <div>mock card item tasks: {tasks.length}</div>;
});

const mockFarm = 'sites/SSF2/farms/Tigris';
const mockWorkspace = 'Grower';
const mockSearchText = 'TEST';
const mockSearchResultCount = jest.fn();

describe('CommonTasksAndActions', () => {
  beforeEach(() => {
    mockLoadData.mockClear();
    mockSearchResultCount.mockClear();
  });

  it('loads data when both workspace and farmpath are provided', () => {
    const mockSearchResultCount = jest.fn();
    render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).toHaveBeenCalled();
  });

  it('renders list of unscheduled tasks', () => {
    const unscheduledTasks = [{ workbinTaskDefinition: mockWorkbinTaskDefinitionData[1] }];
    render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={''}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockCardItemsTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: unscheduledTasks,
      }),
      expect.anything()
    );
  });

  it('reloads data when workspace changes', () => {
    const { rerender } = render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).toHaveBeenCalled();
    mockLoadData.mockClear();
    // no changes
    rerender(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).not.toHaveBeenCalled();
    // change workspace
    rerender(
      <CommonTasksAndActions
        workspace={'PostHarvestOperator'}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).toHaveBeenCalled();
  });

  it('reloads data when farmpath changes', () => {
    const { rerender } = render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).toHaveBeenCalled();
    mockLoadData.mockClear();
    // no changes
    rerender(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).not.toHaveBeenCalled();
    // change farmPath
    rerender(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={'/sites/LAX1/farms/LAX1'}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockLoadData).toHaveBeenCalled();
  });

  it('renders list of unscheduled tasks with existing search text', () => {
    const unscheduledTasks = [{ workbinTaskDefinition: mockWorkbinTaskDefinitionData[1] }];
    render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={mockSearchText}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockCardItemsTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: unscheduledTasks,
      }),
      expect.anything()
    );
    expect(mockSearchResultCount).toHaveBeenLastCalledWith(unscheduledTasks.length);
  });

  it('renders empty list of unscheduled tasks with non-existing search text', () => {
    render(
      <CommonTasksAndActions
        workspace={mockWorkspace}
        farmPath={mockFarm}
        searchText={'NON-EXISTING-TEXT'}
        searchResultCount={mockSearchResultCount}
      />
    );
    expect(mockCardItemsTasks).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: expect.not.arrayContaining([expect.anything()]),
      }),
      expect.anything()
    );
    expect(mockSearchResultCount).toHaveBeenLastCalledWith(0);
  });
});
