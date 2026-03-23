import { BaseEditor } from "../base/BaseEditor";
import { type LeafletEditorOptions } from "../types";
import * as L from 'leaflet';
export default class RectangleEditor extends BaseEditor<L.Rectangle> {
    protected midpointMarkers: any[];
    protected isDraggingPolygon: boolean;
    protected dragStartLatLng: L.LatLng | null;
    protected vertexMarkers: L.Marker[];
    protected historyStack: number[][][];
    protected redoStack: number[][][];
    private tempCoords;
    private lastMoveCoord;
    constructor(map: L.Map, options?: LeafletEditorOptions);
    protected initLayer(geometry?: GeoJSON.Geometry): void;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    protected renderLayer(coords: any[], valid?: boolean): void;
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarker(latlngs: number[][]): void;
    /** 绑定 marker 事件 */
    private bindMarkerEvents;
    protected updateMidpoints(skipMarker?: L.Marker): void;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarkerAndRender(latlngs: number[][]): void;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    protected bindMapEvents(map: L.Map): void;
    /** 关闭地图事件监听
     *
     *
     * @protected
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    protected offMapEvents(map: L.Map): void;
    protected setLayerVisibility(visible: boolean): void;
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditRectangle
     */
    protected enterEditMode(): void;
    /** 退出编辑模式
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    exitEditMode(): void;
    /** 获取图层的样式信息
     *
     *
     * @private
     * @param {boolean} [valid=true] 获取无效的样式还是有效的样式
     * @memberof PolygonEditor
     */
    private getLayerStyle;
    /** 实例化矩形图层事件
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    private initPolygonEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapDblClickEvent;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseMoveEvent;
    /**  地图鼠标抬起事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseUpEvent;
    /** 使用 turf.booleanValid 校验矩形有效性
     *
     *
     * @private
     * @param {L.LatLng[]} coords
     * @return {*}  {boolean}
     * @memberof LeafletRectangle
     */
    protected isValidRectangle(coords: L.LatLng[]): boolean;
    /** 完成绘制
     *
     *
     * @private
     * @param {L.LatLng[]} finalCoords
     * @memberof LeafletRectangleEditor
     */
    private finishedDraw;
    /** 获取当前 marker 坐标
     *
     *
     * @protected
     * @return {*}
     * @memberof PolygonEditor
     */
    protected getCurrentMarkerCoords(): number[][];
    /**
     * 进入编辑模式
     * @private
     */
    private startEdit;
    /** 绘制时撤销最后一个顶点
     *
     *
     * @return {*}  {boolean}
     * @memberof RectangleEditor
     */
    undoDraw(): boolean;
    /** 渲染图层-2
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    private renderLayerFromCoords;
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
    /** 更新矩形角点 */
    private updateRectangleCorners;
}
