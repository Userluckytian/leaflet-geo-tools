import * as L from "leaflet";
import { PolygonEditorState, type GeometryIndex, type SnapOptions, type SnapResult } from "../types";
import { SnapController } from "../utils/SnapController";
export declare abstract class BaseEditor {
    private static currentActiveEditor;
    protected map: L.Map;
    protected currentState: PolygonEditorState;
    protected stateListeners: ((state: PolygonEditorState) => void)[];
    protected isDraggingPolygon: boolean;
    protected dragStartLatLng: L.LatLng | null;
    protected isVisible: boolean;
    protected snapController?: SnapController;
    private snapHighlightLayer;
    private highlightCircleMarker;
    private highlightEdgeLayer;
    constructor(map: L.Map, options: {
        snap?: SnapOptions;
    });
    /**
     * 激活当前编辑器实例
     */
    protected activate(): void;
    /**
     * 停用当前编辑器实例
     */
    protected deactivate(): void;
    /**
     * 检查当前实例是否激活
     */
    protected isActive(): boolean;
    /**
     * 静态方法：停用所有编辑器（压根不用，我都不想写！）
     */
    static deactivateAllEditors(): void;
    /**
     * 强制停用编辑状态（但不改变激活状态）
     */
    protected forceExitEditMode(): void;
    /** 状态改变时，触发存储的所有监听事件的回调
     *
     *
     * @private
     * @memberof BaseEditor
     */
    protected updateAndNotifyStateChange(status: PolygonEditorState): void;
    /** 设置当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof BaseEditor
     */
    setCurrentState(status: PolygonEditorState): void;
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    onStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 移除监听器的方法
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    offStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 清空所有状态监听器
     *
     */
    protected clearAllStateListeners(): void;
    /** 初始化吸附控制器
     *
     *
     * @protected
     * @param {L.Map} map
     * @param {SnapOptions} [snap]
     * @memberof BaseEditor
     */
    private initSnap;
    /** 【吸附器】确定最终的坐标(顶点会去吸附边和其他顶点)
     *
     *
     * @protected
     * @param {L.LatLng} latlng
     * @return {*}  {L.LatLng}
     * @memberof BaseEditor
     */
    protected applySnapWithTarget(latlng: L.LatLng, autoHighlight?: boolean): SnapResult;
    /** 【顶点吸附器】收集所有其他图层的顶点信息
     *
     *
     * @protected
     * @param {L.Map} map
     * @param {L.Layer} excludeLayer
     * @return {*}  {L.LatLng[]}
     * @memberof BaseEditor
     */
    protected collectAllOtherGeometryIndices(map: L.Map, excludeLayer: L.Layer): GeometryIndex[];
    /** 高亮吸附目标点
     *
     *
     * @protected
     * @param {{ start: L.LatLng; end: L.LatLng }} edge
     * @memberof BaseEditor
     */
    private highlightPoint;
    /** 高亮吸附目标线段
     *
     *
     * @protected
     * @param {{ start: L.LatLng; end: L.LatLng }} edge
     * @memberof BaseEditor
     */
    private highlightEdge;
    /** 移除上次吸附高亮图层
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected clearSnapHighlights(): void;
    protected cleanupSnapResources(): void;
    /** 退出编辑模式
     *
     *
     * @abstract
     * @memberof BaseEditor
     */
    abstract exitEditMode(): void;
    /** 提取多边形的坐标点（全部平铺到一个数组中）
     *
     *
     * @protected
     * @param {GeoJSON.GeoJSON} geo
     * @return {*}  {L.LatLng[]}
     * @memberof BaseEditor
     */
    protected extractVerticesFromGeoJSON(geo: GeoJSON.GeoJSON): L.LatLng[];
    /** 构建空间数据索引
     *
     *
     * @protected
     * @param {GeoJSON.Geometry} geometry
     * @return {*}  {GeometryIndex}
     * @memberof BaseEditor
     */
    protected buildGeometryIndex(geometry: GeoJSON.Geometry): GeometryIndex;
}
