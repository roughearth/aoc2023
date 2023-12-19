import { eg1, input } from './input';
import { cleanAndParse, productOf, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

type Part = Record<string, number>;
type Condition = { prop: string, op: string, val: number, destination: string }
type Default = string;
type Rule = { conditions: Condition[], deflt: Default }
type Rules = Map<string, Rule>;
type Range = Record<string, [number, number]>;

function parse(input: string) {
  const lines = cleanAndParse(input);
  const parts: Part[] = [];

  const rules: Rules = new Map();

  for (const line of lines) {
    if (line.startsWith("{")) {
      parts.push(eval(`(${line.replaceAll("=", ":")})`));
    }
    else if (line !== "") {
      const [name, conListSrc] = line.split("{");
      const conSrcList = conListSrc.slice(0, -1).split(",");
      const deflt = conSrcList.pop()!;

      const conditions = conSrcList.map((conSrc) => {
        const [c, destination] = conSrc.split(":");
        const prop = c[0];
        const op = c[1];
        const val = Number(c.slice(2));

        return { prop, op, val, destination };
      });

      rules.set(name, { conditions, deflt });
    }
  }

  return { rules, parts }
}

function accept(part: Part, rules: Rules) {
  let currentRuleName = "in";
  let triggerRulName = ">";

  const visitedRules: Record<string, number> = {};

  while (rules.has(currentRuleName)) {
    visitedRules[currentRuleName] = (visitedRules[currentRuleName] ?? 0) + 1;

    const { conditions, deflt } = rules.get(currentRuleName)!;
    let nextRuleName = deflt;

    conditionsLoop:
    for (const condition of conditions) {
      if (checkCondition(part, condition)) {
        nextRuleName = condition.destination;
        break conditionsLoop;
      }
    }

    triggerRulName = currentRuleName;
    currentRuleName = nextRuleName;
  }

  return (currentRuleName === "A") ? triggerRulName : false;
}

function checkCondition(part: Part, condition: Condition) {
  const { prop, op, val } = condition;
  const partVal = part[prop]!;

  if (op === ">") {
    return partVal > val;
  }
  return partVal < val;
}

function sizeOfRange(range: Range) {
  const propSizes = Object.values(range).map(([min, max]) => Math.max(0, max - min + 1));
  return productOf(propSizes);
}

function analyseRule(
  ruleName: string,
  rules: Rules,
  acceptableRange: Range,
  allAcceptableRanges: Range[]
) {
  if (ruleName === "A") {
    allAcceptableRanges.push(acceptableRange);
  }
  else if (ruleName !== "R") {
    const { conditions, deflt } = rules.get(ruleName)!;

    let hitRange = acceptableRange

    for (const condition of conditions) {
      const { hit, miss } = restrictRange(hitRange, condition);
      analyseRule(condition.destination, rules, hit, allAcceptableRanges);
      hitRange = miss;
    }
    analyseRule(deflt, rules, hitRange, allAcceptableRanges);
  }
}

function cloneRange(range: Range): Range {
  return Object.fromEntries(Object.entries(range).map(([k, v]) => [k, [...v]]));
}

function restrictRange(range: Range, condition: Condition): { hit: Range, miss: Range } {
  const hit = cloneRange(range);
  const miss = cloneRange(range);

  const { prop, op, val } = condition;

  if (op === ">") {
    if (val >= hit[prop][0]) {
      hit[prop][0] = val + 1;
      miss[prop][1] = val;
    }
  }
  else {
    if (val <= hit[prop][1]) {
      hit[prop][1] = val - 1;
      miss[prop][0] = val;
    }
  }

  return { hit, miss };
}

export function part1() {
  const { rules, parts } = parse(input);

  const accepted = parts.filter((part) => accept(part, rules));

  return sumOf(accepted.map((part) => sumOf(Object.values(part))));
}

export function part2() {
  const { rules } = parse(input);

  let initialRange: Range = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };

  const allAcceptableRanges: Range[] = [];

  analyseRule("in", rules, initialRange, allAcceptableRanges);

  const allRangeSizes = allAcceptableRanges.map(r => sizeOfRange(r));

  return sumOf(allRangeSizes);
}

export const answers = [
  492702,
  138616621185978
];
