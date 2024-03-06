import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  topLevelContainerBox: {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: '4px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dndContainer: {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: '4px',
    padding: '0.5rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
    display: 'flex',
    width: '100%',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dndDragIndicatorIcon: {
    height: '100%',
    marginLeft: '5px',
    marginRight: '15px',
  },
  fieldName: {
    marginRight: 'auto',
    maxWidth: '200px',
    overflowWrap: 'break-word',
  },
  fieldType: {
    marginRight: '5px',
  },
  fieldRequired: {
    marginRight: '5px',
  },
  subtitleText: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: '5px',
  },
  divider: {
    margin: '5px',
  },
  newFieldLabel: {
    height: '100%',
    marginLeft: '15px',
    marginRight: '15px',
    fontSize: '1rem',
  },
  newFieldInput: {
    height: '100%',
    marginLeft: 'auto',
    marginRight: '15px',
    width: '200px',
  },
  addNewButton: {
    height: '100%',
    marginLeft: 'auto',
    marginRight: '15px',
    backgroundColor: '#0275d8',
    color: '#fff',
    fontSize: '1rem',
    margin: '5px',
  },
  newFieldBox: {
    display: 'flex',
    alignItems: 'center',
  },
  newFieldError: {
    marginLeft: '15px',
    color: 'red',
    fontSize: '1rem',
  },
  dndTooltip: {
    height: '100%',
    marginRight: '5px',
  },
  dndInput: {
    width: '100%',
  },
}));
