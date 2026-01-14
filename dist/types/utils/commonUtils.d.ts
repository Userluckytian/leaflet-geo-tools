import * as L from 'leaflet';
/** 查询点击位置处的图层
 * 优点：不依赖外部库，纯 Leaflet 实现（优化版本，见queryLayersIntersectingGeometry，可读性强，但依赖@turf/turf库）
 *
 * @export
 * @param {L.Map} map 地图实例
 * @param {L.LeafletMouseEvent} e 点击事件回调参数e
 * @return {*}
 */
export declare function queryLayerOnClick(map: L.Map, e: L.LeafletMouseEvent): any[];
/**
 * 查询与给定几何（线或面）相交的图层
 * @param map 地图实例
 * @param geometry 用户绘制的线或面（GeoJSON Feature 或 Leaflet 图层）
 * @returns 与之相交的图层数组
 */
export declare function queryLayersIntersectingGeometry(map: L.Map, geometry: GeoJSON.Feature | L.Polyline | L.Polygon): any[];
/** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
 *
 *
 * @private
 * @param {string} [iconStyle="border-radius: 50%;background: #ffffff;border: solid 3px red;"]
 * @param {L.PointExpression} [iconSize=[20, 20]]
 * @param {L.DivIconOptions} [options]
 * @return {*}  {L.DivIcon}
 * @memberof LeafletEditPolygon
 */
export declare function buildMarkerIcon(iconStyle?: string, iconSize?: number[], options?: L.DivIconOptions): L.DivIcon;
