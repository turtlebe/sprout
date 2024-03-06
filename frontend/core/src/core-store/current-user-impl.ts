import { CurrentUser, PermissionLevels, Resources } from './types';

export class CurrentUserImpl implements CurrentUser {
  public username = '';
  public firstName = '';
  public lastName = '';
  public userId = '';
  public allowedFarmDefPaths = [];
  public currentFarmDefPath = '';
  public permissions: Record<Resources, string> = {
    HYP_BETA: '',
    HYP_CROPS: '',
    HYP_DERIVED_OBSERVATIONS: '',
    HYP_ENVIRONMENT_V2: '',
    HYP_IGNITION_TAG_REGISTRY: '',
    HYP_LAB_TESTING: '',
    HYP_PERCEPTION: '',
    HYP_PRODUCTION: '',
    HYP_PRODUCTION_ADMIN: '',
    HYP_QUALITY: '',
    HYP_SENSORY: '',
    HYP_TRACEABILITY: '',
    HYP_DEVELOPER: '',
  };

  public constructor(userData: any) {
    // validate that all public props above are provided in userData.
    Object.getOwnPropertyNames(this).forEach(prop => {
      if (!userData[prop]) {
        throw new Error(`Invalid user data, missing required field: ${prop}`);
      }
      this[prop] = userData[prop];
    });
  }

  public hasPermission(resource: Resources, level: PermissionLevels) {
    const levelForResource = this.getLevel(resource);
    if (typeof levelForResource === 'number') {
      return level <= levelForResource;
    } else {
      return false;
    }
  }

  /**
   * This function returns true if the user is a developer.
   *
   * This is the same function as used in hypocotol:
   * https://github.com/PlentyAg/Hypocotyl/blob/master/static/js/permissionsManager.js#L90
   *
   * During the employee onboarding process software developers should get assigned the
   * "hypocotyl-developer-role" which includes giving full permission for this resource.
   * The onboarding script is here:
   * https://plentyag.atlassian.net/wiki/spaces/EN/pages/2061205692/SD+-+Onboarding+Supplementary+Checklist+2022
   */
  public isDeveloper(): boolean {
    return this.hasPermission(Resources.HYP_DEVELOPER, PermissionLevels.FULL);
  }

  private getLevel(resource: Resources): number | undefined {
    const permssionsLevelStr = this.permissions[resource];
    // reverse map on the enum to get the numeric value.
    return permssionsLevelStr && PermissionLevels[permssionsLevelStr];
  }
}
