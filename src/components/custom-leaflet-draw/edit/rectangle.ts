/* 本组件，设计初衷是用作编辑工具的。
 * 既然是编辑工具，目前能想到的用户使用场景：
 * 1：双击激活编辑逻辑。
 * 2：编辑时，支持拖动。
 * 3：绘制状态，外部ui要展示取消按钮，编辑状态，外部ui要展示编辑工具条，所以需要添加事件回调机制，外部监听状态的改变进行响应的ui调整
 * 4: 用户希望传入默认的空间geometry数据，那构造函数需要支持。
 * */
import * as L from 'leaflet';
import { PolygonEditorState, type LeafletToolsOptions, type SnapOptions } from '../types';
import { booleanPointInPolygon, point } from '@turf/turf';
import { BaseRectangleEditor } from './BaseRectangleEditor';
import { LeafletTopology } from '../topo/topo';

export default class LeafletRectangleEditor extends BaseRectangleEditor {

    private rectangleLayer: L.Rectangle | null = null;
    // 图层初始化时
    private drawLayerStyle = {
        weight: 2,
        color: '#008BFF', // 设置边线颜色
        fillColor: "#008BFF", // 设置填充颜色
        fillOpacity: 0.3, // 设置填充透明度
        fill: true, // no fill color means default fill color (gray for `dot` and `circle` markers, transparent for `plus` and `star`)
    };

    // 图层无效时的样式
    private errorDrawLayerStyle = {
        weight: 2,
        color: 'red', // 设置边线颜色
        fillColor: "red", // 设置填充颜色
        fillOpacity: 0.3, // 设置填充透明度
        fill: true,
    };
    private tempCoords: L.LatLng[] = [];
    private lastMoveCoord: L.LatLng | null = null; // 存储鼠标移动的最后一个点的坐标信息

    /** 创建一个矩形编辑类
     *
     * @param {L.Map} map 地图对象
     * @param {LeafletToolsOptions} [options={}] 要构建的多边形的样式属性
     * @param {GeoJSON.Geometry} [defaultGeometry] 默认的空间信息
     * @memberof LeafletEditPolygon
     */
    constructor(map: L.Map, options: LeafletToolsOptions = {}, defaultGeometry?: GeoJSON.Geometry) {
        super(map, { snap: options?.snap, validation: options?.validation, });
        if (this.map) {
            // 创建时激活
            this.activate();
            const existGeometry = !!defaultGeometry;
            // 初始化时，设置绘制状态为true(双击结束绘制时关闭绘制状态，其生命周期到头，且不再改变)，且发出状态通知
            this.updateAndNotifyStateChange(existGeometry ? PolygonEditorState.Idle : PolygonEditorState.Drawing);
            // 鼠标手势设置为十字

            this.map.getContainer().style.cursor = existGeometry ? 'grab' : 'crosshair';
            // 不需要设置十字光标和禁用双击放大（先考虑让用户自己去写，里面不再控制）
            // existGeometry ? this.map.doubleClickZoom.enable() : this.map.doubleClickZoom.disable();
            this.drawLayerStyle = { ...this.drawLayerStyle, ...options?.defaultStyle };
            this.initLayers(existGeometry ? defaultGeometry : undefined);
            this.initMapEvent(this.map);
        }
    }

