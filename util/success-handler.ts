import {Response} from "express";

export function successHandle(message: string, result: any | null | undefined, res: Response) {
  if (result) {
    // never transfer password info to client
    delete result.password;
  }
  if (res) {
    res.status && res.status(200);
    res.send({
      status: 'success',
      message: message,
      result: result
    });
  }

}
