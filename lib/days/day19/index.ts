import { eg1, input } from './input';
import { cleanAndParse, productOf, SafetyNet, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true,
  maxMs: 8 * 60 * 60 * 1_000,
  logMsInterval: 5_000,
  maxLoops: Infinity
};

function parseBlueprint(src: string, i: number) {
  const numbers = src.match(/([0-9]+)/g)!;

  const [
    id,
    oreOre,
    clayOre,
    obsidianOre,
    obsidianClay,
    geodeOre,
    geodeObsidian
  ] = numbers.map(Number);

  if (id !== i + 1) {
    throw new Error("ID sequence error");
  }

  return {
    id,
    oreOre,
    clayOre,
    obsidianOre,
    obsidianClay,
    geodeOre,
    geodeObsidian
  }
}

type Blueprint = ReturnType<typeof parseBlueprint>;
function __log(...msg: any[]) {
  // console.log(...msg);
}

function max(id: number, safetyNet: SafetyNet) {
  console.log("New max for", id, "@", safetyNet.duration);

  let max = 0;

  return {
    set(v: number) {
      if (v > max) {
        max = v;
        console.log("max to", v);
      }
    },
    value() {
      safetyNet.isSafe((_, duration) => `heartbeat @ ${duration}`);
      return max;
    }
  }
}
type Max = ReturnType<typeof max>;

function findBest(
  safetyNet: SafetyNet,
  max: Max,
  blueprint: Blueprint,
  minutesLeft: number,
  oreRobots: number,
  clayRobots: number,
  obsidianRobots: number,
  geodeRobots: number,
  ore: number,
  clay: number,
  obsidian: number,
  geodes: number
): number {
  const {
    oreOre,
    clayOre,
    obsidianOre,
    obsidianClay,
    geodeOre,
    geodeObsidian
  } = blueprint;

  if (minutesLeft === 0) {
    max.set(geodes);
    return geodes;
  }

  const upperBound = geodes + geodeRobots * minutesLeft + (minutesLeft * (minutesLeft + 1) * 0.5);

  if (upperBound < max.value()) {
    return -1;
  }

  minutesLeft--;

  const results: number[] = [];

  const canMakeGeodeRobot = (ore >= geodeOre) && (obsidian >= geodeObsidian);
  const canMakeObsidianRobot = (obsidianRobots < geodeObsidian) && (ore >= obsidianOre) && (clay >= obsidianClay);
  const canMakeClayRobot = (clayRobots < obsidianClay) && (ore >= clayOre);
  const canMakeOreRobot = (clayRobots === 0) && (oreRobots <= Math.max(oreOre, clayOre, obsidianOre, geodeOre)) && (ore >= oreOre);

  let makeGeodeRobot = false;
  let makeObsidianRobot = false;
  let makeClayRobot = false;
  let makeOreRobot = false;

  if (false) { }
  else if (canMakeGeodeRobot) {
    makeGeodeRobot = true;
  }
  else {
    if (canMakeObsidianRobot) {
      makeObsidianRobot = true;
    }
    if (canMakeClayRobot) {
      makeClayRobot = true;
    }
    if (canMakeOreRobot) {
      makeOreRobot = true;
    }
  }

  ore += oreRobots;
  clay += clayRobots;
  obsidian += obsidianRobots;
  geodes += geodeRobots;

  if (makeGeodeRobot) {
    results.push(findBest(
      safetyNet,
      max,
      blueprint,
      minutesLeft,
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots + 1,
      ore - geodeOre,
      clay,
      obsidian - geodeObsidian,
      geodes
    ));
  }

  if (makeObsidianRobot) {
    results.push(findBest(
      safetyNet,
      max,
      blueprint,
      minutesLeft,
      oreRobots,
      clayRobots,
      obsidianRobots + 1,
      geodeRobots,
      ore - obsidianOre,
      clay - obsidianClay,
      obsidian,
      geodes
    ));
  }

  if (makeClayRobot) {
    results.push(findBest(
      safetyNet,
      max,
      blueprint,
      minutesLeft,
      oreRobots,
      clayRobots + 1,
      obsidianRobots,
      geodeRobots,
      ore - clayOre,
      clay,
      obsidian,
      geodes
    ));
  }

  if (makeOreRobot) {
    results.push(findBest(
      safetyNet,
      max,
      blueprint,
      minutesLeft,
      oreRobots + 1,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      ore - oreOre,
      clay,
      obsidian,
      geodes
    ));
  }

  if (
    !makeGeodeRobot ||
    !makeObsidianRobot
  ) {
    results.push(findBest(
      safetyNet,
      max,
      blueprint,
      minutesLeft,
      oreRobots,
      clayRobots,
      obsidianRobots,
      geodeRobots,
      ore,
      clay,
      obsidian,
      geodes
    ));
  }

  return Math.max(...results);
}

export function part1(safetyNet: SafetyNet) {
  const blueprints = cleanAndParse(eg1, parseBlueprint);

  const map = blueprints.map(blueprint => [blueprint.id, findBest(safetyNet, max(blueprint.id, safetyNet), blueprint, 24, 1, 0, 0, 0, 0, 0, 0, 0)])

  console.log(map);

  return sumOf(map.map(([i, v]) => i * v));
}

export function part2(safetyNet: SafetyNet) {
  const blueprints = cleanAndParse(input, parseBlueprint).slice(0, 3);

  const map = blueprints.map(blueprint => findBest(safetyNet, max(blueprint.id, safetyNet), blueprint, 32, 1, 0, 0, 0, 0, 0, 0, 0));

  console.log(map);

  return productOf(map);
}

export const answers = [
  Symbol.for("skip"), // 851 in 11 mins
  Symbol.for("skip") // 12160 in 14 mins
];
