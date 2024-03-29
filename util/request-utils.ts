import {isBoolean, isNull, isUndefined} from "util";

export function parseBoolean(origin: any | null | undefined, defaultValue: boolean = false) {
  if (isBoolean(origin)) {
    return origin;
  }
  let value = defaultValue;
  if (!isNull(origin) && !isUndefined(origin)) {
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

export function isEmailValidate(email: string): boolean {
  return /^[1-9a-zA-Z+.]+@[1-9a-zA-Z.]*[1-9a-zA-Z]+\.[1-9a-zA-Z]+$/.test(email);
}

export function isUsernameValidate(username: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]{4,}$/.test(username);
}
