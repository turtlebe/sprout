import { TaskInstanceBase, WorkbinInstance } from '.';

export function isWorkbinTaskInstance(taskInstance: TaskInstanceBase): taskInstance is WorkbinInstance {
  return taskInstance.type === 'SubmitWorkbinTask';
}
