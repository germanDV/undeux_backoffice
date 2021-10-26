/**
 * qp parses a querystring/search and returns an object.
 */
export function qp(search: string): Record<string, string> {
  const query: Record<string, string> = {};
  search.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    (_, k, __, v) => query[k] = v,
  );
  return query;
}
