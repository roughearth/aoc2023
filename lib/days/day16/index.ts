import { eg1, input } from './input';
import { cleanAndParse, findBest, SafetyNet } from '../../utils';
import { Day } from '..';
import { dijkstraFrom } from '../../utils/dijkstra';

export const meta: Day['meta'] = {
  manualStart: true,
  maxLoops: 1e8,
  logLoopInterval: 1e7,
  maxMs: 240_000
};

type Valve = {
  name: string,
  rate: number,
  next: string[]
};

function analyse(src: string) {
  const data = cleanAndParse(src, (l): [string, Valve] => {
    const name = l.slice(6, 8);
    const [rateSrc, nextSrc] = l.slice(23).split(/; tunnels? leads? to valves? /);

    return [name, {
      name,
      rate: parseInt(rateSrc, 10),
      next: nextSrc.split(", ")
    }]
  });

  const all = new Map(data);
  const nonZero = new Set(data.flatMap(([, v]) => {
    if (v.rate !== 0) {
      return [v];
    }
    return [];
  }));

  const cover = (rootValve: Valve) => {
    const dj = dijkstraFrom(
      rootValve,
      valve => {
        const { next } = valve;

        return next.map(
          n => <[Valve, number]>[all.get(n), 1]
        );
      }
    ).cover();

    const covered = Array.from(dj)
      .filter(([valve]) => !!valve.rate)
      .map(([valve, [cost]]) => <[Valve, number]>[valve, cost]);

    return covered;
  }

  const distances = new Map<Valve, Map<Valve, number>>();

  for (const start of nonZero) {
    distances.set(start, new Map<Valve, number>(cover(start)));
  }

  const AA = all.get("AA")!;
  distances.set(AA, new Map<Valve, number>(cover(AA)));

  return { all, nonZero, distances };
}

export function part1() {
  const { all, nonZero, distances } = analyse(input);

  function nextBest(
    distances: Map<Valve, Map<Valve, number>>,
    openable: Set<Valve>,
    current: Valve,
    score: number,
    minsLeft: number
  ): number {
    const distanceFrom = distances.get(current)!;
    const reachableInTime = Array.from(openable).filter(
      v => (minsLeft > distanceFrom.get(v)!)
    );

    if (reachableInTime.length === 0) {
      return score;
    }

    const [, best] = findBest(reachableInTime, valve => {
      const nextMinsLeft = minsLeft - distanceFrom.get(valve)! - 1;
      const thisScore = valve.rate * nextMinsLeft;
      const nextOpenable = new Set(openable);
      nextOpenable.delete(valve);

      return nextBest(distances, nextOpenable, valve, score + thisScore, nextMinsLeft);
    });

    return best;
  }

  return nextBest(distances, nonZero, all.get("AA")!, 0, 30);;
}

export function part2(safetyNet: SafetyNet) {
  const { all, nonZero, distances } = analyse(eg1);
  const scores: number[] = [];

  function nextBest(
    distances: Map<Valve, Map<Valve, number>>,
    openable: Set<Valve>,
    currentMe: Valve,
    currentElephant: Valve,
    score: number,
    minsLeftMe: number,
    minsLeftElephant: number
  ): number {
    const currentMin = Math.max(minsLeftMe, minsLeftElephant);

    const distanceFrom: {
      me?: Map<Valve, number>,
      elephant?: Map<Valve, number>
    } = {}

    let reachableInTime: {
      me?: Valve,
      elephant?: Valve
    }[] = [];

    if (currentMin === minsLeftMe) {
      distanceFrom.me = distances.get(currentMe)!;
      reachableInTime = Array.from(openable).filter(
        v => (minsLeftMe > distanceFrom.me!.get(v)!)
      ).map(v => ({ me: v }));
    }

    if (currentMin === minsLeftElephant) {
      distanceFrom.elephant = distances.get(currentElephant)!;

      const reachableInTimeElephant = Array.from(openable).filter(
        v => (minsLeftElephant > distanceFrom.elephant!.get(v)!)
      ).map(v => ({ elephant: v }));

      if (minsLeftElephant === minsLeftMe) {
        reachableInTime = reachableInTime.flatMap(
          ({ me }) => reachableInTimeElephant.flatMap(
            ({ elephant }) => (
              me !== elephant
            ) ? [{ me, elephant }] : []
          )
        );
      }
      else {
        reachableInTime = reachableInTimeElephant
      }
    }

    safetyNet.isSafe(() => {
      if (scores.length) {
        const msg = `Found ${Math.max(...scores)}`;
        scores.length = 0;
        return msg;
      }
      return "...";
    });

    if (reachableInTime.length === 0) {
      if (score > 2460) {
        scores.push(score);
      }
      return score;
    }

    const [, best] = findBest(reachableInTime, valvePair => {
      const nextOpenable = new Set(openable);

      let thisScore = score;

      let nextMe = currentMe;
      let nextMinsLeftMe = minsLeftMe;

      if (valvePair.me) {
        nextMe = valvePair.me;
        nextOpenable.delete(nextMe);
        nextMinsLeftMe = minsLeftMe - distanceFrom.me!.get(nextMe)! - 1;
        thisScore += nextMe.rate * nextMinsLeftMe;
      }

      let nextElephant = currentElephant;
      let nextMinsLeftElephant = minsLeftElephant;

      if (valvePair.elephant) {
        nextElephant = valvePair.elephant;
        nextOpenable.delete(nextElephant);
        nextMinsLeftElephant = minsLeftElephant - distanceFrom.elephant!.get(nextElephant)! - 1;
        thisScore += nextElephant.rate * nextMinsLeftElephant;
      }

      return nextBest(distances, nextOpenable, nextMe, nextElephant, thisScore, nextMinsLeftMe, nextMinsLeftElephant);
    });

    return best;
}

  const AA = all.get("AA")!;
  const timeAvailable = 26;

  const best = nextBest(distances, nonZero, AA, AA, 0, timeAvailable, timeAvailable);

  console.log(safetyNet.loops, "loops");

  return best;
}

export const answers = [
  1940,
  Symbol.for("skip")
];
