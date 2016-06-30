
export default function dataSourceHanlder(getDataSource) {
  return (event, context, cb) => {
    const dataSource = getDataSource(event, context);
    if (!dataSource) {
      return cb({
        message: "There is no falcor data source.",
      });
    }

    const falcorContext = eventToContext(event, context);

    let obs;
    if (falcorContext.method === 'get') {
      obs = dataSource.get([].concat(context.paths));
    } else if (falcorContext.method === 'set') {
      obs = dataSource.set(context.jsonGraph);
    } else if (falcorContext.method === 'call') {
      obs = dataSource.call(context.callPath, context.arguments, context.pathSuffixes, context.paths);
    }

    return obs.subscribe(jsonGraphEnvelope => {
      cb(null, jsonGraphEnvelope);
    }, err => {
      cb(err);
    });
  };
}
