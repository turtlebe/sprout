import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { CommissionDevicesPage } from './commission-devices-page';
import { DecommissionDevicesPage } from './decommission-devices-page';
import { DevicePage } from './device-page';
import { DeviceRegistrationPage } from './device-registration-page';
import { DevicesPage } from './devices-page';
import { ROUTES } from './routes';
import { SwapDevicesPage } from './swap-devices-page';
import { UpgradeFirmwarePage } from './upgrade-firmware-page';

export const Devices: React.FC = () => {
  document.title = 'FarmOS - Devices V2 App';

  return (
    <Switch>
      <Route path={ROUTES.devicesPage} component={DevicesPage} exact />
      <Route path={ROUTES.upgradeFirmwarePage(':redisJsonObjectId')} component={UpgradeFirmwarePage} exact />
      <Route path={ROUTES.commissionDevices(':redisJsonObjectId')} component={CommissionDevicesPage} exact />
      <Route path={ROUTES.decommissionDevices(':redisJsonObjectId')} component={DecommissionDevicesPage} exact />
      <Route path={ROUTES.swapDevices(':redisJsonObjectId')} component={SwapDevicesPage} exact />
      <Route path={ROUTES.deviceRegistrationPage} component={DeviceRegistrationPage} exact />

      {/* Catch all /devices/:deviceId redirecting to a device page */}
      <Route path={ROUTES.devicePage(':deviceId')} component={DevicePage} exact />
      <Route path={ROUTES.devicePageTab(':deviceId', ':tab')} component={DevicePage} exact />

      {/* Catch all redireting to DevicesPage if the route does not exist */}
      <Route path={ROUTES.devicesPage} render={() => <Redirect to={ROUTES.devicesPage} />} />
    </Switch>
  );
};
