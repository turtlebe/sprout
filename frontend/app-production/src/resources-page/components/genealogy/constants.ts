// colors used in genealogy:
//  blue - focused resource
//  lightBlue - parent resource
//  black - all others/default.

export const colors = ['black', 'blue', 'lightBlue'] as const;
export type colors = typeof colors[number];

export const FOCUSED_COLOR: colors = 'blue';
export const PARENT_COLOR: colors = 'lightBlue';
export const DEFAULT_COLOR: colors = 'black';
