/**
 * These colors are used to display multiple Metrics and their Observations on the same d3 graph.
 *
 * The first index is for the Observations SVG Line, while the two last element will be used for AlertRules SVG Areas.
 */
export const colors: readonly (readonly string[])[] = [
  ['#a73a38', '#ef5350', '#f27573'],
  ['#773183', '#ab47bc', '#bb6bc9'],
  ['#404a86', '#5c6bc0', '#7c88cc'],
  ['#1c7fac', '#29b6f6', '#53c4f7'],
  ['#1a746b', '#26a69a', '#51b7ae'],
  ['#6d8e46', '#9ccc65', '#afd683'],
  ['#b2a63d', '#ffee58', '#fff179'],
  ['#b2741a', '#ffa726', '#ffb851'],
  ['#b24e2e', '#ff7043', '#ff7043'],
];

export function* getColorGenerator(): Generator<Readonly<string[]>> {
  let index = 0;

  while (true) {
    yield colors[index++ % colors.length];
  }
}

// To generate more colors: https://medialab.github.io/iwanthue/

/**
 * These colors are used to display multiple Metrics and their Observations on the same d3 graph.
 *
 * The first index is for the Observations SVG Line, while the two last element will be used for AlertRules SVG Areas.
 */
export const scheduleColors: readonly string[] = [
  '#54478c',
  '#048ba8',
  '#68b75e',
  '#b0aa3c',
  '#f29e4c',
  '#5ebf8a',
  '#c24fb6',
  '#50c563',
  '#7965d8',
  '#5baa37',
  '#da4879',
  '#9fb737',
  '#885aa4',
  '#c2ab40',
  '#637dc8',
  '#db943b',
  '#5da5d8',
  '#d64737',
  '#3fc1bf',
  '#ae592c',
  '#37835d',
  '#d58bc7',
  '#547d2f',
  '#a34961',
  '#9fb26a',
  '#e08b74',
  '#846f2d',
];

export function* getScheduleColorGenerator(): Generator<Readonly<string>> {
  let index = 0;

  while (true) {
    yield scheduleColors[index++ % scheduleColors.length];
  }
}
