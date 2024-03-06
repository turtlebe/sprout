import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const NotificationTooltip: React.FC<FormGen.TooltipProps> = props => {
  const Chip = ({ children }) => (
    <span style={{ backgroundColor: '#dedede', padding: '4px', borderRadius: '4px' }}>{children}</span>
  );

  return (
    <DialogFormGenTooltip title="Count, Duration, Distinct Source" {...props}>
      <Typography paragraph>
        The <Chip>count</Chip>, <Chip>duration</Chip>, and <Chip>distinct source</Chip> attributes allow you to
        configure how many notifications you would like to receive when alerts happen. By default, one alert will result
        in one notification.
        <br />
        <br />
        To reduce number of notifications and reduce noise, you can configure those three attributes:
      </Typography>
      <Typography variant="h6">Count and Duration</Typography>
      <Typography paragraph>
        Example: When configuring the <Chip>count</Chip> to 10 and the <Chip>duration</Chip> to 10 (minutes). It will
        wait for 10 alerts in less than 10 minutes to happen in order to send one notification.
      </Typography>
      <Typography variant="h6">Distinct Source</Typography>
      <Typography paragraph>
        Examples:
        <br />
        When configuring the <Chip>distinct source</Chip> attribute to <Chip>true</Chip>, in the above example, the
        system will wait for 10 alerts from different sources to send a notification.
        <br />
        When configuring the <Chip>distinct source</Chip> attribute to <Chip>false</Chip>, in the above example, the
        system will wait for 10 alerts from any sources to send a notification.
      </Typography>
    </DialogFormGenTooltip>
  );
};
