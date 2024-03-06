import { CoreState } from '@plentyag/core/src/core-store/types';
import { TestOptions } from 'yup';

import { ReactorStateReturnType } from '../reactors-and-tasks-detail-page/types';

/**
 * Schema Types
 */
export type DataModel =
  | Omit<
      {
        [key: string]: { value?: string } | string | number;
      },
      'submitter' | 'submission_method'
    >
  | {
      submitter?: string;
      submission_method?: string;
    };

/**
 * Module Types
 */
export type ActionRequestType = 'Requests' | 'Asks' | 'Tells';

export interface ActionModule {
  actionName: string;
  actionRequestType: ActionRequestType;
  additionalValidation?: TestOptions;
}

export interface UseActionModule {
  actionModule: ActionModule;
  path: string;
  getDataModel: (actionModel: ProdActions.ActionModel) => DataModel;
  isLoading?: boolean;
}

export type GetDataModelFromReactorState = (
  actionModel: ProdActions.ActionModel,
  reactorState: ReactorStateReturnType,
  coreState?: CoreState
) => DataModel;

export interface UseActionModuleReturn {
  actionModuleProps: ActionModuleProps;
  handleSubmit: () => Promise<any>;
  resetForm: () => void;
}

export interface ActionModuleProps {
  formik: FormikProps<DataModel>;
  actionModel: ProdActions.ActionModel;
  isLoading?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, value: any) => void;
}

export interface RegisterActionModuleProps {
  reactorState: ReactorStateReturnType;
  isLoading: boolean;
  registerActionModule: (module: RegisteredActionModule) => void;
  reactorPath: string;
}

export interface RegisteredActionModule {
  name: string;
  actionModuleProps: ActionModuleProps;
  handleSubmit: () => Promise<any>;
}

export type FieldType = 'TYPE_MESSAGE' | 'TYPE_ENUM' | ProdActions.FundamentalFieldTypes;
