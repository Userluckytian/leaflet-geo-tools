import { type EditOptions, type SnapOptions } from "../types";
import { BaseEditor } from "./BaseEditor";
export declare abstract class BaseRectangleEditor extends BaseEditor {
    protected vertexMarkers: L.Marker[];
    protected historyStack: number[][][];
    protected redoStack: number[][][];
    protected editOptions: EditOptions;
    constructor(map: L.Map, options: {
        snap?: SnapOptions;
        edit?: EditOptions;
    });
    /** 初始化编辑点marker的配置信息
     *
     *
     * @private
     * @param {DragMarkerOptions} [dragMidMarkerOptions] // 中点拖拽标记配置信息
     * @param {DragMarkerOptions} [dragLineMarkerOptions] // 边线拖拽标记配置信息
     * @memberof BasePolygonEditor
     */
    private initEditOptions;
    /** 撤回到上一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    undoEdit(): void;
    /** 前进到刚才测回的一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    redoEdit(): void;
    /** 全部撤回（建议写到二次确认的弹窗后触发）
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
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
    /**
     * 获取当前标记的坐标（辅助方法）
     * @private
     */
    private getCurrentMarkerCoords;
    /**
     * 更新编辑配置
     * @param options 编辑配置
     */
    updateEditOptions(options: EditOptions): void;
    /**
     * 获取是否启用编辑
     */
    getEditEnabled(): boolean;
    /**
     * 设置是否启用编辑
     * @param enabled 是否启用
     */
    setEditEnabled(enabled: boolean): void;
    /**
     * 深度合并编辑配置
     * @private
     */
    private mergeEditOptions;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     *
     * @protected
     * @abstract
     * @param {number[][]} latlngs
     * @memberof SimpleBaseEditor
     */
    protected abstract reBuildMarkerAndRender(latlngs: number[][]): void;
}
