import * as L from 'leaflet';
import { type LeafletToolsOptions, type SnapOptions } from '../types';
import { BasePolygonEditor } from './BasePolygonEditor';
export default class LeafletPolygonEditor extends BasePolygonEditor {
    private polygonLayer;
    private drawLayerStyle;
    private errorDrawLayerStyle;
    private tempCoords;
    private lastMoveCoord;
    /** 创建一个多边形编辑类
     *
     * @param {L.Map} map 地图对象
     * @param {LeafletToolsOptions} [options={}] 要构建的多边形的样式属性以及额外自定义的信息
     * @param {GeoJSON.Geometry} [defaultGeometry] 默认的空间信息
     * @memberof LeafletEditPolygon
     */
    constructor(map: L.Map, options?: LeafletToolsOptions, defaultGeometry?: GeoJSON.Geometry);
    private initLayers;
    /** 实例化面图层事件
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    private initPolygonEvent;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditPolygon
     */
    private initMapEvent;
    undoDraw(): boolean;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof markerPoint
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditPolygon
     */
    private mapDblClickEvent;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditPolygon
     */
    private mapMouseMoveEvent;
    /**  地图鼠标抬起事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditPolygon
     */
    private mapMouseUpEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditPolygon
     */
    private renderLayer;
    /** 完成绘制（结束绘制）
     *
     *
     * @private
     * @param {number[][][][]} finalCoords
     * @memberof LeafletPolygonEditor
     */
    private finishedDraw;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletEditPolygon
     */
    geojson(precision?: number | false | undefined): import("geojson").Feature<import("geojson").Polygon | import("geojson").MultiPolygon, any>;
    /** 返回绘制的图层
     *
     * 应用场景1： 地图上存在多个图层实例，每个图层的options属性中有其唯一id标识。现在若要删除其中一个图层，就需要先找到这个图层实例的options中存储的id标识，然后调用后台的删除接口。
     *
     * 应用场景2： 更改图层样式。
     *
     * （简言之： 场景太多，索性直接返回图层对象即可）
     * @return {*}
     * @memberof LeafletEditPolygon
     */
    getLayer(): L.Polygon<any> | null;
    /** 控制图层显示
     *
     *
     * @memberof LeafletEditPolygon
     */
    private show;
    /** 控制图层隐藏
     *
    *
    * @memberof LeafletEditPolygon
    */
    private hide;
    /** 设置图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    setVisible(visible: boolean): void;
    /** 获取图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    getLayerVisible(): boolean;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletEditPolygon
     */
    destroy(): void;
    /** 销毁绘制的图层
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    private destroyLayer;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditPolygon
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
     * 检查是否可以进入编辑模式
     * @private
     */
    private canEnterEditMode;
    /**
     * 进入编辑模式
     * @public
     */
    startEdit(): void;
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditPolygon
     */
    private enterEditMode;
    /** 退出编辑模式
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    exitEditMode(): void;
    /** 创建一个中点标记
     *
     *
     * @private
     * @param {L.Marker} p1 起点 marker
     * @param {L.Marker} p2 终点 marker
     * @param {number} polygonIndex 多边形索引
     * @param {number} ringIndex 环索引
     * @param {number} insertIndex 插入点的位置
     * @param {number} positionRadio 位置比率
     * @return {*}  {L.Marker}
     * @memberof LeafletPolygonEditor
     */
    protected createInsertMidpointMarker(p1: L.Marker, p2: L.Marker, polygonIndex: number, ringIndex: number, insertIndex: number, positionRadio: number): L.Marker;
    /** 创建一个可拖动的边控制点，用于拖动整条边
     * @param p1 起点 marker
     * @param p2 终点 marker
     * @param polygonIndex 多边形索引
     * @param ringIndex 环索引
     * @param {number} positionRadio 位置比率
     * @returns L.Marker
     */
    protected createEdgeDragMarker(p1: L.Marker, p2: L.Marker, polygonIndex: number, ringIndex: number, positionRadio: number): L.Marker;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层(未使用)
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarkerAndRender(latlngs: number[][][][]): void;
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    private reBuildMarker;
    private renderLayerFromMarkers;
    private pushHistoryFromMarkers;
    /**
     * 快捷方法：动态切换吸附功能
     */
    toggleSnap(options: SnapOptions): void;
    /**  判断点击事件是否自己身上
     *
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof LeafletEditRectangle
     */
    private isClickOnMyLayer;
    private canConsume;
    /** 是否开启了吸附操作
     *
     *
     * @private
     * @return {*}  {boolean}
     * @memberof LeafletPolygonEditor
     */
    private IsEnableSnap;
    /** 转换【多边形】的GeoJSON数据为Leaflet可接受的格式
     *
     *
     * @private
     * @param {GeoJSON.Geometry} geometry
     * @return {*}  {(L.LatLngExpression[][] | L.LatLngExpression[][][])}
     * @memberof LeafletPolygonEditor
     */
    private convertGeoJSONToLatLngs;
}
