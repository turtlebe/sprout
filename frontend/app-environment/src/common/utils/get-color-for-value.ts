const colors = [
  '#46aed7',
  '#d5532c',
  '#626ddc',
  '#63be4a',
  '#a158ca',
  '#afba3b',
  '#d050b3',
  '#3a8c3b',
  '#d54586',
  '#55c185',
  '#df3b5d',
  '#52bfb0',
  '#b33d45',
  '#37835d',
  '#d289cb',
  '#6a8d28',
  '#6362a9',
  '#dc9c34',
  '#7f97dc',
  '#9b862a',
  '#9a4c86',
  '#92b469',
  '#9a4859',
  '#5d6e2b',
  '#e17f93',
  '#c3aa6a',
  '#dd766a',
  '#86672d',
  '#e59263',
  '#a25829',
];

function* colorGenerator(): Generator<Readonly<string>> {
  let index = 0;

  while (true) {
    yield colors[index++ % colors.length];
  }
}

const state = {};
const generator = colorGenerator();

export function getColorForValue(identifier: string) {
  if (!state[identifier]) {
    state[identifier] = generator.next().value;
  }

  return state[identifier];
}
