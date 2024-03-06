export interface ReplaceTokensOptions {
  open: string;
  close: string;
}

export const DEFAULT_OPTIONS = { open: '{', close: '}' };

/**
 * This tool is a simple templating string formatter.
 *
 * usage:
 *   const string = "My phone is {color}"
 *   const data = { color: 'black' };
 *
 *   replaceTokens(string, token => data[token]);
 *   // "My phone is black"
 *
 * @param {string} templateString
 * @param {(item: string) => string} callback
 * @param {ReplaceTokensOptions} options
 * @returns {string}
 */
export const replaceTokens = (
  templateString: string,
  callback: (item: string) => string,
  options: ReplaceTokensOptions = DEFAULT_OPTIONS
): string => {
  const regExp = new RegExp(`${options.open}([^${options.close}]*)${options.close}`, 'g');
  return templateString.replace(regExp, (_, tokenKey) => callback(tokenKey));
};
