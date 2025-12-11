import { type Units } from '@turf/turf';
import * as L from 'leaflet';
import { PolygonEditorState } from '../types';
type distanceOptions = {
    units: Units;
    precision?: number;
    lang: 'en' | 'zh';
};
export default class LeafletDistance {
    private map;
    private lineLayer;
    private drawLayerStyle;
    private tempCoords;
    private markerArr;
    private measureOptions;
    private totalDistance;
    private currentState;
    private stateListeners;
    /**
     * 创建一个测量距离的类
     * @param {L.Map} map 地图对象
     * @param {distanceOptions} [measureOptions={ units: 'meters' }] turf库的测量距离的options选项
     * @param {L.PolylineOptions} [options={}] 测量距离时的polyline样式，允许用户自定义
     * @memberof LeafletDistance
     */
    constructor(map: L.Map, measureOptions?: distanceOptions, options?: L.PolylineOptions);
    private initLayers;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletDistance
     */
    private initMapEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletDistance
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletDistance
     */
    private mapDblClickEvent;
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletDistance
     */
    private reset;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletDistance
     */
    private mapMouseMoveEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletDistance
     */
    private renderLayer;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletDistance
     */
    geojson(): import("geojson").Feature<import("geojson").LineString | import("geojson").MultiLineString, any>;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletDistance
     */
    destroy(): void;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletDistance
     */
    private offMapEvent;
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    private deduplicateCoordinates;
    /**
     * 计算距离并创建popup
     *
     * @private
     * @param {number[][]} coordinates
     * @memberof LeafletDistance
     */
    private calcDistanceAndCreatePopup;
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {(number | string)} distance
     * @return {*}  {L.DivIcon}
     * @memberof LeafletDistance
     */
    private measureMarkerIcon;
    /**
     * 格式化距离单位
     * @param value 原始距离值
     * @param unit 原始单位
     * @param options 格式化选项
     * @returns 格式化后的距离对象
     */
    private formatDistance;
    /** 统一处理单位同义词 */
    private normalizeUnit;
    /** 获取单位名称（支持中英文） */
    private getUnitName;
    /** 处理国际单位制换算 */
    private formatMetricSystem;
    /** 处理英尺换算 */
    private formatFeet;
    /** 处理码换算 */
    private formatYards;
    /** 处理英寸换算 */
    private formatInches;
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletDistance
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
     * @memberof LeafletDistance
     */
    private updateAndNotifyStateChange;
}
export {};
