export function* pairs(
  length: number,
  {
    start = 0,
    gap = 1
  } = {}
) {
  let i = start;

  do {
    let j = i + gap

    do {
      yield [i, j];
      j += 1;
    }
    while (j < length)

    i += 1;
  }
  while (i < length - gap)
}

export function* combinationsOf<T>(items: T[], count: number): Generator<T[]> {
  if (count === 1) {
    for (const item of items) {
      yield [item];
    }
  }
  else {
    for (const [i, item] of items.entries()) {
      for (const rest of combinationsOf(items.slice(i + 1), count - 1)) {
        yield [item, ...rest];
      }
    }
  }
}

export function* sumPartitions(total: number, count: number, allowZero = false): Generator<number[]> {
  let start = allowZero ? 0 : 1;

  if (count === 1) {
    yield [total];
  }
  else if (count === 2) {
    for (let i = start; i <= total - 1; i++) {
      yield [i, total - i];
    }
  }
  else {
    for (let i = start; i <= total - (count - 1); i++) {
      for (const rest of sumPartitions(total - i, count - 1)) {
        yield [i, ...rest];
      }
    }
  }
}