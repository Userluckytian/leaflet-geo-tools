/** 保存裁剪后的图层
 *
 *
 * @param {*} lineFeature 绘制的线Feature 格式：{type: "Feature", properties: {…}, geometry: { coordinates: [ [111, 80], [120, 80], [120, 90], [111, 90] ], type: "LineString" }}
 * @param {*} selLayers  用户选择的图层
 * @return {*} 返回对象{clipsPolygons,  waitingDelLayer}，其中clipsPolygons为裁剪后的多边形，waitingDelLayer为需要删除的旧图层
 */
export declare function clipSelectedLayersByLine(lineFeature: any, selLayers: any): {
    clipsPolygons: any[];
    waitingDelLayer: any[];
};
/** 合并多边形
 *
 * @param selLayers
 */
export declare function mergePolygon(selLayers: any): any;
