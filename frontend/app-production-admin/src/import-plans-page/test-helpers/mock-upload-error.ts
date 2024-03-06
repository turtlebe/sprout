import { UploadWorksheetErrorMessage } from '../components';

export const mockUploadError: UploadWorksheetErrorMessage['errorData'] = {
  PropLoad: {
    error: true,
    message: 'table_serial is not valid, given P800-0008046A:5WNV-JSM6-KB',
    task: {
      plannedDate: '2042-07-22',
      taskParametersJsonPayload:
        '{"table_serial": {"value": "P800-0008046A:5WNV-JSM6-KB"}, "prop_level_path": {"value": "sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel2"}}',
      taskPath:
        'sites/LAX1/farms/LAX1/workCenters/PropLoad/interfaces/PropLoad/methods/LoadTableIntoPropFromCleanTableStack',
      workcenter: 'sites/LAX1/farms/LAX1/workCenters/PropLoad',
    },
  },
};
