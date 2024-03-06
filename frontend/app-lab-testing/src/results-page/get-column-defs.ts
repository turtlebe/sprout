import { CustomHeader } from '../common/components/table-renderers/custom-header';
import { LabRenderer } from '../common/components/table-renderers/lab-renderer';
import { LotCodesRenderer } from '../common/components/table-renderers/lot-codes-renderer';
import { NotesEditor } from '../common/components/table-renderers/notes-editor';
import { OverallStatusRenderer } from '../common/components/table-renderers/status/overall-status-renderer';
import { DumpRefillStatus, HealthStatus } from '../common/types/interface-types';
import { convertISOStringToViewString } from '../common/utils/date-utils';
import { generateTestHeaderKey } from '../common/utils/generate-test-header-key';

import { cols } from './table-cols';

function statusComparator(status1, status2) {
  return status1.data > status2.data ? 1 : status1.data < status2.data ? -1 : 0;
}

// eslint-disable-next-line max-params
function sampleDateComparator(date1, date2, node1, node2) {
  const date1InMs = (node1.data.sample_date && new Date(node1.data.sample_date).getTime()) || Date.now();
  const date2InMs = (node2.data.sample_date && new Date(node2.data.sample_date).getTime()) || Date.now();
  return date1InMs - date2InMs;
}

// eslint-disable-next-line max-params
function createdDateComparator(date1, date2, node1, node2) {
  const date1InMs = (node1.data.created && node1.data.created.date.getTime()) || Date.now();
  const date2InMs = (node2.data.created && node2.data.created.date.getTime()) || Date.now();
  return date1InMs - date2InMs;
}

const textFilterDefn = {
  floatingFilterComponent: 'textReadonlyFloatingFilter',
  filter: 'agTextColumnFilter',
  filterParams: {
    buttons: ['apply', 'reset'],
    filterOptions: ['equals'],
    suppressAndOrCondition: true,
    browserDatePicker: true,
  },
};

const textFilterContainsDefn = {
  floatingFilterComponent: 'textReadonlyFloatingFilter',
  filter: 'agTextColumnFilter',
  filterParams: {
    buttons: ['apply', 'reset'],
    filterOptions: ['contains'],
    suppressAndOrCondition: true,
    browserDatePicker: true,
  },
};

