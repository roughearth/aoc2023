import { eg1, input } from './input';
import { cleanAndParse, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  // manualStart: true
};

type Map = {
  map: string[];
  flippedMap: string[];
  hCandidates: number[];
  vCandidates: number[];
  hAdjacents: number[][];
  vAdjacents: number[][];
};

function blankMap(): Map {
  return {
    map: [],
    flippedMap: [],
    hCandidates: [],
    vCandidates: [],
    hAdjacents: [],
    vAdjacents: []
  };
}

function parse(input: string) {
  const lines = cleanAndParse(input);

  const maps: Map[] = [];

  let currentMap = blankMap();

  lines.forEach((line, i) => {
    if (line === '') {
      maps.push(currentMap);
      currentMap = blankMap();
    }
    else {
      currentMap.map.push(line);
    }
  });

  maps.push(currentMap);

  return { lines, maps };
}

function flipMap(map: Map) {
  const width = map.map[0].length;

  for (let col = 0; col < width; col++) {
    map.flippedMap[col] = map.map.map(row => row[col]).join('');
  }
}

function unflipMap(map: Map) {
  const width = map.flippedMap[0].length;

  for (let col = 0; col < width; col++) {
    map.map[col] = map.flippedMap.map(row => row[col]).join('');
  }
}

function flipMaps(maps: Map[]) {
  maps.forEach(flipMap);
}

function analyseMaps(maps: Map[]) {
  maps.forEach(map => {
    map.hCandidates = [];
    map.vCandidates = [];
    map.hAdjacents = [];
    map.vAdjacents = [];

    map.map.forEach((line, i) => {
      if (line === map.map[i + 1]) {
        map.hCandidates.push(i + 1);
      }
    });

    map.flippedMap.forEach((line, i) => {
      if (line === map.flippedMap[i + 1]) {
        map.vCandidates.push(i + 1);
      }
    });

    map.map.forEach((line, i) => {
      const distance = hammingDistance(line, map.map[i + 1]);
      if (distance.length === 1) {
        map.hAdjacents.push([i + 1, distance[0]]);
      }
    });

    map.flippedMap.forEach((line, i) => {
      const distance = hammingDistance(line, map.flippedMap[i + 1]);
      if (distance.length === 1) {
        map.vAdjacents.push([i + 1, distance[0]]);
      }
    });
  });
}

function verifyReflectionLine(srcMap: Map, which: 'map' | 'flippedMap', line: number) {
  // console.log({ which, line })
  const map = srcMap[which];

  const linesToTest = Math.min(
    line,
    map.length - line
  )

  for (let i = 1; i < linesToTest; i++) {
    const a = line - i - 1;
    const b = line + i;
    // console.log(map[a] === map[b], a, b, map[a], map[b])
    if (map[a] !== map[b]) {
      return false;
    }
  }

  return true;
}

function verifyNearReflectionLine(srcMap: Map, which: 'map' | 'flippedMap', line: number) {
  const map = srcMap[which];

  const linesToTest = Math.min(
    line,
    map.length - line
  )

  const nearMisses: number[][] = [];

  for (let i = 0; i < linesToTest; i++) {
    const a = line - i - 1;
    const b = line + i;

    const distance = hammingDistance(map[a], map[b]);

    if (distance.length >= 2) {
      return [];
    }
    if (distance.length === 1) {
      nearMisses.push([a, b, distance[0]]);
    }
  }

  return nearMisses;
}

function findReflectionLines(map: Map, i: number) {
  const hNears = map.hCandidates
    .map(line => [line, verifyNearReflectionLine(map, 'map', line)] as [number, number[][]])
    .filter(([, miss]) => miss.length)
    .map(([ref, [miss]]) => [ref, miss] as [number, number[]]);

  const vNears = map.vCandidates
    .map(line => [line, verifyNearReflectionLine(map, 'flippedMap', line)] as [number, number[][]])
    .filter(([, miss]) => miss.length)
    .map(([ref, [miss]]) => [ref, miss] as [number, number[]]);

  const hLines = map.hCandidates.filter(line => verifyReflectionLine(map, 'map', line));
  const vLines = map.vCandidates.filter(line => verifyReflectionLine(map, 'flippedMap', line));

  const hAdjs = map.hAdjacents.filter(line => verifyReflectionLine(map, 'map', line[0]));
  const vAdjs = map.vAdjacents.filter(line => verifyReflectionLine(map, 'flippedMap', line[0]));

  return { hLines, vLines, hNears, vNears, hAdjs, vAdjs };
}

