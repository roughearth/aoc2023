import { Base } from "./base";


describe("Base", () => {
  describe("12, with negative `VWX`", () => {
    let base: Base;

    beforeEach(() => {
      base = Base(12, { negativeDigits: "VWX" });
    });

    it.each([
      [0, '0'],
      [9, '1X'],
      [10, '1W'],
      [11, '1V'],
      [12, '10'],
      [13, '11'],
      [105, '1XX'],
      [144, '100'],
    ])("%d <-> %s", (n, s) => {
      expect(base.to(n)).toBe(s);
      expect(base.parse(s)).toBe(n);
    });
  });

  describe("5, with negative `-=` (AoC 2022, day 25)", () => {
    let base: Base;

    beforeEach(() => {
      base = Base(5, { negativeDigits: "-=" });
    });

    it.each([
      [1747, "1=-0-2"],
      [906, "12111"],
      [198, "2=0="],
      [11, "21"],
      [201, "2=01"],
      [31, "111"],
      [1257, "20012"],
      [32, "112"],
      [353, "1=-1="],
      [107, "1-12"],
      [7, "12"],
      [3, "1="],
      [37, "122"],
    ])("%d <-> %s", (n, s) => {
      expect(base.to(n)).toBe(s);
      expect(base.parse(s)).toBe(n);
    });
  });

  describe("large base", () => {
    let base: Base;

    beforeEach(() => {
      base = Base(62, { digits: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
    });

    it.each([
      [0, '0'],
      [9, '9'],
      [10, 'a'],
      [32, 'w'],
      [60, 'Y'],
      [61, 'Z'],
      [62, '10'],
      [62 ** 5 - 30, 'ZZZZw'],
    ])("%d <-> %s", (n, s) => {
      expect(base.to(n)).toBe(s);
      expect(base.parse(s)).toBe(n);
    });
  });

  describe("custom digits", () => {
    let base: Base;

    beforeEach(() => {
      base = Base(8, { digits: "zxcvbnmo" });
    });

    const c1310009 =
      4 * 8 ** 6 +
      7 * 8 ** 5 +
      7 * 8 ** 4 +
      6 * 8 ** 3 +
      4 * 8 ** 2 +
      7 * 8 +
      1;

    const c102910 =
      3 * 8 ** 5 +
      1 * 8 ** 4 +
      0 * 8 ** 3 +
      7 * 8 ** 2 +
      7 * 8 +
      6;

    it.each([
      [0, 'z'],
      [1, 'x'],
      [2, 'c'],
      [3, 'v'],
      [4, 'b'],
      [5, 'n'],
      [6, 'm'],
      [7, 'o'],
      [8, 'xz'],
      [c1310009, 'boombox'],
      [c102910, 'vxzoom'],
    ])("%d <-> %s", (n, s) => {
      expect(base.to(n)).toBe(s);
      expect(base.parse(s)).toBe(n);
    });
  });
});
