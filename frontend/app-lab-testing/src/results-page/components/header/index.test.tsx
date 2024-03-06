import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { cloneDeep } from 'lodash';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';

import { print } from '../../../common/components/save-and-print/print';
import { DumpRefillStatus, HealthStatus } from '../../../common/types/interface-types';

import { Header, headerTestIds, MAX_PRINT_ROWS } from '.';

import { deleteFlow } from './delete/delete-flow';

jest.mock('./delete/delete-flow');
jest.mock('../../../common/components/save-and-print/print');

const mockDeleteFlow = deleteFlow as jest.Mock;
const mockPrint = print as jest.Mock;

jest.mock('../filtered-columns', () => {
  const fakeFilteredColumns = () => {
    return null;
  };
  return { FilteredColumns: fakeFilteredColumns };
});

const mockLabTestTypes: LT.LabTestType[] = [
  {
    createdAt: '2020-04-01T21:50:33Z',
    createdByUsername: 'test_user',
    labTestKind: 'Human Pathogen',
    labTestName: 'IEH_Human Pathogen',
    labTestProvider: 'IEH',
    labTestTypeId: '73789208-5449-4504-a20f-8917c8c6b25c',
    schemaSubmissionFormBySampleType: new Map(), // not needed in testing here.
    schemaResultsAndThreholdsBySampleType: new Map(), // not needed in testing here.
    updatedAt: '2020-04-01T21:51:01Z',
    updatedByUsername: 'test_user',
    allowDifferentSampleTypeCreation: false,
  },
];

const sampleResult1: LT.SampleResult = {
  labTestEvents: [],
  labTestKind: 'Human Pathogen',
  labTestPassed: true,
  labTestProvider: 'IEH',
  labTestResults: new Map(),
  info: {
    sampleDate: '2020-06-01',
    sampleTime: '11:00 AM',
    sampleType: 'some-sample-type',
    labelDetails: 'some-lab-details',
    farmDefPath: '/farm-def',
    farmDefId: 'xyz',
    lotCodes: [],
    notes: '',
    predictedHarvestDates: [],
    productCodes: [],
    subLocation: '',
    trialIds: [],
    treatmentIds: [],
    healthStatus: HealthStatus.Healthy,
    materialLot: '',
    containerId: '',
    nutrientStage: '1',
    dumpRefillStatus: DumpRefillStatus.pre,
    providerSampleId: '',
  },
  labTestSampleId: '123',
};

