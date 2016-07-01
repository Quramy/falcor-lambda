import assert from "assert";
import Router from "falcor-router";
import dataSourceHandler from "../src";

class TestRouter extends Router.createClass([
  {
    route: "greeting",
    get: function(pathset) {
      return {
        path: ["greeting"],
        value: "hello",
      };
    },
    set: function(jsonGraph) {
      return {
        path: ["greeting"],
        value: jsonGraph.greeting,
      };
    },
    call: function(callpath, args) {
      return {
        path: ["message"],
        value: args[0],
      };
    },
  },
]) {
  constructor() {
    super();
  }
}

class ReflectRouter extends Router.createClass([
  {
    route: "reflect.event",
    get: function() {
      return {
        path: ["reflect", "event"],
        value: { $type: "atom", value: this.event }
      };
    },
  },
  {
    route: "reflect.context",
    get: function() {
      return {
        path: ["reflect", "context"],
        value: { $type: "atom", value: this.context}
      };
    },
  },
]){
  constructor(event, context) {
    super();
    this.event = event;
    this.context = context;
  }
}

describe("dataSourceHandler", function () {
  describe("handler creation", function () {
    it("passes through event and context value to handler", function (done) {
      const handler = dataSourceHandler((event, context) => {
        return new ReflectRouter(event, context);
      });
      const event = {
        method: "get",
        paths: JSON.stringify([["reflect", "event"], ["reflect", "context"]]),
      };
      const context = {
        key: "value",
      };
      handler(event, context, (err, {jsonGraph}) => {
        assert.deepEqual(jsonGraph.reflect.event.value, event);
        assert.deepEqual(jsonGraph.reflect.context.value, context);
        done();
      })
    });
  });

  describe("created handler", function () {
    it("handles get request", function (done) {
      const router = new TestRouter();
      const handler = dataSourceHandler(() => new TestRouter());
      handler({
        method: "get",
        paths: JSON.stringify([["greeting"]]),
      }, {}, (err, {jsonGraph}) => {
        assert.deepEqual(jsonGraph, {greeting: "hello"});
        done();
      });
    });

    it("handles set request", function (done) {
      const router = new TestRouter();
      const handler = dataSourceHandler(() => new TestRouter());
      handler({
        method: "set",
        jsonGraph: JSON.stringify({
          jsonGraph: {
            greeting: "bye"
          },
          paths: [["greeting"]],
        }),
      }, {}, (err, {jsonGraph}) => {
        assert.deepEqual(jsonGraph, {greeting: "bye"});
        done();
      });
    });

    it("handles call request", function (done) {
      const router = new TestRouter();
      const handler = dataSourceHandler(() => new TestRouter());
      handler({
        method: "call",
        callPath: JSON.stringify(["greeting"]),
        arguments: JSON.stringify(["hello"]),
      }, {}, (err, {jsonGraph}) => {
        assert.deepEqual(jsonGraph, {message: "hello"});
        done();
      });
    });
  });

  describe("options", function () {
    it("allows to customize eventToFalcorContext function", function (done) {
      const handler = dataSourceHandler(() => new TestRouter(), {
        eventToFalcorContext: (event) => event,
      });
      handler({method: "get", paths:[["greeting"]]}, {}, err => {
        if(!err) done();
      });
    });
  });
});
