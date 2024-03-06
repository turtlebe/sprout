import { useCoreStore } from '@plentyag/core/src/core-store';
import { CurrentUserImpl } from '@plentyag/core/src/core-store/current-user-impl';

import { CoreState, CurrentUserData } from './types';

jest.mock('@plentyag/core/src/core-store');

export const DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES: CurrentUserData = {
  username: 'olittle',
  firstName: 'omar',
  lastName: 'little',
  userId: 'olittle@plenty.ag',
  permissions: {
    HYP_BETA: 'FULL',
    HYP_CROPS: 'FULL',
    HYP_DERIVED_OBSERVATIONS: 'READ_AND_LIST',
    HYP_ENVIRONMENT_V2: 'READ_AND_LIST',
    HYP_IGNITION_TAG_REGISTRY: 'READ_AND_LIST',
    HYP_LAB_TESTING: 'FULL',
    HYP_PERCEPTION: 'FULL',
    HYP_PRODUCTION: 'FULL',
    HYP_PRODUCTION_ADMIN: 'FULL',
    HYP_QUALITY: 'READ_AND_LIST',
    HYP_SENSORY: 'EDIT',
    HYP_TRACEABILITY: 'FULL',
    HYP_DEVELOPER: 'EDIT',
  },
  allowedFarmDefPaths: ['sites/LAX1/farms/LAX1', 'sites/SSF2/farms/Tigris'],
  currentFarmDefPath: 'sites/LAX1/farms/LAX1',
};

export const mockCoreState: CoreState = {
  currentUser: new CurrentUserImpl(DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES),
  farmOsModules: [],
};

export function mockCurrentUser(overrides = {}, mockActions = {}) {
  (useCoreStore as jest.Mock).mockReturnValue([
    {
      currentUser: new CurrentUserImpl({
        ...DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES,
        ...overrides,
      }),
    },
    mockActions,
  ]);
}
