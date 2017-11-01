import {tokenSignatureSecret} from "../config";
import * as md5 from "md5";

/**
 * Token generator for email or sms verify
 * <p>
 * base on simple signature and verify theory,
 * won't need database to store generated tokens.
 */
export class TokenGenerator {

  private expire: number;
  private sigCount: number;
  private timeSnip: number;

  /**
   * Constructor
   * @param {number} expire expire of every token, in millisecond
   * @param sigCount
   */
  constructor(expire: number, sigCount: number) {
    this.expire = expire;
    this.sigCount = sigCount;
    this.timeSnip = Math.ceil(expire / sigCount);
  }

  /**
   * sign with key
   * @param {string} str
   * @param {string} key
   * @return {string}
   */
  private static signature(str: string, key: string): string {
    return parseInt(md5(`${str}#${key}`), 16).toString(36).substring(0, 8).toUpperCase();
  }

  private generateByTime(uid: any, op: string, time: number): string {
    let calcTime = Math.floor(time / this.timeSnip) * this.timeSnip;
    let verifyString = `${uid}|${calcTime}|${op}`;
    return TokenGenerator.signature(verifyString, tokenSignatureSecret);
  }

  /**
   * generate a signature for user to do op
   * @param uid
   * @param {string} op
   * @return {Promise<string>}
   */
  generate(uid: any, op: string): Promise<string> {
    return new Promise(resolve => {
      let sig = this.generateByTime(uid, op, new Date().getTime());
      resolve(sig);
    });
  }

  /**
   * check a signature for user to do op
   * @param uid
   * @param {string} op
   * @param {string} token
   * @return {Promise<boolean>}
   */
  check(uid: any, op: string, token: string): Promise<boolean> {
    let time = new Date().getTime();
    return new Promise(resolve => {
      let possiblySig: string[] = [];
      for (let i = 0; i <= this.sigCount; i++) { // need a extra check
        let sig = this.generateByTime(uid, op, time - i * this.timeSnip);
        possiblySig.push(sig);
      }
      let result = token.toUpperCase() in possiblySig;
      resolve(result);
    });
  }
}