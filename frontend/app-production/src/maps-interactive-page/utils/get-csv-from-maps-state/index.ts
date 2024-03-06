import { ContainerLocation, FarmDefMachine } from '@plentyag/core/src/farm-def/types';
import { DateTime } from 'luxon';

import { ContainerState, MapsState } from '../../types';
import { getResourceLoadedDate } from '../get-resource-loaded-date';

enum Columns {
  SITE = 'Site',
  AREA = 'Area',
  LINE = 'Line',
  MACHINE = 'Machine',
  CONTAINER_LOCATION = 'Container Location',
  CONTAINER_SERIAL = 'Container Serial',
  CONTAINER_TYPE = 'Container Type',
  CONTAINER_STATUS = 'Container Status',
  CONTAINER_LABELS = 'Container Labels',
  MATERIAL_LOT_NAME = 'Material Lot Name',
  MATERIAL_LABELS = 'Material Labels',
  CROP = 'Crop',
  LOAD_DATE = 'Load Date',
  AGE_COHORT = 'Age Cohort',
  IS_CONFLICT = 'Is conflict?',
}

const EXPORT_ORDER = [
  Columns.SITE,
  Columns.AREA,
  Columns.LINE,
  Columns.MACHINE,
  Columns.CONTAINER_LOCATION,
  Columns.CONTAINER_SERIAL,
  Columns.CONTAINER_TYPE,
  Columns.MATERIAL_LOT_NAME,
  Columns.CROP,
  Columns.CONTAINER_LABELS,
  Columns.MATERIAL_LABELS,
  Columns.CONTAINER_STATUS,
  Columns.LOAD_DATE,
  Columns.AGE_COHORT,
  Columns.IS_CONFLICT,
] as const;

export const getCSVFromMapsState = (machines: FarmDefMachine[], mapsState: MapsState, selectedDate: DateTime) => {
  const resourceReducer = (acc, resource: ContainerState, isConflict = false): string[][] => {
    const { resourceState } = resource;

    if (!resourceState) {
      return acc;
    }

    // farm def lookup
    const ref = resourceState?.location?.containerLocation?.farmdefContainerLocationRef;
    let containerLocation;
    const machine = machines.find(currentMachine => {
      containerLocation = Object.values(currentMachine.containerLocations).find(
        (containerLocation: ContainerLocation) => containerLocation?.ref === ref
      );
      return Boolean(containerLocation);
    });

    const loadedDate = getResourceLoadedDate(resource);

    const data = {
      [Columns.SITE]: resourceState?.location?.machine?.siteName ?? '',
      [Columns.AREA]: resourceState?.location?.machine?.areaName ?? '',
      [Columns.LINE]: resourceState?.location?.machine?.lineName ?? '',
      [Columns.MACHINE]: machine?.name ?? '',
      [Columns.CONTAINER_LOCATION]: containerLocation?.name ?? '',
      [Columns.CONTAINER_SERIAL]: resourceState?.containerObj?.serial ?? '',
      [Columns.CONTAINER_TYPE]: resourceState?.containerObj?.containerType ?? '',
      [Columns.CONTAINER_STATUS]: resourceState?.containerStatus ?? '',
      [Columns.CONTAINER_LABELS]: resourceState?.containerLabels.join(', ') ?? '',
      [Columns.MATERIAL_LOT_NAME]: resourceState?.materialObj?.lotName ?? '',
      [Columns.MATERIAL_LABELS]: resourceState?.materialLabels.join(', ') ?? '',
      [Columns.CROP]: resourceState?.materialObj?.product ?? '',
      [Columns.LOAD_DATE]: loadedDate ? DateTime.fromJSDate(loadedDate).toUTC().toISO() : '',
      [Columns.AGE_COHORT]: loadedDate
        ? Math.trunc(selectedDate.endOf('day').diff(DateTime.fromJSDate(loadedDate), 'days').as('days'))
        : '',
      [Columns.IS_CONFLICT]: isConflict ? 'TRUE' : 'FALSE',
    };

    acc.push(EXPORT_ORDER.map(column => data[column]));
    return acc;
  };

  // go through data at each location
  const data = Object.values(mapsState).reduce((acc, resource) => {
    // process data of current resource
    acc = resourceReducer(acc, resource);

    // if conflict is found in resource, add the conflicted resources
    if (Boolean(resource.conflicts)) {
      acc = resource.conflicts.reduce((acc, conflict) => resourceReducer(acc, conflict, true), acc);
    }

    return acc;
  }, []);

  return [[...EXPORT_ORDER], ...data];
};
