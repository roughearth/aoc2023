export function Base(base: number, {
  digits = Array.from({ length: 36 }, (_, i) => i.toString(36)).join(""),
  negativeDigits = ""
} = {}) {
  const digitSrc: [string, number][] = [
    ...Array.from(negativeDigits).map(
      (s, i): [string, number] => [s, -(i + 1)]
    ),
    ...Array.from(
      { length: base - negativeDigits.length },
      (_, i): [string, number] => [digits[i], i]
    )
  ];

  const valueMap = new Map(digitSrc);
  const digitMap = new Map(digitSrc.map(
    ([char, val]) => [
      ((val % base) + base) % base,
      char
    ]
  ));

  function to(n: number) {
    const chars = [];

    while (n) {
      const char = digitMap.get(n % base)!;
      n -= valueMap.get(char)!;
      n /= base;
      chars.unshift(char);
    }

    return chars.join("") || digitMap.get(0);
  }

  function parse(s: string) {
    return Array.from(s).reduce(
      (t, n) => (t * base + valueMap.get(n)!),
      0
    );
  }

  return {
    to,
    parse
  };
}

export type Base = ReturnType<typeof Base>;
