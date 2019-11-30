import { Context } from "../src/context";

describe("Simple tests", () => {
  it("should get context", () => {
    let context = {};
    let actual = new Context(context);

    expect(actual.context()).toBe(context);
  });
  it("should change context", () => {
    let context1 = {};
    let context2 = {};
    let actual = new Context(context1);

    actual.change(context2);

    expect(actual.context()).toBe(context2);
  });
});

describe("Plugins tests", () => {
  it("should process task", () => {
    function testIt(this: number, param1: number, param2: string) {
      actual1 = this;
      actual2 = param1;
      actual3 = param2;
    }

    var actual1: number = 0,
      actual2: number = 0,
      actual3: string = "";

    let c = new Context(100);
    c.use(50)
      .use("test")
      .task(testIt);

    expect(actual1).toBe(100);
    expect(actual2).toBe(50);
    expect(actual3).toBe("test");
  });
});