    // 初始化图层
    private initLayers(defaultGeometry?: GeoJSON.Geometry): void {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180]]坐标，也就是页面的左下角
        const polylineOptions = {
            pane: 'overlayPane',
            layerVisible: true, // 增加了一个自定义属性，用于用户从图层层面获取图层的显隐状态
            defaultStyle: this.drawLayerStyle,
            ...this.drawLayerStyle,
        };
        let coords: L.LatLngBoundsExpression = [[181, 181], [182, 182]]; // 默认空图形
        if (defaultGeometry) {
            coords = this.convertRectGeoJSONToLatLngs(defaultGeometry);
        }
        this.rectangleLayer = L.rectangle(coords, polylineOptions);
        this.rectangleLayer.addTo(this.map);
        this.initPolygonEvent();
        // 设置吸附源（排除当前图层） 
        if (this.IsEnableSnap()) {
            this.setSnapSources([this.rectangleLayer]);
        }
    }

    /** 实例化矩形图层事件
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    private initPolygonEvent() {

        if (this.rectangleLayer) {

            this.rectangleLayer.on('mousedown', (e: L.LeafletMouseEvent) => {
                // 关键：只有激活的实例才处理事件
                if (!this.isActive()) return;
                if (this.currentState === PolygonEditorState.Editing) {
                    this.isDraggingPolygon = true;
                    this.dragStartLatLng = e.latlng;
                    this.map.dragging.disable();
                }
            });
        }
    }

    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    private initMapEvent(map: L.Map) {
        // 绘制操作会用到这俩
        map.on('click', this.mapClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
        // -----分割线--------
        // [编辑操作]会用到双击事件
        map.on('dblclick', this.mapDblClickEvent);
        // 拖动面用的这个
        map.on('mouseup', this.mapMouseUpEvent);
    }

    // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
    /**  地图点击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapClickEvent = (e: L.LeafletMouseEvent) => {
        // 关键：只有激活的实例才处理事件
        if (!this.isActive()) return;
        // 绘制时的逻辑
        if (this.currentState === PolygonEditorState.Drawing) {
            if (this.tempCoords.length === 0) {
                let point = e.latlng;
                if (this.IsEnableSnap()) {
                    const { snappedLatLng } = this.applySnapWithTarget(e.latlng);
                    point = snappedLatLng;
                }
                this.tempCoords.push(point);
            } else {
                // 添加吸附处理
                let point = e.latlng;
                if (this.IsEnableSnap()) {
                    const { snappedLatLng } = this.applySnapWithTarget(e.latlng);
                    point = snappedLatLng;
                }
                const finalCoords = [this.tempCoords[0], point];
                const isValid = this.isValidRectangle(finalCoords);
                if (isValid) {
                    // 校验通过，完成绘制
                    this.finishedDraw(finalCoords)
                } else {
                    // 校验失败，保持绘制状态（不执行reset）
                    throw new Error('绘制的矩形无效，请调整');
                    // 用户可以继续移动鼠标调整
                }
            }
        }
    }

    

    /**  地图双击事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapDblClickEvent = (e: L.LeafletMouseEvent) => {
        // 关键：只有激活的实例才处理事件
        if (!this.canConsume(e)) return;
        if (!this.rectangleLayer) throw new Error('图层实例化失败，无法完成图层创建，请重试');
        const clickedLatLng = e.latlng;
        const polygonGeoJSON = this.rectangleLayer.toGeoJSON();
        // 判断用户是否点击到了面上，是的话，就开始编辑模式
        const turfPoint = point([clickedLatLng.lng, clickedLatLng.lat]);
        const isInside = booleanPointInPolygon(turfPoint, polygonGeoJSON);
        if (isInside && this.currentState !== PolygonEditorState.Editing) {
            this.startEdit();
        } else {
            this.commitEdit();
        }

    }

    /**  地图鼠标移动事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseMoveEvent = (e: L.LeafletMouseEvent) => {
        // 关键：只有激活的实例才处理事件
        if (!this.isActive()) return;
        if (this.currentState === PolygonEditorState.Drawing) {
            this.lastMoveCoord = e.latlng;
            if (this.IsEnableSnap()) {
                const { snappedLatLng } = this.applySnapWithTarget(e.latlng);
                this.lastMoveCoord = snappedLatLng;
            }
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            if (!this.tempCoords.length) return;
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (this.tempCoords.length > 0) {
                const movedPathCoords = [...this.tempCoords, this.lastMoveCoord];
                const isValid = this.isValidRectangle(movedPathCoords);
                // 实时渲染
                this.renderLayer(movedPathCoords, isValid);
            }
        }
        // 编辑时的逻辑
        if (this.currentState === PolygonEditorState.Editing) {
            // 事件机制1：拖动机制时的事件。
            if (this.isDraggingPolygon && this.dragStartLatLng) {
                const deltaLat = e.latlng.lat - this.dragStartLatLng.lat;
                const deltaLng = e.latlng.lng - this.dragStartLatLng.lng;

                this.vertexMarkers.forEach(marker => {
                    const old = marker.getLatLng();
                    marker.setLatLng([old.lat + deltaLat, old.lng + deltaLng]);
                });

                const updated = this.vertexMarkers.map(m => [m.getLatLng().lat, m.getLatLng().lng]);
                this.renderLayerFromCoords(updated);

                this.dragStartLatLng = e.latlng; // 连续拖动
            }
        }
    }

    /**  地图鼠标抬起事件，用于设置点的位置
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @memberof LeafletEditRectangle
     */
    private mapMouseUpEvent = (e: L.LeafletMouseEvent) => {
        // 关键：只有激活的实例才处理事件
        if (!this.isActive()) return;
        // 条件1: 编辑事件
        if (this.currentState === PolygonEditorState.Editing) {
            // 条件1-1： 编辑状态下： 拖动面的事件
            if (this.isDraggingPolygon) {
                this.isDraggingPolygon = false;
                this.dragStartLatLng = null;
                this.map.dragging.enable();
                const updated = this.vertexMarkers.map(m => [m.getLatLng().lat, m.getLatLng().lng]);
                this.renderLayerFromCoords(updated); // 可更新也可不更新，因为mousemove的最后一次可以理解为已经更新过了
                this.historyStack.push(updated);
                try { this.pushHistory(updated); } catch (e) { }
                return;
            }
        }
    }

    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    private renderLayer(coords: L.LatLng[], valid: boolean = true) {
        if (this.rectangleLayer) {
            this.rectangleLayer.setStyle(valid ? this.drawLayerStyle : this.errorDrawLayerStyle)
            const bounds = L.latLngBounds(coords);
            this.rectangleLayer.setBounds(bounds);
        } else {
            throw new Error('图层不存在，无法渲染');
        }
    }

    /** 渲染图层-2
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    private renderLayerFromCoords(coords: number[][]): void {
        if (!this.rectangleLayer) return;

        // 将 number[][] 转换为 L.LatLng[]
        const latlngs = coords.map(coord => L.latLng(coord[0], coord[1]));
        this.renderLayer(latlngs);
    }

    /** 完成绘制
     *
     *
     * @private
     * @param {L.LatLng[]} finalCoords
     * @memberof LeafletRectangleEditor
     */
    private finishedDraw(finalCoords: L.LatLng[]): void {
        this.renderLayer(finalCoords);
        this.tempCoords = []; // 清空吧，虽然不清空也没事，毕竟后面就不使用了
        this.lastMoveCoord = null; // 清空吧，虽然不清空也没事，毕竟后面就不使用了
        this.reset();
        // 移除（吸附后）可能存在的高亮
        this.clearSnapHighlights();
        // 设置为空闲状态，并发出状态通知- 61 + 
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    }

    /** 返回图层的空间信息 
     * 
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletEditRectangle
     */
    public geojson() {
        if (this.rectangleLayer) {
            return this.rectangleLayer.toGeoJSON();
        } else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    }

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
    public getLayer() {
        return this.rectangleLayer;
    }

    /** 控制图层显示
     *
     *
     * @memberof LeafletEditPolygon
     */
    private show() {
        this.isVisible = true;
        // 使用用户默认设置的样式，而不是我自定义的！
        this.rectangleLayer?.setStyle({ ...(this.rectangleLayer.options as any).defaultStyle, layerVisible: true });
    }
