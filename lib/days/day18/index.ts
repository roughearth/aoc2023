import { eg1, input } from './input';
import { cleanAndParse, CoordinateRange, findRange, growRange, orthogonalNeighbours } from '../../utils';
import { Day } from '..';
import { dijkstraFrom } from '../../utils/dijkstra';

export const meta: Day['meta'] = {};

function toNeighbourEntries(src: string): [string, string[]] {
  const coords = src.split(",").map(Number);

  const neighbourCoords = Array.from(orthogonalNeighbours(coords));

  return [src, neighbourCoords.map(c => c.join(","))];
}


export function part1() {
  const entries = cleanAndParse(input, toNeighbourEntries);

  const neighbourMap = new Map(entries);
  let found = 0;

  for (const [cube, neighbours] of neighbourMap) {
    let faces = 6;
    for (const neighbour of neighbours) {
      if (neighbourMap.has(neighbour)) {
        faces--;
      }
    }
    found += faces;
  }

  return found;
}

function findOutsides(
  neighbourMap: Map<string, string[]>,
  range: CoordinateRange
) {
  const dj = dijkstraFrom(
    range.map(([min]) => min).join(","),
    c => {
      const coords = c.split(",").map(Number);
      const neighbourCoords = Array.from(
        orthogonalNeighbours(coords, range)
      ).map(c => c.join(","));

      return neighbourCoords.filter(
        n => !neighbourMap.has(n)
      ).map(
        n => [n, 1]
      )
    }
  );

  return new Set(dj.cover().keys());
}

export function part2() {
  const src = input;
  const entries = cleanAndParse(src, toNeighbourEntries);
  const neighbourMap = new Map(entries);

  const cubes = cleanAndParse(src, s => s.split(",").map(Number));
  const range = findRange(cubes);

  const allOutsides = findOutsides(neighbourMap, growRange(range));

  let found = 0;

  for (const [, neighbours] of neighbourMap) {
    for (const neighbour of neighbours) {
      if (allOutsides.has(neighbour)) {
        found++;
      }
    }
  }

  return found;
}

export const answers = [
  3498,
  2008
];
