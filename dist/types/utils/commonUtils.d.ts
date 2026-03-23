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
/**
 * 简单坐标去重 - 剔除连续重复坐标
 * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
 * @param {number} precision - 精度（小数位数），默认6位
 * @returns {Array} 去重后的坐标数组
 */
export declare function deduplicateCoordinates(coordinates: string | any[]): any[];
/**
 * 获取边上某个比例位置的点（例如 1/3、2/3）
 * @param p1 起点
 * @param p2 终点
 * @param ratio 比例（0~1），例如 1/3 = 0.333
 * @returns L.LatLng
 */
export declare function getFractionalPointOnEdge(p1: L.LatLng, p2: L.LatLng, ratio: number): L.LatLng;
/** 转换经纬度为Leaflet可接受的格式(简言之,从[经度, 纬度],变成[纬度, 经度])
 *
 *
 * @private
 * @param {GeoJSON.Geometry} geometry
 * @return {*}  {(L.LatLngExpression[][] | L.LatLngExpression[][][])}
 * @memberof LeafletPolygonEditor
 */
export declare function reverseLatLngs(geometry: GeoJSON.Geometry): L.LatLngExpression[][] | L.LatLngExpression[][][];
/** 转换【矩形】的geojson-经纬度坐标
 *
 *
 * @private
 * @param {GeoJSON.Geometry} geometry
 * @return {*}  {L.LatLngBoundsExpression}
 * @memberof LeafletRectangleEditor
 */
export declare function reverseRectLatLngs(geometry: GeoJSON.Geometry): L.LatLngBoundsExpression;
/** 转换【点】的经纬度坐标
 *
 *
 * @private
 * @param {GeoJSON.Geometry} geometry
 * @return {*}  {L.LatLngBoundsExpression}
 * @memberof LeafletRectangleEditor
 */
export declare function reversePointLatLngs(geometry: GeoJSON.Geometry): number[];
/** 转换【线】的经纬度坐标,并强制按照多线的结构返回。
 *
 *
 * @private
 * @param {GeoJSON.Geometry} geometry
 * @return {*}  {L.LatLngBoundsExpression}
 * @memberof LeafletRectangleEditor
 */
export declare function reversePolyLineLatLngs(geometry: GeoJSON.Geometry): number[][][];
/**  判断点击事件是否点击到layer身上
     *
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof LeafletEditRectangle
     */
export declare function isClickOnLayer(e: L.LeafletMouseEvent, layer: L.Polygon | L.Rectangle | L.Circle | L.Polyline): boolean;
/** turf的校验有效性，同时增强，因为要同步进行坐标的范围进行校验
 *
 * @param geom
 * @returns
 */
export declare function booleanValidEnhance(geom: any): boolean;
