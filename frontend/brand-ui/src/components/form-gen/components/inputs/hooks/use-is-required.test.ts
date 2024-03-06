import { renderHook } from '@testing-library/react-hooks';
import * as yup from 'yup';

import { useIsRequired } from './use-is-required';

describe('useIsRequired', () => {
  describe('decorateLabel', () => {
    it('returns the label as is', () => {
      const formGenField: FormGen.FieldTextField = {
        type: 'TextField',
        name: 'mockName',
        label: 'Mock Label',
      };
      const { result } = renderHook(() => useIsRequired(formGenField));

      expect(result.current.decorateLabel(formGenField.label)).toBe(formGenField.label);
    });

    it('returns the label suffixed with a "*" when using "yup.required()"', () => {
      const formGenField: FormGen.FieldTextField = {
        type: 'TextField',
        name: 'mockName',
        label: 'Mock Label',
        validate: yup.mixed().required(),
      };
      const { result } = renderHook(() => useIsRequired(formGenField));

      expect(result.current.decorateLabel(formGenField.label)).toBe(`${formGenField.label} *`);
    });
  });
});
