/**
 * 裁剪多边形（支持Polygon、MultiPolygon、带孔洞的面）
 */
declare function splitPolygon(polygonFeature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>, // 面、多面
splitter: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.Polygon>): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[] | null;
export default splitPolygon;
