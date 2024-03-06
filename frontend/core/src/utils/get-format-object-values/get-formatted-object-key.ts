import v from 'voca';

/**
 * Function to format usual camel or snake case keys into a separated word phrase.
 * It will also capitalize the phrase.
 */
export const getFormattedObjectKey = (key: string) => {
  return v(key).chain().capitalize().words().value().join(' ');
};
