import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { ActionsFormPage } from '.';

import { ActionsForm } from './components';

const mockActionsForm = ActionsForm as jest.Mock;
jest.mock('./components/actions-form');
mockActionsForm.mockImplementation(() => {
  return <div>Mock Actions Form</div>;
});

const testActionPath =
  'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled';

const basePath = '/production/actions';

describe('ActionsFormPage', () => {
  beforeEach(() => {
    mockActionsForm.mockClear();
  });

  async function renderActionsForm(search: string) {
    const entries = [
      {
        pathname: `${basePath}/${testActionPath}`,
        search,
      },
    ];
    return actAndAwaitRender(
      <MemoryRouter initialEntries={entries} initialIndex={0}>
        <Route path={`${basePath}/:actionPath+`} component={ActionsFormPage} />
      </MemoryRouter>
    );
  }

  it('has initial values taken from query parameters', async () => {
    await renderActionsForm('?tote_serial=serial1');

    expect(mockActionsForm).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: {
          path: testActionPath,
          prefilledArgs: {
            tote_serial: { isDisabled: true, value: 'serial1' },
          },
        },
        error: '',
      }),
      expect.anything()
    );
  });

  it('passes error from query parameter to ActionsForm', async () => {
    await renderActionsForm('?error=some-error');

    expect(mockActionsForm).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: {
          path: testActionPath,
          prefilledArgs: {},
        },
        error: 'some-error',
      }),
      expect.anything()
    );
  });
});
