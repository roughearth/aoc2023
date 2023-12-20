import { eg1, eg2, input } from './input';
import { cleanAndParse, lcm } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const ON = true;
const OFF = false;
const HI = true;
const LO = false;

type Module = {
  type: string;
  name: string;
  to: string[];
  state: Map<string, boolean>;
};

type Pulse = {
  state: boolean;
  to: string;
  from: string;
}

type PulseQueue = Pulse[];

const TypeKey: Record<string, string> = {
  'b': 'broadcaster',
  '&': 'con',
  '%': 'fl'
};

function parse(input: string) {
  const cleaned = cleanAndParse(input, line => {
    const [from, to] = line.split(' -> ');
    let type = TypeKey[from[0]];
    let name = from.slice(1);

    if (from === 'broadcaster') {
      name = from;
    }

    return [name, {
      type,
      name,
      to: to.split(', '),
      state: new Map()
    }] as [string, Module];
  });

  const map = new Map(cleaned);

  for (const [name, module] of map) {
    if (module.type === 'fl') {
      module.state.set('on', OFF);
    }
    for (const to of module.to) {
      const toNode = map.get(to);

      if (toNode && toNode.type === 'con') {
        toNode.state.set(name, LO);
      }
    }
  }

  return map;
}

export function part1() {
  const parsed = parse(input);

  let pulseCount = new Map([[LO, { count: 0 }], [HI, { count: 0 }]]);
  let rxCount = new Map([[LO, { count: 0 }], [HI, { count: 0 }]]);

  let C = 1e3;

  while (C--) {
    const pulses: PulseQueue = [{ state: LO, to: 'broadcaster', from: 'button' }];

    while (pulses.length) {
      const { state, to, from } = pulses.shift()!;

      const nextNode = parsed.get(to);

      pulseCount.get(state)!.count++;
      if (to === 'rx') {
        rxCount.get(state)!.count++;
      }

      switch (nextNode?.type) {
        case 'broadcaster': {
          nextNode.to.forEach(n => pulses.push({ state, to: n, from: nextNode.name }));
          break
        }
        case 'con': {
          nextNode.state.set(from, state);
          const allHi = [...nextNode.state.values()].every(v => v === HI);
          nextNode.to.forEach(n => pulses.push({ state: !allHi, to: n, from: nextNode.name }));
          break;
        }
        case 'fl': {
          if (state === LO) {
            const st = !nextNode.state.get('on')!;
            nextNode.state.set('on', st);

            nextNode.to.forEach(n => pulses.push({ state: st, to: n, from: nextNode.name }));
          }
          break;
        }
      }
    }
  }

  return pulseCount.get(HI)!.count * pulseCount.get(LO)!.count;
}

export function part2() {
  const parsed = parse(input);

  const [[id]] = Array.from(parsed.entries()).filter(([, v]) => v.to.includes('rx'));

  const keys = new Map(Array.from(parsed.get(id)!.state.keys()).map(k => [k, [] as number[]]));

  let C = 0;

  while (Array.from(keys.values()).some(v => v.length < 1)) {
    C++
    const pulses: PulseQueue = [{ state: LO, to: 'broadcaster', from: 'button' }];

    while (pulses.length) {
      const { state, to, from } = pulses.shift()!;

      const nextNode = parsed.get(to);

      if (keys.has(to) && state === LO) {
        keys.get(to)!.push(C);
      }

      switch (nextNode?.type) {
        case 'broadcaster': {
          nextNode.to.forEach(n => pulses.push({ state, to: n, from: nextNode.name }));
          break
        }
        case 'con': {
          nextNode.state.set(from, state);

          const allHi = [...nextNode.state.values()].every(v => v === HI);

          nextNode.to.forEach(n => pulses.push({ state: !allHi, to: n, from: nextNode.name }));
          break;
        }
        case 'fl': {
          if (state === LO) {
            const st = !nextNode.state.get('on')!;

            nextNode.state.set('on', st);

            nextNode.to.forEach(n => pulses.push({ state: st, to: n, from: nextNode.name }));
          }
          break;
        }
      }
    }
  }

  const keysValues = Array.from(keys.values());

  return lcm(...keysValues.map(([v]) => v));
}

export const answers = [
  743090292,
  241528184647003
];
