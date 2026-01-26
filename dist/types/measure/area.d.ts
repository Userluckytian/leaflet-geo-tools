import * as L from 'leaflet';
import { PolygonEditorState, type ValidationOptions } from '../types';
export type areaOptions = {
    precision?: number;
    lang?: 'en' | 'zh';
    polygonStyle?: L.PolylineOptions;
    validErrorPolygonStyle?: L.PolylineOptions;
    validation?: ValidationOptions;
    markerStyle?: areaMarker;
};
export type areaMarker = {
    containerClassName: string;
    dotClassName: string;
    labelClassName: string;
};
export type FormattedArea = {
    val: number;
    unit: string;
};
export default class LeafletArea {
    private map;
    private polygonLayer;
    private markerLayer;
    private tempCoords;
    private measureOptions;
    private static markerStyle;
    private currentState;
    private stateListeners;
    private validationOptions;
    constructor(map: L.Map, measureOptions?: areaOptions);
    private initLayers;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletArea
     */
    private initMapEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletArea
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletArea
     */
    private mapDblClickEvent;
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletArea
     */
    private reset;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletArea
     */
    private mapMouseMoveEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletArea
     */
    private renderLayer;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletArea
     */
    geojson(): import("geojson").Feature<import("geojson").Polygon | import("geojson").MultiPolygon, any>;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletArea
     */
    destroy(): void;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletArea
     */
    private offMapEvent;
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {FormattedArea} area
     * @return {*}  {L.DivIcon}
     * @memberof LeafletArea
     */
    private measureMarkerIcon;
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    private deduplicateCoordinates;
    /**
     * 面积单位转换函数
     * @param {number} squareMeters - 输入的平方米数值
     * @returns {FormattedArea} 格式化后的面积对象
     */
    private formatArea;
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletArea
     */
    onStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 添加移除单个监听器的方法
     *
     */
    offStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 清空所有状态监听器
     *
     */
    private clearAllStateListeners;
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletArea
     */
    private updateAndNotifyStateChange;
    /** 更新几何校验的内容项
     *
     *
     * @param {ValidationOptions} rules
     * @memberof LeafletPolyline
     */
    setValidationRules(rules: ValidationOptions): void;
    /** 校验线图层的有效性
     *
     *
     * @private
     * @param {L.LatLng[]} coords
     * @return {*}  {boolean}
     * @memberof LeafletRectangle
     */
    private isValidPolygon;
    /** 自相交检测（使用 turf.kinks）
     *
     *
     * @private
     * @param {number[][]} coords
     * @return {*}  {boolean} true=有自相交，false=无自相交
     * @memberof LeafletPolyline
     */
    private hasSelfIntersection;
}
