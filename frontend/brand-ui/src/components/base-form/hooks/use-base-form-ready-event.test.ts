import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useGoToPath } from '@plentyag/core/src/hooks/use-go-to-path';
import { renderHook } from '@testing-library/react-hooks';

import { useBaseFormReadyEvent } from './use-base-form-ready-event';

jest.mock('@plentyag/core/src/hooks/use-go-to-path');
jest.mock('@plentyag/brand-ui/src/components/global-snackbar');

const mockUseGoToPath = useGoToPath as jest.Mock;
const setIsGoToAllowed = jest.fn();
const resetForm = jest.fn();
const removeImage = jest.fn();
mockUseGoToPath.mockReturnValue({ setIsGoToAllowed });
mockGlobalSnackbar();

const formGenTextField: FormGen.FieldTextField = { type: 'TextField', name: 'name', label: 'label' };
const formGenDragAndDrop: FormGen.FieldDragAndDrop = {
  type: 'DragAndDrop',
  name: 'name',
  label: 'label',
  onRender: jest.fn(),
  afterSubmit: jest.fn(),
};

describe('useBaseFormReadyEvent', () => {
  beforeEach(() => {
    setIsGoToAllowed.mockClear();
    successSnackbar.mockClear();
    errorSnackbar.mockClear();
    resetForm.mockClear();
    removeImage.mockClear();
  });

  describe('resetForm', () => {
    it('resets the form', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      const images = [{ remove: removeImage }, { remove: removeImage }];
      result.current.formikRef.current = { resetForm, values: { [formGenDragAndDrop.name]: images } };
      result.current.formReadyEvent.api.resetForm();
      expect(resetForm).toHaveBeenCalled();
      expect(setIsGoToAllowed).toHaveBeenCalledWith(true);
      expect(removeImage).not.toHaveBeenCalled(); // because formGenField does not contain the formGenDragAndDrop
    });

    it('resets the form and remove images', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField, formGenDragAndDrop] } })
      );

      const images = [{ remove: removeImage }, { remove: removeImage }];
      result.current.formikRef.current = { resetForm, values: { [formGenDragAndDrop.name]: images } };
      result.current.formReadyEvent.api.resetForm();
      expect(resetForm).toHaveBeenCalled();
      expect(setIsGoToAllowed).toHaveBeenCalledWith(true);
      expect(removeImage).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleSuccess', () => {
    it('resets the form, allows useGoToPath and shows a snackbar when submitting successfully', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      result.current.formikRef.current = { resetForm };
      result.current.formReadyEvent.api.handleSuccess();
      expect(setIsGoToAllowed).toHaveBeenCalledWith(true);
      expect(successSnackbar).toHaveBeenCalledWith('Your data has been submitted.');
      expect(resetForm).toHaveBeenCalled();
    });

    it('allows useGoToPath and shows a snackbar when updating successfully', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: true, formGenConfig: { fields: [formGenTextField] } })
      );

      result.current.formikRef.current = { resetForm };
      result.current.formReadyEvent.api.handleSuccess();
      expect(setIsGoToAllowed).toHaveBeenCalledWith(true);
      expect(successSnackbar).toHaveBeenCalledWith('Your data has been updated.');
      expect(resetForm).not.toHaveBeenCalled();
    });
  });

  describe('handleError', () => {
    it('logs a 500 error', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      result.current.formReadyEvent.api.handleError('error-message');
      expect(consoleError).toHaveBeenCalled();
      expect(errorSnackbar).toHaveBeenCalledWith();
    });

    it('logs a 400 error', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      result.current.formReadyEvent.api.handleError({ status: 400, response: 'error-message' });
      expect(consoleError).not.toHaveBeenCalled();
      expect(errorSnackbar).toHaveBeenCalledWith({ message: 'error-message' });
    });
  });

  describe('handleChange', () => {
    it('does not block navigation when values are equals to initial values', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      const initialValues = {
        [formGenTextField.name]: 'default-value',
      };
      const values = initialValues;

      result.current.handleChange(values, initialValues);
      expect(setIsGoToAllowed).not.toHaveBeenCalledWith(false);
    });

    it('blocks navigation when values are not equals to initial values', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenTextField] } })
      );

      const initialValues = { [formGenTextField.name]: 'new-value' };
      const values = { [formGenTextField.name]: 'default-value' };

      result.current.handleChange(values, initialValues);
      expect(setIsGoToAllowed).toHaveBeenCalledWith(false);
    });

    it('does not block navigation when images have been fetched from S3', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenDragAndDrop] } })
      );

      const initialValues = {};
      const values = { [formGenDragAndDrop.name]: [{ downloadedFromS3: true }] };

      result.current.handleChange(values, initialValues);
      expect(setIsGoToAllowed).not.toHaveBeenCalledWith(false);
    });

    it('block navigation when images have been uploaded but the form has not been submitted', () => {
      const { result } = renderHook(() =>
        useBaseFormReadyEvent({ isUpdating: false, formGenConfig: { fields: [formGenDragAndDrop] } })
      );

      const initialValues = {};
      const values = { [formGenDragAndDrop.name]: [{ downloadedFromS3: true }, {}] };

      result.current.handleChange(values, initialValues);
      expect(setIsGoToAllowed).toHaveBeenCalledWith(false);
    });
  });
});
