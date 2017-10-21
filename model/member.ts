/**
 * User of this app
 * <p>
 * store as "member" collection in database
 */
export class Member {
  _id?: any;
  username?: string;
  nickname?: string;
  password?: string;
  email?: string;
  isEmailVerified?: boolean;
  mobile?: number;
  isMobileVerified?: boolean;
  city?: string;
  cars?: Array<string>
}