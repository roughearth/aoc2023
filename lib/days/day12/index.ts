import { eg1, input } from './input';
import { cleanAndParse, generateArray, sumOf, sumPartitions } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  // manualStart: true
};

/*

. good
# bad
? unknown

p,q,r is 3 blocks of consecutive bad, of length p, then q, then r

countValid of string and blocks
  consider
    * stringLength
      - the length of the string
    * blocksCount
      - the number of entries in blocks
    * blocksTotal
      - the sum of all entries in blocks
    * stringBlocksLowerBound
      - the lower bound of the number of blocks in the string
      - (the number of contiguous blocks of only ? and # that contain at least one #)
      - string.split(/\.+/).filter(b => b.replaceAll("?", "").length).length

    if stringLength < (blocksCount + blocksTotal - 1)
      (simply not enough characters to satisfy the blocks)
      return 0
    if stringBlocksLowerBound > blocksCount
      (not enough blocks to satisfy the string)
      (this also covers "no blocks left but the string needs some")
      return 0
    if stringBlocksLowerBound === blocksCount === 0
      (can be satisfied by all ".", but in exactly 1 way)
      (this also covers "no string left, and no blocks left")
      return 1
    ######
      More exit conditions??
    ######
    (else)
      return sum(forEach valid position of first block
                  countValid of remainingString and remainingBlocks
                )


*/
function parseAndCopy(input: string, copies: number) {
  return cleanAndParse(input, (l, i) => {
    const [rawSprings, rawNumbers] = l.split(" ");
    const springs = rawSprings.repeat(copies);
    const numbers = generateArray(copies, () => rawNumbers.split(",")).flat().map(Number);


    return { springs, numbers };
  });
}

export function part1() {
  const parsed = parseAndCopy(eg1, 1);

  console.log({ parsed });

  return "todo"
}

export function part2() {
  const parsed = parseAndCopy(eg1, 5);

  // console.log({ parsed });

  return "todo"
}

export const answers = [
  21, // <- eg | real -> 7670,
  525152 // <- eg | real -> ???
];
