import { eg1, input } from './input';
import { cleanAndParse, generateArray, sumOf } from '../../utils';
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

function countValid(input: string, blocks: number[], depth: number, cache: Map<string, [number, number]>): number {
  const cacheKey = `${input}|${blocks.join(",")}`;

  if (cache.has(cacheKey)) {
    const hit = cache.get(cacheKey)!;
    hit[1]++;
    return hit[0];
  }

  const stringLength = input.length;
  const blocksCount = blocks.length;
  const blocksTotal = sumOf(blocks);
  const stringBlocksLowerBound = input.split(/\.+/).filter(b => b.replaceAll("?", "").length).length;

  if (stringLength < (blocksCount + blocksTotal - 1)) {
    cache.set(cacheKey, [0, 1]);
    return 0;
  }

  if (stringBlocksLowerBound > blocksCount) {
    cache.set(cacheKey, [0, 1]);
    return 0;
  }

  if (stringBlocksLowerBound === 0 && blocksCount === 0) {
    cache.set(cacheKey, [1, 1]);
    return 1;
  }

  const nextBlocks = blocks.slice(1);
  const firstBlock = blocks.at(0);

  const searchRegex = new RegExp(`[.?](?=[#?]{${firstBlock}}[.?])`, "g");
  const expandedInput = `.${input}.`;

  const foundIndexes = Array.from(expandedInput.matchAll(searchRegex))
    .map(m => m.index!)
    .filter(i => !input.slice(0, i).includes("#")); // to prevent skipping over a block (could also have done this with a negative lookbehind in the regex - "(?<=^[^#]*)" at the start)

  const foundTotals = foundIndexes.map(i => countValid(input.slice(i + 1 + firstBlock!), nextBlocks, depth + 1, cache));

  const sum = sumOf(foundTotals);

  cache.set(cacheKey, [sum, 1]);
  return sumOf(foundTotals);
}

function parseAndCopy(input: string, copies: number) {
  return cleanAndParse(input, (l, i) => {
    const [rawSprings, rawNumbers] = l.split(" ");
    const springs = generateArray(copies, () => rawSprings).join("?");
    const numbers = generateArray(copies, () => rawNumbers.split(",")).flat().map(Number);

    return { springs, numbers };
  });
}

function part(input: string, copies: number) {
  const parsed = parseAndCopy(input, copies);

  const cache = new Map<string, [number, number]>();
  const result = parsed.map(p => countValid(p.springs, p.numbers, 1, cache));

  return sumOf(result);
}

export function part1() {
  return part(input, 1);
}

export function part2() {
  return part(input, 5);
}

export const answers = [
  7670, // eg -> 21 | real -> 7670,
  157383940585037 // eg -> 525152 | real -> 157383940585037
];
