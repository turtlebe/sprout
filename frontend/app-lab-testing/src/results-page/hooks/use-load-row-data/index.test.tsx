import { IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';
import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { useLoadSamples } from '../../../common/hooks/use-load-samples';

import { useLoadRowData } from '.';

jest.mock('../../../common/hooks/use-load-samples');
const mockUseLoadSamples = useLoadSamples as jest.Mock;

describe('useLoadRowData', () => {
  function renderUseLoadRowDataHook(mockGridApi: GridApi, queryParameter?: string) {
    const mockTableApi: LT.TableApi = {
      resetGrid: () => {},
      clearSelection: () => {},
      refreshCache: () => {},
      columnApi: null,
      gridApi: mockGridApi,
    };

    const mockContainerRef = null;

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

    const mockOnError = () => {};
    const mockonSuccess = () => {};

    const makeRequestMock = jest.fn();
    mockUseLoadSamples.mockReturnValue({ isLoading: false, error: null, makeRequest: makeRequestMock });

    const path = '/lab-testing' + queryParameter;
    const history = createMemoryHistory({ initialEntries: [path] });

    const wrapper = ({ children }) => <Router history={history}>{children}</Router>;

    const {} = renderHook(
      () =>
        useLoadRowData({
          labTestTypes: mockLabTestTypes,
          tableApi: mockTableApi,
          containerRef: mockContainerRef,
          hasEditPermissions: true,
          username: 'test-user',
          onError: mockOnError,
          onSuccess: mockonSuccess,
        }),
      { wrapper }
    );

    return makeRequestMock;
  }

  it('uses query parameter for sample id filter', () => {
    // @ts-ignore
    const mockGridApi: GridApi = {
      setDatasource: (dataSource: IDatasource) => {
        const params: IGetRowsParams = {
          startRow: 0,
          endRow: 100,
          successCallback: () => {},
          failCallback: () => {},
          sortModel: [],
          filterModel: {},
          context: null,
        };
        dataSource.getRows(params);
      },
    };

    const queryValue = 'id1234';
    const queryParameter = `?lab_test_sample_id=${queryValue}`;
    const mockMakeRequest = renderUseLoadRowDataHook(mockGridApi, queryParameter);

    const expectedQueryParams = {
      page: 1,
      lab_tests_per_page: 100,
      order_by: '',
      lab_test_sample_id: queryValue,
    };
    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: expectedQueryParams,
      onSuccess: expect.anything(),
      onError: expect.anything(),
    });
  });

  it('invokes api with sort and filter parameters', () => {
    // @ts-ignore
    const mockGridApi: GridApi = {
      setDatasource: (dataSource: IDatasource) => {
        const params: IGetRowsParams = {
          startRow: 0,
          endRow: 100,
          successCallback: () => {},
          failCallback: () => {},
          sortModel: [{ colId: 'created', sort: 'desc' }],
          filterModel: {
            sample_type: {
              filterType: 'selection',
              selectedItems: [{ name: 'Soil', value: 'Soil' }],
            },
          },
          context: null,
        };
        dataSource.getRows(params);
      },
    };

    const mockMakeRequest = renderUseLoadRowDataHook(mockGridApi);

    const expectedQueryParams = {
      page: 1,
      lab_tests_per_page: 100,
      order_by: '-start_time',
      sample_type: 'Soil',
    };
    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: expectedQueryParams,
      onSuccess: expect.anything(),
      onError: expect.anything(),
    });
  });
});
