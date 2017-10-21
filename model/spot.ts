/**
 * a parking spot or a navigation location point
 *
 * <p>
 * use in {@link Lot#spots} to describe the parking spots information and indoor navigation
 */
export class Spot {

  /**
   * identification of a parking spot, such as "L1A3", "B2C4"
   * <p>
   * should be unique in a parking lot
   */
  name: number;

  /**
   * status information, should be one value in {@link SpotStatusList}
   */
  status: number;

  /**
   * physics mac of this devices, used in indoor navigation
   */
  mac?: {
    /**
     * should be one in {@link SpotMacType}
     */
    type: string
    value: string
  };

  fee: {
    /**
     * price per cycle - CNY
     */
    price: number

    /**
     * cycle duration - second
     */
    cycle: number
  }
}

export const SpotStatusList = {
  /**
   * idle, this spot is available for use
   */
  IDLE: 0,

  /**
   * this spot has been booked but not be used yet
   */
  KEEP: 1,

  /**
   * a car has been parked on this spot
   */
  OCCUPANCY: 2,

  /**
   * disabled by parking manager
   */
  DISABLE: 3,

  /**
   * this is not a parking spot but only a device for navigation
   */
  LOCATE_POINT: 4,
};

export const SpotMacType = {
  BLUETOOTH: 1,
  WIFI: 2,
};