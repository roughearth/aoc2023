import { orthogonalNeighbours, simpleRange } from ".";
import { AStar, aStarFrom } from "./a-star";
import { multiply, eg1, input } from "./dijkstra-testdata";


describe("A*", () => {
  function makeGraph(src: string, target?: string): [AStar<string>, string] {
    const riskgrid = src.split("\n");
    const maxRow = riskgrid.length;
    const maxCol = riskgrid[0].length;
    target ??= `${maxRow - 1},${maxCol - 1}`;

    const range = simpleRange([maxRow, maxCol]);

    const graph: AStar<string> = aStarFrom(
      '0,0',
      (r: string) => {
        const [row, col] = r.split(",").map(Number);
        const n = Array.from(
          orthogonalNeighbours([row, col], range)
        ).map(
          ([r, c]) => [
            `${r},${c}`,
            Number(riskgrid[r][c])
          ] as [string, number]
        );

        return n;
      },
      () => 0,
      n => n === target
    );

    return [graph, target];
  }

  describe("find", () => {
    test("AoC 2021, day 15, part 1 example, wrong target", () => {
      const [graph] = makeGraph(eg1, '10,10');

      expect(() => graph.find()).toThrow('Target not found');
    });

    test("AoC 2021, day 15, part 1 example", () => {
      const [graph, target] = makeGraph(eg1);

      expect(graph.find()).toEqual([
        "9,9",
        40,
        [
          "0,0", "1,0", "2,0",
          "2,1", "2,2", "2,3", "2,4", "2,5", "2,6",
          "3,6", "3,7",
          "4,7", "4,8",
          "5,8", "6,8", "7,8", "8,8",
          "8,9", "9,9"
        ]
      ]);
    });

    test("AoC 2021, day 15, part 1 input", () => {
      const [graph, target] = makeGraph(input);

      expect(graph.find()).toEqual([
        "99,99",
        415,
        expect.any(Array)
      ]);
    });

    test("AoC 2021, day 15, part 2 example", () => {
      const [graph, target] = makeGraph(multiply(eg1));

      expect(graph.find()[1]).toEqual(315);
    });

    test("AoC 2021, day 15, part 2 input", () => {
      const [graph, target] = makeGraph(multiply(input));

      expect(graph.find()[1]).toEqual(2864);
    });
  });
});
