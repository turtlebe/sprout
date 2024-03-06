/**
 * Attempts to read an environment variable from plenty global.
 * The plenty global in set by sprout backend via the react index.html.
 * note: local dev env won't have plenty since index.html is served by webpack
 * dev server rather than sprout.
 * @param name Name of environment variable.
 */
export function getFlaskEnvironmentVariable(name: string): string | undefined {
  return window.plenty?.env[name];
}
