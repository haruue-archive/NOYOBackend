import {ObjectID} from "bson";
import {Goods} from "./goods";
import {isUndefined} from "util";

export class Order {
  _id: ObjectID;

  /**
   * represent the id of goods in Order
   */
  goodsId: ObjectID;

  title: string;
  summary: string;

  /**
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
   * only in Orders
   */
  buyer: ObjectID;

  /**
   * status value,
   * represent status of a Order
   */
  status: 0|1|2|3|4|5|6|7|-1 = 0;

  /**
   * where it sent in Order
   */
  address: string;

  /**
   * external things
   * only used in Order,
   * always be empty in Goods
   */
  external: string = "";


  constructor(goodsId: ObjectID, title: string, summary: string, count: number, price: number, image: string | undefined, type, seller: ObjectID, buyer: ObjectID, status: any | any | any | any | any | any | any | any, address: string, external: string) {
    this._id = new ObjectID();
    this.goodsId = goodsId;
    this.title = title;
    this.summary = summary;
    this.count = Math.floor(count);
    this.price = Math.floor(price * 100) / 100 * this.count;
    this.image = image;
    this.type = type;
    this.seller = seller;
    this.buyer = buyer;
    this.status = status;
    this.address = address;
    this.external = external;
  }

  static fromGoods(goods: Goods, buyer: ObjectID, count: number, address: string, external: string) {
    if (isUndefined(goods._id)) {
      throw new Error("Storage it into db before create a order");
    }
    let order = new Order(
      goods._id,
      goods.title,
      goods.summary,
      count,
      goods.price,
      goods.image,
      goods.type,
      goods.seller,
      buyer,
      0,
      address,
      external
    );
    goods.orders.push(order);
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
    STATUS_DELIVERED: 7,
    STATUS_CANCELLED: -1
  };

  static STATUSES = [
    Order.StatusList.STATUS_WAITING_PAY,
    Order.StatusList.STATUS_PAID,
    Order.StatusList.STATUS_WAITING_PLANT,
    Order.StatusList.STATUS_PLANTED,
    Order.StatusList.STATUS_WAITING_HARVEST,
    Order.StatusList.STATUS_HARVESTED,
    Order.StatusList.STATUS_TRANSPORT,
    Order.StatusList.STATUS_DELIVERED,
    Order.StatusList.STATUS_CANCELLED
  ];


}