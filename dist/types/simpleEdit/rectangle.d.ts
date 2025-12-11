import * as L from 'leaflet';
import { SimpleBaseEditor } from './SimpleBaseEditor';
export default class LeafletEditRectangle extends SimpleBaseEditor {
    private rectangleLayer;
    private drawLayerStyle;
    private tempCoords;
    /** 创建一个矩形编辑类
     *
     * @param {L.Map} map 地图对象
     * @param {L.PolylineOptions} [options={}] 要构建的多边形的样式属性
     * @param {GeoJSON.Geometry} [defaultGeometry] 默认的空间信息
     * @memberof LeafletEditPolygon
     */
    constructor(map: L.Map, options?: L.PolylineOptions, defaultGeometry?: GeoJSON.Geometry);
    private initLayers;
    /** 实例化矩形图层事件
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    private initPolygonEvent;
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    private initMapEvent;
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapClickEvent;
    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapDblClickEvent;
    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseMoveEvent;
    /**  地图鼠标抬起事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseUpEvent;
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    private renderLayer;
    /** 渲染图层-2
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    private renderLayerFromCoords;
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletEditRectangle
     */
    geojson(): import("geojson").Feature<import("geojson").Polygon | import("geojson").MultiPolygon, any>;
    /** 返回绘制的图层
     *
     * 应用场景1： 地图上存在多个图层实例，每个图层的options属性中有其唯一id标识。现在若要删除其中一个图层，就需要先找到这个图层实例的options中存储的id标识，然后调用后台的删除接口。
     *
     * 应用场景2： 更改图层样式。
     *
     * （简言之： 场景太多，索性直接返回图层对象即可）
     * @return {*}
     * @memberof LeafletEditRectangle
     */
    getLayer(): L.Rectangle<any> | null;
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletEditRectangle
     */
    destroy(): void;
    /** 销毁绘制的图层
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    private destroyLayer;
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    private offMapEvent;
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditRectangle
     */
    private enterEditMode;
    /** 退出编辑模式
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    exitEditMode(): void;
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {string} [iconStyle="border-radius: 50%;background: #ffffff;border: solid 3px red;"]
     * @param {L.PointExpression} [iconSize=[20, 20]]
     * @param {L.DivIconOptions} [options]
     * @return {*}  {L.DivIcon}
     * @memberof LeafletEditRectangle
     */
    private buildMarkerIcon;
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     * @param latlngs 坐标数组
     */
    protected reBuildMarkerAndRender(latlngs: number[][]): void;
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    private reBuildMarker;
    /** 绑定 marker 事件 */
    private bindMarkerEvents;
    /** 更新矩形角点 */
    private updateRectangleCorners;
    /**  判断点击事件是否自己身上
     *
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof LeafletEditRectangle
     */
    private isClickOnMyLayer;
    private canConsume;
    private convertGeoJSONToLatLngs;
}
