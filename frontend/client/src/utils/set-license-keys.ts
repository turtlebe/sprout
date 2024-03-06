import { LicenseManager } from '@ag-grid-enterprise/core';
import { getFlaskEnvironmentVariable } from '@plentyag/core/src/utils/get-flask-environment-variable';

export function setLicenseKeys() {
  /**
   * Setting AG Grid Enterprise license key from secrets
   */
  const agGridEnterpriseLicenseKey = getFlaskEnvironmentVariable('AG_GRID_ENTERPRISE_LICENSE_KEY');
  LicenseManager.setLicenseKey(agGridEnterpriseLicenseKey);
}
