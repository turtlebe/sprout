import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const RecipientTooltip: React.FC<FormGen.TooltipProps> = props => {
  return (
    <DialogFormGenTooltip title="Recipient" {...props}>
      <Typography variant="h6">Opsgenie</Typography>
      <Typography paragraph>
        For Opsgenie Subscriptions, the recipient can be the Opsgenie <b>Team Name</b> or <b>Team ID</b>.<br />
        The name can be any of the teams listed&nbsp;
        <a href="https://plenty.app.opsgenie.com/teams/list" target="_blank">
          here
        </a>
        . The ID is found in the URL after clicking on a team.
      </Typography>
      <Typography variant="h6">Slack</Typography>
      <Typography paragraph>
        For Slack Subscriptions, the recipient can be a channel or a user.
        <br />
        The recipient needs to be prefixed by <b>#</b> for a channel or <b>@</b> for a user.
      </Typography>
      <Typography paragraph>
        Examples:&nbsp;
        <span style={{ backgroundColor: '#dedede', padding: '4px', borderRadius: '4px' }}>#farmos-support</span>&nbsp;
        <span style={{ backgroundColor: '#dedede', padding: '4px', borderRadius: '4px' }}>@username</span>
      </Typography>
    </DialogFormGenTooltip>
  );
};
