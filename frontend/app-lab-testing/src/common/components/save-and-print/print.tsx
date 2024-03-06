import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SavePrintDialog } from '.';

import { printLabTests } from './print-lab-tests';

/**
 * Presents user with a modal displaying generating print out status and then automatically
 * opens print out in a new tab when complete. If failed, allows user to retry or abort.
 * @param data Data to print out.
 * @param setModalStatus Function to update the status modal with current printing status.
 * @param done Function is called when print flow is complete (or aborted).
 * @param submissionFormData: data to show when user hits download button - see SD-7342.
 */
export function print({
  data,
  setModalStatus,
  done,
  submissionFormData,
}: {
  data: LT.PrintData[];
  setModalStatus: (value: React.SetStateAction<SavePrintDialog>) => void;
  done: (closeCreate: boolean) => void;
  submissionFormData?: LT.SubmissionFormData;
}) {
  setModalStatus({
    open: true,
    statusTitle: 'Generating Print out',
    status: (
      <>
        <span>Generating print out...</span>
        <CircularProgress size={15} />
      </>
    ),
    enableClose: false,
    enablePrint: false,
  });

  function handleError(
    error: string,
    setModalStatus: (value: React.SetStateAction<SavePrintDialog>) => void,
    done: (closeCreate: boolean) => void
  ) {
    setModalStatus({
      open: true,
      statusTitle: 'Generating PDF Failed',
      status: (
        <>
          <p>Error: {error}</p>
          <p>Press Print to try again or Close to abort.</p>
        </>
      ),
      enableClose: true,
      enablePrint: true,
      submissionFormData,
      onClose: () => {
        // navigate back to results page.
        done(true);
      },
      onPrint: () => {
        print({ data, setModalStatus, done, submissionFormData });
      },
    });
  }

  function handleResults(
    result: { status: boolean; error?: string },
    setModalStatus: (value: React.SetStateAction<SavePrintDialog>) => void,
    done: (closeCreate: boolean) => void
  ) {
    if (result.status) {
      setModalStatus({
        open: true,
        statusTitle: 'Success generating print out',
        status: (
          <>
            <p>PDF should open in a new browser tab.</p>
            <p>Press Print to do again or Close to view the results page.</p>
          </>
        ),
        enableClose: true,
        enablePrint: true,
        submissionFormData,
        onClose: () => {
          done(true);
        },
        onPrint: () => {
          print({ data, setModalStatus, done, submissionFormData });
        },
      });
    } else {
      handleError(result.error || 'Error generating PDF.', setModalStatus, done);
    }
  }

  printLabTests(data)
    .then(results => handleResults(results, setModalStatus, done))
    .catch(err => handleError(err, setModalStatus, done));
}
