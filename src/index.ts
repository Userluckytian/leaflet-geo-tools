// src/index.ts

import LeafletCircle from './draw/circle';
import MarkerPoint from './draw/markerPoint';
import LeafletPolygon from './draw/polygon';
import LeafletPolyline from './draw/polyline';
import LeafletRectangle from './draw/rectangle';
import LeafletPolygonEditor from './edit/polygon';
import LeafletRectangleEditor from './edit/rectangle';
import LeafletArea from './measure/area';
import LeafletDistance from './measure/distance';

// 首先导入所有模块

// ... 导入其他所有类

// 导出类型
export * from './types';

// 命名导出（ES6模块用）
export {
    LeafletCircle,
    MarkerPoint,
    LeafletPolygon,
    LeafletPolyline,
    LeafletRectangle,
    LeafletArea,
    LeafletDistance,
    LeafletRectangleEditor,
    LeafletPolygonEditor,
};

// UMD需要默认导出
const LeafletGeoTools = {
    LeafletCircle,
    MarkerPoint,
    LeafletPolygon,
    LeafletPolyline,
    LeafletRectangle,
    LeafletArea,
    LeafletDistance,
    LeafletRectangleEditor,
    LeafletPolygonEditor,
    // ... 其他类
};

// 为了兼容性，也导出为default
export default LeafletGeoTools;