export function Dict<T>(tuples: Array<[any, T]>) {
  let dict: { [key: number]: any } = {};
  let string_dict: { [key: string]: any } = {};

  tuples.forEach(t => {
    switch (typeof t[0]) {
      case "string":
        string_dict[t[0]] = t[1];
        break;
      case "number":
        dict[t[0]] = t[1];
        break;
    }
  });

  function getByEnum(key: any): T {
    switch (typeof key) {
      case "string":
        return string_dict[key];
      default:
        return dict[key];
    }
  }
  return getByEnum;
}
