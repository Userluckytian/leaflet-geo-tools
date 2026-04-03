import type { TopoClipResult, ReshapeOptions, TopoReshapeFeatureResult } from "../types";
/** 保存裁剪后的图层
 *
 * @param {Feature<any>} lineFeature 绘制的线Feature
 * @param {L.GeoJSON[]} selLayers 用户选择的图层数组
 * @return {Object} 返回对象{clipsPolygons, waitingDelLayer}
 */
export declare function clipSelectedLayersByLine(lineFeature: GeoJSON.Feature<any>, selLayers: L.GeoJSON[], precision?: number | false): TopoClipResult;
/** 合并多边形
 *
 * @param selLayers
 */
export declare function mergePolygon(selLayers: any, precision?: number | false): GeoJSON.Feature | null;
/** 返回整形要素工具处理后的结果和参与裁剪的要素数组
 *
 *
 * @export
 * @param {GeoJSON.Feature<any>} lineFeature
 * @param {L.GeoJSON[]} selLayers
 * @return {*}  {TopoReshapeFeatureResult}
 */
export declare function reshapeSelectedLayersByLine(sketchLine: GeoJSON.Feature<any>, selLayers: L.GeoJSON[], options?: ReshapeOptions, precision?: number | false): TopoReshapeFeatureResult;
/**
 * 判断点是否在线上（支持 LineString 和 MultiLineString）
 * @param pointGeoJSON 点 GeoJSON
 * @param lineGeoJSON 线 GeoJSON（LineString 或 MultiLineString）
 * @returns 是否在线上
 */
export declare function isPointOnLine(pointGeoJSON: any, lineGeoJSON: any): boolean;
/** 点是否在圆内
 *
 *
 * @export
 * @param {L.LatLng} point
 * @param {L.Circle} layer
 * @return {*}
 */
export declare function isPointClickInCircle(point: L.LatLng, layer: L.Circle): boolean;
