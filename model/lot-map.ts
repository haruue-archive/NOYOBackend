/**
 * Indoor map for a single floor of a parking lot
 *
 * <p>
 * use in {@link Lot#map} to describe the parking lot structure and indoor navigation
 *
 * <p>
 * 1. draw the map
 * 2. put it in a rect with follow direction and
 *    origin point (0, 0) in the left-bottom corner
 *
 * W ---x---> E
 * S ---y---> N
 *
 *        y ^ N
 *          |
 *   W      |        E
 *  ------------------>
 *          |        x
 *          |
 *   O      | S
 *
 */
export class LotMap {

  /**
   * the size of the map in px
   */
  size?: {
    x: number;
    y: number;
  };

  imageUrl?: string;

  // TODO: find a way to draw the map

}