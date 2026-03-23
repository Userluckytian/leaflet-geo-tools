// src/index.ts

import CircleEditor from "./editor/circleEditor";
import MarkerPointEditor from "./editor/markerPointEditor";
import PolygonEditor from "./editor/polygonEditor";
import PolylineEditor from "./editor/polylineEditor";
import RectangleEditor from "./editor/rectangleEditor";

import LeafletArea from './measure/area';
import LeafletDistance from './measure/distance';

import { LeafletTopology } from './topo/topo';


// 首先导入所有模块

// ... 导入其他所有类

// 导出类型
export * from './types';

// 命名导出（ES6模块用）
export {
    CircleEditor,
    MarkerPointEditor,
    PolygonEditor,
    PolylineEditor,
    RectangleEditor,

    LeafletArea,
    LeafletDistance,

    LeafletTopology,
};

// UMD需要默认导出
const LeafletGeoTools = {
    CircleEditor,
    MarkerPointEditor,
    PolygonEditor,
    PolylineEditor,
    RectangleEditor,

    LeafletArea,
    LeafletDistance,

    LeafletTopology,
    // ... 其他类
};

// 为了兼容性，也导出为default
export default LeafletGeoTools;