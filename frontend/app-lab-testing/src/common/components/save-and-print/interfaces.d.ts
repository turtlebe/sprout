// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace LT {
  // Data after saving/submitting.
  interface SavedData extends CreateItem {
    // saved data returns unique sampleId for each item
    sampleId: string;
  }

  interface SaveDetails {
    index: number;
    lab_test_sample_id: string;
    lab_test_submission_form_id: string;
  }
  interface SaveResult {
    success: string;
    details: SaveDetails[];
  }

  interface SaveError {
    err_code: string; // error code: 400, 500, etc.
    message: {
      error: string;
      details?: SaveErrorDetail[];
    };
  }

  // Gives error for individual row.
  interface SaveErrorDetail {
    index: number; // index of errored field (starting at 1)
    error: string | FieldError;
  }

  // Error for particular field (e.g., sample_type).
  interface FieldError {
    [fieldName: string]: [string]; // error message is in array of length 1.
  }

  // data for printing labels.
  // printing only needs a subset of saved data.
  type PrintData = Pick<
    SavedData,
    | 'sampleId'
    | 'sampleDate'
    | 'sampleTime'
    | 'sampleType'
    | 'labelDetails'
    | 'location'
    | 'lotCodes'
    | 'trialIds'
    | 'treatmentIds'
  >;

  interface SubmissionFormData {
    metadata: { uuid: string; date: Date };
    labProvider: string;
  }
}
