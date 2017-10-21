import {Spot} from "./spot";
import {LotMap} from "./lot-map";

/**
 * Represent a parking lot
 * <p>
 * store as "lot" collection in database
 */
export class Lot {
  _id?: any;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: string;

  /**
   * real geographical coordinates for amap
   */
  location: {
    longitude: number;
    latitude: number;
  };

  spots: Array<Spot>;

  /**
   * indoor map information, optional
   * <p>
   * considering the floor may named complexly (such as UF, BG) in Chongqing,
   * using String to index it
   */
  map?: Map<String, LotMap>;
}