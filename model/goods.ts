import {ObjectID} from "bson";
import {isUndefined} from "util";
import {Order} from "./order";

/**
 * A class refer to Goods
 */
export class Goods {
  _id?: ObjectID;

  title: string;
  summary: string;

  /**
   * in Goods: reminder of available goods
   */
  count: number;
  price: number;
  image?: string;

  /**
   * should be one of {@link TypeList}
   */
  type: "product" | "mud";

  /**
   * uid of seller
   */
  seller: ObjectID;

  /**
   * refer to orders create by this goods
   */
  orders: Array<Order> = [];

  /**
   * where it grow in Goods
   */
  address: string;

  constructor(seller: ObjectID, title: string, summary: string, count: number, price: number, type: "product"|"mud", address: string, image?: string | undefined) {
    this.title = title;
    this.summary = summary;
    this.count = Math.floor(count);
    this.price = Math.floor(price * 100) / 100;
    this.type = type;
    this.image = image;
    this.seller = seller;
    this.address = address;
  }

  createOrder(buyer: ObjectID, count: number, address: string, external: string): Order {
    if (isUndefined(this._id)) {
      throw new Error("Storage it into db before create a order");
    }
    let order = new Order(
      this._id,
      this.title,
      this.summary,
      count,
      this.price,
      this.image,
      this.type,
      this.seller,
      buyer,
      0,
      address,
      external
    );
    this.orders.push(order);
    return order;
  }

  static TypeList = {
    TYPE_MUD: "mud",
    TYPE_PRODUCT: "product"
  };

  static TYPES = [
    Goods.TypeList.TYPE_MUD,
    Goods.TypeList.TYPE_PRODUCT
  ]
}


