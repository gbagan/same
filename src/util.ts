export const arrayOf = <A>(n: number, val: A): A[] => new Array(n).fill(val);
export const tabulate = <A>(n: number, f: (i: number) => A): A[] => Array.from({ length: n }, (_, i) => f(i));
export const random = (start: number, end: number) => start + (end - start) * Math.random() | 0;
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function countBy<A>(arr: readonly A[], pred: (x: A, i: number) => boolean): number {
  let count = 0;
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    if (pred(arr[i], i)) {
      count += 1;
    }
  }
  return count;
}