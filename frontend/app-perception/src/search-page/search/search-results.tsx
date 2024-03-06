import { ArrowBack, GetApp, NavigateBefore, NavigateNext, ZoomIn } from '@material-ui/icons';
import { addTagToObject } from '@plentyag/app-perception/src/api/add-tag-to-object';
import { useHasEditPermission } from '@plentyag/app-perception/src/api/use-has-edit-permission';
import { FormRenderer } from '@plentyag/brand-ui/src/components/form-gen';
import {
  CircularProgress,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  makeStyles,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { isKeyPressed } from '@plentyag/core/src/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ObjectTag, SearchResult } from '../../common/types/interfaces';
import { ImageLabeling } from '../labeling';

import { DetailsView } from './details-view';
import { TrialInfoView } from './trial-info-table-view';
import { downloadResult } from './utils/download';

const imageSize = 300;
const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  resultsHeader: {
    width: '100%',
    margin: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultsControlPanel: {
    display: 'flex',
    flexDirection: 'row',
  },
  resultsPaging: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  results: {
    flex: '1',
    overflow: 'auto',
  },
  gridLayout: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  gridTile: {
    maxWidth: imageSize,
    marginTop: '20px',
  },
  selectedGridTile: {
    maxWidth: imageSize,
    marginTop: '20px',
    outlineWidth: '5px',
    outlineStyle: 'solid',
    outlineColor: 'rgba(33, 150, 243, 0.55)',
  },
  galleryLayout: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  galleryImageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    minWidth: '0px',
    minHeight: '0px',
    overflow: 'auto',
    objectFit: 'contain',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  galleryControl: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  details: {
    width: '100%',
    height: '20%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'row',
  },
  labelingView: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  labelingHeader: {
    width: '100%',
    margin: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelingControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelingCount: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLayout: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    maxHeight: imageSize,
    maxWidth: imageSize,
  },
  detailsIcon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  backIcon: {
    top: '0',
    left: '0',
    color: 'rgba(0, 0, 0, 0.75)',
  },
  arrowIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  arrowIcon: {
    color: 'rgba(0, 0, 0, 0.75)',
  },
  dataDownload: {
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addTag: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagForm: {
    flexDirection: 'row',
    width: '200px',
    alignItems: 'center',
  },
  addTagFormInput: {
    marginBottom: '0',
  },
});

interface SearchResults {
  results: SearchResult[];
  loading: boolean;
  error: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const SearchResults: React.FC<SearchResults> = ({
  results,
  loading,
  error,
  currentPage,
  setCurrentPage,
  totalPages,
  currentView,
  setCurrentView,
}) => {
  const classes = useStyles({});
  const [currentResult, setCurrentResult] = useState<SearchResult>(null);
  const hasEditPermission = useHasEditPermission();
  // use as any until https://github.com/jaredpalmer/formik/issues/2290
  const addTagRef = useRef(null) as any;

  let currentLayout: any;

  /**
   * When users move back to grid layout, scroll the current result into view
   */
  useEffect(() => {
    if (currentView === 'grid' && currentResult) {
      const currentResultTile = document.getElementById(currentResult.uuid);
      var rect = currentResultTile?.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        currentResultTile?.scrollIntoView(false);
      }
      if (rect.top < 0) {
        currentResultTile?.scrollIntoView(true);
      }
    }
  }, [currentView]);

  /**
   * Set the current result using the react hook so the detail view will be populated
   * with the data for the current result
   *
   * @param result
   */
  const showDetails = (result: SearchResult) => {
    setCurrentResult(result);
  };

  /**
   * Switch to the gallery view when the user selects the zoom in button
   * Also ser the current result using the react hook so the detail view
   * will be populated with the data for the current result
   *
   * @param result
   */
  const showGalleryView = (result: SearchResult) => {
    setCurrentResult(result);
    setCurrentView('gallery');
  };

  /**
   * Switch back to grid view when th user selects the back button
   */
  const showGridView = () => {
    setCurrentView('grid');
  };

  /**
   * Switch to image labeling view
   */
  const showLabelingView = () => {
    setCurrentView('labeling');
  };

  /**
   * Move galley view to the next result
   */
  const nextResult = () => {
    setCurrentResult(results[results.findIndex(res => res.uuid === currentResult.uuid) + 1]);
  };

  /**
   * Move galley view to the previous result
   */
  const prevResult = () => {
    setCurrentResult(results[results.findIndex(res => res.uuid === currentResult.uuid) - 1]);
  };

  /**
   * Update the current result with the added tag
   *
   * @param tag tag to add to the current result
   */
  const addTagToCurrentResult = (tag: ObjectTag) => {
    const updatedResult = results[results.findIndex(res => res.uuid === currentResult.uuid)];
    updatedResult.objectTags = [...currentResult.objectTags, tag];
    setCurrentResult({ ...currentResult, ...updatedResult });
  };

  /**
   * Add the tag to the current object
   */
  const addTag: FormRenderer['onSubmit'] = async ({ ...values }) => {
    const tag = values.addTag;
    // TODO: change to use formgen reset when SD-5163 is complete
    addTagRef?.current?.resetForm();
    const tagResult = await addTagToObject(currentResult.uuid, tag);
    const success = 200;
    if (tagResult.data && tagResult.status === success) {
      addTagToCurrentResult(tagResult.data.data[0]);
      return { message: `Tag ${tag} created successfully` };
    }
    return { message: `Error creating ${tag}: ${tagResult.statusText}` };
  };

  /**
   * keyboard shortcuts for search results
   *
   * @param keyEvent Event trigged on key press
   */
  const onKeyDown = keyEvent => {
    const { isArrowLeftPressed, isArrowRightPressed, isMinusPressed, isEqualsPressed } = isKeyPressed(keyEvent);

    if (isArrowLeftPressed && results?.findIndex(res => res.uuid === currentResult?.uuid) !== 0) {
      prevResult();
    }

    if (isArrowRightPressed && results?.findIndex(res => res.uuid === currentResult?.uuid) !== results?.length - 1) {
      nextResult();
    }

    if (isMinusPressed && currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }

    if (isEqualsPressed && currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const addTagForm = (
    <FormRenderer
      initialValues={{}}
      classes={{ form: classes.addTagForm, input: classes.addTagFormInput }}
      formId={'AddTag'}
      onSubmit={addTag}
      innerRef={addTagRef}
      formGenConfig={{
        fields: [
          {
            type: 'TextField',
            name: 'addTag',
            label: 'Add Tag',
          },
        ],
      }}
    />
  );

  const resultsHeader = (
    <div className={classes.resultsHeader}>
      <div className={classes.resultsControlPanel}>
        {totalPages > 1 && (
          <div className={classes.resultsPaging}>
            <IconButton
              icon={NavigateBefore}
              className={classes.arrowIcon}
              size={'small'}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <Typography variant={'body2'}>
              page {currentPage} of {totalPages}
            </Typography>
            <IconButton
              icon={NavigateNext}
              className={classes.arrowIcon}
              size={'small'}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );

  const detailView = (
    <div className={classes.details}>
      <DetailsView result={currentResult} showLabelingView={showLabelingView} />
    </div>
  );

  const gridLayout = (
    <React.Fragment>
      {resultsHeader}
      <div className={classes.results}>
        <ImageList id="imageGrid" className={classes.gridLayout}>
          {results &&
            results.map(result => (
              <ImageListItem
                id={result.uuid}
                key={result.uuid}
                className={currentResult?.uuid === result.uuid ? classes.selectedGridTile : classes.gridTile}
                onClick={() => showDetails(result)}
              >
                <img src={result.s3Url} alt={result.dtUtc} />
                <ImageListItemBar
                  title={<span>Date: {result.dtUtc}</span>}
                  subtitle={
                    <span>
                      Site: {result.site} Area: {result.area} Line: {result.line}
                    </span>
                  }
                  actionIcon={
                    <IconButton
                      icon={ZoomIn}
                      autoFocus={currentResult?.uuid === result.uuid}
                      className={classes.detailsIcon}
                      onClick={() => showGalleryView(result)}
                    />
                  }
                />
              </ImageListItem>
            ))}
        </ImageList>
      </div>
      <Divider orientation="horizontal" />
      {detailView}
    </React.Fragment>
  );

  const galleryLayout = (
    <React.Fragment>
      <div className={classes.results}>
        <div className={classes.galleryLayout}>
          <div className={classes.backIcon}>
            <IconButton icon={ArrowBack} onClick={() => showGridView()} />
          </div>
          <div className={classes.galleryControl}>
            <div className={classes.arrowIconContainer}>
              <IconButton
                icon={NavigateBefore}
                className={classes.arrowIcon}
                disabled={results?.findIndex(res => res.uuid === currentResult?.uuid) === 0}
                onClick={prevResult}
              />
            </div>
            <div className={classes.galleryImageContainer}>
              {currentResult && (
                <img src={currentResult.s3Url} alt={currentResult.dtUtc} className={classes.galleryImage} />
              )}
              {hasEditPermission && <div className={classes.addTag}>{addTagForm}</div>}
            </div>
            <div className={classes.arrowIconContainer}>
              <IconButton
                icon={NavigateNext}
                autoFocus={true}
                className={classes.arrowIcon}
                disabled={results?.findIndex(res => res.uuid === currentResult?.uuid) === results?.length - 1}
                onClick={nextResult}
              />
            </div>
          </div>
          <div className={classes.dataDownload}>
            <Typography variant={'body2'}>Download</Typography>
            <IconButton icon={GetApp} onClick={() => downloadResult(currentResult)} />
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" />
      {detailView}
    </React.Fragment>
  );

  const trialInfoLayout = <TrialInfoView results={results} onBackToSearch={() => setCurrentView('grid')} />;

  const labelLayout = (
    <React.Fragment>
      <div className={classes.labelingHeader}>
        <div className={classes.backIcon}>
          <IconButton icon={ArrowBack} onClick={() => showGridView()} />
        </div>
        <div className={classes.labelingControl}>
          <div className={classes.arrowIconContainer}>
            <IconButton
              icon={NavigateBefore}
              className={classes.arrowIcon}
              disabled={results?.findIndex(res => res.uuid === currentResult?.uuid) === 0}
              onClick={prevResult}
            />
          </div>
          <div className={classes.labelingCount}>
            {results?.findIndex(res => res.uuid === currentResult?.uuid) + 1} of {results?.length}
          </div>
          <div className={classes.arrowIconContainer}>
            <IconButton
              icon={NavigateNext}
              autoFocus={true}
              className={classes.arrowIcon}
              disabled={results?.findIndex(res => res.uuid === currentResult?.uuid) === results?.length - 1}
              onClick={nextResult}
            />
          </div>
        </div>
      </div>
      <ImageLabeling currentPerceptionObject={currentResult} />
    </React.Fragment>
  );

  if (loading) {
    currentLayout = (
      <div className={classes.emptyLayout}>
        <CircularProgress className={classes.emptyLayout} />
      </div>
    );
    if (currentResult) {
      setCurrentResult(null);
    }
  } else if (error) {
    currentLayout = (
      <div className={classes.emptyLayout}>
        <Typography variant={'h5'}>Error: {error}</Typography>
      </div>
    );
    if (currentResult) {
      setCurrentResult(null);
    }
  } else if (results) {
    if (results.length === 0) {
      currentLayout = (
        <div className={classes.emptyLayout}>
          <Typography variant={'h5'}>No search results found, try expanding search criteria</Typography>
        </div>
      );
      if (currentResult) {
        setCurrentResult(null);
      }
    } else {
      if (!currentResult) {
        setCurrentResult(results[0]);
      }
      if (currentView === 'gallery') {
        currentLayout = galleryLayout;
      } else if (currentView === 'labeling') {
        currentLayout = labelLayout;
      } else if (currentView === 'trials') {
        currentLayout = trialInfoLayout;
      } else {
        currentLayout = gridLayout;
      }
    }
  } else {
    currentLayout = (
      <div className={classes.emptyLayout}>
        <Typography variant={'h5'}>Search for perception images</Typography>
      </div>
    );
  }

  return (
    <div className={classes.root} onKeyDown={onKeyDown}>
      {currentLayout}
    </div>
  );
};
