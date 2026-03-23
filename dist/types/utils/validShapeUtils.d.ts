/** [面]自相交检测（使用 turf.kinks， 一般线、面才会有）
 *
 *
 * @private
 * @param {number[][]} coords
 * @return {*}  {boolean} true=有自相交，false=无自相交
 */
export declare function polygonHasSelfIntersection(coords: number[][]): boolean;
/** [线]自相交检测（使用 turf.kinks， 一般线、面才会有）
 *
 *
 * @private
 * @param {number[][]} coords
 * @return {*}  {boolean} true=有自相交，false=无自相交
 */
export declare function polylineHasSelfIntersection(coords: number[][]): boolean;
