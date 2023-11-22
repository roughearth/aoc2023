export const eg1 = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

export const eg1Parsed = () => [
  {
    items: [79, 98],
    operation: (old: number) => old * 19,
    divisibleby: 23,
    Iftrue: 2,
    Iffalse: 3
  }, {
    items: [54, 65, 75, 74],
    operation: (old: number) => old + 6,
    divisibleby: 19,
    Iftrue: 2,
    Iffalse: 0
  }, {
    items: [79, 60, 97],
    operation: (old: number) => old * old,
    divisibleby: 13,
    Iftrue: 1,
    Iffalse: 3
  }, {
    items: [74],
    operation: (old: number) => old + 3,
    divisibleby: 17,
    Iftrue: 0,
    Iffalse: 1
  }
];

export const inputParsed = () => [
  {
    items: [50, 70, 54, 83, 52, 78],
    operation: (old: number) => old * 3,
    divisibleby: 11,
    Iftrue: 2,
    Iffalse: 7
  }, {
    items: [71, 52, 58, 60, 71],
    operation: (old: number) => old * old,
    divisibleby: 7,
    Iftrue: 0,
    Iffalse: 2
  }, {
    items: [66, 56, 56, 94, 60, 86, 73],
    operation: (old: number) => old + 1,
    divisibleby: 3,
    Iftrue: 7,
    Iffalse: 5
  }, {
    items: [83, 99],
    operation: (old: number) => old + 8,
    divisibleby: 5,
    Iftrue: 6,
    Iffalse: 4
  }, {
    items: [98, 98, 79],
    operation: (old: number) => old + 3,
    divisibleby: 17,
    Iftrue: 1,
    Iffalse: 0
  }, {
    items: [76],
    operation: (old: number) => old + 4,
    divisibleby: 13,
    Iftrue: 6,
    Iffalse: 3
  }, {
    items: [52, 51, 84, 54],
    operation: (old: number) => old * 17,
    divisibleby: 19,
    Iftrue: 4,
    Iffalse: 1
  }, {
    items: [82, 86, 91, 79, 94, 92, 59, 94],
    operation: (old: number) => old + 7,
    divisibleby: 2,
    Iftrue: 5,
    Iffalse: 3
  }
];

export const input = `Monkey 0:
Starting items: 50, 70, 54, 83, 52, 78
Operation: new = old * 3
Test: divisible by 11
  If true: throw to monkey 2
  If false: throw to monkey 7

Monkey 1:
Starting items: 71, 52, 58, 60, 71
Operation: new = old * old
Test: divisible by 7
  If true: throw to monkey 0
  If false: throw to monkey 2

Monkey 2:
Starting items: 66, 56, 56, 94, 60, 86, 73
Operation: new = old + 1
Test: divisible by 3
  If true: throw to monkey 7
  If false: throw to monkey 5

Monkey 3:
Starting items: 83, 99
Operation: new = old + 8
Test: divisible by 5
  If true: throw to monkey 6
  If false: throw to monkey 4

Monkey 4:
Starting items: 98, 98, 79
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 1
  If false: throw to monkey 0

Monkey 5:
Starting items: 76
Operation: new = old + 4
Test: divisible by 13
  If true: throw to monkey 6
  If false: throw to monkey 3

Monkey 6:
Starting items: 52, 51, 84, 54
Operation: new = old * 17
Test: divisible by 19
  If true: throw to monkey 4
  If false: throw to monkey 1

Monkey 7:
Starting items: 82, 86, 91, 79, 94, 92, 59, 94
Operation: new = old + 7
Test: divisible by 2
  If true: throw to monkey 5
  If false: throw to monkey 3`;