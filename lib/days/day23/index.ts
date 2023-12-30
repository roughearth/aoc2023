import { eg1, input } from './input';
import { ArrayKeyedMap, ArrayKeyedSet, Coordinate, CoordinateRange, cleanAndParse, coordinates, inRange, orthogonalNeighbours, simpleRange } from '../../utils';
import { Day } from '..';

type ArrayKeyedSet = ReturnType<typeof ArrayKeyedSet>;
type ArrayKeyedMap = ReturnType<typeof ArrayKeyedMap>;


export const meta: Day['meta'] = {
  manualStart: true
};

const moves: Record<string, Move> = {
  N: { move: [-1, 0], arrow: '^' },
  S: { move: [1, 0], arrow: 'v' },
  E: { move: [0, 1], arrow: '>' },
  W: { move: [0, -1], arrow: '<' }
};

type Move = { move: number[], arrow: string };

const directions = Object.keys(moves);

function parse(input: string, part: 1 | 2) {
  if (part === 2) {
    input = input.replace(/[<>v^]/g, '.');
  }

  const rawGrid = cleanAndParse(input, l => l.split(''));
  const width = rawGrid[0].length;
  const height = rawGrid.length;

  const range = simpleRange([height, width]);

  const startSrc: Coordinate = [0, 1];
  const endSrc: Coordinate = [height - 1, width - 2];

  const walls: Coordinate[] = [];
  const passages: Record<number, Coordinate[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    [-1]: []
  };

  for (const [y, x] of coordinates(range)) {
    const cell = rawGrid[y][x];

    if (cell === '#') {
      walls.push([y, x]);
    }
    else {
      const neighbours = Array.from(
        orthogonalNeighbours([y, x], range)
      ).filter(
        ([ny, nx]) => rawGrid[ny][nx] !== '#'
      );

      passages[neighbours.length].push([y, x]);
    }
  }

  const nodes = [startSrc, endSrc, ...passages[3], ...passages[4]];

  const outgoing = new Map<string, Map<string, number>>(
    nodes.map(
      coord => {
        const key = coord.join(',');
        const edges = new Map<string, number>(
          nextCells(rawGrid, coord, range, ArrayKeyedSet()).flatMap(from => {
            const edge = traceEdge(rawGrid, endSrc, coord, from, range, nodes);

            if (!edge) return [];

            return [[edge.end.join(","), edge.weight]];
          })
        );


        return [key, edges];
      }
    )
  );

  const incoming = new Map<string, Map<string, number>>(
    nodes.map(
      coord => {
        const key = coord.join(',');
        const edges = new Map<string, number>();

        return [key, edges];
      }
    )
  );

  outgoing.forEach((edges, from) => {
    edges.forEach((weight, to) => {
      incoming.get(to)!.set(from, weight);
    });
  });

  const start = startSrc.join(',');
  const end = endSrc.join(',');

  const parsed = { start, end, outgoing, incoming };

  return parsed;
}

export function part1() {
  const { start, end, incoming, outgoing } = parse(input, 1);

  const topologicalOrder: string[] = [];
  const sortQueue = [start];
  const incomingClone = new Map([...incoming.entries()].map(([k, v]) => [k, new Map(v)]));

  while (sortQueue.length > 0) {
    const node = sortQueue.shift()!;

    topologicalOrder.push(node);

    const edges = outgoing.get(node)!;

    for (const [to] of edges) {
      const incomingEdges = incomingClone.get(to)!;

      incomingEdges.delete(node);

      if (incomingEdges.size === 0) {
        sortQueue.push(to);
      }
    }
  }

  const lengths = new Map<string, number>();

  topologicalOrder.forEach(n => {
    const incomingEdges = incoming.get(n)!;
    if (incomingEdges.size === 0) {
      lengths.set(n, 0);
      return;
    }

    const max = Math.max(
      ...Array.from(incomingEdges.entries()).map(([from, weight]) => lengths.get(from)! + weight)
    );

    lengths.set(n, max);
  });

  return lengths.get(end)!;
}

export function part2() {
  const { start, end, outgoing } = parse(input, 2);

  console.log({ start, outgoing });

  const recurse = (node: string, path: string[]) => {
    // console.log("recurse", node, path)

    if (node === end) {
      return 0;
    }

    path.push(node);

    const edges = [...outgoing.get(node)!.entries()];
    const validEdges = edges.filter(([next]) => !path.includes(next));

    const edgeCosts = validEdges.map(([next, cost]) => cost + recurse(next, path));
    const cost: number = Math.max(...edgeCosts);

    path.pop();

    return cost;
  };

  const path: string[] = [];

  const ans = recurse(start, path);

  console.log({ path });

  return ans;
}

export const answers = [
  2238,
  6398
];


function nextCells(grid: string[][], [y, x]: Coordinate, range: CoordinateRange, visited: ArrayKeyedSet): Coordinate[] {
  return directions.flatMap(d => {
    const { move: [dy, dx], arrow } = moves[d];

    const [ny, nx] = [y + dy, x + dx];

    if (!inRange([ny, nx], range)) {
      return [];
    }

    if (visited.has([ny, nx])) {
      return [];
    }

    const testCell = grid[ny][nx];

    if (testCell === '.' || testCell === arrow) {
      return [[ny, nx]];
    }

    return [];
  });
}


function traceEdge(
  grid: string[][],
  exit: Coordinate,
  start: Coordinate,
  first: Coordinate,
  range: CoordinateRange,
  nodes: Coordinate[]
) {
  let [y, x] = first;
  let next: Coordinate[] = [];
  const visited = ArrayKeyedSet([start]);

  let N = 0;

  while (true) {
    if (N++ > 1e5) throw new Error('too many iterations');

    visited.add([y, x]);
    next = nextCells(grid, [y, x], range, visited);

    if (nodes.some(([ny, nx]) => ny === y && nx === x)) {
      return { end: [y, x], weight: N, from: first };
    }

    if (next.length === 0) {
      if (y === exit[0] && x === exit[1]) {
        return { end: [y, x], weight: N, from: first };

      }

      return undefined;
    }

    [[y, x]] = next;
  }
}

type Edge = Exclude<ReturnType<typeof traceEdge>, undefined>;