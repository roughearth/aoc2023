/*

const graph = dijkstraFrom(startNode, edgeFn, options);

const found = graph.find(targetNodeFn);
const allCostsAndPaths = graph.cover();

for (let [node, cost, path] of graph) {
  doSomethingWith(node, cost);
}


*/

function nextUnvisitedNode<T>(unvisitedNodes: Set<T>, distanceMap: Map<T, number>, heuristicMap: Map<T, number>) {
  let minVal = Number.MAX_SAFE_INTEGER;
  let min: T | undefined;

  for (let node of unvisitedNodes) {
    const distance = distanceMap.get(node)!;
    const heuristic = heuristicMap.get(node)!;

    const total = distance + heuristic;

    if (total < minVal) {
      minVal = total;
      min = node;
    }
  }

  return min;
}

export function aStarFrom<T>(
  startNode: T,
  edgeFn: (n: T) => [T, number][],
  heuristicFn: (n: T) => number,
  targetFn: (n: T) => boolean,
  options?: { maxLoops?: number, maxMs?: number } // set up a safety net
): AStar<T> {
  function* nodes(): Generator<NodeTuple<T>, void, unknown> {
    let loopCount = 0;
    const start = performance.now();

    const allNodes = new Set<T>([startNode]);
    const unvisitedNodes = new Set<T>([startNode]);
    const distanceMap = new Map<T, number>([[startNode, 0]]);
    const heuristicMap = new Map<T, number>([[startNode, heuristicFn(startNode)]]);
    const pathMap = new Map<T, T[]>([[startNode, [startNode]]]);

    while (unvisitedNodes.size) {
      loopCount++;
      if (options?.maxLoops && loopCount > options.maxLoops) {
        throw new Error(`Maximum loop count exceeded after ${(performance.now() - start).toFixed(1)}ms`);
      }
      if (options?.maxMs && performance.now() - start > options.maxMs) {
        throw new Error(`Maximum time exceeded after ${loopCount} loops`);
      }

      const current = nextUnvisitedNode(unvisitedNodes, distanceMap, heuristicMap) as T;
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
          heuristicMap.set(node, heuristicFn(node));
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
    find(): NodeTuple<T> {
      for (let [node, cost, path] of nodes()) {
        if (targetFn(node)) {
          return [node, cost, path];
        }
      }

      throw new Error("Target not found");
    }
  }
}

export type NodeTuple<T> = [T, number, T[]];

export type AStar<T> = {
  [Symbol.iterator]: () => Generator<NodeTuple<T>, void, unknown>,
  find: () => NodeTuple<T>
};