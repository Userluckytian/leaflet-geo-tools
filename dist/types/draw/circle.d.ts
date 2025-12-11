import * as L from 'leaflet';
import { PolygonEditorState } from '../types';
export default class LeafletCircle {
    private map;
    private circleLayer;
    private drawLayerStyle;
    private center;
    private radius;
    private tempCoords;
    private currentState;
    private stateListeners;
    constructor(map: L.Map, options?: L.CircleOptions);
    private initLayers;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletCircle
     */
    private initMapEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletCircle
     */
    private mapClickEvent;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletCircle
     */
    private mapMouseMoveEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletCircle
     */
    private renderLayer;
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletCircle
     */
    private reset;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletCircle
     */
    geojson(): import("geojson").Feature<import("geojson").Polygon, import("geojson").GeoJsonProperties>;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletCircle
     */
    destroy(): void;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletCircle
     */
    private offMapEvent;
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletCircle
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
     * @memberof LeafletCircle
     */
    private updateAndNotifyStateChange;
}
