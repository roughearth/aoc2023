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
  hAdjacents: number[];
  vAdjacents: number[];
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
  const srcLines = cleanAndParse(input);

  const maps: Map[] = [];

  let currentMap = blankMap();

  srcLines.forEach((line, i) => {
    if (line === '') {
      maps.push(currentMap);
      currentMap = blankMap();
    }
    else {
      currentMap.map.push(line);
    }
  });

  maps.push(currentMap);

  maps.forEach(map => {
    const width = map.map[0].length;

    for (let col = 0; col < width; col++) {
      map.flippedMap[col] = map.map.map(row => row[col]).join('');
    }

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
      if (distance === 1) {
        map.hAdjacents.push(i + 1);
      }
    });

    map.flippedMap.forEach((line, i) => {
      const distance = hammingDistance(line, map.flippedMap[i + 1]);
      if (distance === 1) {
        map.vAdjacents.push(i + 1);
      }
    });
  });

  const lines = maps
    .map((m, i) => findReflectionLines(m, i));

  return { lines, maps };
}

function verifyReflectionLine(srcMap: Map, which: 'map' | 'flippedMap', line: number) {
  const map = srcMap[which];

  const linesToTest = Math.min(
    line,
    map.length - line
  )

  for (let i = 1; i < linesToTest; i++) {
    const a = line - i - 1;
    const b = line + i;

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

    if (distance >= 2) {
      return [];
    }
    if (distance === 1) {
      nearMisses.push([a, b]);
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

  const hAdjs = map.hAdjacents.filter(line => verifyReflectionLine(map, 'map', line));
  const vAdjs = map.vAdjacents.filter(line => verifyReflectionLine(map, 'flippedMap', line));

  return { hLines, vLines, hNears, vNears, hAdjs, vAdjs };
}

function hammingDistance(a: string, b: string) {
  let difference = 0;

  if (!b) {
    return a.length;
  }

  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      difference++;
    }
  }

  return difference;
}

export function part1() {
  const { lines } = parse(input);

  const sum = lines
    .map(({ hLines, vLines }, i) => {
      const hSum = hLines[0] || 0;
      const vSum = vLines[0] || 0;

      return (100 * hSum) + vSum
    });

  return sumOf(sum);
}

export function part2() {
  const { lines } = parse(input);

  const sum = lines
    .map(({ hAdjs, vAdjs, hNears, vNears }, i) => {
      const hSum = hAdjs[0] || hNears[0]?.[0] || 0;
      const vSum = vAdjs[0] || vNears[0]?.[0] || 0;

      return (100 * hSum) + vSum;
    });

  return sumOf(sum);
}

export const answers = [
  37718,
  40995
];