describe('Header', () => {
  const mockTableApi: any = {
    refreshCache: jest.fn(),
    clearSelection: jest.fn(),
  };
  beforeEach(() => {
    mockDeleteFlow.mockImplementation((rows, _status, callback) => {
      callback();
    });
  });
  afterEach(() => {
    mockDeleteFlow.mockReset();
    mockPrint.mockReset();
    mockTableApi.refreshCache.mockReset();
    mockTableApi.clearSelection.mockReset();
  });
  describe('delete tests', () => {
    function createHeader(canCreateTests: boolean, selectedRows: LT.SampleResult[]) {
      const header = render(
        <Header
          hasCrudPermissions={canCreateTests}
          selectedRows={selectedRows}
          tableApi={mockTableApi}
          snackbarProps={{}}
        />,
        {
          wrapper: props => <MemoryRouter {...props} />,
        }
      );
      return header;
    }
    it('delete not possible without edit permissions', () => {
      const header = createHeader(false, [sampleResult1]);
      header.getByTestId(headerTestIds.delete).click();
      expect(mockDeleteFlow).not.toHaveBeenCalled();
      expect(mockTableApi.refreshCache).not.toHaveBeenCalled();
      expect(mockTableApi.clearSelection).not.toHaveBeenCalled();
    });

    it('cannot delete if nothing selected', () => {
      const header = createHeader(false, []);
      header.getByTestId(headerTestIds.delete).click();
      expect(mockDeleteFlow).not.toHaveBeenCalled();
      expect(mockTableApi.refreshCache).not.toHaveBeenCalled();
      expect(mockTableApi.clearSelection).not.toHaveBeenCalled();
    });

    it('can delete if edit perms and something selected and after delete, cache and selection is cleared', () => {
      const header = createHeader(true, [sampleResult1]);
      header.getByTestId(headerTestIds.delete).click();
      expect(mockDeleteFlow).toHaveBeenCalled();
      expect(mockTableApi.refreshCache).toHaveBeenCalled();
      expect(mockTableApi.clearSelection).toHaveBeenCalled();
    });
  });

  describe('create and edits tests', () => {
    function renderHeader(canCreateTests: boolean, selectedRows: LT.SampleResult[], labTestTypes?: LT.LabTestType[]) {
      const history = createMemoryHistory();
      const mockSnackbarProps = {
        errorSnackbar: jest.fn(),
      };
      const mockValue: any = {}; // values not needed for testing here.
      const header = render(
        <Router history={history}>
          <Header
            labTestTypes={labTestTypes || mockLabTestTypes}
            hasCrudPermissions={canCreateTests}
            selectedRows={selectedRows}
            tableApi={mockValue}
            snackbarProps={mockSnackbarProps}
          />
        </Router>
      );

      return { header, mockSnackbarProps, history };
    }

    function runEditCreateTests(isEdit: boolean) {
      const title = isEdit ? 'edit' : 'create';
      const testId = isEdit ? headerTestIds.edit : headerTestIds.create;

      it(`${title} not possible without edit permissions`, () => {
        const { header, history } = renderHeader(false, [sampleResult1]);
        expect(history.location.pathname).toBe('/');
        header.getByTestId(testId).click();
        expect(history).toHaveLength(1);
        expect(history.location.pathname).toBe('/');
      });

      it(`${title} not allow if max selected items reached`, () => {
        const selectedRows = new Array(25);
        selectedRows.fill(sampleResult1);
        const { header, mockSnackbarProps, history } = renderHeader(true, selectedRows);
        expect(history.location.pathname).toBe('/');
        header.getByTestId(testId).click();
        expect(history).toHaveLength(1);
        expect(history.location.pathname).toBe('/');
        expect(mockSnackbarProps.errorSnackbar).toHaveBeenCalled();
      });

      it(`can not ${title} if all lab providers are not the same`, () => {
        const sampleResult2 = cloneDeep(sampleResult1);
        sampleResult2.labTestProvider = sampleResult1.labTestProvider + '-diff';
        const selectedRows = [sampleResult1, sampleResult2];
        const { header, mockSnackbarProps } = renderHeader(true, selectedRows);
        header.getByTestId(testId).click();
        expect(mockSnackbarProps.errorSnackbar).toHaveBeenCalled();
      });

      it(`can not ${title} if all lab providers are the same and exception not allowed for different sample types`, () => {
        const sampleResult2 = cloneDeep(sampleResult1);
        sampleResult2.info.sampleType = sampleResult1.info.sampleType + '-diff';
        const selectedRows = [sampleResult1, sampleResult2];
        const { header, mockSnackbarProps } = renderHeader(true, selectedRows);
        header.getByTestId(testId).click();
        expect(mockSnackbarProps.errorSnackbar).toHaveBeenCalled();
      });

      it(`can ${title} if all lab providers are the same and exception allowed for different sample types`, () => {
        const labTestTypes = cloneDeep(mockLabTestTypes);
        labTestTypes[0].allowDifferentSampleTypeCreation = true;

        const sampleResult2 = cloneDeep(sampleResult1);
        sampleResult2.info.sampleType = sampleResult1.info.sampleType + '-diff';
        const selectedRows = [sampleResult1, sampleResult2];
        const { header, mockSnackbarProps } = renderHeader(true, selectedRows, labTestTypes);
        header.getByTestId(testId).click();
        expect(mockSnackbarProps.errorSnackbar).not.toHaveBeenCalled();
      });

      it(`can ${title} if all lab providers and sample types are the same`, () => {
        const sampleResult2 = cloneDeep(sampleResult1);
        const selectedRows = [sampleResult1, sampleResult2];
        const { header, mockSnackbarProps } = renderHeader(true, selectedRows);
        header.getByTestId(testId).click();
        expect(mockSnackbarProps.errorSnackbar).not.toHaveBeenCalled();
      });

      it(`can ${title} if edit perms, something selected, less than max and all test types the same`, () => {
        const { header, history } = renderHeader(true, [sampleResult1]);
        expect(history.location.pathname).toBe('/');
        header.getByTestId(testId).click();
        expect(history).toHaveLength(2);
        expect(history.location.pathname).toBe('/lab-testing/create');
      });
    }

    runEditCreateTests(false);
    runEditCreateTests(true);
  });

  describe('print tests', () => {
    function createHeader(canCreateTests: boolean, selectedRows: LT.SampleResult[]) {
      const mockSnackbarProps = {
        errorSnackbar: jest.fn(),
      };
      const mockValue: any = {}; // values not needed for testing here.
      const header = render(
        <Header
          hasCrudPermissions={canCreateTests}
          selectedRows={selectedRows}
          tableApi={mockValue}
          snackbarProps={mockSnackbarProps}
        />,
        {
          wrapper: props => <MemoryRouter {...props} />,
        }
      );
      return { header, mockSnackbarProps };
    }

    it('cannot print if nothing selected', () => {
      const { header } = createHeader(true, []);
      header.getByTestId(headerTestIds.print).click();
      expect(mockPrint).not.toHaveBeenCalled();
    });

    it('print not allow if max selected items reached', () => {
      const selectedRows = new Array(MAX_PRINT_ROWS + 1);
      selectedRows.fill(sampleResult1);
      const { header, mockSnackbarProps } = createHeader(true, selectedRows);
      header.getByTestId(headerTestIds.print).click();
      expect(mockPrint).not.toHaveBeenCalled();
      expect(mockSnackbarProps.errorSnackbar).toHaveBeenCalled();
    });

    it('can print if something selected, less than max and all test types the same', () => {
      const { header, mockSnackbarProps } = createHeader(true, [sampleResult1, sampleResult1]);
      header.getByTestId(headerTestIds.print).click();
      expect(mockPrint).toHaveBeenCalled();
      expect(mockSnackbarProps.errorSnackbar).not.toHaveBeenCalled();
    });
  });
});
