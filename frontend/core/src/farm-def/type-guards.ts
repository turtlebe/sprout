import {
  ChildDeviceLocation,
  ContainerLocation,
  DeviceLocation,
  FarmDefLine,
  FarmDefMeasurementType,
  FarmDefObject,
  FarmDefSite,
  ScheduleDefinition,
} from './types';
import { isValidKind } from './utils';

export function isFarmDefObject(object: any): object is FarmDefObject {
  return object && object.id && object.path && isValidKind(object.kind, 'singular');
}

export function isFarmDefSite(object: any): object is FarmDefSite {
  return isFarmDefObject(object) && object.kind === 'site';
}

export function isFarmDefLine(object: any): object is FarmDefLine {
  return isFarmDefObject(object) && object.kind === 'line';
}

export function isContainerLocation(object: any): object is ContainerLocation {
  return object && object.ref && object.path && object.kind === 'containerLocation';
}

export function isDeviceLocation(object: any): object is DeviceLocation {
  return object && object.ref && object.path && object.kind === 'deviceLocation';
}

export function isChildDeviceLocation(object: any): object is ChildDeviceLocation {
  return object && object.ref && object.path && object.kind === 'childDeviceLocation';
}

export function isScheduleDefinition(object: any): object is ScheduleDefinition {
  return object && object.ref && object.path && object.kind === 'scheduleDefinition';
}

export function isMeasurementType(object: any): object is FarmDefMeasurementType {
  return object && object.hasOwnProperty('supportedUnits');
}
