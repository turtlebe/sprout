import { getCookie } from './get-cookie';

/**
 * Returns true if cookie with name 'ignition' exists.
 * This is cookie set by ignition browser when using embedded
 * browser in ignition. see code in https://github.com/PlentyAg/mes_lib
 */
export function isIgnition() {
  return !!getCookie('ignition');
}
