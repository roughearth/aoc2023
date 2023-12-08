import { eg1, input } from './input';
import { cleanAndParse, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const pt1 = 0;
const pt2 = 1;

function parseData(input: string) {
  const data = cleanAndParse(input, l => {
    const [hand, bid] = l.split(' ');
    return {
      hand,
      bid: Number(bid),
      type: [getType(hand, pt1), getType(hand, pt2)],
      value: [getValue(hand, pt1), getValue(hand, pt2)],
      rank: -1,
      winnings: -1
    };
  });

  return data;
}
type Hand = ReturnType<typeof parseData>[number];

/*
Part 2 types
Ignore combinations where Jokers are different to the rest of the hand

> 11111|0 = hi
> 1112|0 = 1p
> 122|0 = 2p
> 113|0 = 3k
> 23|0 = fh
> 14|0 = 4k
> 5|0 = 5k

> 1111|1 = 1p (1112)
> 112|1 = 2p (122) or 3k (113)
> 13|1 = fh (23) or 4k (14)
> 22|1 = fh (23)
> 4|1 = 5k (5)

> 111|2 = 2p (122) or 3k (113)
> 12|2 = fh (23) or 4k (14)
> 3|2 = 5k (5)

> 11|3 = fh (23) or 4k (14)
> 2|3 = 5k (5)

> 1|4 = 5k (5)

> 0|5 = 5k (5)


*/
const Types = [
  [ // High card (0)
    "11111",
    "11111|0"
  ],
  [ // One pair (1)
    "1112",
    "1112|0",
    "1111|1"
  ],
  [ // Two pair (2)
    "122",
    "122|0"
  ],
  [ // Three of a kind (3)
    "113",
    "113|0",
    "112|1",
    "111|2"
  ],
  [ // Full house (4)
    "23",
    "23|0",
    "22|1",
  ],
  [ // Four of a kind (5)
    "14",
    "14|0",
    "13|1",
    "12|2",
    "11|3"
  ],
  [ // Five of a kind (6)
    "5",
    "5|0",
    "4|1",
    "3|2",
    "2|3",
    "1|4",
    "|5"
  ],
];

function getType(hand: string, pt: number) {
  const faceMap = new Map<string, number>();

  for (const c of hand) {
    const count = faceMap.get(c) || 0;
    faceMap.set(c, count + 1);
  }

  let counts: string;

  if (pt === 0) {
    counts = [...faceMap.values()].sort().join('');
  }
  else {
    const jCount = faceMap.get('J') || 0;
    faceMap.delete('J');

    counts = `${[...faceMap.values()].sort().join('')}|${jCount}`;
  }

  return Types.findIndex(t => t.includes(counts));
}

const Faces = ["23456789TJQKA", "J23456789TQKA"];
const FaceValues = "0123456789ABC"
const Base = FaceValues.length

function getValue(hand: string, pt: number) {
  const value = Array.from(hand)
    .map(c => FaceValues[Faces[pt].indexOf(c)])
    .join('');
  return parseInt(value, Base);
}

const compare = (pt: number) => (a: Hand, b: Hand) => {
  if (a.type[pt] === b.type[pt]) {
    return b.value[pt] - a.value[pt];
  }
  return b.type[pt] - a.type[pt];
}

function doPart(pt: number, input: string) {
  const hands = parseData(input).sort(compare(pt));

  let rank = hands.length;

  for (const hand of hands) {
    hand.rank = rank--;
    hand.winnings = hand.bid * hand.rank;
  }

  const answer = sumOf(hands.map(h => h.winnings));

  return answer;
}

export function part1() {
  return doPart(pt1, input);
}

export function part2() {
  return doPart(pt2, input);
}

export const answers = [
  251927063,
  255632664
];
