import { Box, Button, Divider } from '@plentyag/brand-ui/src/material-ui/core';

import { SearchForm } from './search/search-form';
import { SearchResults } from './search/search-results';
import { TrialInfoView } from './search/trial-info-table-view';
import { useStyles } from './styles';
import { usePerceptionState } from './use-perception-state';

const dataTestIds = {
  root: 'perception-root',
  leftNav: 'perception-left-nav',
  rightNav: 'perception-right-nav',
  searchResult: 'perception-search-result',
  dashboard: 'perception-dashboard',
  images: 'perception-images',
  trials: 'perception-trials',
};

export { dataTestIds as dataTestIdsSearchPage };

export const SearchPage: React.FC = () => {
  const classes = useStyles({});
  const {
    results,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    currentView,
    setCurrentView,
    searchFields,
    setSearchFields,
  } = usePerceptionState();

  return (
    <div data-testid={dataTestIds.root} className={classes.root}>
      {['grid', 'labeling', 'gallery'].includes(currentView) && (
        <div data-testid={dataTestIds.searchResult} className={classes.results}>
          <SearchResults
            results={results}
            loading={loading}
            error={error}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      )}
      {currentView === 'grid' && (
        <div data-testid={dataTestIds.rightNav} className={classes.form}>
          <Divider orientation="vertical" />
          <Box flexGrow={1}>
            <Button data-testid={dataTestIds.trials} onClick={() => setCurrentView('trials')}>
              Trials
            </Button>
            <Divider orientation="horizontal" />
            <SearchForm searchFields={searchFields} setSearchFields={setSearchFields} setCurrentPage={setCurrentPage} />
          </Box>
        </div>
      )}
      {currentView === 'trials' && <TrialInfoView results={results} onBackToSearch={() => setCurrentView('grid')} />}
    </div>
  );
};
