import * as L from 'leaflet';
import { PolygonEditorState } from '../types';
export declare abstract class SimpleBaseEditor {
    private static currentActiveEditor;
    protected map: L.Map;
    protected currentState: PolygonEditorState;
    protected vertexMarkers: L.Marker[];
    protected midpointMarkers: L.CircleMarker[];
    protected historyStack: number[][][];
    protected redoStack: number[][][];
    protected stateListeners: ((state: PolygonEditorState) => void)[];
    protected isDraggingPolygon: boolean;
    protected dragStartLatLng: L.LatLng | null;
    constructor(map: L.Map);
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
     * @memberof SimpleBaseEditor
     */
    protected updateAndNotifyStateChange(status: PolygonEditorState): void;
    /** 设置当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof SimpleBaseEditor
     */
    setCurrentState(status: PolygonEditorState): void;
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof SimpleBaseEditor
     */
    onStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 移除监听器的方法
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof SimpleBaseEditor
     */
    offStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 清空所有状态监听器
     *
     */
    clearAllStateListeners(): void;
    /** 撤回到上一步
     *
     *
     * @return {*}  {void}
     * @memberof SimpleBaseEditor
     */
    undoEdit(): void;
    /** 前进到刚才测回的一步
     *
     *
     * @return {*}  {void}
     * @memberof SimpleBaseEditor
     */
    redoEdit(): void;
    /** 全部撤回（建议写到二次确认的弹窗后触发）
     *
     *
     * @return {*}  {void}
     * @memberof SimpleBaseEditor
     */
    resetToInitial(): void;
    /** 完成编辑行为
     *
     *
     * @memberof SimpleBaseEditor
     */
    commitEdit(): void;
    /** 地图状态重置
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    reset(): void;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     *
     * @protected
     * @abstract
     * @param {number[][]} latlngs
     * @memberof SimpleBaseEditor
     */
    protected abstract reBuildMarkerAndRender(latlngs: number[][]): void;
    /** 退出编辑模式
     *
     *
     * @abstract
     * @memberof SimpleBaseEditor
     */
    abstract exitEditMode(): void;
}
