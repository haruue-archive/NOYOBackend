import {isBoolean} from "util";

export function parseBoolean(origin: any | null | undefined, defaultValue: boolean = false) {
  if (isBoolean(origin)) {
    return origin;
  }
  let value = defaultValue;
  if (origin) {
    if (defaultValue) {
      // default true, try to make it false
      if (origin == '0' || /^n.*/i.test(origin) || /^f.*/i.test(origin)) {
        value = false;
      }
    } else {
      // default false, try to make it true
      if (origin > 0 || origin < 0 || /^y.*/i.test(origin) || /^t.*/i.test(origin)) {
        value = true;
      }
    }
  }
  return value;
}