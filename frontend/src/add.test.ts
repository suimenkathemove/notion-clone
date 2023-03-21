import { expect, test } from "vitest";

const add = (a: number, b: number) => a + b;

test("add", () => {
  expect(add(1, 2)).toBe(3);
});
