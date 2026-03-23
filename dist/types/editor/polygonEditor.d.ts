import { type LeafletEditorOptions, type MidpointPair } from "../types";
import * as L from "leaflet";
import { BaseEditor } from "../base/BaseEditor";
export default class PolygonEditor extends BaseEditor<L.Polygon> {
    protected isDraggingPolygon: boolean;
    protected dragStartLatLng: L.LatLng | null;
    private tempCoords;
    private lastMoveCoord;
    protected vertexMarkers: L.Marker[][][];
    protected midpointMarkers: MidpointPair[][][];
    protected historyStack: number[][][][][];
    protected redoStack: number[][][][][];
    constructor(map: L.Map, options?: LeafletEditorOptions);
    protected initLayer(geometry?: GeoJSON.Geometry | L.LatLng): void;
    protected bindMapEvents(map: L.Map): void;
    protected offMapEvents(map: L.Map): void;
    protected setLayerVisibility(visible: boolean): void;
    protected renderLayer(coords: number[][][][], valid?: boolean): void;
    protected enterEditMode(): void;
    protected exitEditMode(): void;
    /** 获取当前 marker 坐标
     *
     *
     * @protected
     * @return {*}
     * @memberof PolygonEditor
     */
    protected getCurrentMarkerCoords(): number[][][][];
    /** 插入中间点坐标
     *
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditPolygon
     */
    protected insertMidpointMarkers(skipMarker?: L.Marker): void;
    /** 移除所有中点标记（若存在正在拖动的，则跳过）
     *
     *
     * @memberof BasePolygonEditor
     */
    protected removeAllMidPointMarkers(skipMarker?: L.Marker): void;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层(未使用)
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarkerAndRender(latlngs: number[][][][]): void;
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarker(coords: number[][][][]): void;
    /** 实时更新中线点的位置（传参意思：用户正在拖动的避免销毁和重新构建）
    *
    *
    * @private
    * @memberof LeafletEditPolygon
    */
    protected updateMidpoints(skipMarker?: L.Marker): void;
    /** 实例化面图层事件
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    private bindPolygonEvent;
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
    /** 校验面图层的有效性
     *
     *
     * @private
     * @param {L.LatLng[]} coords
     * @return {*}  {boolean}
     */
    private isValidPolygon;
    /** 完成绘制（结束绘制）
     *
     *
     * @private
     * @param {number[][][][]} finalCoords
     * @memberof LeafletPolygonEditor
     */
    private finishedDraw;
    /** 进入编辑模式
     *
     * @private
     */
    private startEdit;
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
    /** 获取图层的样式信息
     *
     *
     * @private
     * @param {boolean} [valid=true] 获取无效的样式还是有效的样式
     * @memberof PolygonEditor
     */
    private getLayerStyle;
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
    private createInsertMidpointMarker;
    /** 创建一个可拖动的边控制点，用于拖动整条边
     *
     * @private
     * @param p1 起点 marker
     * @param p2 终点 marker
     * @param polygonIndex 多边形索引
     * @param ringIndex 环索引
     * @param {number} positionRadio 位置比率
     * @returns L.Marker
     */
    private createEdgeDragMarker;
    private renderLayerFromMarkers;
    private pushHistoryFromMarkers;
    /**  绘制时,用于撤销最后一个绘制点(一般绑定到快捷键ctrl + Z上)
     *
     *
     * @return {*}  {boolean}
     * @memberof PolygonEditor
     */
    undoDraw(): boolean;
}
