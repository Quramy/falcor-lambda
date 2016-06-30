export default function eventToContext(event, context) {
  const ret = {};
  Object.keys(event).forEach(k => {
    if (k === "method") {
      ret.method = event.method;
    } else if (event[k].length) {
      ret[k] = JSON.parse(event[k]);
    }
  });
  return ret;
}
