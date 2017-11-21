import {ObjectID} from "bson";
import {isUndefined} from "util";

/**
 * A class refer to Goods and Orders
 */
export class Goods {
  _id?: ObjectID;

  /**
   * unused in Goods
   * represent the id of goods in Order
   */
  goodsId: ObjectID;

  title: string;
  summary: string;

  /**
   * in Goods: reminder of available goods
   * in Order: count of goods that the consume buy
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
   * status value,
   * represent status of a Order
   * unused and always be {@link StatusList.STATUS_WAITING_PAY} in Goods
   */
  status: 0|1|2|3|4|5|6|7 = 0;

  /**
   * where it grow in Goods
   * where it sent in Order
   */
  address: string;

  /**
   * external things
   * only used in Order,
   * always be empty in Goods
   */
  external: string = "";

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

  createOrder(count: number, address: string, external: string): Goods {
    let order = new Goods(this.seller, this.title, this.summary, count, this.price, this.type, address, this.image);
    order._id = ObjectID.createFromTime(new Date().getTime() / 1000);
    if (isUndefined(this._id)) {
      throw new Error("Storage it into db before create a order");
    }
    order.goodsId = this._id;
    order.external = external;
    return order;
  }

  static StatusList = {
    STATUS_WAITING_PAY: 0,
    STATUS_PAID: 1,
    STATUS_WAITING_PLANT: 2,
    STATUS_PLANTED: 3,
    STATUS_WAITING_HARVEST: 4,
    STATUS_HARVESTED: 5,
    STATUS_TRANSPORT: 6,
    STATUS_DELIVERED: 7
  };

  static STATUSES = [
    Goods.StatusList.STATUS_WAITING_PAY,
    Goods.StatusList.STATUS_PAID,
    Goods.StatusList.STATUS_WAITING_PLANT,
    Goods.StatusList.STATUS_PLANTED,
    Goods.StatusList.STATUS_WAITING_HARVEST,
    Goods.StatusList.STATUS_HARVESTED,
    Goods.StatusList.STATUS_TRANSPORT,
    Goods.StatusList.STATUS_DELIVERED
  ];

  static TypeList = {
    TYPE_MUD: "mud",
    TYPE_PRODUCT: "product"
  };

  static TYPES = [
    Goods.TypeList.TYPE_MUD,
    Goods.TypeList.TYPE_PRODUCT
  ]
}


