import { orthogonalNeighbours, simpleRange } from ".";
import { multiply, eg1, input } from "./dijkstra-testdata";
import { Dijkstra, dijkstraFrom } from "./dijkstra"


describe("Dijkstra", () => {
  function makeGraph(src: string): [Dijkstra<string>, string] {
    const riskgrid = src.split("\n");
    const maxRow = riskgrid.length;
    const maxCol = riskgrid[0].length;

    const range = simpleRange([maxRow, maxCol]);

    const graph: Dijkstra<string> = dijkstraFrom(
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
      }
    );

    return [graph, `${maxRow - 1},${maxCol - 1}`];
  }

  describe("find", () => {
    test("AoC 2021, day 15, part 1 example, wrong target", () => {
      const [graph] = makeGraph(eg1);

      expect(() => graph.find(n => n === '10,10')).toThrow('Target not found');
    });

    test("AoC 2021, day 15, part 1 example", () => {
      const [graph, target] = makeGraph(eg1);

      expect(graph.find(n => n === target)).toEqual([
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

      expect(graph.find(n => n === target)).toEqual([
        "99,99",
        415,
        expect.any(Array)
      ]);
    });

    test("AoC 2021, day 15, part 2 example", () => {
      const [graph, target] = makeGraph(multiply(eg1));

      expect(graph.find(n => n === target)[1]).toEqual(315);
    });

    test("AoC 2021, day 15, part 2 input", () => {
      const [graph, target] = makeGraph(multiply(input));

      expect(graph.find(n => n === target)[1]).toEqual(2864);
    });
  });

  describe("cover", () => {
    test("AoC 2021, day 15, part 1 example", () => {
      const [graph] = makeGraph(eg1);

      const allCostsAndPaths = graph.cover();

      expect(allCostsAndPaths.size).toEqual(100);
      expect(allCostsAndPaths.get("0,0")).toEqual([0, ['0,0']]);
      expect(allCostsAndPaths.get("3,7")).toEqual([26, [
        "0,0", "1,0", "2,0",
        "2,1", "2,2", "2,3", "2,4", "2,5", "2,6",
        "3,6", "3,7"
      ]]);
      expect(allCostsAndPaths.get("4,8")?.[0]).toEqual(allCostsAndPaths.get("5,7")?.[0]);

    });

    test("AoC 2021, day 15, part 1 input", () => {
      const [graph] = makeGraph(input);

      const allCostsAndPaths = graph.cover();

      expect(allCostsAndPaths.size).toEqual(10_000);
    });
  });
});
