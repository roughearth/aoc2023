import { generateArray } from "./array";

export type CoordinateLimits = [number, number];
export type CoordinateRange = CoordinateLimits[];
export type Coordinate = number[];
/**
 * Return a `CoordinateRange` from 0 with the given count of coordinates in each dimension
 * @param sizes array of the size in each dimension. Range is 0...(size - 1)
 * @param dims number of dimensions required, defaults to the number of `sizes` given
 */
export function simpleRange(sizes: number[], dims = sizes.length): CoordinateRange {
  const range: CoordinateRange = sizes.map(m => [0, m - 1]);
  validateRange(range);

  while (range.length < dims) {
    range.push([0, 0]);
  }

  return range;
}

/**
 * Returns a new range that's more expansive in every direction by the given amount
 * @param range
 * @param by
 */
export function growRange(range: CoordinateRange, by = 1): CoordinateRange {
  return range.map(([min, max]) => [min - by, max + by]);
}

export function cloneRange(range: CoordinateRange): CoordinateRange {
  return range.map(([min, max]) => [min, max]);
}

export function findRange(coords: Coordinate[]): CoordinateRange {
  if (coords.length === 0) {
    throw new Error("Cannot find the range of an empty set");
  }

  let dims = coords[0].length;

  if (dims === 0) {
    throw new Error("Cannot find the range of a set with zero dimensions (first point determines dimensions).");
  }

  let range: CoordinateRange = generateArray(
    dims,
    () => [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  for (const coord of coords) {
    if (coord.length !== dims) {
      throw new Error("Cannot find the range of a set of points with mixed dimensions (first point determines dimensions).");
    }

    for (let d = 0; d < dims; d++) {
      range[d] = [
        Math.min(coord[d], range[d][0]),
        Math.max(coord[d], range[d][1])
      ]
    }
  }

  return range;
}


/**
 * Tests if a given coordinate lies within a given range
 * @param coord
 * @param range
 */
export function inRange(coord: Coordinate, range: CoordinateRange): boolean {
  if (coord.length !== range.length) {
    throw new Error(`Co-ordinate has wrong dimension size ${coord.length} != ${range.length}`);
  }

  return coord.reduce((res: boolean, n, dim) => {
    const [min, max] = range[dim];
    return res && (n >= min) && (n <= max);
  }, true);
}

/**
 * Obtains the intersection between two ranges, to limit one range to lie within another.
 * Useful for constraining a grown range within a parent
 * @param target
 * @param limit
 */
export function constrainRange(target: CoordinateRange, limit: CoordinateRange): CoordinateRange {
  if (target.length !== limit.length) {
    throw new Error(`Target range has wrong dimension size ${target.length} != ${limit.length}`);
  }

  const constrainedRange: CoordinateRange = target.map((
    [min, max],
    i
  ) => {
    let [lo, hi] = limit[i];
    return [Math.max(min, lo), Math.min(max, hi)];
  });

  try {
    validateRange(constrainedRange);
  }
  catch(e: any) {
    if (e.message.startsWith("Range is invalid at dimension")) {
      const dimMsg = e.message.slice(30);
      throw new Error(`Range has no overlap at dimension ${dimMsg}`);
    }
    throw e;
  }

  return constrainedRange;
}

function validateRange(range: CoordinateRange, dim = range.length) {
  if (range.length !== dim) {
    throw new Error(`Range has invalid dimension size ${range.length} != ${dim}`)
  }
  range.forEach(([min, max], i) => {
    if (min > max) {
      throw new Error(`Range is invalid at dimension ${i + 1}, ${min} > ${max}`)
    }
  });

  return true;
}

/**
 * Generate all possible tuples of coordinates in the given `CoordinateRange`
 * @param limits
 */
export function* coordinates(limits: CoordinateRange) {
  validateRange(limits);
  const current = limits.map(([min]) => min); // start at all the mins
  const lastDim = limits.length - 1;

  outer:
  while (true) { // will break when there are no more coords to yeild
    // (re)set to changing the "right-most" dimension
    let i = lastDim;
    let [min, max] = limits[lastDim];

    // copy it to avoid accidental mutation;
    yield [...current] as Coordinate;

    while (true) { // increment, moving "left" until wrapping is uncessessary
      const next = current[i] + 1;

      if (next > max) { // can't go higher in this dimension
        if (i === 0) {
          // moving "left" isn't possible, so stop
          break outer;
        }

        current[i] = min; // back to the beginning
        i -= 1; // "left" a dimension
        [min, max] = limits[i]; // read the limits
      }
      else {
        current[i] = next;
        break;
      }
    }
  }
}
export type CoordinateIterator = ReturnType<typeof coordinates>;

/**
 * Generate *all* the neighbours of the given coordinate, even "diagonals".
 * (ie all the coordinates that differ by 1 in 1 or more dimensions)
 * @param center
 */
export function* neighbours(center: number[], range?: CoordinateRange) {
  let limits: CoordinateRange = center.map(c => [c - 1, c + 1]);
  if (range) {
    limits = constrainRange(limits, range);
  }

  for (const neighbour of coordinates(limits)) {
    if (neighbour.reduce((b, c, i) => (b && c === center[i]), true)) {
      continue;
    }
    yield neighbour;
  }
}

/**
 * Generate all the orthogonal neighbours of the given coordinate.
 * (ie all the coordinates that differ by 1 in exactly 1 dimension)
 * @param center
 */
export function* orthogonalNeighbours(center: number[], range?: CoordinateRange) {
  let dim = center.length;
  const diffs = [-1, 1];

  while (dim--) {
    for (const d of diffs) {
      const neighbour = [...center];
      neighbour[dim] += d;

      if (!range || inRange(neighbour, range)) {
        yield neighbour;
      }
    }
  }
}

const HEX_DIFFS = [
  [-1,  0],
  [ 0, -1],
  [-1,  1],
  [ 1, -1],
  [ 0,  1],
  [ 1,  0]
]

// with this choice, all 3 planes are identically hexagonal
const FCC_DIFFS = [
  [ 0,  0, -1],
  [ 0,  1, -1],
  [ 1,  0, -1],

  ...HEX_DIFFS.map(d => [...d, 0]),

  [-1,  0,  1],
  [ 0, -1,  1],
  [ 0,  0,  1],
];

export function* hexagonalNeighbors([x, y]: number[]) {
  for(const [dx, dy] of HEX_DIFFS) {
    yield [x + dx, y + dy];
  }
}

export function* faceCentredCubicNeighbors([x, y, z]: number[]) {
  for(const [dx, dy, dz] of FCC_DIFFS) {
    yield [x + dx, y + dy, z + dz];
  }
}

/**
 * Pad a coordinate with trailing zeros to match the given dimension count
 * @param coords
 * @param dims
 */
export function padCoordinate(coords: number[], dims: number) {
  return Object.assign(Array(dims).fill(0), coords);
}

/**
 * Turn a coordinate in to a string key suitable for a map
 * NOTE: If the coordinate range has reasonable bounds, `getIntKey` is much faster
 * Using an `ArrayKeyedMap` is also faster, if a little slower than `getIntKey`, but not size limited
 * @param coords
 */
export function getKey(coords: number[]): string {
  // join is much faster than JSON.stringify
  return coords.join();
}

/**
 * Turn a coordinate in to an integer key suitable for a map
 * NOTES: Limited for large ranges by MAX_SAFE_INTEGER, but much faster than `getKey`
 * Using an `ArrayKeyedMap` is a little slower, but not size limited
 * @param coords
 */
export function getIntKey(coords: number[], hashSize = 100): number {
  let key = 0;
  let pwr = 1;
  const pwrChange = hashSize * 2;

  for (const coord of coords) {
    key += (coord + hashSize) * pwr;
    pwr *= pwrChange;
  }

  return key;
}
