import { BaseEditor } from "./BaseEditor";
export declare abstract class BaseRectangleEditor extends BaseEditor {
    protected vertexMarkers: L.Marker[];
    protected midpointMarkers: L.CircleMarker[];
    protected historyStack: number[][][];
    protected redoStack: number[][][];
    constructor(map: L.Map);
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
