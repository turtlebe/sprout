const BASE_PATH = '/perception';

export const PATHS = {
  dashboardPage: BASE_PATH,
  searchPage: `${BASE_PATH}/search`,
  deploymentPage: (path: string) => `${BASE_PATH}/${path}`,
};
