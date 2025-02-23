export type Error = Omit<
  Readonly<
    (
      & symbol
      & {
        timestamp: number;
      }
    )
  >,
  "toString" | "valueOf"
>;

export type MaybeError = [Error, undefined];
export type MaybeSuccess<Success> = [undefined, Success];

export type Maybe<Success = void> = MaybeError | MaybeSuccess<Success>;

export type IsError<T> = T extends MaybeError ? true : false;
export type IsSuccess<T> = T extends MaybeSuccess<T> ? true : false;

export const succeed = <T>(value: T): MaybeSuccess<T> => [undefined, value];

export const fail = (description: any): MaybeError => {
  return [
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
};

export const success = succeed;
export const error = fail;
