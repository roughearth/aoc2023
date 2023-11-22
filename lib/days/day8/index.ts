import { eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

type Tree = {
  row: number,
  col: number,
  height: number,
  left: number[],
  right: number[],
  up: number[],
  down: number[]
}

function makeTrees(rowSrc: string, rowId: number): Tree[] {
  const rowArray = Array.from(rowSrc);
  const trees = rowArray.map((t, i) => ({
    row: rowId,
    col: i,
    height: Number(t),
    left: rowArray.slice(0, i).map(Number).reverse(),
    right: rowArray.slice(i + 1).map(Number),
    up: [],
    down: []
  }));

  return trees;
}

function getVerticalPaths(grid: Tree[][], size: number): void {
  for (let col = 1; col < size - 1; col++) {
    for (let row = 1; row < size - 1; row++) {
      grid[row][col].up = [grid[row - 1][col].height, ...grid[row - 1][col].up];
    }

    for (let row = size - 2; row >= 1; row--) {
      grid[row][col].down = [grid[row + 1][col].height, ...grid[row + 1][col].down];
    }
  }
}

export function part1() {
  const grid = cleanAndParse(input, makeTrees);
  const size = grid.length;

  const edges = 4 * (size - 1);
  let visible = 0;

  getVerticalPaths(grid, size);

  for (let col = 1; col < size - 1; col++) {
    for (let row = 1; row < size - 1; row++) {
      const { height, left, right, up, down } = grid[row][col];
      if (
        height > Math.min(
          Math.max(...left),
          Math.max(...right),
          Math.max(...up),
          Math.max(...down)
        )
      ) {
        visible++
      }
    }
  }

  return edges + visible;
}

function countVisible(heights: number[], height: number) {
  const lower = heights.findIndex(t => t >= height);

  if (lower === -1) {
    return heights.length;
  }

  return lower + 1;
}

function getScenicScore(tree: Tree) {
  return countVisible(tree.up, tree.height) *
    countVisible(tree.down, tree.height) *
    countVisible(tree.left, tree.height) *
    countVisible(tree.right, tree.height);
}

export function part2() {
  const grid = cleanAndParse(input, makeTrees);
  const size = grid.length;
  getVerticalPaths(grid, size);

  let maxFound = 0;

  for (let col = 1; col < size - 1; col++) {
    for (let row = 1; row < size - 1; row++) {
      maxFound = Math.max(maxFound, getScenicScore(grid[row][col]));
    }
  }
  return maxFound;
}

export const answers = [
  1711,
  301392
];
