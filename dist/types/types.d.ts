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
export declare enum PolygonEditorState {
    Idle = "idle",// 空闲状态：既不是绘制中，也不是编辑中
    Drawing = "drawing",// 正在绘制
    Editing = "editing"
}
export type drawInstance = LeafletCircle | MarkerPoint | LeafletPolygon | LeafletPolyline | LeafletRectangle;
export type measureInstance = LeafletArea | LeafletDistance;
export type editorInstance = LeafletEditPolygon | LeafletEditRectangle | LeafletRectangleEditor | LeafletPolygonEditor;
export type leafletGeoEditorInstance = drawInstance | measureInstance | editorInstance;
export interface LeafletPolylineOptionsExpends extends L.PolylineOptions {
    origin?: any;
    defaultStyle?: any;
    [key: string]: unknown;
}
