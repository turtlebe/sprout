import { CardItem } from '@plentyag/brand-ui/src/components/card-item';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { RecipeSettings } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { getRecipeSettingValue } from '../../utils';

const dataTestIds = {
  root: 'recipe-table-root',
  headerKeyName: 'recipe-table-header-key-name',
  headerValueName: 'recipe-table-header-value-name',
  tableRowKey: (rowKey: string) => `recipe-table-row-key-${rowKey}`,
  tableRowValue: (rowKey: string) => `recipe-table-row-value-${rowKey}`,
};

export { dataTestIds as dataTestIdsRecipeTable };

export interface RecipeTable {
  title: string;
  tooltip?: JSX.Element;
  tableKeyHeaderName: string;
  tableValueHeaderName: string;
  recipe: RecipeSettings;
  'data-testid'?: string;
}

/**
 * This component renders a card with the recipe setting displayed in a table.
 *
 * The recipe table must in the format like this example:
 * {
 *     "1": 300,
 *     "2": 305,
 *     "5": { value: 10, units: "m/s"},
 *    "10": "test"
 *   "str": true
 * }
 *
 * where:
 * - value is either a primitive type (string, number, bool) or
 * object with fields: value and units, where value is an string, number, or bool.
 */
export const RecipeTable: React.FC<RecipeTable> = ({
  title,
  tooltip,
  tableKeyHeaderName,
  tableValueHeaderName,
  recipe,
  'data-testid': dataTestId,
}) => {
  return (
    <CardItem data-testid={dataTestId || dataTestIds.root} name={title} tooltip={tooltip}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell data-testid={dataTestIds.headerKeyName}>{tableKeyHeaderName}</TableCell>
              <TableCell data-testid={dataTestIds.headerValueName}>{tableValueHeaderName}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(recipe || {}).map(tableKey => {
              const setting = recipe[tableKey];
              return (
                <TableRow key={tableKey}>
                  <TableCell>
                    <Typography data-testid={dataTestIds.tableRowKey(tableKey)}>{tableKey}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography data-testid={dataTestIds.tableRowValue(tableKey)}>
                      {getRecipeSettingValue(setting)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </CardItem>
  );
};
