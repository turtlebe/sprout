import { Battery20, Battery50, Battery90, BatteryAlert, BatteryFull, BatteryUnknown } from '@material-ui/icons';
import { styled } from '@plentyag/brand-ui/src/material-ui/core';

export const StyledBatteryUnknown = styled(BatteryUnknown)({});

export const StyledBatteryAlert = styled(BatteryAlert)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const StyledBattery20 = styled(Battery20)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const StyledBattery50 = styled(Battery50)({
  color: '#ffa444',
});

export const StyledBattery90 = styled(Battery90)(({ theme }) => ({
  color: theme.palette.success.main,
}));

export const StyledBatteryFull = styled(BatteryFull)(({ theme }) => ({
  color: theme.palette.success.main,
}));

export const StyledBatteryLoading = styled(BatteryFull)(({ theme }) => ({
  color: theme.palette.grey[300],
}));
