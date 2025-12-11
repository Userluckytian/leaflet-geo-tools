import * as L from 'leaflet';
import LeafletPolyline from '../draw/polyline';
export declare class LeafletTopology {
    private static instance;
    private map;
    drawLineLayer: LeafletPolyline | null;
    private selectedLayers;
    private clickHandler;
    private drawLineListener;
    constructor(map: L.Map);
    static getInstance(map: L.Map): LeafletTopology;
    /** 选择图层
     *
     *
     * @memberof LeafletTopology
     */
    select(): void;
    /**
     * 执行合并操作
     * */
    merge(): void;
    /**
     * 执行线裁剪操作
     * */
    clipByLine(): void;
    /** 基于选中的图层的空间信息，添加对应的高亮图层
     *
     *
     * @private
     * @param {*} layer
     * @memberof LeafletTopology
     */
    private addHighLightLayerByPickLayerGeom;
    private disableMapOpt;
    private enableMapOpt;
    /**
     * 清理状态和事件
     * 1： off click事件
     * 2： 移除高亮图层
     * 3： 恢复地图事件
     * 4： 重置模式管理器
     * */
    cleanAll(): void;
}
