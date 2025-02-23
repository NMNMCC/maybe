export type Error = Readonly<
  symbol & {
    timestamp: number;
  }
>;

type Handler<T> = {
  failed: (handler: (error: Error) => void) => T | void;
  succeeded: (handler: (value: T) => void) => Error | void;
};

type MaybeFailedBase = [Error, undefined];
export type MaybeFailed = MaybeFailedBase & Handler<never>;

type MaybeSucceedBase<T> = [undefined, T];
export type MaybeSucceed<T> = MaybeSucceedBase<T> & Handler<T>;

export type Maybe<T = void> = Readonly<MaybeFailed | MaybeSucceed<T>>;

export const fail = (description?: any): MaybeFailed => {
  const base: MaybeFailedBase = [
    Object.freeze(
      Object.assign(
        Symbol((() => {
          switch (typeof description) {
            case "string":
            case "number":
            case "undefined":
              return description;
            case "function":
              return description.name;
            case "bigint":
              return description.toString();
            case "symbol":
              return description.description;
            case "object":
              try {
                return JSON.stringify(description);
              } catch {
                return String(description);
              }
            default:
              return String(description);
          }
        })()),
        {
          timestamp: Date.now(),
        },
      ),
    ),
    undefined,
  ];

  return Object.assign(
    base,
    {
      failed: (handler) => {
        handler(base[0]);
        return undefined;
      },
      succeeded: () => {
        return base[0];
      },
    } satisfies Handler<void>,
  );
};

export const succeed: {
  (): MaybeSucceed<void>;
  <T>(value: T): MaybeSucceed<T>;
} = <T = void>(value?: T): MaybeSucceed<T> => {
  const base: MaybeSucceedBase<T> = [undefined, value as any];

  return Object.assign(
    base,
    {
      failed: () => base[1],
      succeeded: (handler) => {
        handler(base[1]);
        return undefined;
      },
    } satisfies Handler<T>,
  );
};
