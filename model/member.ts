/**
 * User of this app
 * <p>
 * store as "member" collection in database
 */
export class Member {
  _id?: any;
  username: string;
  nickname: string;
  password: string;
  email: string;
  isEmailVerified: boolean = false;
  mobile?: number;
  isMobileVerified: boolean = false;
  city?: string;
  role: "farmer" | "consumer";

  static ROLE_FARMER = "farmer";
  static ROLE_CONSUMER = "consumer";

  static ROLES = [Member.ROLE_FARMER, Member.ROLE_CONSUMER];
}