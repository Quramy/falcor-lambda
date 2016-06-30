import Router from "falcor-router";

export default class MyRouter extends Router.createClass([
  {
    route: "greeting",
    get: function(pathset) {
      return {
        path: ["greeting"],
        value: "Hello, world",
      };
    },
    set: function(jsonGraph) {
      return {
        path: ["greeting"],
        value: jsonGraph.greeting,
      };
    }
  },
]) {

}
