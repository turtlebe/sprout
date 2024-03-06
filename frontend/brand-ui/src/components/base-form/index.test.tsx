import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Link, MemoryRouter, Router } from 'react-router-dom';

import { dataTestIdsSubmitterTextHelper } from '../submitter-text-helper';

import { BaseForm, dataTestIdsBaseForm as dataTestIds } from '.';

const formGenTextField: FormGen.FieldTextField = { type: 'TextField', name: 'textFieldName', label: 'textFieldLabel' };
const formGenConfig: FormGen.Config = {
  title: 'Title',
  fields: [formGenTextField],
};

mockCurrentUser();
mockGlobalSnackbar();

const handleSubmit = jest.fn();
const handleBaseFormReady = jest.fn();

describe('BaseForm', () => {
  beforeEach(() => {
    handleSubmit.mockClear();
    handleBaseFormReady.mockClear();
  });

  it('disables the submit and displays a loader when isLoading is "true"', () => {
    handleBaseFormReady.mockImplementation(() => {
      event => {
        expect(event.api).toBeDefined();
        expect(event.api).toHaveProperty('resetForm');
        expect(event.api).toHaveProperty('handleSuccess');
        expect(event.api).toHaveProperty('handleError');
      };
    });
    const { getByTestId } = render(
      <BaseForm
        isLoading={true}
        isUpdating={false}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(getByTestId(dataTestIds.form)).toBeVisible();
    expect(getByTestId(dataTestIds.submit)).toHaveTextContent('Submit');
    expect(getByTestId(dataTestIds.submit)).toBeDisabled();
    expect(handleBaseFormReady).toHaveBeenCalled();
    expect(getByTestId(formGenTextField.name).querySelector('input')).toBeInTheDocument();
    expect(getByTestId(formGenTextField.name).querySelector('input')).toHaveValue('');
  });

  it('enables the submit and hides the loader when isLoading is "false"', async () => {
    const initialValues = { [formGenTextField.name]: 'default-value' };
    handleSubmit.mockImplementation(values => {
      expect(values).toEqual(initialValues);
    });
    const { getByTestId } = render(
      <BaseForm
        isLoading={false}
        isUpdating={true}
        initialValues={initialValues}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(getByTestId(dataTestIds.form)).toBeVisible();
    expect(getByTestId(dataTestIds.submit)).toHaveTextContent('Update');
    expect(getByTestId(dataTestIds.submit)).not.toBeDisabled();
    expect(getByTestId(formGenTextField.name).querySelector('input')).toBeInTheDocument();
    expect(getByTestId(formGenTextField.name).querySelector('input')).toHaveValue('default-value');

    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('has "determinate" progress type when "loadingProgress" number value provided', () => {
    const progress = 70;
    const { getByTestId } = render(
      <BaseForm
        isUpdating={true}
        isLoading={true}
        loadingProgress={progress}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
        renderSubmitTextHelper={false}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(getByTestId(dataTestIds.loader)).toHaveAttribute('aria-valuenow', progress.toString());
  });

  it('has "indeterminate" progress type when "loadingProgress" is undefined', () => {
    const { getByTestId } = render(
      <BaseForm
        isUpdating={true}
        isLoading={true}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
        renderSubmitTextHelper={false}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(getByTestId(dataTestIds.loader)).not.toHaveAttribute('aria-valuenow');
  });

  it('guards against route changes when the form gets dirty and removes the guard on a successful submit', async () => {
    let event;
    handleBaseFormReady.mockImplementation(e => (event = e)); // saves the baseFormReady api
    handleSubmit.mockImplementation(() => event.api.handleSuccess()); // calls the default handleSuccess provided by baseFormReady api
    const getUserConfirmation = jest.fn();
    const history = createMemoryHistory({ getUserConfirmation });

    const { getByTestId } = render(
      <Router history={history}>
        <BaseForm
          isLoading={false}
          isUpdating={true}
          formGenConfig={formGenConfig}
          onSubmit={handleSubmit}
          onBaseFormReady={handleBaseFormReady}
        />
        <Link to="/page-1" data-testid="link1">
          Link 1
        </Link>
        <Link to="/" data-testid="home">
          Home
        </Link>
      </Router>
    );
    expect(history.location.pathname).toBe('/');

    getByTestId('link1').click();
    expect(history.location.pathname).toBe('/page-1');
    getByTestId('home').click();
    expect(history.location.pathname).toBe('/');

    // -> make the form dirty
    await actAndAwait(() => changeTextField(formGenTextField.name, 'new-value'));

    // -> navigating away requires user confirmation
    getByTestId('link1').click();
    expect(history.location.pathname).toBe('/');
    expect(getUserConfirmation).toHaveBeenCalled();

    // -> submit clears user confirmation
    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    getByTestId('link1').click();
    expect(history.location.pathname).toBe('/page-1');
  });

  it('disables submit button', async () => {
    const initialValues = { [formGenTextField.name]: 'default-value' };
    const { queryByTestId, getByTestId } = render(
      <BaseForm
        isLoading={false}
        isUpdating={true}
        initialValues={initialValues}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
        isSubmitDisabled={true}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(getByTestId(dataTestIds.submit)).toBeDisabled();
    expect(queryByTestId(dataTestIdsSubmitterTextHelper.root)).toBeInTheDocument();

    await actAndAwait(() => getByTestId(dataTestIds.submit).click());

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('renders without SubmitTextHelper', () => {
    const { queryByTestId } = render(
      <BaseForm
        isLoading={false}
        isUpdating={true}
        formGenConfig={formGenConfig}
        onSubmit={handleSubmit}
        onBaseFormReady={handleBaseFormReady}
        renderSubmitTextHelper={false}
      />,
      { wrapper: props => <MemoryRouter {...props} /> }
    );

    expect(queryByTestId(dataTestIdsSubmitterTextHelper.root)).not.toBeInTheDocument();
  });
});
