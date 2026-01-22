/**  整形要素工具： Reshape Feature：
 * ArcMap-修整线： https://desktop.arcgis.com/zh-cn/arcmap/latest/manage-data/editing-existing-features/reshaping-lines.htm
 * ArcMap-修整面： https://desktop.arcgis.com/zh-cn/arcmap/latest/manage-data/editing-existing-features/reshaping-polygons.htm
 * ArcGIS Pro： https://pro.arcgis.com/en/pro-app/latest/help/editing/reshape-a-feature.htm?utm_source=copilot.com
 * 1: 支持线、面的重塑处理。（✔）
 * 2: 【Allow reshaping without a selection】允许无选择重塑。（✔）
 * 3: 【Show Preview】实时预览reshape效果，便于判断结果是否符合预期。（目前：不支持）
 * 4: 【Reshape with single intersection】仅限线要素，允许单一交叉点重塑。（✔）
 * 5: 【Choose result on finish】完成后，由用户来选择要保留的部分。（目前：自动保留周长最大的特征，用户想要自己选择保留的部分）
 * 挖孔面的特殊情况（暂时还没搞懂这块的行为）：
 * 1：我构建了一个挖孔的面，假设，面的外部定义为区域A，面定义为区域B，面的内环部分定义为区域C，我在区域A绘制一个起点P1，然后这条线经过A，经过B，经过C，再回到区域A，和面共有4个交点，其中外环2个，内环2个。我认为这是一分为2的行为，但通过重塑后，却得到了2部分：外环从分割线切分保留了一部分，内环区域被填充了一部分。（感觉对于arcgis来说，执行的是先只考虑外环面部分，再只考虑内环面部分，这样解释就合理了）
 * 2：还用上面的区域ABC举例，假设我的起点在区域C内，然后依次穿过区域B，区域A，再从区域A穿过区域B，再回到区域C。第一次执行（绘制一小块区域）的结果是扩充，第二次执行的结果（这次把线画的很大，在绕过环的情况下去包裹尽可能多的面）却是整个B删掉了，然后区域A和区域B围起来的部分是保留的，区域C变成了填充的。
 */
import type { ReshapeOptions } from "../types";
/** reshape 多面：逐个 polygon 判断是否相交并 reshape
 */
declare function reshapeMultiPolygonByLine(multi: GeoJSON.Feature<GeoJSON.MultiPolygon>, sketchLine: GeoJSON.Feature<GeoJSON.LineString>, options?: ReshapeOptions): GeoJSON.Feature<GeoJSON.MultiPolygon>[];
/**
 * （针对面）根据草图线自动判断并执行 reshape（裁剪或扩张）
 */
declare function reshapePolygonByLine(polygon: GeoJSON.Feature<GeoJSON.Polygon>, sketchLine: GeoJSON.Feature<GeoJSON.LineString>, options?: ReshapeOptions): GeoJSON.Feature<GeoJSON.Polygon>[] | null;
/**
 * （针对线）根据草图线自动判断并执行 reshape（裁剪或扩张）
 */
declare function reshapeLineByLine(target: GeoJSON.Feature<GeoJSON.LineString>, sketch: GeoJSON.Feature<GeoJSON.LineString>, options?: ReshapeOptions): GeoJSON.Feature<GeoJSON.LineString>[] | null;
export { reshapePolygonByLine, reshapeMultiPolygonByLine, reshapeLineByLine };
