import type { ReshapeOptions, TopoClipResult, TopoReshapeFeatureResult } from "../types";
/** 保存裁剪后的图层
 *
 * @param {Feature<any>} lineFeature 绘制的线Feature
 * @param {L.GeoJSON[]} selLayers 用户选择的图层数组
 * @return {Object} 返回对象{clipsPolygons, waitingDelLayer}
 */
export declare function clipSelectedLayersByLine(lineFeature: GeoJSON.Feature<any>, selLayers: L.GeoJSON[]): TopoClipResult;
/** 合并多边形
 *
 * @param selLayers
 */
export declare function mergePolygon(selLayers: any): GeoJSON.Feature | null;
/** 返回整形要素工具处理后的结果和参与裁剪的要素数组
 *
 *
 * @export
 * @param {GeoJSON.Feature<any>} lineFeature
 * @param {L.GeoJSON[]} selLayers
 * @return {*}  {TopoReshapeFeatureResult}
 */
export declare function reshapeSelectedLayersByLine(sketchLine: GeoJSON.Feature<any>, selLayers: L.GeoJSON[], options?: ReshapeOptions): TopoReshapeFeatureResult;
