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
  },
]) {

}
