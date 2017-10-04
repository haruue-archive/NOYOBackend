import {Response} from "express";
import {isUndefined} from "util";

interface APIResult {
  status?: string;
  message: string;
  data?: any;
}

export function successHandle(res: Response, result: APIResult) {
  if (result.data) {
    // never transfer password info to client
    delete result.data.password;
  }
  if (res) {
    res.status && res.status(200);
    if (isUndefined(result.status)) {
      result.status = 'success';
    }
    res.send(result);
  }

}
