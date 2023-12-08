import { eg1, eg2, input } from './input';
import { cleanAndParse, gcd, lcm } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parse(input: string) {
  const lines = cleanAndParse(input);

  const sequence = Array.from(lines[0]);

  const ANodes = new Set<string>();
  const ZNodes = new Set<string>();

  const nodes = new Map(lines.slice(2).map(line => {
    const id = line.slice(0, 3);
    const L = line.slice(7, 10);
    const R = line.slice(12, 15);

    if (id.endsWith('A')) {
      ANodes.add(id);
    }
    if (id.endsWith('Z')) {
      ZNodes.add(id);
    }

    return [id, new Map(Object.entries({ L, R }))];
  }));

  return { sequence, nodes, ANodes, ZNodes };
}

export function part1() {
  const { sequence, nodes } = parse(input);

  let cursor = 0;
  const { length } = sequence;

  let node = 'AAA';

  while (node !== 'ZZZ') {
    const moves = nodes.get(node)!;
    const move = sequence[cursor % length];

    node = moves.get(move)!;
    cursor++;
  }

  return cursor;
}

export function part2() {
  const { sequence, nodes, ANodes, ZNodes } = parse(input);

  const { length } = sequence;

  const oneByOne = Array.from(ANodes).map(node => {
    let cursor = 0;

    while (!ZNodes.has(node)) {
      const moves = nodes.get(node)!;
      const move = sequence[cursor % length];

      node = moves.get(move)!;
      cursor++;
    }

    return cursor;
  });


  const reducer = gcd(...oneByOne);
  const reduced = oneByOne.map(n => n / reducer);

  return lcm(length, ...reduced);
}

export const answers = [
  12361,
  18215611419223
];
