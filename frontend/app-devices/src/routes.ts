const BASE_PATH = '/devices-v2';

export const ROUTES = {
  devicesPage: BASE_PATH,
  deviceRegistrationPage: `${BASE_PATH}/register`,
  devicePage: (id: string) => `${BASE_PATH}/${id}`,
  devicePageTab: (id: string, tab: string) => `${BASE_PATH}/${id}/${tab}`,
  upgradeFirmwarePage: (redisJsonObjectId: string) => `${BASE_PATH}/upgrade-firmware/${redisJsonObjectId}`,
  commissionDevices: (redisJsonObjectId: string) => `${BASE_PATH}/commission/${redisJsonObjectId}`,
  decommissionDevices: (redisJsonObjectId: string) => `${BASE_PATH}/decommission/${redisJsonObjectId}`,
  swapDevices: (redisJsonObjectId: string) => `${BASE_PATH}/swap/${redisJsonObjectId}`,
};
