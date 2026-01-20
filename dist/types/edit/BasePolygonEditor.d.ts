import * as L from "leaflet";
import { type EditOptions, type MidpointPair, type SnapOptions } from "../types";
import { BaseEditor } from "./BaseEditor";
export declare abstract class BasePolygonEditor extends BaseEditor {
    protected vertexMarkers: L.Marker[][][];
    protected midpointMarkers: MidpointPair[][][];
    protected historyStack: number[][][][][];
    protected redoStack: number[][][][][];
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
    /** 插入中间点坐标
     *
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditPolygon
     */
    protected insertMidpointMarkers(skipMarker?: L.Marker): void;
    /** 实时更新中线点的位置（传参意思：用户正在拖动的避免销毁和重新构建）
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    protected updateMidpoints(skipMarker?: L.Marker): void;
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
    protected abstract createInsertMidpointMarker(p1: L.Marker, p2: L.Marker, polygonIndex: number, ringIndex: number, insertIndex: number, positionRadio: number): L.Marker | null;
    protected abstract createEdgeDragMarker(p1: L.Marker, p2: L.Marker, polygonIndex: number, ringIndex: number, positionRadio: number): L.Marker | null;
    /**
     * 获取边上某个比例位置的点（例如 1/3、2/3）
     * @param p1 起点
     * @param p2 终点
     * @param ratio 比例（0~1），例如 1/3 = 0.333
     * @returns L.LatLng
     */
    protected getFractionalPointOnEdge(p1: L.LatLng, p2: L.LatLng, ratio: number): L.LatLng;
    /** 移除所有中点标记（若存在正在拖动的，则跳过）
     *
     *
     * @memberof BasePolygonEditor
     */
    protected removeAllMidPointMarkers(skipMarker?: L.Marker): void;
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
     * @memberof BaseEditor
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
     * @memberof BaseEditor
     */
    protected abstract reBuildMarkerAndRender(latlngs: number[][][][]): void;
}
