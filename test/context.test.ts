import { Context } from "../src/context";

describe("Module create test", () => {
  it("should create module", () => {
    let context = {};
    let actual = new Context(context);

    expect(actual.context()).toBe(context);
  });
});
