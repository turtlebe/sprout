import { WorkcenterTaskDetailsResponse } from '../../../common/types';

export interface TaskTitleRendererProps {
  task: WorkcenterTaskDetailsResponse;
  'data-testid'?: string;
}
