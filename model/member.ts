/**
 * User of this app
 * <p>
 * store as "member" collection in database
 */
import {ObjectID} from "bson";
import {Order} from "./order";

export class Member {
  _id?: ObjectID;
  username: string;
  nickname: string;
  password: string;
  email: string;
  isEmailVerified: boolean = false;
  mobile?: number;
  isMobileVerified: boolean = false;
  city?: string;
  role: "farmer" | "consumer";
  orders: Array<Order> = [];

  static RoleList = {
    ROLE_FARMER: "farmer",
    ROLE_CONSUMER: "consumer"
  };


  static ROLES = [Member.RoleList.ROLE_FARMER, Member.RoleList.ROLE_CONSUMER];
}
