const common = theme => ({
  margin: theme.spacing(0, 2, 0, 0),
  flex: '0 0 auto',
});
export const commonStyles = theme => ({
  smallHeader: {
    ...common(theme),
    width: '140px',
  },
  mediumHeader: {
    ...common(theme),
    width: '180px',
  },
  largeHeader: {
    ...common(theme),
    width: '200px',
  },
  extraLargeHeader: {
    ...common(theme),
    width: '220px',
  },
  extraExtraLargeHeader: {
    ...common(theme),
    width: '250px',
  },
  testsHeader: {
    ...common(theme),
    width: '500px',
  },
  locationHeader: {
    ...common(theme),
    width: '340px',
  },
  productCodesHeader: {
    ...common(theme),
    width: '325px',
  },
});
