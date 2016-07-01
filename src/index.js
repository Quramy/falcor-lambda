import eventToContext from "./eventToContext";

const defaultOpt = {
  debug: false,
  eventToFalcorContext: eventToContext,
};

export default function dataSourceHanlder(getDataSource, opt = {}) {

  const options = Object.assign(defaultOpt, opt);

  function log() {
    if (options.debug) {
      console.log.apply(console, arguments);
    }
  }

  return (event, context, cb) => {
    const dataSource = getDataSource(event, context);
    if (!dataSource) {
      return cb({
        message: "There is no falcor data source.",
      });
    }

    log("event", event);
    const falcorContext = options.eventToFalcorContext(event, context);
    if (!falcorContext) {
      return cb({
        message: "No falcor context"
      });
    }
    log("falcorContext", falcorContext);

    let obs;
    if (falcorContext.method === 'set') {
      obs = dataSource.set(falcorContext.jsonGraph);
    } else if (falcorContext.method === 'call') {
      obs = dataSource.call(falcorContext.callPath, falcorContext.arguments, falcorContext.pathSuffixes, falcorContext.paths);
    } else {
      obs = dataSource.get([].concat(falcorContext.paths));
    }

    return obs.subscribe(jsonGraphEnvelope => {
      log("success", jsonGraphEnvelope);
      cb(null, jsonGraphEnvelope);
    }, err => {
      log("error", err);
      cb(err);
    });
  };
}
