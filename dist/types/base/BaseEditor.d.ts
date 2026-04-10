import { EditorState, type EditOptionsExpends, type EditorListenerConfigs, type GeometryIndex, type LeafletEditorOptions, type SnapHighlightLayerOptions, type SnapOptions, type SnapResult, type ValidationOptions } from "../types";
import * as L from "leaflet";
import { SnapController } from "../utils/SnapController";
export declare abstract class BaseEditor<T extends L.Layer> {
    protected map: L.Map;
    protected options: LeafletEditorOptions;
    protected layer: T | null;
    protected layerVisble: boolean;
    /** 编辑器的图层需要提供的内容
     *
     * 1.1：初始化构建`abstruct createEditorLayer()`方法，交由子类去实现，毕竟不同的编辑器，图层类型不一样，构建方式也不一样。
     * 1.2：图层初始化后，还要绑定一系列的地图事件（点击、双击、鼠标移动） abstruct bindMapEvents()方法，交由子类去实现，毕竟不同的编辑器，事件绑定的方式和事件类型也不一样。
     * 1.3：编辑器是否提供显隐事件？如果不提供的话，比如双击编辑事件，如果这个图层是隐藏的，就不能激活编辑功能, 如何做？先提供吧。 abstruct setLayerVisibility()方法，交由子类去实现，毕竟不同的编辑器，图层显隐的方式也不一样。
     * 1.4：toGeojson默认支持的参数，要保持住，之前的丢了。
     * 1.5：销毁鼠标监听事件 abstruct offMapEvents()方法，交由子类去实现，毕竟不同的编辑器，事件解绑的方式和事件类型也不一样。
     */
    /**创建图层并添加到地图上（三件事:1: 创建图层并添加到地图上 2:要不要给图层绑定自身的监听事件? 3: 如果编辑器开启吸附,则需要设置吸附源）
     *
     *
     * @protected
     * @abstract
     * @template U
     * @param {U} layerOptions 图层的样式配置项
     * @param {GeoJSON.Geometry} [geometry] 图层的默认几何信息
     * @memberof BaseEditor
     */
    protected abstract initLayer(geometry?: GeoJSON.Geometry | L.LatLng): void;
    /** 绑定地图事件
     *
     *
     * @protected
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract bindMapEvents(map: L.Map): void;
    /** 取消绑定地图事件
     *
     *
     * @protected
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract offMapEvents(map: L.Map): void;
    /** 设置图层的显隐状态
     *
     *
     * @protected
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract setLayerVisibility(visible: boolean): void;
    /** 获取图层的显隐状态
     *
     *
     * @protected
     * @return {*}  {boolean}
     * @memberof BaseEditor
     */
    protected getLayerVisibility(): boolean;
    /** 渲染图层
     *
     *
     * @protected
     * @abstract
     * @param {any[]} coords 坐标数组
     * @param {boolean} valid 是否为有效几何坐标
     * @memberof BaseEditor
     */
    protected abstract renderLayer(coords: any[], valid: boolean): void;
    /** 返回图层的空间信息
     *
     *
     * @memberof LeafletEditPolygon
     */
    getGeoJSON(precision?: number | false): any;
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
    getLayer(): T | null;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletPolyLine
     */
    layerDestroy(): void;
    /** 地图状态重置
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    reset(): void;
    protected snapController?: SnapController;
    private snapHighlightLayer;
    private highlightCircleMarker;
    private highlightEdgeLayer;
    protected snapHighlightOptions: SnapHighlightLayerOptions;
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
    /** 高亮吸附目标[点]
     *
     *
     * @protected
     * @param {{ start: L.LatLng; end: L.LatLng }} edge
     * @memberof BaseEditor
     */
    private highlightPoint;
    /** 高亮吸附目标[线段]
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
    /** 是否开启了吸附操作
     *
     *
     * @private
     * @return {*}  {boolean}
     * @memberof LeafletPolygonEditor
     */
    protected IsEnableSnap(): boolean;
    /**
     * 快捷方法：动态切换吸附功能
     */
    toggleSnap(options: SnapOptions): void;
    protected editOptions: EditOptionsExpends;
    protected abstract vertexMarkers: any[];
    protected abstract midpointMarkers: any[];
    protected abstract historyStack: any[];
    protected abstract redoStack: any[];
    /**
     * 获取是否启用编辑
     */
    getEditEnabled(): boolean;
    /** 启用/禁用编辑
     *
     * @param enabled 是否启用
     */
    protected enableEdit(enabled: boolean): void;
    /** 初始化编辑点marker的配置信息
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected initEditOptions(options?: EditOptionsExpends): EditOptionsExpends;
    /** 获取编辑配置项
      *
      *
      * @abstract
      * @memberof BaseEditor
      */
    protected getEditOptions(): EditOptionsExpends;
    /** 更新编辑配置
      *
      *
      * @abstract
      * @memberof BaseEditor
      */
    protected updateEditOptions(options: EditOptionsExpends): void;
    /**
     * 检查是否可以进入编辑模式
     * @private
     */
    protected canEnterEditMode(): boolean;
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract enterEditMode(): void;
    /** 退出编辑模式(注意职责分离,一般我们退出编辑状态,要发消息通知我们设置的监听事件: 比如: "在? 从编辑状态变成空闲状态了. 你爪子?" 但是我希望你不要在这个事件中写状态变更.保持职责分离.)
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract exitEditMode(): void;
    /** 获取最后的坐标数据并提交保存
     *
     *
     * @protected
     * @abstract
     * @memberof BaseEditor
     */
    protected abstract getCurrentMarkerCoords(): any;
    /** 根据坐标重建 marker 和图形
     *
     *
     * @protected
     * @abstract
     * @param {any[]} coords  latlngs坐标数组
     * @memberof BaseEditor
     */
    protected abstract reBuildMarker(coords: any[]): void;
    /** 实时更新中线点的位置（传参意思：用户正在拖动的避免销毁和重新构建）
     *
     *
     * @protected
     * @abstract
     * @param {L.Marker} [skipMarker]
     * @memberof BaseEditor
     */
    protected abstract updateMidpoints(skipMarker?: L.Marker): void;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     *
     * @protected
     * @abstract
     * @param {any} coordinatesArray 坐标数组
     * @memberof BaseEditor
     */
    protected abstract reBuildMarkerAndRender(coordinatesArray: any): void;
    /** 撤回
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected undoEdit(): void;
    /** 取消撤回
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected redoEdit(): void;
    /** 重置回[编辑前]的状态
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected resetToInitial(): void;
    /** 完成编辑
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    protected commitEdit(): void;
    private static currentActiveEditor;
    /** 激活当前编辑器实例
     *
     */
    protected activate(): void;
    /** 停用当前编辑器实例
     *
     */
    protected getCurrentState(): EditorState;
    /** 停用当前编辑器实例
     *
     */
    protected deactivate(): void;
    /** 检查当前实例是否激活
     *
     */
    protected isActive(): boolean;
    protected currentState: EditorState;
    private stateListeners;
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: EditorState) => void} listener // 监听事件
     * @param {EditorListenerConfigs} [configs={ immediateNotify: false }] // 配置参数
     * @memberof BaseEditor
     */
    onStateChange(listener: (state: EditorState) => void, configs?: EditorListenerConfigs): void;
    /** 添加移除单个监听器的方法
     *
     */
    offStateChange(listener: (state: EditorState) => void): void;
    /** [内部使用] 清空所有状态监听器
     *
     */
    private clearAllStateListeners;
    /** 状态改变时，触发存储的所有监听事件的回调
     *
     *
     * @protected
     * @param {PolygonEditorState} status
     * @param {boolean} [immediateNotify] (立即发出消息通知)
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    protected updateAndNotifyStateChange(status: EditorState, immediateNotify?: boolean): void;
    protected validationOptions: ValidationOptions;
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
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletEditPolygon
     */
    destroy(): void;
    /** 双击事件是否可以继续触发
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof BaseEditor
     */
    protected canConsume(e: L.LeafletMouseEvent): boolean;
    constructor(map: L.Map, options: LeafletEditorOptions);
}
