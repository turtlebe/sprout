import { WORKSPACE_TASKS_SEARCH_QUERY_PARAM } from '@plentyag/app-production/src/constants';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useQueryParam } from '@plentyag/core/src/hooks/use-query-param';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CommonTasksAndActions, CurrentTasks, WorkbinInstancesTable } from '..';

import { dataTestIdsWorkbinTasks as dataTestIds, WorkbinTasks } from '.';

mockCurrentUser();

const mockSearchResultMatchingCommonAndTasks = 'test1';
const mockSearchResultMatchingCurrentTasks = 'test2';
const mockSearchResultMatchingBoth = 'test3';

jest.mock('../common-tasks-and-actions');
const mockCommonTasksAndActions = CommonTasksAndActions as jest.Mock;
mockCommonTasksAndActions.mockImplementation(({ searchText, searchResultCount }) => {
  React.useEffect(() => {
    searchResultCount(
      searchText === mockSearchResultMatchingCommonAndTasks || searchText === mockSearchResultMatchingBoth ? 1 : 0
    );
  }, [searchText]);
  return <div>mock common task and actions</div>;
});

jest.mock('../current-tasks');
const mockCurrentTasks = CurrentTasks as jest.Mock;
mockCurrentTasks.mockImplementation(({ searchText, searchResultCount }) => {
  React.useEffect(() => {
    searchResultCount(
      searchText === mockSearchResultMatchingCurrentTasks || searchText === mockSearchResultMatchingBoth ? 2 : 0
    );
  }, [searchText]);
  return <div>mock current tasks</div>;
});

jest.mock('../workbin-instances-table');
const mockWorkbinInstancesTable = WorkbinInstancesTable as jest.Mock;
mockWorkbinInstancesTable.mockReturnValue(<div>mock workbin instance table</div>);

jest.mock('@plentyag/core/src/hooks/use-query-param');
const mockUseQueryParam = useQueryParam as jest.Mock;
mockUseQueryParam.mockReturnValue(new URLSearchParams(''));

describe('WorkbinTasks', () => {
  let mockScrollIntoView = jest.fn();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const currentScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterAll(() => {
    window.HTMLElement.prototype.scrollIntoView = currentScrollIntoView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderWorkbinTasks() {
    return render(<WorkbinTasks workspace={'mock-ws'} />);
  }

  it('show no search result card when user has not entered an search text', () => {
    const { queryByTestId } = renderWorkbinTasks();

    expect(queryByTestId(dataTestIds.searchResultMessage)).not.toBeInTheDocument();
  });

  it('shows search result card when user has entered search text and there are matches', async () => {
    const { queryByTestId } = renderWorkbinTasks();

    expect(queryByTestId(dataTestIds.searchResultMessage)).not.toBeInTheDocument();

    async function expectSearchResults(searchText: string) {
      const input = queryByTestId(dataTestIds.searchField).querySelector('input');
      // enter text and expect message search message to show
      await actAndAwait(() => changeTextField(input, searchText));
      expect(queryByTestId(dataTestIds.searchResultMessage)).toHaveTextContent(`Search Results for: ${searchText}`);
      // clear and expect message to disappear
      await actAndAwait(() => changeTextField(input, ''));
      expect(queryByTestId(dataTestIds.searchResultMessage)).not.toBeInTheDocument();
    }

    await expectSearchResults(mockSearchResultMatchingCommonAndTasks);
    await expectSearchResults(mockSearchResultMatchingCurrentTasks);
    await expectSearchResults(mockSearchResultMatchingBoth);
  });

  it('shows search result card when user has entered search text and there are no matches', async () => {
    const { queryByTestId } = renderWorkbinTasks();

    const input = queryByTestId(dataTestIds.searchField).querySelector('input');
    const nonMatchingSearchString = 'non-matching-search';
    await actAndAwait(() => changeTextField(input, nonMatchingSearchString));

    expect(queryByTestId(dataTestIds.searchResultMessage)).toHaveTextContent(
      `No Search Results for: ${nonMatchingSearchString}`
    );
  });

  it('expands accordion when clicking into search field', () => {
    const { queryByTestId } = renderWorkbinTasks();

    const accordion = queryByTestId(dataTestIds.accordionSummary);

    // expanded initially
    expect(accordion).toHaveAttribute('aria-expanded', 'true');

    accordion.click();

    // after click on summary bar should be collapsed
    expect(accordion).toHaveAttribute('aria-expanded', 'false');

    const text = queryByTestId(dataTestIds.searchField);
    text.click();

    // should now be expanded after clicking into search field.
    expect(accordion).toHaveAttribute('aria-expanded', 'true');

    text.click();

    // should still be expanded (not collapsed) when clicking search field again.
    expect(accordion).toHaveAttribute('aria-expanded', 'true');
  });

  it('prefills search text field if query param is set and then scroll this component into view', () => {
    mockUseQueryParam.mockReturnValue(new URLSearchParams(`?${WORKSPACE_TASKS_SEARCH_QUERY_PARAM}=123abc`));

    const { queryByTestId } = renderWorkbinTasks();

    // -- make sure the search input box is prefilled with '123abc' matching the query param
    expect(queryByTestId(dataTestIds.searchField).querySelector('input').value).toEqual('123abc');

    // -- page should scroll down to focus on the workbin tasks
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(queryByTestId(dataTestIds.root).scrollIntoView).toHaveBeenCalled();
  });
});
