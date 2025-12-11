import * as L from 'leaflet';
import { PolygonEditorState } from '../types';
export default class LeafletRectangle {
    private map;
    private rectangleLayer;
    private drawLayerStyle;
    private tempCoords;
    private currentState;
    private stateListeners;
    constructor(map: L.Map, options?: L.PolylineOptions);
    private initLayers;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletRectangle
     */
    private initMapEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletRectangle
     */
    private mapClickEvent;
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletRectangle
     */
    private reset;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletRectangle
     */
    private mapMouseMoveEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletRectangle
     */
    private renderLayer;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletRectangle
     */
    geojson(): import("geojson").Feature<import("geojson").Polygon | import("geojson").MultiPolygon, any>;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletRectangle
     */
    destroy(): void;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletRectangle
     */
    private offMapEvent;
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletRectangle
     */
    onStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 添加移除单个监听器的方法
     *
     */
    offStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 清空所有状态监听器
     *
     */
    clearAllStateListeners(): void;
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletRectangle
     */
    private updateAndNotifyStateChange;
}
