export default function eventToContext(event, context) {
  const ret = {};
  if (event.method) {
    ret.method = event.method;
  }
  if (event.paths) {
    ret.paths = JSON.parse(event.paths);
  }
  return ret;
}
