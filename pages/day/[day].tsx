import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/router'
import { Days, Answer } from "../../lib/days";
import { safetyNet, timeAndRun } from "../../lib/utils";
import Nav from "../../components/nav";

function check<T>(answers: T[], index: number, result: T) {
}

const Check: React.FC<{
  answers: Answer[],
  index: number,
  result: Answer
}> = ({ answers, index, result }) => {
  const { mark, className } = useMemo(
    () => {
      let mark = '';
      let className = '';

      if (answers[index]) {
        if (answers[index] === result) {
          mark = '✔';
          className = "correct";
        }
        else {
          mark = '×';
          className = "correct";
        }
      }

      return { mark, className };
    },
    [answers, index, result]
  );

  if (mark) {
    return <small className={className}>{mark}</small>;
  }
  return null;
};

const App: React.FC = () => {
  const router = useRouter()
  const { day } = router.query

  const { part1, part2, answers = [], meta, meta: { manualStart = false } = {} } = useMemo(
    () => Days[`day${day}`] ?? {},
    [day]
  );

  const startPart1 = useCallback(
    () => {
      if (manualStart) {
        console.log("Part 1 started");
      }
      setPart1(timeAndRun(() => {
        const ans = part1(safetyNet(meta))
        if (manualStart) {
          console.log("Part 1 returned", ans);
        }
        return ans;
      }));
    },
    [manualStart, part1, meta]
  )

  const startPart2 = useCallback(
    () => {
      if (manualStart) {
        console.log("Part 2 started");
      }
      setPart2(timeAndRun(() => {
        const ans = part2(safetyNet(meta))
        if (manualStart) {
          console.log("Part 2 returned", ans);
        }
        return ans;
      }));
    },
    [manualStart, part2, meta]
  )

  const [[result1, duration1], setPart1] = useState<[string | number, number]>(["", 0]);
  const [[result2, duration2], setPart2] = useState<[string | number, number]>(["", 0]);

  useEffect(
    () => {
      if (meta) {
        if (manualStart) {
          setPart1(["", 0]);
          setPart2(["", 0]);
        }
        else {
          console.clear();
          startPart1();
          startPart2();
        }
      }
    },
    [meta, manualStart, startPart1, startPart2]
  )

  return (
    <>
      <h1>AoC 2022 - Day {day}</h1>
      <p><a href={`https://adventofcode.com/2022/day/${day}`} target="_blank" rel="noreferrer">Problem</a></p>
      <div className="parts">
        <div className="part">
          <h2>Part 1 <Check answers={answers} result={result1} index={0} /></h2>
          <pre><big><b>{result1}</b></big></pre>
          <p><small><i>(in {duration1}ms)</i></small></p>
          {manualStart && <p>
            <button type="button" onClick={startPart1}>start</button>
          </p>}
        </div>
        <div className="part">
          <h2>Part 2 <Check answers={answers} result={result2} index={1} /></h2>
          <pre><big><b>{result2}</b></big></pre>
          <p><small><i>(in {duration2}ms)</i></small></p>
          {manualStart && <p>
            <button type="button" onClick={startPart2}>start</button>
          </p>}
        </div>
      </div>

      <Nav />
    </>
  );
}

export default App

