import { LiveStatusIcon, ObservationSource } from '@plentyag/app-environment/src/common/components';
import { getAlertRuleTypeLabel, isTriggered } from '@plentyag/app-environment/src/common/utils';
import { CircularProgressCentered } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { AlertEvent, LiveStatus } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, getShortenedPath, sortByDate } from '@plentyag/core/src/utils';
import moment from 'moment';
import React from 'react';

export const ROWS_PER_PAGE = 10;

const dataTestIds = getScopedDataTestIds(
  {
    activeSwitch: 'activeSwitch',
    tableRow: (alertEvent: AlertEvent) => `row-${alertEvent.id}`,
    tableCellStatus: (alertEvent: AlertEvent) => `cell-status-${alertEvent.id}`,
    tableCellAlertRuleType: (alertEvent: AlertEvent) => `cell-alert-rule-type-${alertEvent.id}`,
    tableCellTime: (alertEvent: AlertEvent) => `cell-time-${alertEvent.id}`,
    loader: 'loader',
  },
  'table-alert-events'
);

export { dataTestIds as dataTestIdsTableAlertEvents };

export interface TableAlertEvents {
  alertEvents: AlertEvent[];
  activeAlertEvents: AlertEvent[];
  isLoading: boolean;
}

/**
 * Table with backend pagination that renders a list of AlertEvents for the given rule
 */
export const TableAlertEvents: React.FC<TableAlertEvents> = ({
  alertEvents = [],
  activeAlertEvents = [],
  isLoading,
}) => {
  const [showActiveAlerts, setShowActiveAlerts] = React.useState(false);
  const HeaderCell = ({ children }) => (
    <TableCell style={{ fontWeight: 'bold', fontSize: '14px' }}>{children}</TableCell>
  );

  React.useEffect(() => {
    setShowActiveAlerts(activeAlertEvents.length > 0);
  }, [activeAlertEvents.length]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Switch
                checked={showActiveAlerts}
                onChange={() => setShowActiveAlerts(!showActiveAlerts)}
                data-testid={dataTestIds.activeSwitch}
              />
              Active Alerts Only
            </TableCell>
          </TableRow>
          <TableRow>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>Triggered By</HeaderCell>
            <HeaderCell>Source</HeaderCell>
            <HeaderCell>Source Path</HeaderCell>
            <HeaderCell>Time</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <CircularProgressCentered data-testid={dataTestIds.loader} />
              </TableCell>
            </TableRow>
          ) : (
            [...(showActiveAlerts ? activeAlertEvents : alertEvents)]
              ?.sort(sortByDate({ attribute: 'generatedAt' }))
              .map((alertEvent, index) => (
                <TableRow key={index} data-testid={dataTestIds.tableRow(alertEvent)}>
                  <TableCell data-testid={dataTestIds.tableCellStatus(alertEvent)}>
                    <Box display="flex" alignItems="center">
                      <LiveStatusIcon
                        fontSize="small"
                        status={isTriggered(alertEvent.status) ? LiveStatus.outOfRange : LiveStatus.inRange}
                      />
                      <Box padding={1} />
                      {alertEvent.status}
                    </Box>
                  </TableCell>
                  <TableCell data-testid={dataTestIds.tableCellAlertRuleType(alertEvent)}>
                    {getAlertRuleTypeLabel(alertEvent.alertRule.alertRuleType)}
                  </TableCell>
                  <TableCell>
                    {alertEvent.observationData?.length > 0 && (
                      <ObservationSource observation={alertEvent.observationData[0]} />
                    )}
                  </TableCell>
                  <TableCell>
                    {alertEvent.observationData?.length > 0 && getShortenedPath(alertEvent.observationData[0].path)}
                  </TableCell>
                  <TableCell data-testid={dataTestIds.tableCellTime(alertEvent)}>
                    {moment(alertEvent.generatedAt).fromNow()}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
