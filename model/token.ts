/**
 *
 */
export class Token {
  _id?: any;
  random: string;
  validated: boolean = false;

  /**
   * thing to validate
   */
  what: {
    name: string;
    userId: any;
    extra?: any;
    refId?: any;
  };

  /**
   * milliseconds
   *
   * <p>
   * initialize with new Date().getTime()
   * </p>
   */
  create: number;

  /**
   * milliseconds
   */
  expire: number;

  static obtain(length: number = 32, expire: number = 21600000, numberOnly: boolean = false): Promise<Token> {
    return new Promise((resolve, reject) => {
      try {
        const token = new Token();
        token.create = new Date().getTime();
        token.expire = expire;
        token.random = '';
        const range = numberOnly ? 10 : 62;
        for (let i = 0; i < length; i++) {
          let r = Math.floor(Math.random() * range + 48);
          if (r > 57) r += 7;
          if (r > 90) r += 6;
          token.random += String.fromCodePoint(r);
        }
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * obtain a token object for email validate
   *
   * 21600000 ms == 6 hours
   * @param {number} expire
   * @returns {Token}
   */
  static obtainEmail(expire: number = 21600000): Promise<Token> {
    return Token.obtain(32, expire, false);
  }

  /**
   * obtain a token object for mobile validate
   *
   * 900000 ms == 15 minutes
   * @param {number} expire
   * @returns {Token}
   */
  static obtainMobile(expire: number = 900000): Promise<Token> {
    return Token.obtain(6, expire, true);
  }
}

