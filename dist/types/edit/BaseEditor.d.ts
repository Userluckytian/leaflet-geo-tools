import * as L from "leaflet";
import { PolygonEditorState, type BaseEditOptions, type EditorListenerConfigs, type GeometryIndex, type SnapHighlightLayerOptions, type SnapOptions, type SnapResult, type ValidationOptions } from "../types";
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
    protected snapHighlightOptions: SnapHighlightLayerOptions;
    protected baseEditOptions: BaseEditOptions;
    protected validationOptions: ValidationOptions;
    constructor(map: L.Map, options: {
        snap?: SnapOptions;
        validation?: ValidationOptions;
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
     * @protected
     * @param {PolygonEditorState} status
     * @param {boolean} [immediateNotify] (立即发出消息通知)
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    protected updateAndNotifyStateChange(status: PolygonEditorState, immediateNotify?: boolean): void;
    /** 设置编辑器当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof BaseEditor
     */
    setCurrentState(status: PolygonEditorState): void;
    /** 返回编辑器当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof BaseEditor
     */
    getCurrentState(): PolygonEditorState;
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: PolygonEditorState) => void} listener // 监听事件
     * @param {EditorListenerConfigs} [configs={ immediateNotify: false }] // 配置参数
     * @memberof BaseEditor
     */
    onStateChange(listener: (state: PolygonEditorState) => void, configs?: EditorListenerConfigs): void;
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
    /**
      * arcgis，
      * 1：拖动面时，不进行吸附行为，
      * 2：拖动点接近另一个点时，点被吸附到一起，
      * 3：拖动一个点接近一条线时，点会被吸附到线上
      * 4：拖动一条线接近另一条线时，会根据鼠标按下拖动的那个坐标去吸附目标线，而拖动的线会跟着跑，同步的图形也在变化
     */
    /** 初始化吸附控制器
     *
     *
     * @protected
     * @param {L.Map} map
     * @param {SnapOptions} [snap]
     * @memberof BaseEditor
     */
    private initSnap;
    /**
     * 动态启用/禁用吸附功能
     * @param options 吸附选项
     */
    updateSnapOptions(options: SnapOptions): void;
    /**
     * 获取当前吸附配置
     */
    getSnapOptions(): SnapOptions | null;
    /**
     * 设置吸附源（其他几何图形）
     * @param layers 要排除的图层列表
     */
    protected setSnapSources(excludeLayers: L.Layer[]): void;
    /** 【吸附器】确定最终的坐标(顶点会去吸附边和其他顶点)
     *
     *
     * @protected
     * @param {L.LatLng} latlng
     * @return {*}  {L.LatLng}
     * @memberof BaseEditor
     */
    protected applySnapWithTarget(latlng: L.LatLng): SnapResult;
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
    /** 初始化编辑点marker的配置信息
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected initBaseEditOptions(options?: BaseEditOptions): BaseEditOptions;
    /** 更新编辑配置
      *
      *
      * @abstract
      * @memberof BaseEditor
      */
    abstract updateEditOptions(options: BaseEditOptions): void;
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
    /** 更新几何校验的内容项
     *
     *
     * @param {ValidationOptions} rules
     * @memberof LeafletPolyline
     */
    setValidationOptions(rules: ValidationOptions): void;
    /** 获取几何校验的内容项
     *
     *
     * @param {ValidationOptions} rules
     * @memberof LeafletPolyline
     */
    getValidationOptions(): ValidationOptions;
    /** 校验面图层的有效性
     *
     *
     * @private
     * @param {L.LatLng[]} coords
     * @return {*}  {boolean}
     * @memberof LeafletRectangle
     */
    isValidPolygon(coords: number[][]): boolean;
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
