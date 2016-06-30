import Router from "falcor-router";
import dataSourceHanlder from "falcor-lambda";

// module.exports.handler = function(event, context, cb) {
//   lib.runGraphQL(event, function(error, response) {
//     return context.done(error, response);
//   });
// };

class MyRouter extends Router.createClass([
  {
    route: "greeting",
    get: function(pathset) {
      return {
        path: "greeting",
        value: "Hello, world",
      },
    },
  },
]);

module.exports.handler = dataSourceHanlder((event, context) => {
  return new MyRouter();
});
