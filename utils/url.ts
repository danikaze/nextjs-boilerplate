type ParamValue = string | number;
interface KeyValueMap {
  [key: string]: ParamValue;
}

export function addUrlParam(
  base: string,
  name: string,
  value: ParamValue
): string {
  // tslint:disable: triple-equals
  if (!name || value == null) return base;

  const joiner = base.indexOf('?') === -1 ? '?' : '&';
  const key = encodeURIComponent(name);
  const val = encodeURIComponent(value);

  return `${base}${joiner}${key}=${val}`;
}

export function addUrlParams(base: string, params: KeyValueMap): string {
  const keys = Object.keys(params);
  let result = base;

  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    result = addUrlParam(result, keys[i], params[k]);
  }

  return result;
}
