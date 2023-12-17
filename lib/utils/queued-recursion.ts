/*

const sum = recurWithQueue(fn, ...arg)

*/

function testTuple<T extends any[]>(t: T) {
  return t;
}

const t: [number, string, boolean] = [1, "a", true];

const qqq = testTuple(t);

type RecurAny<V> = (recur: RecurAny<V>, ...args: any[]) => V;
type Recur1<A1, V> = (recur: Recur1<A1, V>, arg1: A1) => V;
type Recur2<A1, A2, V> = (recur: Recur2<A1, A2, V>, arg1: A1, arg2: A2) => V;
type Recur3<A1, A2, A3, V> = (recur: Recur3<A1, A2, A3, V>, arg1: A1, arg2: A2, arg3: A3) => V;
type Recur4<A1, A2, A3, A4, V> = (recur: Recur4<A1, A2, A3, A4, V>, arg1: A1, arg2: A2, arg3: A3, arg4: A4) => V;

export function recurWithQueue<A1, V>(fn: Recur1<A1, V>): V;
export function recurWithQueue<A1, A2, V>(fn: Recur2<A1, A2, V>, arg1: A1, arg2: A2): V;
export function recurWithQueue<A1, A2, A3, V>(fn: Recur3<A1, A2, A3, V>, arg1: A1, arg2: A2, arg3: A3): V;
export function recurWithQueue<A1, A2, A3, A4, V>(fn: Recur4<A1, A2, A3, A4, V>, arg1: A1, arg2: A2, arg3: A3, arg4: A4): V;
export function recurWithQueue<V>(fn: RecurAny<V>, ...args: any[]): V {
  return "todo" as any;
}

