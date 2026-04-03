export declare enum EditorState {
    Idle = "idle",// 空闲状态：既不是绘制中，也不是编辑中
    Drawing = "drawing",// 正在绘制
    Editing = "editing"
}
export interface EditorListenerConfigs {
    immediateNotify?: boolean;
}
export interface BaseEditOptions {
    enabled: boolean;
    vertexsMarkerStyle?: L.MarkerOptions;
}
export interface EditOptionsExpends extends BaseEditOptions {
    dragLineMarkerOptions?: DragMarkerOptions;
    dragMidMarkerOptions?: DragMarkerOptions;
    circle_LinkRadiusAndCenterDashLineOptions?: CircleDashLineOptions;
    [key: string]: unknown;
}
export interface LeafletPolylineOptions extends L.PolylineOptions {
    origin?: any;
    [key: string]: unknown;
}
export interface LeafletMarkerOptions extends L.MarkerOptions {
    origin?: any;
    [key: string]: unknown;
}
export interface LeafletEditorOptions {
    coordPrecision?: number;
    defaultGeometry?: GeoJSON.Geometry;
    defaultStyle?: LeafletPolylineOptions | LeafletMarkerOptions;
    snap?: SnapOptions;
    edit?: EditOptionsExpends;
    validation?: ValidationOptions;
}
export type SnapMode = 'vertex' | 'edge';
export type SnapOptions = {
    enabled: boolean;
    modes: SnapMode[];
    tolerance?: number;
    highlight?: SnapHighlightLayerOptions;
};
export interface SnapHighlightLayerOptions {
    enabled?: boolean;
    pointStyle?: L.CircleMarkerOptions;
    edgeStyle?: L.PolylineOptions;
}
export type ValidationOptions = {
    allowSelfIntersect?: boolean;
    validErrorPolygonStyle?: L.PolylineOptions;
    validErrorLineStyle?: L.PolylineOptions;
    validErrorPointStyle?: L.MarkerOptions;
};
export type DragMarkerOptions = {
    enabled: boolean;
    dragMarkerStyle: L.MarkerOptions;
    positionRatio: number;
};
export type CircleDashLineOptions = {
    enabled: boolean;
    dashLineStyle: L.PolylineOptions;
};
export interface SnapResult {
    snappedLatLng: L.LatLng;
    snapped: boolean;
    type?: 'vertex' | 'edge';
    target?: L.LatLng | {
        start: L.LatLng;
        end: L.LatLng;
    } | undefined | null;
}
export interface GeometryIndex {
    type: 'polygon' | 'polyline';
    vertices: L.LatLng[];
    edges: {
        start: L.LatLng;
        end: L.LatLng;
    }[];
    bounds: L.LatLngBounds;
    geometry: GeoJSON.Geometry;
}
export type drawInstance = any;
export type measureInstance = any;
export type EditorInstance = drawInstance | measureInstance;
export type MidpointPair = {
    insert: L.Marker | null;
    edge: L.Marker | null;
};
export interface TopoOptions {
    precision?: number;
    circleStep?: number;
}
export interface TopoMergeResult {
    mergedLayers: L.GeoJSON[];
    mergedGeom: GeoJSON.Feature | null;
}
export interface TopoClipResult {
    doClipLayers: L.Layer[];
    clipedGeoms: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[];
}
export interface TopoReshapeFeatureResult {
    doReshapeLayers: L.Layer[];
    reshapedGeoms: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString>[];
}
export interface ReshapeOptions {
    /**
     * auto: 自动保留 reshape 后周长最大的结果
     * manual: 返回所有候选结果，由调用方决定保留哪一个
     */
    chooseStrategy?: 'auto' | 'manual';
    /**
     * 允许在未选择任何图层的情况下进行整形操作
     * 默认为 false
     */
    AllowReshapingWithoutSelection?: Boolean;
}
