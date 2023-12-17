/*

const graph = dijkstraFrom(startNode, edgeFn, options);

const found = graph.find(targetNodeFn);
const allCostsAndPaths = graph.cover();

for (let [node, cost, path] of graph) {
  doSomethingWith(node, cost);
}


*/

function nextUnvisitedNode<T>(unvisitedNodes: Set<T>, distanceMap: Map<T, number>) {
  let minVal = Number.MAX_SAFE_INTEGER;
  let min: T | undefined;

  for (let node of unvisitedNodes) {
    const distance = distanceMap.get(node) as number;
    if (distance < minVal) {
      minVal = distance;
      min = node;
    }
  }

  return min;
}

export function dijkstraFrom<T>(
  startNode: T,
  edgeFn: (n: T) => [T, number][],
  options?: {maxLoops?: number, maxMs?: number} // set up a safety net
): Dijkstra<T> {
  function* nodes(): Generator<NodeTuple<T>, void, unknown> {
    let loopCount = 0;
    const start = performance.now();

    const allNodes = new Set<T>([startNode]);
    const unvisitedNodes = new Set<T>([startNode]);
    const distanceMap = new Map<T, number>([[startNode, 0]]);
    const pathMap = new Map<T, T[]>([[startNode, [startNode]]]);

    while (unvisitedNodes.size) {
      loopCount++;
      if (options?.maxLoops && loopCount > options.maxLoops) {
        throw new Error(`Maximum loop count exceeded after ${(performance.now() - start).toFixed(1)}ms`);
      }
      if (options?.maxMs && performance.now() - start > options.maxMs) {
        throw new Error(`Maximum time exceeded after ${loopCount} loops`);
      }

      const current = nextUnvisitedNode(unvisitedNodes, distanceMap) as T;
      unvisitedNodes.delete(current);
      const distance = <number>distanceMap.get(current);
      const path = <T[]>pathMap.get(current);

      for (let [node, cost] of edgeFn(current)) {
        const nextDistance = distance + cost;
        const nextPath = [...path, node];

        if (!allNodes.has(node)) {
          allNodes.add(node);
          unvisitedNodes.add(node);
          distanceMap.set(node, nextDistance);
          pathMap.set(node, nextPath);
        }

        const nodeDistance = <number>distanceMap.get(node);

        if (nextDistance < nodeDistance) {
          distanceMap.set(node, nextDistance);
          pathMap.set(node, nextPath);
        }
      }

      yield [current, distance, path];
    }
  }

  return {
    [Symbol.iterator]: nodes,
    // test if the node is target, return the node and its distance
    find(targetFn: (n: T) => boolean): NodeTuple<T> {
      for (let [node, cost, path] of nodes()) {
        if (targetFn(node)) {
          return [node, cost, path];
        }
      }

      throw new Error("Target not found");
    },
    findAll(targetFn: (n: T) => boolean): NodeTuple<T>[] {
      const all: NodeTuple<T>[] = [];
      for (let [node, cost, path] of nodes()) {
        if (targetFn(node)) {
          all.push([node, cost, path]);
        }
      }

      return all;
    },
    // return all reachable nodes mapped to their distances
    cover(): Map<T, [number, T[]]> {
      return new Map(Array.from(nodes()).map(([n, d, p]) => [n, [d, p]]));
    }
  }
}

export type NodeTuple<T> = [T, number, T[]];

export type Dijkstra<T> = {
  [Symbol.iterator]: () => Generator<NodeTuple<T>, void, unknown>,
  find: (targetFn: (n: T) => boolean) => NodeTuple<T>,
  findAll: (targetFn: (n: T) => boolean) => NodeTuple<T>[],
  cover: () => Map<T, [number, T[]]>
};