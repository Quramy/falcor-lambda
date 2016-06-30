import MyRouter from "./router";
import assert from "assert";

describe("router", function () {
  it("returns greeting", function (done) {
    const dataSource = new MyRouter();
    const paths = [["greeting"]];
    dataSource.get([].concat(paths)).subscribe(({jsonGraph}) => {
      assert(jsonGraph.greeting === "Hello, world");
      done();
    }, (err) => {
      console.error(err);
      assert.fail();
    });
  });
});
