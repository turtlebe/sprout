import { isCommentable } from '@plentyag/app-production/src/common/utils';
import { OpenCloseToggle } from '@plentyag/brand-ui/src/components/open-close-toggle';
import { TabPanel } from '@plentyag/brand-ui/src/components/tab-panel';
import { Box, Collapse, Divider, LinearProgress, Tab, Tabs } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useUnmount } from 'react-use';

import { useAppPaths } from '../common/hooks';

import { Comments } from './components/comments';
import { Genealogy } from './components/genealogy';
import { Header } from './components/header';
import { History } from './components/history';
import { ResourceInfo } from './components/resource-info';
import { Search } from './components/search';
import { SearchRefreshButton } from './components/search-refresh-button';
import { SearchActions, SearchState, useResetTabWhenNoHistory, useSearch, useSearchQueryParameter } from './hooks';
import { useStyles } from './styles';
import { hasContainerOrMaterial } from './utils/hasContainerOrMaterial';

export const dataTestIds = {
  info: 'info',
  genealogy: 'genealogy',
  materialHistory: 'material-history',
  containerHistory: 'container-history',
  materialComments: 'material-comments',
};

interface ResourcesUrlParams {
  tab: string;
}

export const ResourcesPage: React.FC<RouteComponentProps<ResourcesUrlParams>> = props => {
  const { tab: initialTab } = props.match.params;
  const [tab, setTab] = React.useState(initialTab || 'info');

  const { resourcesPageBasePath } = useAppPaths();

  const [{ isSearching, searchResult }, { refreshSearch, resetSearch }] = useSearch<
    Pick<SearchState, 'isSearching' | 'searchResult'>,
    SearchActions
  >(state => ({
    isSearching: state.isSearching,
    searchResult: state.searchResult,
  }));

  useResetTabWhenNoHistory({ searchResult, currTab: tab, setTab });

  useUnmount(() => {
    resetSearch();
  });

  useSearchQueryParameter();

  const classes = useStyles({ isLoading: isSearching });

  const [isCollapsed, setCollapsed] = React.useState<boolean>(false);

  function handleTabChange(event: React.ChangeEvent<{}>, value: any) {
    setTab(value);
    refreshSearch();
  }

  const { hasContainer, hasMaterial } = hasContainerOrMaterial(searchResult);
  const hasComments = isCommentable(searchResult);

  return (
    <>
      {props.match.params.tab !== tab && <Redirect to={`${resourcesPageBasePath}/${tab}${props.location.search}`} />}
      <LinearProgress className={classes.linearProgress} />

      <Box className={classes.container}>
        <Box className={classes.stickyContainer}>
          <Collapse in={!isCollapsed}>
            <Box display="flex" m={4}>
              <Search />
              <SearchRefreshButton />
            </Box>

            {searchResult && (
              <Box m={4} mt={0} mb={2}>
                <Header
                  onCommentClick={hasComments ? () => handleTabChange(null, dataTestIds.materialComments) : undefined}
                />
              </Box>
            )}
          </Collapse>

          {searchResult && (
            <Box display="flex" ml={4} mr={4}>
              <Tabs
                classes={{ flexContainer: classes.tabsFlexContainer }}
                className={classes.tabsContainer}
                value={tab}
                onChange={handleTabChange}
              >
                <Tab
                  classes={{ wrapped: classes.tabWrapped }}
                  data-testid={dataTestIds.info}
                  value={dataTestIds.info}
                  wrapped={true}
                  label="Information"
                />
                <Tab
                  classes={{ wrapped: classes.tabWrapped }}
                  data-testid={dataTestIds.genealogy}
                  value={dataTestIds.genealogy}
                  wrapped={true}
                  label="Genealogy"
                />
                {hasMaterial && (
                  <Tab
                    classes={{ wrapped: classes.tabWrapped }}
                    data-testid={dataTestIds.materialHistory}
                    value={dataTestIds.materialHistory}
                    wrapped={true}
                    label="Material History"
                  />
                )}
                {hasComments && (
                  <Tab
                    classes={{ wrapped: classes.tabWrapped }}
                    data-testid={dataTestIds.materialComments}
                    value={dataTestIds.materialComments}
                    wrapped={true}
                    label="Material Comments"
                  />
                )}
                {hasContainer && (
                  <Tab
                    classes={{ wrapped: classes.tabWrapped }}
                    data-testid={dataTestIds.containerHistory}
                    value={dataTestIds.containerHistory}
                    wrapped={true}
                    label="Container History"
                  />
                )}
              </Tabs>
              <OpenCloseToggle
                className={classes.openCloseToggle}
                orientation="horizontal"
                onToggle={() => setCollapsed(!isCollapsed)}
                open={isCollapsed}
              />
            </Box>
          )}
          <Divider />
        </Box>

        {searchResult && (
          <Box className={classes.tabPanelContainer}>
            <TabPanel className={classes.tabPanel} value={tab} index={dataTestIds.info}>
              <ResourceInfo />
            </TabPanel>
            {tab === 'genealogy' && (
              <TabPanel className={classes.tabPanel} value={tab} index={dataTestIds.genealogy}>
                <Genealogy />
              </TabPanel>
            )}
            <TabPanel className={classes.tabPanel} value={tab} index={dataTestIds.materialHistory}>
              <History historyType="material" />
            </TabPanel>
            <TabPanel className={classes.tabPanel} value={tab} index={dataTestIds.materialComments}>
              <Comments />
            </TabPanel>
            <TabPanel className={classes.tabPanel} value={tab} index={dataTestIds.containerHistory}>
              <History historyType="container" />
            </TabPanel>
          </Box>
        )}
      </Box>
    </>
  );
};
