import React from 'react';

export interface FormStateContext {
  getFieldState: (name: string) => FormGen.FieldState;
  setFieldState: (name, fieldState: FormGen.FieldState) => void;
  updateGroupValues?: (currentValue: any) => void;
  groupValues?: any;
}

export const FormStateContext = React.createContext<FormStateContext>(null);

export const useFormStateContext = () => React.useContext(FormStateContext);