function hammingDistance(a: string, b: string) {
  let differences: number[] = [];

  if (!b) {
    return Array.from(a, (_, i) => i);
  }

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      differences.push(i);
    }
  }

  return differences;
}

export function part1() {
  const { maps } = parse(input);
  flipMaps(maps);
  analyseMaps(maps);

  const lines = maps
    .map((m, i) => findReflectionLines(m, i))

  const sum = lines
    .map(({ hLines, vLines }, i) => {
      const hSum = hLines[0] || 0;
      const vSum = vLines[0] || 0;

      return (100 * hSum) + vSum
    });

  return sumOf(sum);
}

export function part2() {
  const { maps } = parse(input);
  flipMaps(maps);
  analyseMaps(maps);

  const linesV1 = maps
    .map((m, i) => findReflectionLines(m, i));

  maps.forEach((map, i) => {
    const line = linesV1[i];

    for (const [ref, [a, b, col]] of line.hNears) {
      if (line.vLines.includes(col)) {
        throw new Error(`Overlap hNears with vLines at ${i}`);
      }
    }

    for (const [ref, [a, b, row]] of line.vNears) {
      if (line.hLines.includes(row)) {
        throw new Error(`Overlap vNears with hLines at ${i}`);
      }
    }

    if ((line.hAdjs.length + line.vAdjs.length + line.hNears.length + line.vNears.length) !== 1) {
      throw new Error(`Not exactly one candidate at ${i}`);
    }

    if (line.hAdjs.length || line.hNears.length) {
      if (line.hAdjs.length) {
        const [[a]] = line.hAdjs;
        const b = a - 1
        map.map[a] = map.map[b];
      }
      else {
        const [[, [a, b]]] = line.hNears;
        map.map[a] = map.map[b];
      }

      flipMap(map);
    }
    else {
      if (line.vAdjs.length) {
        const [[a]] = line.vAdjs;
        const b = a - 1
        map.flippedMap[a] = map.flippedMap[b];
      }
      else {
        const [[, [a, b]]] = line.vNears;
        map.flippedMap[a] = map.flippedMap[b];
      }

      unflipMap(map);
    }
  });

  analyseMaps(maps);

  const lines = maps
    .map((m, i) => findReflectionLines(m, i));

  // lines.forEach((line, i) => {
  //   const lineV1 = linesV1[i];

  //   if (line.hLines[0] === lineV1.hLines[0]) {
  //     console.log(`(Pt 1) Both hSum and vSum at ${i}`);
  //   }
  // });

  const sum = lines
    .map(({ hLines, vLines }, i) => {
      const hSum = hLines[0] || 0;
      const vSum = vLines[0] || 0;

      // if (hSum > 0 && vSum > 0) {
      //   console.log(`(Pt 2) Both hSum and vSum at ${i}`);
      // }

      return (100 * hSum) + vSum;
    });

  const sumV1 = linesV1
    .map(({ hAdjs, vAdjs, hNears, vNears }, i) => {
      const hSum = hAdjs[0]?.[0] || hNears[0]?.[0] || 0;
      const vSum = vAdjs[0]?.[0] || vNears[0]?.[0] || 0;

      if (hSum > 0 && vSum > 0) {
        console.log(`(Pt 2) Both hSum and vSum at ${i}`);
      }

      // console.log({ hSum, vSum, i });

      return (100 * hSum) + vSum;
    });

  console.log({ linesV1, lines, maps, sum, sumV1 });

  // 43000 is too high
  // 43372 is too high
  // 52815 is too high
  return sumOf(sumV1);
}

export const answers = [
  37718,
  400 // for eg1
];