export function getColumnDefs(labTestTypes: LT.LabTestType[], hasEditPermissions: boolean) {
  if (!labTestTypes || labTestTypes.length === 0) {
    return [];
  }
  const testTypes = labTestTypes.map<LT.SelectableItem>(labTestType => {
    return {
      name: labTestType.labTestKind,
      value: labTestType.labTestKind,
    };
  });

  const labs = labTestTypes.map<LT.SelectableItem>(labTestType => {
    return {
      name: labTestType.labTestProvider,
      value: labTestType.labTestProvider,
    };
  });

  let _sampleTypes: string[] = [];
  labTestTypes.forEach(labTestType => {
    _sampleTypes = _sampleTypes.concat(Array.from(labTestType.schemaResultsAndThreholdsBySampleType.keys()));
  });

  const sampleTypes = _sampleTypes.map<LT.SelectableItem>(item => {
    return {
      name: item,
      value: item,
    };
  });

  const healthStatusTypes = Object.keys(HealthStatus).map<LT.SelectableItem>(key => {
    return {
      name: key,
      value: HealthStatus[key],
    };
  });

  const dumpRefillStatusTypes = Object.keys(DumpRefillStatus).map<LT.SelectableItem>(key => {
    return {
      name: key,
      value: DumpRefillStatus[key],
    };
  });

  const details: LT.ColumnDef = [
    {
      headerName: 'Created',
      colId: cols.CREATED,
      field: cols.CREATED,
      headerTooltip: 'Date lab sample created.',
      resizable: true,
      sortable: true,
      sort: 'desc',
      filter: 'agDateColumnFilter',
      floatingFilterComponent: 'dateReadonlyFloatingFilter',
      filterParams: {
        buttons: ['apply', 'reset'],
        filterOptions: ['inRange', 'greaterThanOrEqual'],
        defaultOption: 'inRange',
        suppressAndOrCondition: true,
        browserDatePicker: true,
      },
      pinned: 'left',
      minWidth: 150,
      comparator: createdDateComparator,
      valueGetter: param => {
        if (!param.data) {
          return 'Loading...';
        }
        return param.data.created && param.data.created.view;
      },
      checkboxSelection: true,
      lockPosition: true,
      lockPinned: true,
    },
    {
      headerName: 'Sample Date',
      colId: cols.SAMPLE_DATE,
      field: cols.SAMPLE_DATE,
      headerTooltip: 'Date sample will be taken. Sample Date will show in printed label.',
      resizable: true,
      sortable: true,
      floatingFilterComponent: 'dateReadonlyFloatingFilter',
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['apply', 'reset'],
        filterOptions: ['inRange', 'greaterThanOrEqual'],
        defaultOption: 'inRange',
        suppressAndOrCondition: true,
        browserDatePicker: true,
      },
      minWidth: 130,
      comparator: sampleDateComparator,
    },
    {
      headerName: 'Sample Creator',
      colId: cols.SAMPLE_CREATOR,
      field: cols.SAMPLE_CREATOR,
      headerTooltip: 'User that created sample.',
      resizable: true,
      sortable: true,
      ...textFilterContainsDefn,
      minWidth: 140,
    },
    {
      headerName: 'Status',
      colId: cols.STATUS,
      field: cols.STATUS,
      headerTooltip: 'Test Result Status: pass, fail, no data yet.',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: [
          { name: 'Pass', value: 'pass' },
          { name: 'Fail', value: 'fail' },
          { name: 'Pending', value: 'pending' },
        ],
      },
      minWidth: 100,
      cellRendererFramework: OverallStatusRenderer,
      comparator: statusComparator,
      filterValueGetter: (item: any) => {
        return item?.data?.status?.data;
      },
    },
    {
      headerName: 'Sample Type',
      colId: cols.SAMPLE_TYPE,
      field: cols.SAMPLE_TYPE,
      headerTooltip: 'Sample Type will show in printed label',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: true,
        selectableItems: sampleTypes,
      },
      minWidth: 220,
    },
    {
      headerName: 'Product Codes',
      colId: cols.PRODUCT_CODES,
      field: cols.PRODUCT_CODES,
      headerTooltip: 'Product codes.',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Location',
      colId: cols.LOCATION,
      field: cols.LOCATION,
      headerTooltip: 'If no Label Detail is provided, Location will print on label.',
      resizable: true,
      sortable: false, // not needed per laurel.
      ...textFilterContainsDefn,
      minWidth: 160,
    },
    {
      headerName: 'Sub-Location',
      colId: cols.SUB_LOCATION,
      field: cols.SUB_LOCATION,
      headerTooltip: 'Additional location information.',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 160,
    },
    {
      headerName: 'Test Type',
      colId: cols.TEST_TYPE,
      field: cols.TEST_TYPE,
      headerTooltip: 'Lab test type.',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: testTypes,
      },
      minWidth: 100,
    },
    {
      headerName: 'Lab',
      colId: cols.LAB,
      field: cols.LAB,
      headerTooltip: 'Lab processing the sample.',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: labs,
      },
      minWidth: 100,
      cellRendererFramework: LabRenderer,
    },
    {
      headerName: 'Lot Codes',
      colId: cols.LOT_CODES,
      field: cols.LOT_CODES,
      headerTooltip: 'Lot codes.',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 100,
      cellRendererFramework: LotCodesRenderer,
    },
    {
      headerName: 'Harvest Dates',
      colId: cols.HARVEST_DATES,
      field: cols.HARVEST_DATES,
      headerTooltip: 'Harvest Dates.',
      resizable: true,
      sortable: true,
      floatingFilterComponent: 'dateReadonlyFloatingFilter',
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['apply', 'reset'],
        filterOptions: ['equals'],
        suppressAndOrCondition: true,
        browserDatePicker: true,
      },
      minWidth: 120,
      cellRenderer: (item: any) => {
        if (!item.data) {
          return ''; // hasn't loaded yet.
        }
        let result = '';
        // print range of dates: <firstDate> to <lastDate>
        // first item in array is lowest date.
        // last item (if exists) is latest date.
        // see: https://plentyag.atlassian.net/browse/SD-6274
        const harvestDates = item.data[cols.HARVEST_DATES];
        if (Array.isArray(harvestDates) && harvestDates.length > 0) {
          result += convertISOStringToViewString(harvestDates[0]);
          if (harvestDates.length > 1) {
            result += ` to ${convertISOStringToViewString(harvestDates[harvestDates.length - 1])}`;
          }
        }
        return result;
      },
    },
    {
      headerName: 'Label Details',
      colId: cols.LABEL_DETAILS,
      field: cols.LABEL_DETAILS,
      headerTooltip: 'Label Details will show in printed label if it has a value.',
      resizable: true,
      sortable: false, // not needed per laurel.
      filter: false, // not needed per laurel.
      minWidth: 100,
    },
    {
      headerName: 'Sample Time',
      colId: cols.SAMPLE_TIME,
      field: cols.SAMPLE_TIME,
      headerTooltip: 'Time sample will be taken. Sample Time will show in printed label.',
      resizable: true,
      sortable: false, // Not needed, confirmed by Laurel.
      floatingFilterComponent: 'dateReadonlyFloatingFilter',
      minWidth: 130,
    },
    {
      headerName: 'Notes',
      colId: cols.NOTES,
      field: cols.NOTES,
      headerTooltip: 'Misc Notes',
      resizable: true,
      sortable: false, // not needed per laurel.
      filter: false, // not needed per laurel.
      minWidth: 100,
      editable: hasEditPermissions,
      singleClickEdit: true,
      cellEditorFramework: NotesEditor,
      cellRenderer: (item: any) => {
        return item.data ? item.data[cols.NOTES].notes : '';
      },
    },
    {
      headerName: 'Sample ID',
      colId: cols.LAB_TEST_SAMPLE_ID,
      field: cols.LAB_TEST_SAMPLE_ID,
      headerTooltip: 'Sample ID number',
      resizable: true,
      sortable: true,
      ...textFilterContainsDefn,
      minWidth: 140,
    },
    {
      headerName: 'Trial',
      colId: cols.TRIAL_IDS,
      field: cols.TRIAL_IDS,
      headerTooltip: 'Trial #',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Treatment',
      colId: cols.TREATMENT_IDS,
      field: cols.TREATMENT_IDS,
      headerTooltip: 'Treament #',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Harvest Cycle',
      colId: cols.HARVEST_CYCLE,
      field: cols.HARVEST_CYCLE,
      headerTooltip: 'Harvest Cycle #',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Health Status',
      colId: cols.HEALTH_STATUS,
      field: cols.HEALTH_STATUS,
      headerTooltip: 'Health Status',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: healthStatusTypes,
      },
      minWidth: 130,
    },
    {
      headerName: 'Material Lot',
      colId: cols.MATERIAL_LOT,
      field: cols.MATERIAL_LOT,
      headerTooltip: 'Material Lot',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Container ID',
      colId: cols.CONTAINER_ID,
      field: cols.CONTAINER_ID,
      headerTooltip: 'Container ID',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Nutrient Stage',
      colId: cols.NUTRIENT_STAGE,
      field: cols.NUTRIENT_STAGE,
      headerTooltip: 'Nutrient Stage',
      resizable: true,
      sortable: true,
      ...textFilterDefn,
      minWidth: 130,
    },
    {
      headerName: 'Dump-Refill Status',
      colId: cols.DUMP_REFILL_STATUS,
      field: cols.DUMP_REFILL_STATUS,
      headerTooltip: 'Health Status',
      resizable: true,
      sortable: true,
      filter: 'selectionFilter',
      filterParams: {
        multiple: false,
        selectableItems: dumpRefillStatusTypes,
      },
      minWidth: 150,
    },
    {
      headerName: 'NovaCrop Id',
      colId: cols.PROVIDER_SAMPLE_ID,
      field: cols.PROVIDER_SAMPLE_ID,
      headerTooltip: 'NovaCrop Id',
      resizable: true,
      sortable: true,
      ...textFilterContainsDefn,
      minWidth: 130,
    },
  ];

  const columnDefs: LT.ColumnGroupDef = [
    {
      headerName: 'Test Details',
      children: details,
      groupId: 'test_details',
    },
  ];

  labTestTypes.forEach(labTestType => {
    labTestType.schemaResultsAndThreholdsBySampleType.forEach((schema, sampleType) => {
      const tests: LT.ColumnDef = [];
      schema.forEach((labTestData, testName) => {
        const subTitle = labTestData.range ? '(' + labTestData.range + ')' : '';
        const title = testName + (labTestData.units ? ` ${labTestData.units}` : '');
        const headerTooltip =
          testName + (labTestData.units ? ` ${labTestData.units}` : '') + (subTitle ? ` ${subTitle}` : '');
        const colId = generateTestHeaderKey({
          provider: labTestType.labTestProvider,
          kind: labTestType.labTestKind,
          sampleType,
          testName,
        });
        tests.push({
          headerName: testName,
          headerTooltip,
          colId,
          field: colId,
          resizable: true,
          headerComponentFramework: CustomHeader,
          headerComponentParams: {
            title,
            subTitle,
          },
          cellRendererSelector: (params: any) => {
            const colId = params.column.colId;
            if (!params.data || !params.data[colId]) {
              return {};
            }
            const data = params.data[colId];
            if (data.isManualField) {
              return {
                component: 'manualStatusRenderer',
                params: data,
              };
            }
            return {
              component: 'statusRenderer',
              params: data,
            };
          },
          minWidth: 100,
        });
      });

      const labHeader = `${labTestType.labTestKind}; Sample: ${sampleType}; ${labTestType.labTestProvider}`;

      columnDefs.push({
        headerName: labHeader,
        headerTooltip: labHeader,
        children: tests,
        groupId: 'tests_results',
      });
    });
  });

  return columnDefs;
}
