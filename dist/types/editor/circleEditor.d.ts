import { BaseEditor } from "../base/BaseEditor";
import { type LeafletEditorOptions, type MidpointPair } from "../types";
import * as L from 'leaflet';
export default class CircleEditor extends BaseEditor<L.Circle> {
    protected midpointMarkers: MidpointPair[];
    protected updateMidpoints(skipMarker?: L.Marker): void;
    protected reBuildMarkerAndRender(coordinatesArray: any): void;
    protected vertexMarkers: L.Marker[];
    protected historyStack: number[][][];
    protected redoStack: any[];
    protected isDragging: boolean;
    protected dragStartLatLng: L.LatLng | null;
    private dashLineLayer;
    private tempCoords;
    private km_value;
    constructor(map: L.Map, options?: LeafletEditorOptions);
    /** 获取图层的样式信息
     *
     *
     * @private
     * @param {boolean} [valid=true] 获取无效的样式还是有效的样式
     * @memberof PolygonEditor
     */
    private getLayerStyle;
    protected initLayer(geometry?: GeoJSON.Geometry): void;
    protected bindMapEvents(map: L.Map): void;
    protected offMapEvents(map: L.Map): void;
    /** 返回图层的空间信息
     *
     *
     * @memberof LeafletEditPolygon
     */
    getGeoJSON(FittingPointNum?: number): import("geojson").Feature<import("geojson").Polygon, import("geojson").GeoJsonProperties>;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletCircle
     */
    private mapClickEvent;
    /** 完成绘制（结束绘制）
     *
     *
     * @private
     * @param {number[][][]} finalCoords 多线结构，如果你是单条线，就再包裹一层
     * @memberof LeafletPolyLine
     */
    private finishedDraw;
    /** 通过坐标对，获取中心点，半径，以及圆形是否是有效的（因为有的时候，我们可以约束圆的面积不能太小。这样这个校验就是有用的。）
     *
     *
     * @private
     * @param {number[][]} coords
     * @return {*}
     * @memberof CircleEditor
     */
    private getCenterAndRadiusByCoordArr;
    /** 渲染图层
     *
     *
     * @protected
     * @param { [][]} coords
     * @param {boolean} valid 几何形状的有效性，无效几何的颜色变色
     * @memberof LeafletCircle
     */
    protected renderLayer(coords: number[][], valid?: boolean): void;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletCircle
     */
    private mapMouseMoveEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletPolyLine
     */
    private mapDblClickEvent;
    /** 双击事件是否可以继续触发
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof BaseEditor
     */
    protected canConsume(e: L.LeafletMouseEvent): boolean;
    /** 使用 turf.booleanValid 校验圆形有效性
     *
     *
     * @private
     * @param {L.LatLng} center
     * @param {number} radius
     * @return {*}  {boolean}
     * @memberof LeafletCircle
     */
    private isValidCircle;
    /** 进入编辑模式
     *
     * @private
     * @memberof PolylineEditor
     */
    startEdit(): void;
    protected enterEditMode(): void;
    protected getCurrentMarkerCoords(): number[][];
    protected reBuildMarker(coords: number[][]): void;
    protected exitEditMode(): void;
    protected setLayerVisibility(visible: boolean): void;
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
    private renderLayerFromMarkers;
    private pushHistoryFromMarkers;
    private renderDashLineLayer;
    private removeDashLineLayer;
}
