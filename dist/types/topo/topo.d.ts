import * as L from 'leaflet';
import LeafletPolyline from '../draw/polyline';
import { type ReshapeOptions, type TopoClipResult, type TopoMergeResult, type TopoReshapeFeatureResult } from '../types';
export declare class LeafletTopology {
    private static instance;
    private map;
    drawLineLayer: LeafletPolyline | null;
    private selectedLayers;
    private clickHandler;
    private drawLineListener;
    private isPicking;
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
    merge(callback: (result: TopoMergeResult) => void): void;
    /**
     * 执行整形要素工具操作
     * */
    reshapeFeature(options: ReshapeOptions, callback: (result: TopoReshapeFeatureResult) => void): void;
    /**
     * 执行线裁剪操作
     * */
    clipByLine(callback: (result: TopoClipResult) => void): void;
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
    /** 返回选择的全部图层
     *
     *
     * @memberof LeafletTopology
     */
    getSelectLayers(): L.GeoJSON<any, import("geojson").Geometry>[];
    /**
     * 静态方法：检查指定地图是否处于选择图层状态
     * @param map 地图实例
     * @returns {boolean} 是否正在选择图层
     */
    static isPicking(map: L.Map): boolean;
    /**
       * 完全销毁单例实例
       * 应在页面卸载或组件销毁时调用
       */
    destroy(): void;
}
