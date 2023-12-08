import { input, eg1 } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function analyse(input: string) {
  const data = cleanAndParse(input, line => {
    const [game, draws] = line.split(':');
    const id = Number(game.slice(5));

    const max: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0
    };

    const rounds = cleanAndParse(draws, round => {
      const balls = cleanAndParse(round, ball => {
        const [number, colour] = ball.split(' ');
        max[colour] = Math.max(max[colour], Number(number));
      }, { separator: ',' });

    }, { separator: ';' });

    const power = max.red * max.green * max.blue;

    return { id, max, power };
  });

  return data;
}

export function part1() {
  const data = analyse(input);

  const possible = data.filter(({ max }) => {
    return (
      max.red <= 12 &&
      max.green <= 13 &&
      max.blue <= 14
    );
  });

  return possible.reduce((acc, { id }) => acc + id, 0);
}

export function part2() {
  const data = analyse(input);

  return data.reduce((acc, { power }) => acc + power, 0);
}

export const answers = [
  2204,
  71036
];
