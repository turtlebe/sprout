import { getReactorsAndTasksDetailPath } from '.';

const mockBaseReactorsAndTasksDetailBasePath = 'sites/LAX1/farms/LAX1/reactors-and-tasks/detail';
const mockReactorPath = 'sites/LAX1/areas/TrayAutomation';

describe('getReactorsAndTasksDetailPath', () => {
  it('returns proper path with taskId', () => {
    expect(
      getReactorsAndTasksDetailPath({
        reactorsAndTasksDetailBasePath: mockBaseReactorsAndTasksDetailBasePath,
        reactorPath: mockReactorPath,
        taskId: 'task-1',
      })
    ).toEqual(`${mockBaseReactorsAndTasksDetailBasePath}/${mockReactorPath}?taskId=task-1`);
  });

  it('returns proper path without taskId', () => {
    expect(
      getReactorsAndTasksDetailPath({
        reactorsAndTasksDetailBasePath: mockBaseReactorsAndTasksDetailBasePath,
        reactorPath: mockReactorPath,
      })
    ).toEqual(`${mockBaseReactorsAndTasksDetailBasePath}/${mockReactorPath}`);
  });
});
