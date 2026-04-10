import * as L from 'leaflet';
import { BaseEditor } from "../base/BaseEditor";
import { type LeafletEditorOptions, type MidpointPair } from "../types";
export default class PolylineEditor extends BaseEditor<L.Polyline> {
    protected historyStack: number[][][][];
    private tempCoords;
    private lastMoveCoord;
    protected vertexMarkers: L.Marker[][];
    protected redoStack: any[];
    protected midpointMarkers: MidpointPair[][];
    constructor(map: L.Map, options?: LeafletEditorOptions);
    protected initLayer(geometry?: GeoJSON.Geometry): void;
    protected bindMapEvents(map: L.Map): void;
    protected offMapEvents(map: L.Map): void;
    protected setLayerVisibility(visible: boolean): void;
    protected renderLayer(coords: number[][][], valid?: boolean): void;
    /** 获取图层的样式信息
     *
     *
     * @private
     * @param {boolean} [valid=true] 获取无效的样式还是有效的样式
     * @memberof PolygonEditor
     */
    private getLayerStyle;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletPolyLine
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletPolyLine
     */
    private mapDblClickEvent;
    /** 完成绘制（结束绘制）
     *
     *
     * @private
     * @param {number[][][]} finalCoords 多线结构，如果你是单条线，就再包裹一层
     * @memberof LeafletPolyLine
     */
    private finishedDraw;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletPolyLine
     */
    private mapMouseMoveEvent;
    /** 显示图层
     *
     *
     * @private
     * @memberof PolylineEditor
     */
    private show;
    /** 隐藏图层
     *
     *
     * @private
     * @memberof PolylineEditor
     */
    private hide;
    protected exitEditMode(): void;
    /**  绘制时,用于撤销最后一个绘制点(一般绑定到快捷键ctrl + Z上)
     *
     *
     * @return {*}  {boolean}
     * @memberof PolylineEditor
     */
    undoDraw(): boolean;
    protected getCurrentMarkerCoords(): number[][][];
    /** 进入编辑模式
     *
     * @private
     * @memberof PolylineEditor
     */
    startEdit(): void;
    protected enterEditMode(): void;
    protected reBuildMarker(multi_coords: number[][][]): void;
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
    /** 创建一个中点标记
     *
     *
     * @private
     * @param {L.Marker} p1 起点 marker
     * @param {L.Marker} p2 终点 marker
     * @param {number} lineIndex 单条线的索引
     * @param {number} insertIndex 插入点的位置
     * @param {number} positionRadio 位置比率
     * @return {*}  {L.Marker}
     * @memberof LeafletPolygonEditor
     */
    private createInsertMidpointMarker;
    /** 实时更新中线点的位置（传参意思：用户正在拖动的避免销毁和重新构建）
     *
     *
     * @private
     * @memberof PolylineEditor
     */
    protected updateMidpoints(skipMarker?: L.Marker): void;
    /** 创建一个可拖动的边控制点，用于拖动整条边
     *
     * @private
     * @param p1 起点 marker
     * @param p2 终点 marker
     * @param lineIndex 线索引
     * @param {number} positionRadio 位置比率
     * @returns L.Marker
     */
    private createEdgeDragMarker;
    private renderLayerFromMarkers;
    private pushHistoryFromMarkers;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层(在基类中使用的)
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarkerAndRender(latlngs: number[][][]): void;
    /** 校验线图层的有效性
     *
     *
     * @private
     * @param {number[][][]} multiLine_coords 多线坐标
     * @return {*}  {boolean}
     * @memberof PolylineEditor
     */
    private isValidPolyline;
    /** 绘制状态下的校验，允许只有1个点的情况
     *
     *
     * @private
     * @param {number[][]} coords 单条线的坐标
     * @return {*}  {boolean}
     * @memberof PolylineEditor
     */
    private isValidForDrawing;
}
