export type ConcatX<T> = (a: T, b: T) => T;

export type ConcatY = <T>(a: T, b: T) => T;

export function printData<T>(data: T) {
  console.log('data: ', data);
}
