import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { useLocalStorageUnitsPreferences } from '@plentyag/app-environment/src/common/hooks';
import { getSearchMeasurementTypesUrl } from '@plentyag/app-environment/src/common/utils';
import { Card } from '@plentyag/brand-ui/src/components';
import {
  Button,
  ButtonGroup,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefMeasurementType, FarmDefMeasurementUnit } from '@plentyag/core/src/farm-def/types';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { map } from 'lodash';
import React from 'react';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'none',
  },
}));

const dataTestIds = {
  rowMeasurementType: (measurementType: FarmDefMeasurementType): string =>
    `units-preference-table-row-${measurementType.name}`,
  buttonUnit: (unit: FarmDefMeasurementUnit): string => `units-preference-table-cell-button-${unit.unit}`,
};

export { dataTestIds as dataTestIdsUnitsPreferences };

/**
 * Display a Table with MeasurementTypes that have more than one Units and let the user pick
 * their preference to persist it in local storage.
 */
export const UnitsPreferences: React.FC = () => {
  const classes = useStyles({});
  const { data: measurementTypes = [], isValidating } = useSwrAxios<FarmDefMeasurementType[]>({
    url: getSearchMeasurementTypesUrl(),
  });
  const { getPreferredUnitName, setPreferredUnit } = useLocalStorageUnitsPreferences();
  const measurementTypesWithMultipleUnits = measurementTypes.filter(
    measurementType => Object.keys(measurementType.supportedUnits).length > 1
  );

  return (
    <Card title="Units" isLoading={isValidating} doNotPadContent>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Measurement Types</StyledTableCell>
              <StyledTableCell>Units</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {measurementTypesWithMultipleUnits.map(measurementType => (
              <TableRow key={measurementType.name} data-testid={dataTestIds.rowMeasurementType(measurementType)}>
                <TableCell>{measurementType.name}</TableCell>
                <TableCell>
                  <ButtonGroup color="default">
                    {map(measurementType.supportedUnits, unit => (
                      <Button
                        key={unit.unit}
                        className={classes.button}
                        onClick={() => setPreferredUnit(measurementType, unit)}
                        color={getPreferredUnitName(measurementType) === unit.unit ? 'primary' : undefined}
                        data-testid={dataTestIds.buttonUnit(unit)}
                      >
                        {unit.symbol}
                      </Button>
                    ))}
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
