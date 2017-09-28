import {Response} from "express";

export function errorHandle(error: any, message: string, code: number, res: Response) {
  error && console.error(error);
  if (res) {
    code && res.status && res.status(code);
    res.send({
      status: 'error',
      message: message,
    });
  }

}