export type Result<T, E = Error> =
  | {
      type: "loading";
    }
  | {
      type: "ok";
      data: T;
    }
  | {
      type: "err";
      error: E;
    };
