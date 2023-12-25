import { eg1, input } from './input';
import { cleanAndParse, combinationsOf, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true
};

type Component = {
  name: string;
  src: string[];
  toSet: Set<string>;
  to: string[];
};

type ComponentMap = Map<string, Component>;

type Edge = string[];

function getComponent(components: ComponentMap, name: string) {
  if (!components.has(name)) {
    components.set(name, {
      name,
      src: [name],
      to: [],
      toSet: new Set(),
    });
  }

  return components.get(name)!;
}

function parse(input: string) {
  const components: ComponentMap = new Map();

  cleanAndParse(input, line => {
    const [name, toSrc] = line.split(': ');
    const thisComponent = getComponent(components, name);

    for (const to of toSrc.split(' ')) {
      const toComponent = getComponent(components, to);

      thisComponent.toSet.add(to);
      toComponent.toSet.add(name);
    }
  });

  for (const component of components.values()) {
    component.to = [...component.toSet];
  }

  return { components };
}

function random(max: number) {
  return Math.floor(Math.random() * max);
}

function randomEdge(components: ComponentMap) {
  const names = [...components.keys()];
  const component1 = components.get(names[random(names.length)])!;

  const component2 = components.get(component1.to[random(component1.to.length)])!;

  return [component1.name, component2.name];
}

function contractEdge(components: ComponentMap, edgeFrom: string, edgeTo: string) {
  const component1 = getComponent(components, edgeFrom);
  const component2 = getComponent(components, edgeTo);

  const newComponent: Component = {
    name: `${edgeFrom}-${edgeTo}`,
    to: [...component1.to, ...component2.to].filter(to => to !== edgeFrom && to !== edgeTo),
    toSet: new Set(),
    src: [...component1.src, ...component2.src],
  };

  [component1, component2].forEach(component => {
    for (const toName of component.to) {
      const { to } = getComponent(components, toName);
      for (let i = 0; i < to.length; i++) {
        if ((to[i] === component1.name) || (to[i] === component2.name)) {
          to[i] = newComponent.name;
        }
      }
    }
  });

  components.delete(edgeFrom);
  components.delete(edgeTo);
  components.set(newComponent.name, newComponent);
}


export function part1() {
  let l = 0;
  let m = 0;
  do {
    const { components } = parse(input);

    while (components.size > 2) {
      const [edgeFrom, edgeTo] = randomEdge(components);
      contractEdge(components, edgeFrom, edgeTo);
    }

    const [{ to: to1, src: src1 }, { to: to2, src: src2 }] = [...components.values()];

    l = to1.length;
    m = src1.length * src2.length;
  }
  while (l !== 3); // question says the minimum cut is 3

  return m;
}

export function part2() {
  return "Merry Xmas!";
}

export const answers = [
  569904
];
