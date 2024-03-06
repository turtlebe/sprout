import { SkusWithCount } from '@plentyag/app-production/src/reports-finished-goods-page/hooks';
import {
  ReportTabs,
  useFinishedGoodsRouting,
} from '@plentyag/app-production/src/reports-finished-goods-page/hooks/use-finished-goods-routing';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { PackagingLot } from '@plentyag/core/src/types';
import { DateTimeFormat, getBestByDateFromLotAndSku } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { useStyles } from '../../styles';
import { getFilteringObjectParam } from '../../utils/get-filtering-object-param';

const dataTestIds = {
  root: 'skus-table-root',
  link: (id: string) => `skus-table-link-${id}`,
  count: (id: string) => `skus-table-count-${id}`,
  date: (id: string) => `skus-table-date-${id}`,
  noSkus: 'skus-table-no-skus',
};

export { dataTestIds as dataTestIdsSkusTable };

export interface SkusTable {
  basePath: string;
  lot: PackagingLot;
  skus: SkusWithCount[];
}

export const SkusTable: React.FC<SkusTable> = ({ basePath, lot, skus }) => {
  const classes = useStyles({});

  const { getLink } = useFinishedGoodsRouting(basePath);

  return (
    <TableContainer data-testid={dataTestIds.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.title}>SKUs</TableCell>
            <TableCell className={classes.title} align="right">
              Count
            </TableCell>
            <TableCell className={classes.title} align="right">
              Exp Date
            </TableCell>
          </TableRow>
        </TableHead>
        {skus.length > 0 ? (
          <TableBody>
            {skus.map(({ sku, count }) => {
              const { lotName } = lot;
              const { displayName } = sku;

              const expDate = getBestByDateFromLotAndSku(lot, sku);
              const expDateString = DateTime.fromJSDate(expDate).toFormat(DateTimeFormat.US_DATE_ONLY);

              const filterQueryParam = {
                lotName: getFilteringObjectParam(lotName),
                sku: getFilteringObjectParam(displayName),
              };

              return (
                <TableRow key={sku.displayAbbreviation}>
                  <TableCell className={classes.content}>
                    <PlentyLink
                      to={getLink(ReportTabs.SKUS, filterQueryParam)}
                      data-testid={dataTestIds.link(sku.displayAbbreviation)}
                    >
                      {displayName}
                    </PlentyLink>
                  </TableCell>
                  <TableCell
                    className={classes.content}
                    align="right"
                    data-testid={dataTestIds.count(sku.displayAbbreviation)}
                  >
                    {count}
                  </TableCell>
                  <TableCell
                    className={classes.content}
                    align="right"
                    data-testid={dataTestIds.date(sku.displayAbbreviation)}
                  >
                    {expDateString}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        ) : (
          <TableBody data-testid={dataTestIds.noSkus}>
            <TableRow>
              <TableCell colSpan={3} className={classes.content}>
                No SKUs associated
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};
