import { Check, Warning } from '@material-ui/icons';
import { Chip, Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { DmsDevice } from '../../types';
import { isHathorDevice } from '../../utils';

import { useStyles } from './styles';

const dataTestIds = {
  noCertificate: 'device-certificate-missing',
  hasCertificate: 'device-certificate-present',
};

export { dataTestIds as dataTestIdsDeviceCertificate };

export interface DeviceCertificate {
  device: DmsDevice;
}

export const DeviceCertificate: React.FC<DeviceCertificate> = ({ device }) => {
  const classes = useStyles({});

  if (!isHathorDevice(device)) {
    return null;
  }

  if (!device.hasCertificate) {
    return (
      <Chip
        className={classes.error}
        label="no certificate"
        icon={<Warning className={classes.errorIcon} />}
        data-testid={dataTestIds.noCertificate}
      />
    );
  }

  return (
    <Tooltip
      title={`Created at: ${DateTime.fromISO(device.certificateCreatedAt).toFormat(DateTimeFormat.US_DEFAULT)}`}
      arrow
    >
      <Chip color="default" label="certificate" icon={<Check />} data-testid={dataTestIds.hasCertificate} />
    </Tooltip>
  );
};
