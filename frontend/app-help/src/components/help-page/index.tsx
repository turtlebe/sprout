import { ArrowRight } from '@material-ui/icons';
import {
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useGetFarmOsModules } from '@plentyag/core/src/hooks';
import React from 'react';

const dataTestIds = {
  moduleLabel: 'help-page-modules-label',
  knowledgeBaseSection: 'help-page-knowledge-base',
};
export { dataTestIds as dataTestIdsHelpPage };

export const HelpPage: React.FC = () => {
  const { data } = useGetFarmOsModules();

  const helpLink = (
    <Link target="_blank" href="https://plenty-ag.slack.com/archives/farmos-support">
      #farmos-support on Slack
    </Link>
  );

  const knowledgeBaseLink = (
    <Link target="_blank" href="https://plentyag.atlassian.net/wiki/spaces/FOS/overview">
      FarmOS Knowledge Base
    </Link>
  );

  const modules = data?.farmOsModules.map(module => (
    <ListItem key={module.label}>
      <ListItemIcon style={{ minWidth: '1rem' }}>
        <ArrowRight />
      </ListItemIcon>
      <ListItemText data-testid={dataTestIds.moduleLabel}>{module.label}</ListItemText>
    </ListItem>
  ));

  return (
    <Box overflow="auto" height="100%" pb={4}>
      <Container maxWidth="sm">
        <Box my={3}>
          <Typography variant="h4">Help</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h5">General</Typography>
        </Box>
        <Typography>For general inquiries, send a message to {helpLink}.</Typography>
        <Box mt={2} data-testid={dataTestIds.knowledgeBaseSection}>
          <Typography>
            For additional information about specific FarmOS applications and how to use them, visit the{' '}
            {knowledgeBaseLink}.
          </Typography>
        </Box>

        {modules && (
          <>
            <Box mt={2}>
              <Typography variant="h5">Access</Typography>
            </Box>
            <Typography>Here are all of the capabilities that currently exist in FarmOS:</Typography>
            <List dense>{modules}</List>
            <Typography>If you need access to one of these capabilities, please request help in {helpLink}</Typography>
          </>
        )}
      </Container>
    </Box>
  );
};
