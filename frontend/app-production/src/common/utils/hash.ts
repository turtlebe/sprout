// not a great algo but good enough for our purposes...
// taken from: https://stackoverflow.com/questions/61634063/generate-deterministic-hash-number-between-0-and-1-from-string
// given a string generates number in range: [0,1).
export function hash(str: string) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += ((i + 1) * str.codePointAt(i)) / (1 << 8);
  }
  return sum % 1;
}
