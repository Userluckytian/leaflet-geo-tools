import * as L from 'leaflet';
import { type LeafletEditorOptions } from '../types';
import { BaseEditor } from '../base/BaseEditor';
export default class MarkerPointEditor extends BaseEditor<L.Marker> {
    protected vertexMarkers: any[];
    protected midpointMarkers: any[];
    protected historyStack: any[];
    protected redoStack: any[];
    protected enterEditMode(): void;
    protected reBuildMarker(coords: any[]): void;
    protected renderLayer(coords: any[], valid: boolean): void;
    protected getCurrentMarkerCoords(): void;
    protected updateMidpoints(skipMarker?: L.Marker): void;
    protected reBuildMarkerAndRender(coordinatesArray: any): void;
    exitEditMode(): void;
    constructor(map: L.Map, options?: LeafletEditorOptions);
    protected initLayer(geometry?: GeoJSON.Geometry): void;
    protected bindMapEvents(map: L.Map): void;
    protected offMapEvents(map: L.Map): void;
    protected setLayerVisibility(visible: boolean): void;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof markerPoint
     */
    private mapClickEvent;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof markerPoint
     */
    private mapMouseMoveEvent;
    /** 状态重置
     *
     *
     * @private
     * @memberof MarkerPoint
     */
    private resetStatus;
    /** 获取图层的样式信息
     *
     *
     * @private
     * @param {boolean} [valid=true] 获取无效的样式还是有效的样式
     * @memberof PolygonEditor
     */
    private getLayerStyle;
}
