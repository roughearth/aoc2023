export function generateArray<T>(length: number, generate: (i: number) => T): T[] {
  return Array.from(
    { length },
    (_, i) => generate(i)
  );
}

export function chunk<T>(a: T[], size: number): T[][] {
  return a.flatMap((_, i, a) => (i % size) ? [] : [a.slice(i, i + size)]);
}

export function sumOf(a: number[], map: (i: any) => number = i => i): number {
  return a.reduce((a, b) => map(a) + map(b));
}

export function productOf(a: number[], map: (i: any) => number = i => i): number {
  return a.reduce((a, b) => map(a) * map(b));
}

export function findBest<T>(a: T[], scoreFn: (i: T) => number): [T, number] {
  return <[T, number]>a.reduce(
    (t: [T | undefined, number], current) => {
      const [best, max] = t;

      const score = scoreFn(current);
      if (!best || (score > max)) {
        return [current, score];
      }
      return [best, max];
    },
    [undefined, Number.MIN_SAFE_INTEGER]
  )
}
