import L from "leaflet";
/** reshape 多面：逐个 polygon 判断是否相交并 reshape
 */
declare function reshapeMultiPolygonByLine(multi: GeoJSON.Feature<GeoJSON.MultiPolygon>, sketchLine: GeoJSON.Feature<GeoJSON.LineString>, map: L.Map): GeoJSON.Feature<GeoJSON.MultiPolygon>[];
/**
 * 根据草图线自动判断并执行 reshape（裁剪或扩张）
 */
declare function reshapePolygonByLine(polygon: GeoJSON.Feature<GeoJSON.Polygon>, sketchLine: GeoJSON.Feature<GeoJSON.LineString>, map: L.Map): GeoJSON.Feature<GeoJSON.Polygon>[] | null;
export { reshapePolygonByLine, reshapeMultiPolygonByLine };
