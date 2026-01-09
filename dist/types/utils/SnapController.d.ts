/**
 * 1：吸附源是谁?
 * 假设图上有abc三个几何图形，然后你此刻在编辑C几何图层，那么吸附源就是除去C几何图层外的其他两个图层A和B。比如A和B均是多边形，我要先收集A和B的全部顶点。以拖动C几何中的一个顶点p1为例，我就要把P1和AB图层的所有顶点进行比较，来判断吸附到谁身上。综上: 吸附源是【A和B的全部顶点】。
 * 2: 后续我想在页面放置按钮：1：开启吸附、关闭吸附 2：吸附方式: 顶点吸附、线吸附。针对2我不确定应该是自动判断还是让用户选择(根据用户拖动的内容来自动选择吸附模式，留个口子，可能只要线吸附或者顶点吸附)
 * 3:对于数据格式，我们可以提前整理出一个处理好的拆分数据结构，比如：
 * const draggedGeometry = {
 *   type: 'polygon', // 或 'polyline'
 *   vertices: [p1, p2, p3, p4], // 所有顶点
 *   edges: [         // 所有边（线段）
 *     {start: p1, end: p2},
 *     {start: p2, end: p3},
 *     // ...
 *   ],
 *   bounds: {minX, minY, maxX, maxY}, // 包围盒(这个是否需要),
 *   geometry: {...}
 * };
 * 4:地图编辑中可能有大量几何元素，需要优化, 只在拖动点周围查询
 * 5: 对于顶点吸附：以拖动C几何中的一个顶点p1为例，我就要把从周围获取的顶点都进行比较，来判断吸附到谁身上
 * 6：对于线吸附：采用平行边投影吸附（暂时未使用线和线的吸附，因为arcgis没有好像）
 *     6.1：我拖动的是一条边 E = [P₁, P₂]。
 *     6.2：吸附源是其他周围的边集合 E' = {[A₁, A₂], [B₁, B₂], ...}。
 *     6.3. 判断E与E'中每条边是否近似平行（允许小误差）,（注意这里，如果E和E'是交叉的，只要角度小于某个阈值，则仍旧认为平行），平行则继续
 *     6.4 计算P1到E'中平行线的距离d1，P2到E'线的距离d2
 *     6.5. 计算平均距离 d_avg = (d1 + d2) / 2
 *     6.6. 如果 d_avg < 阈值 → 吸附
 *     6.7. 吸附时：将E整条边平行移动到E'对应的平行边上
 *
 */
import * as L from 'leaflet';
import type { GeometryIndex, SnapMode } from "../types";
export declare class SnapController {
    private map;
    private tolerance;
    private modes;
    private vertexSources;
    private edgeSources;
    constructor(map: L.Map);
    /** 设置阈值
     *
     *
     * @param {number} tolerance
     * @memberof SnapController
     */
    setTolerance(tolerance: number): void;
    /** 设置吸附模式
     *
     *
     * @param {SnapMode[]} modes
     * @memberof SnapController
     */
    setModes(modes: SnapMode[]): void;
    /** 设置吸附源
     *
     *
     * @param {L.LatLng[]} points
     * @memberof SnapController
     */
    setGeometrySources(indices: GeometryIndex[]): void;
    /** 顶点吸附
     *
     *
     * @param {L.LatLng} input
     * @return {*}  {(L.LatLng | null)}
     * @memberof SnapController
     */
    snapVertex(input: L.LatLng): L.LatLng | null;
    /** 返回输入点即将吸附的目标边线
     *
     *
     * @param {L.LatLng} input
     * @return {*}  {({ start: L.LatLng; end: L.LatLng } | null)}
     * @memberof SnapController
     */
    getClosestEdge(input: L.LatLng): {
        start: L.LatLng;
        end: L.LatLng;
    } | null;
    /** 边线吸附
     *
     *
     * @protected
     * @param {L.LatLng} latlng
     * @return {*}  {(L.LatLng | null)}
     * @memberof BaseEditor
     */
    snapEdge(latlng: L.LatLng): L.LatLng | null;
    /** 将一个点 p 投影到一条线段 ab 上，返回投影点的位置。
     *
     *
     * @private
     * @param {L.LatLng} p
     * @param {L.LatLng} a
     * @param {L.LatLng} b
     * @return {*}  {L.LatLng}
     * @memberof SnapController
     */
    private projectPointToSegment;
}
