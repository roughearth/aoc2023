import { modAdd, modInv, modLog, modLpr, modMul, modPow } from "./mod";

describe('mod utils', () => {
  describe('modLpr', () => {
    it('returns the least positive residue of a number modulo mod', () => {
      expect(modLpr(7, 5)).toBe(2);
      expect(modLpr(-7, 5)).toBe(3);
      expect(modLpr(7, -5)).toBe(2);
      expect(modLpr(-7, -5)).toBe(3);
    });
  });

  describe('modInv', () => {
    it('returns the modular inverse of a number modulo mod', () => {
      expect(modInv(3, 7)).toBe(5);
      expect(() => modInv(2, 3)).toThrow();
    });
  });

  describe('modAdd', () => {
    it('returns the sum of two numbers modulo mod', () => {
      expect(modAdd(3, 4, 5)).toBe(2);
      expect(modAdd(3, 4, -5)).toBe(2);
    });
  });

  describe('modMul', () => {
    it('returns the product of two numbers modulo mod', () => {
      expect(modMul(3, 4, 5)).toBe(2);
      expect(modMul(3, 4, -5)).toBe(2);
    });
  });

  describe('modPow', () => {
    it('returns n to the power of p modulo mod', () => {
      expect(modPow(2, 3, 5)).toBe(3);
      expect(modPow(2, 3, -5)).toBe(3);
    });
  });

  describe('modLog', () => {
    it('returns the logarithm of n to the base of b modulo mod', () => {
      expect(modLog(2)(3)(7)).toBe(5);
      expect(() => modLog(2)(3)(5)).toThrow();
    });
  });
});
