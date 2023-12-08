import { modAdd, modInv, modLog, modLpr, modMul, modPow } from "./mod";

describe('mod utils', () => {
  describe('modLpr', () => {
    it.each([
      [7, 5, 2],
      [-7, 5, 3],
      [7, -5, 2],
      [-7, -5, 3],
    ])('the least positive residue of %p modulo %p is %p', (a, b, c) => {
      expect(modLpr(a, b)).toBe(c);
    });
  });

  describe('modInv', () => {
    it('returns the modular inverse of a number modulo mod', () => {
      expect(modInv(3, 7)).toBe(5);
    });
  });

  describe('modAdd', () => {
    it.each([
      [3, 4, 5, 2],
      [3, 4, -5, 2]
    ])('the sum of %p and %p modulo %p is %p', (a, b, c, d) => {
      expect(modAdd(a, b, c)).toBe(d);
    });
  });

  describe('modMul', () => {
    it.each([
      [3, 4, 5, 2],
      [3, 4, -5, 2]
    ])('the product of %p and %p modulo %p is %p', (a, b, c, d) => {
      expect(modMul(a, b, c)).toBe(d);
    });
  });

  describe('modPow', () => {
    it.each([
      [3, 4, 5, 1],
      [3, 4, -5, 1],
      [3, 4, 7, 4],
      [3, 4, -7, 4]
    ])('%p to the power of %p modulo %p is %p', (a, b, c, d) => {
      expect(modPow(a, b, c)).toBe(d);
    });
  });

  describe('modLog', () => {
    it('returns the logarithm of n to the base of b modulo mod', () => {
      expect(modLog(2, 3, 7)).toBe(2);
    });
    it('throws if there is no log', () => {
      expect(() => modLog(2, 99, 7)).toThrow();
    });
  });
});
