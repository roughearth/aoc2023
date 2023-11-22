import { eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

type Children = Map<string, File | Directory>

type Directory = {
  name: string
  children: Children
  parent: Directory
}

type File = {
  name: string
  size: number
}

function makeDirectory(name: string, parent: Directory): Directory {
  return { name, parent, children: new Map() }
}

function isDirectory(node: File | Directory): node is Directory {
  return Boolean((<Directory>node).children);
}

function addDirectory(parent: Directory, name: string): Directory {
  const dir = makeDirectory(name, parent);
  parent.children.set(name, dir);
  return dir;
}

function addFile(parent: Directory, name: string, size: number): void {
  parent.children.set(name, { name, size });
}

function parseTree(src: string): [Directory, Set<Directory>] {
  const listing = cleanAndParse(src);

  const root = makeDirectory('/', <Directory>{});
  let current = root;
  let line: string | undefined;
  const directorySet = new Set<Directory>([root]);

  while (line = listing.shift()) {
    if (line === "$ cd /") {
      current = root;
    }
    else if (line === '$ cd ..') {
      current = current.parent;
    }
    else if (line.startsWith('$ cd ')) {
      current = <Directory>current.children.get(line.slice(5));
    }
    else { // $ ls
      do {
        line = listing[0];

        if (!line || line.startsWith('$')) {
          break;
        }

        const [type, name] = line?.split(' ') ?? [];

        if (type === 'dir') {
          directorySet.add(addDirectory(current, name));
        }
        else {
          addFile(current, name, Number(type));
        }

        listing.shift();
      }
      while (true);
    }
  }

  return [root, directorySet];
}

function getDirectorySize(dir: Directory) {
  const children = dir.children.values();
  return Array.from(children).reduce(
    (tot, node): number => {
      if (isDirectory(node)) {
        return tot + getDirectorySize(node);
      }
      return tot + node.size;
    },
    0
  )
}

export function part1() {
  const [, directories] = parseTree(input);

  const sum = Array.from(directories).map(
    d => getDirectorySize(d)
  ).filter(
    s => s <= 100_000
  ).reduce(
    (a, b) => a + b
  );

  return sum;
}

export function part2() {
  const availableSpace = 70_000_000;
  const requiredSpace = 30_000_000;
  const [root, directories] = parseTree(input);

  const rootSpace = getDirectorySize(root);
  const minDeleteSize = requiredSpace - (availableSpace - rootSpace);

  const canditateSizes = Array.from(directories).map(
    dir => getDirectorySize(dir)
  ).filter(
    size => size >= minDeleteSize
  );

  return Math.min(...canditateSizes);
}

export const answers = [
  1348005,
  12785886
];
