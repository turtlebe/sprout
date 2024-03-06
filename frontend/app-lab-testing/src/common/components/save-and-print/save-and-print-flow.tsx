import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SavePrintDialog } from '.';

import { print } from './print';
import { saveLabTests } from './save-lab-tests';

interface SaveAndPrintFlow {
  itemsToSave: LT.CreateItem[];
  isEdit: boolean;
  setModalStatus: (value: React.SetStateAction<SavePrintDialog>) => void;
  done: (saved: boolean) => void;
}

export async function saveAndPrintFlow({ itemsToSave, isEdit, setModalStatus, done }: SaveAndPrintFlow) {
  // save data
  setModalStatus({
    open: true,
    statusTitle: 'Saving Tests',
    status: (
      <>
        <span>Saving...</span>
        <CircularProgress size={15} />
      </>
    ),
    enableClose: false,
    enablePrint: false,
  });

  const saveResult = await saveLabTests(itemsToSave, isEdit);

  if (saveResult.status && saveResult.sampleIds) {
    const sampleIds = saveResult.sampleIds;
    const savedResults: LT.SavedData[] = itemsToSave.map((item, index) => {
      const sampleId = sampleIds[index];
      return { ...item, sampleId };
    });
    const submissionFormData: LT.SubmissionFormData | undefined = saveResult.submissionFormId
      ? {
          metadata: { uuid: saveResult.submissionFormId, date: new Date() },
          labProvider: savedResults[0].labTestProvider,
        }
      : undefined;
    // save success
    setModalStatus({
      open: true,
      statusTitle: 'Tests Saved',
      status: <p>Tests successfully saved. Press Close to view the results page.</p>,
      enableClose: true,
      enablePrint: true,
      submissionFormData,
      onPrint: () => {
        print({ data: savedResults, setModalStatus, done, submissionFormData });
      },
      onClose: () => {
        // navigate back to results page.
        done(true);
      },
    });
  } else {
    // save failed.
    const errors = saveResult.errors ? saveResult.errors.map((error, index) => <p key={index}>{error}</p>) : [];
    setModalStatus({
      open: true,
      statusTitle: 'Tests Not Saved',
      status: (
        <>
          {errors}
          <p>Please fix errors and try again or contact FarmOS support for help.</p>
        </>
      ),
      enableClose: true,
      enablePrint: false,
      onClose: () => {
        setModalStatus({ open: false });
        done(false);
      },
    });
  }
}
