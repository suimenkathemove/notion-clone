type ScalarMap = Record<string, "string" | "number">;
const scalarMap: ScalarMap = {
  PageId: "string",
};

// TODO: utils
const keys = <T extends string>(object: Record<T, unknown>): T[] =>
  Object.keys(object) as T[];

const phantom = (k: string, v: string): string => `${v} & { __type: '${k}' }`;

export const defineScalarType = (): string[] =>
  keys(scalarMap).map((k) => `export type ${k} = ${phantom(k, scalarMap[k]!)}`);

export const configScalars = (): Record<string, string> =>
  keys(scalarMap).reduce(
    (acc, k) => ({ ...acc, [k]: phantom(k, scalarMap[k]!) }),
    {},
  );
