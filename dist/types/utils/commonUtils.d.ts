import * as L from 'leaflet';
/** 查询点击位置处的图层
 *
 *
 * @export
 * @param {L.Map} map 地图实例
 * @param {L.LeafletMouseEvent} e 点击事件回调参数e
 * @return {*}
 */
export declare function queryLayerOnClick(map: L.Map, e: L.LeafletMouseEvent): any[];
