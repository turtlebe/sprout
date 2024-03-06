import { PlanStatus, WorkcenterPlan, WorkcenterPlanResponse, WorkcenterTaskDetailsResponse } from '../../common/types';
import { getDateFormat } from '../../common/utils';

const today = new Date();
const todayDate = getDateFormat(today);

const workcenter = 'sites/LAX1/farms/LAX1/workCenters/Seed';
const mockCreatedTasks: WorkcenterTaskDetailsResponse[] = [];
const plan: WorkcenterPlan = {
  id: 'fc827d8c-27e2-4934-87a7-afebd575ed86',
  workcenter,
  plannedDate: todayDate,
  taskOrdering: mockCreatedTasks.map(task => task.taskDetails.id),
  status: PlanStatus.CREATED,
  progress: 0,
  summary: [],
};
export const mockSeedCreatedPlanNoTasks: WorkcenterPlanResponse = {
  plan,
  detailsOfTasksFromPlan: mockCreatedTasks,
};
