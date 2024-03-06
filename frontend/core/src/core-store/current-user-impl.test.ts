import { CurrentUserImpl } from './current-user-impl';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES } from './test-helpers';
import { PermissionLevels, Resources } from './types';

const userData = DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES;

describe('CurrentUserImpl', () => {
  it('throws exception if missing required data', () => {
    const userData = {
      username: 'mary',
      // missing all other fields.
    };
    expect(() => new CurrentUserImpl(userData)).toThrow();
  });

  it('creates user data when all data provided', () => {
    expect(() => new CurrentUserImpl(userData)).not.toThrow();
    const user = new CurrentUserImpl(userData);
    expect(user).toEqual(userData);
  });

  it('will return false when permission level not met', () => {
    const userDataWithReadAndListPermission = {
      ...userData,
      permissions: { HYP_LAB_TESTING: 'READ_AND_LIST' },
    };
    const user = new CurrentUserImpl(userDataWithReadAndListPermission);

    expect(user.hasPermission(Resources.HYP_LAB_TESTING, PermissionLevels.EDIT)).toBe(false);
    expect(user.hasPermission(Resources.HYP_LAB_TESTING, PermissionLevels.FULL)).toBe(false);
  });

  it('will return true when permission level met', () => {
    const userDataWithEditPermission = {
      ...userData,
      permissions: { HYP_LAB_TESTING: 'EDIT' },
    };

    const user = new CurrentUserImpl(userDataWithEditPermission);
    expect(user.hasPermission(Resources.HYP_LAB_TESTING, PermissionLevels.EDIT)).toBe(true);
    expect(user.hasPermission(Resources.HYP_LAB_TESTING, PermissionLevels.READ_AND_LIST)).toBe(true);
  });

  it('returns true when user is a developer, otherwise false', () => {
    const userDataWithFullDev = {
      ...userData,
      permissions: { HYP_DEVELOPER: 'FULL' },
    };
    const dev_user = new CurrentUserImpl(userDataWithFullDev);
    expect(dev_user.isDeveloper()).toBe(true);

    const userDataWithNoDev = {
      ...userData,
    };
    const non_dev_user = new CurrentUserImpl(userDataWithNoDev);
    expect(non_dev_user.isDeveloper()).toBe(false);

    const userDataWithEditDev = {
      ...userData,
      permissions: { HYP_DEVELOPER: 'EDIT' },
    };
    const dev_user_with_only_edit = new CurrentUserImpl(userDataWithEditDev);
    expect(dev_user_with_only_edit.isDeveloper()).toBe(false);
  });
});
