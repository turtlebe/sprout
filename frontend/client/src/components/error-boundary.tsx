import { Box, createStyles, Link, Typography, WithStyles, withStyles } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const styles = createStyles({
  center: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    cursor: 'pointer',
  },
});

interface Props extends WithStyles<typeof styles> {}
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`React error boundary: ${error} ${errorInfo}`);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.classes.center}>
          <Typography variant="h4">We're sorry FarmOS encountered an error.</Typography>
          {this.state.error && (
            <Box m={2}>
              <Typography variant="h5">{this.state.error.toString()}</Typography>
            </Box>
          )}
          <Typography variant="h5">
            Check network connection and then try{' '}
            <Link className={this.props.classes.link} onClick={() => this.handleClick()}>
              refreshing
            </Link>{' '}
            your browser.
          </Typography>
          <Typography variant="h5">If problem persists, please get help in Slack channel:</Typography>
          <Link variant="h5" target="_blank" href="https://plenty-ag.slack.com/archives/C7Y0Q0N9L">
            #farmos-support
          </Link>
          {this.state.errorInfo?.componentStack && (
            <Box m={2}>
              <pre>Stack Trace:{this.state.errorInfo.componentStack}</pre>
            </Box>
          )}
        </div>
      );
    }

    return this.props.children;
  }

  private handleClick() {
    window.location.reload(true);
  }
}

export const PlentyErrorBoundary = withStyles(styles)(ErrorBoundary);
