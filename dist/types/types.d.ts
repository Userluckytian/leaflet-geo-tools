import type LeafletCircle from "./draw/circle";
import type MarkerPoint from "./draw/markerPoint";
import type LeafletPolygon from "./draw/polygon";
import type LeafletPolyline from "./draw/polyline";
import type LeafletRectangle from "./draw/rectangle";
import type LeafletEditPolygon from "./simpleEdit/polygon";
import type LeafletEditRectangle from "./simpleEdit/rectangle";
import type LeafletArea from "./measure/area";
import type LeafletDistance from "./measure/distance";
import type LeafletRectangleEditor from "./edit/rectangle";
import type LeafletPolygonEditor from "./edit/polygon";
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
export type EditOptions = {
    enabled: boolean;
    vertexsMarkerStyle?: L.MarkerOptions;
    dragLineMarkerOptions?: DragMarkerOptions;
    dragMidMarkerOptions?: DragMarkerOptions;
};
export type DragMarkerOptions = {
    enabled: boolean;
    dragMarkerStyle?: L.MarkerOptions;
    positionRatio?: number;
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
export declare enum PolygonEditorState {
    Idle = "idle",// 空闲状态：既不是绘制中，也不是编辑中
    Drawing = "drawing",// 正在绘制
    Editing = "editing"
}
export interface EditorListenerConfigs {
    immediateNotify?: boolean;
}
export type drawInstance = LeafletCircle | MarkerPoint | LeafletPolygon | LeafletPolyline | LeafletRectangle;
export type measureInstance = LeafletArea | LeafletDistance;
export type editorInstance = LeafletEditPolygon | LeafletEditRectangle | LeafletRectangleEditor | LeafletPolygonEditor;
export type leafletGeoEditorInstance = drawInstance | measureInstance | editorInstance;
export type MidpointPair = {
    insert: L.Marker | null;
    edge: L.Marker | null;
};
export interface LeafletPolylineOptionsExpends extends L.PolylineOptions {
    origin?: any;
    defaultStyle?: any;
    snap?: SnapOptions;
    edit?: EditOptions;
    [key: string]: unknown;
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
