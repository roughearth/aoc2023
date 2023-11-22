import Link from 'next/link'
import leaderBoardMap from '../lib/.leaderboardListRc.json'
import { generateArray } from '../lib/utils';
import { currentDay } from "../lib/utils/dates";
import style from './nav.module.scss';


const decemberDays = [
  [
    'nov28', 'nov29', 'nov30',
    ...generateArray(4, i => `${i + 1}`)
  ],
  generateArray(7, i => `${i + 5}`),
  generateArray(7, i => `${i + 12}`),
  generateArray(7, i => `${i + 19}`)
];

const Nav: React.FC = () => {
  return (
    <>
      <h4>Nav</h4>
      <p><Link href={`/day/${currentDay()}`}>Today</Link></p>
      <table className={style.navCalendar}>
        <thead>
          <tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr>
        </thead>
        <tbody>{
          decemberDays.map((week) => <tr key={week[6]} data-key={week[6]}>{
            week.map((day) => <td align="right" key={day} data-key={day}>{
              (!day.startsWith('nov')) ? <Link href={`/day/${day}`}>{day}</Link> : ' '
            }</td>)
          }</tr>)
        }</tbody>
      </table>
      <ul className={style.navList}>
        {leaderBoardMap && leaderBoardMap.map(([id, name]) => (
          <li key={id}>
            <a href={`https://adventofcode.com/2022/leaderboard/private/view/${id}`} target="_blank" rel="noreferrer">{name} leaderboard</a>
          </li>
        ))}
        <li><a href="https://adventofcode.com/2022/" target="_blank" rel="noreferrer">AoC 2022</a></li>
      </ul>
    </>
  );
}

export default Nav;

