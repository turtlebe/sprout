import { Show } from '@plentyag/brand-ui/src/components';
import { Button, LinearProgress, Link, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import { useGoToPath } from '@plentyag/core/src/hooks/use-go-to-path';
import { isKeyPressed } from '@plentyag/core/src/utils';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { SavePrintDialog, useSavePrintDialog } from '../common/components/save-and-print';
import { useLabTestTypes } from '../common/hooks/use-lab-test-types';
import { shouldShowColumn } from '../common/utils/should-show-column';

import { RowComponentWrapper } from './row-component-wrapper';
import { useStyles } from './styles';
import { TableHeader } from './table-header';
import { filterHiddenColumns } from './utils/filter-hidden-columns';
import { getId } from './utils/get-id';
import { getInitialValues } from './utils/get-initial-values';
import { HideFormFill } from './utils/hide-form-fill';
import { validateForm } from './utils/validate-form';
import { useWarningDialog, WarningDialog } from './warning-dialog';

const dataTestIds = {
  title: 'create-view-title',
  addRowButton: 'create-view-add-row-button',
};
export { dataTestIds as dataTestIdsCreateView };

/**
 * Stop enter key from causing submit.
 * @param keyEvent Event trigged on key press
 */
function handleKeyDown(keyEvent) {
  const { isEnterPressed } = isKeyPressed(keyEvent);
  if (isEnterPressed) {
    keyEvent.preventDefault();
  }
}

export const CreatePage = () => {
  const classes = useStyles({});

  const { setIsGoToAllowed, goToPath } = useGoToPath();

  const tableHeaderWrapper = React.useRef<HTMLDivElement>(null);

  const location = useLocation<LT.ReactRouterLocationState>();

  const state = useCoreStore()[0];

  const fieldsWithWarnings = React.useRef<Set<string>>(new Set());

  function handleHortScroll(event: any) {
    // keep header scroll in sync with table body.
    if (tableHeaderWrapper.current) {
      tableHeaderWrapper.current.scrollLeft = event.target.scrollLeft;
    }
  }

  const initialSelectedRows: LT.SampleResult[] | undefined = location?.state?.selectedRows;
  const isEdit = location?.state?.isEdit || false;

  const { savePrintDialogStatus, save } = useSavePrintDialog();
  const { warningDialogStatus, checkWarning } = useWarningDialog();

  const { labTestTypes, labTestTypesLoadingError, isLoadingLabTestTypes } = useLabTestTypes();

  const loadingError = labTestTypesLoadingError;
  const isLoading = isLoadingLabTestTypes;
  const username = state.currentUser?.username;

  function setWarning(fieldName: string, hasWarning: boolean) {
    if (hasWarning) {
      fieldsWithWarnings.current.add(fieldName);
    } else {
      fieldsWithWarnings.current.delete(fieldName);
    }
  }

  let bodyContent;
  if (loadingError) {
    bodyContent = (
      <Typography color={'error'} className={classes.bodyMessage}>
        {'Data fetch failed: ' + loadingError.toString()}
      </Typography>
    );
  } else if (labTestTypes && labTestTypes.length && username) {
    const { initialValues, initialValue } = getInitialValues({ username, labTestTypes, initialSelectedRows, isEdit });
    const initialItems: LT.CreateSchema = {
      items: initialValues,
    };
    bodyContent = (
      <React.Fragment>
        <Formik
          validateOnChange={true}
          validateOnBlur={false}
          validateOnMount={false}
          initialValues={initialItems}
          validate={values => validateForm(values, labTestTypes)}
          onSubmit={async (values, actions) => {
            const dialogResult = await checkWarning(!!fieldsWithWarnings.current.size);
            if (dialogResult === 'fix-warning') {
              return;
            }
            const saveResult = await save(values.items, isEdit);
            actions.setSubmitting(false);
            if (saveResult === 'saved') {
              setIsGoToAllowed(true);
              goToPath('/lab-testing');
            }
          }}
        >
          {({ handleSubmit, setValues, dirty, values, setFieldValue }) => {
            setIsGoToAllowed(!dirty);

            const hiddenColumns: LT.HiddenColumns = {};
            const sampleTypes = values.items.map(item => item.sampleType);
            const labTestProvider = values.items[0].labTestProvider;
            Object.keys(initialValue).forEach(key => {
              hiddenColumns[key] = !shouldShowColumn(key as LT.CreateCols, sampleTypes, labTestProvider);
            });

            function onSubmit(e) {
              setValues(filterHiddenColumns(values, hiddenColumns), false);
              handleSubmit(e);
            }
            return (
              <Form onKeyDown={handleKeyDown} onSubmit={onSubmit} className={classes.form}>
                <HideFormFill />
                <FieldArray
                  name="items"
                  validateOnChange={
                    true
                  } /* Determines if form validation should or should not be run after any array manipulations */
                  render={arrayHelpers => (
                    <>
                      <TableHeader hiddenColumns={hiddenColumns} ref={tableHeaderWrapper} />
                      <div onScroll={handleHortScroll} className={classes.scroller}>
                        {values?.items?.length > 0 &&
                          values.items.map((item, index) => {
                            const rowData = {
                              index,
                              item,
                              labTestTypes,
                              setFieldValue,
                              setWarning,
                              hiddenColumns,
                            };
                            return (
                              <RowComponentWrapper
                                arrayHelpers={arrayHelpers}
                                totalItems={values.items.length}
                                key={item.id}
                                rowData={rowData}
                                isEdit={isEdit}
                              />
                            );
                          })}
                      </div>
                      <div className={classes.buttonContainer}>
                        <Show when={!isEdit}>
                          <Button
                            data-testid={dataTestIds.addRowButton}
                            variant="contained"
                            onClick={() => {
                              const dupItem = { ...initialValue };
                              dupItem.id = getId();
                              arrayHelpers.push(dupItem);
                            }}
                          >
                            Add Row
                          </Button>
                        </Show>
                        <Button className={classes.submitButton} type="submit" variant="contained" color="primary">
                          Submit
                        </Button>
                      </div>
                    </>
                  )}
                />
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  } else if (!isLoading) {
    bodyContent = (
      <Typography color={'primary'} className={classes.bodyMessage} variant="h6">
        No Lab Type Data from Server
      </Typography>
    );
  }

  const header = (
    <div className={classes.header}>
      <Typography data-testid={dataTestIds.title} variant="h5" className={classes.title}>
        {isEdit ? 'Edit' : 'Create'} Lab Tests
      </Typography>
      <div className={classes.resultsButtonContainer}>
        <Link component={RouterLink} to="/lab-testing" underline="none">
          <Button variant="contained">Back to Results</Button>
        </Link>
      </div>
    </div>
  );

  const body = <div className={classes.body}>{bodyContent}</div>;

  return (
    <div className={classes.root}>
      {<LinearProgress className={classes.progress} style={{ visibility: isLoading ? 'visible' : 'hidden' }} />}
      {header}
      {body}
      <SavePrintDialog {...savePrintDialogStatus} />
      <WarningDialog {...warningDialogStatus} />
    </div>
  );
};
