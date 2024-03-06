import { Help } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { DialogDefault } from '@plentyag/brand-ui/src/components';
import { Box, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const Example = ({ children }) => (
  <div style={{ backgroundColor: '#dedede', padding: '0.5rem', borderRadius: '4px' }}>{children}</div>
);

export const AlertRuleOperationTooltip: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <IconButton size="small" icon={Help} onClick={() => setOpen(true)} />
      <DialogDefault title="Rule's Operator" open={open} onClose={() => setOpen(false)}>
        <Box padding={2}>
          <Alert severity="info">
            The operator of the Rule is the condition in order to generate an alert and potentially receive a
            notification.
          </Alert>

          <Typography variant="h6">Equals To</Typography>
          <Typography paragraph>When the data's value equals the rule value, an alert is generated.</Typography>
          <Example>
            Given a Rule's value set to "ValueA":
            <ul>
              <li>Data with the value: "ValueA", generates an alert.</li>
              <li>Data with the value: "ValueB", does not generate an alert.</li>
            </ul>
          </Example>

          <Typography variant="h6">Not Equals To</Typography>
          <Typography paragraph>When the data's value does not equal the rule value, an alert is generated.</Typography>
          <Example>
            Given a Rule's value set to "ValueA":
            <ul>
              <li>Data with the value: "ValueB", generates an alert.</li>
              <li>Data with the value: "ValueA", does not generate an alert.</li>
            </ul>
          </Example>

          <Typography variant="h6">In</Typography>
          <Alert severity="warning">
            This Rule's value can be one or many values. You can enter multiple values by using the "," as separator.
          </Alert>
          <Typography paragraph>
            When the data's value equals to one of the rule's value, an alert is generated.
          </Typography>
          <Example>
            Given a Rule's value set to "ValueA, ValueB":
            <ul>
              <li>Data with the value: "ValueA", generates an alert.</li>
              <li>Data with the value: "ValueB", generates an alert.</li>
              <li>Data with the value: "ValueC", does not generate an alert.</li>
            </ul>
          </Example>

          <Typography variant="h6">Not In</Typography>
          <Alert severity="warning">
            This Rule's value can be one or many values. You can enter multiple values by using the "," as separator.
          </Alert>
          <Typography paragraph>
            When the data's value does not equal to any of the rule's value, an alert is generated.
          </Typography>
          <Example>
            Given a Rule's value set to "ValueA, ValueB":
            <ul>
              <li>Data with the value: "ValueC", generates an alert.</li>
              <li>Data with the value: "ValueA", does not generates an alert.</li>
              <li>Data with the value: "ValueB", does not generates an alert.</li>
            </ul>
          </Example>

          <Typography variant="h6">Contains</Typography>
          <Typography paragraph>
            When the rule's value is contained within the data's value, an alert is generated.
          </Typography>
          <Example>
            Given a Rule's value set to "ValueA":
            <ul>
              <li>Data with the value: "ValueA", generates an alert.</li>
              <li>Data with the value: "ValueB", does not generates an alert.</li>
            </ul>
          </Example>

          <Typography variant="h6">Not Contains</Typography>
          <Typography paragraph>
            When the rule's value is not contained within the data's value, an alert is generated.
          </Typography>
          <Example>
            Given a Rule's value set to "ValueA":
            <ul>
              <li>Data with the value: "ValueB", generates an alert.</li>
              <li>Data with the value: "ValueA", does not generates an alert.</li>
            </ul>
          </Example>
        </Box>
      </DialogDefault>
    </>
  );
};
