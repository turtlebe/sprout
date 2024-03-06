export interface CalibrationHistory {
  deviceId: string;
  devicePartNumber?: string;
  type: string;
  validFrom: string;
  validTo: string;
  calibrationOffset: number;
  calibrationFormula?: string;
  calibrationError?: number;
  preCalibrationError?: number;
  preCalibrationErrorUnits?: number;
  preCalibrationValue?: number;
  preCalibrationRefValue?: number;
  postCalibrationError?: number;
  postCalibrationErrorUnits?: number;
  postCalibrationValue?: number;
  postCalibrationRefValue?: number;
}
