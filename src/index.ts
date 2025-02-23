export type Error<T> = Readonly<
  symbol & { data: T; timestamp: number }
>;

type MaybeFailedBase<T> = [Error<T>, undefined];
type MaybeFailedHandler<T> = {
  failed: (handler: (error: Error<T>) => void) => void;
  succeeded: (handler: (value: never) => void) => Error<T>;
};
export type MaybeFailed<T> = Readonly<
  MaybeFailedBase<T> & MaybeFailedHandler<T>
>;

type MaybeSucceedBase<T> = [undefined, T];
type MaybeSucceedHandler<T> = {
  failed: (handler: (error: never) => void) => T;
  succeeded: (handler: (value: T) => void) => void;
};
export type MaybeSucceed<T> = Readonly<
  MaybeSucceedBase<T> & MaybeSucceedHandler<T>
>;

export type Maybe<T = void, F = {}> =
  | MaybeFailed<F>
  | MaybeSucceed<T>;

const any = (value: any): string | number | undefined => {
  switch (typeof value) {
    case "function":
      return value.name;
    case "string":
    case "number":
    case "undefined":
      return value;
    case "bigint":
      return value.toString();
    case "symbol":
      return value.description;
    case "object":
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    default:
      return String(value);
  }
};

export const fail = <T>(
  description?: any,
  data: T = {} as T,
): MaybeFailed<T> => {
  const base: MaybeFailedBase<T> = [
    Object.freeze(
      Object.assign(
        Symbol(any(description)),
        {
          timestamp: Date.now(),
          data,
        },
      ),
    ),
    undefined,
  ];
  const handler: MaybeFailedHandler<T> = {
    failed: (handler) => handler(base[0]),
    succeeded: () => base[0],
  };

  return Object.freeze(Object.assign(base, handler));
};

export const succeed: {
  (): MaybeSucceed<void>;
  <T>(value: T): MaybeSucceed<T>;
} = <T = void>(value?: T): MaybeSucceed<T> => {
  const base: MaybeSucceedBase<T> = [undefined, value as any];
  const handler: MaybeSucceedHandler<T> = {
    failed: () => base[1],
    succeeded: (handler) => handler(base[1]),
  };

  return Object.freeze(Object.assign(base, handler));
};
