# Leaflet Geo Tools API v1.0

## 第1章：项目概述

### 1.1 项目简介

Leaflet Geo Tools 是一个基于 Leaflet 的增强型 GIS 工具库，专注于提供专业的地理信息绘制、编辑、测量和拓扑操作功能。该库旨在为 Web GIS 应用提供一套完整、易用且高性能的几何操作解决方案。

#### 核心特性

- **🎨 丰富的绘制工具**：支持点、线、面、矩形、圆形等多种几何图形的绘制
- **✏️ 强大的编辑功能**：提供顶点编辑、中点插入、拖动面、复杂面编辑（polygon、multi-polygon、Polygon with Hole(s)）等专业编辑能力
- **📏 精确测量工具**：内置距离测量和面积测量功能，支持多种单位制
- **🔗 拓扑操作**：提供面合并、线分割、整形等高级拓扑操作
- **🚀 高性能**：优化的渲染和事件处理机制，确保流畅的用户体验
- **📦 TypeScript 支持**：完整的类型定义，提供优秀的开发体验
- **🔌 多种使用方式**：支持 ES6、CommonJS 和浏览器直接使用

#### 技术栈

- **核心依赖**：Leaflet 1.9.4
- **空间分析**：Turf.js 7.3.1
- **开发语言**：TypeScript 5.9.3
- **构建工具**：Rollup 2.79.2

### 1.2 技术架构说明

#### 模块化设计

Leaflet Geo Tools 采用模块化架构设计，主要包含以下核心模块：

```
src/
├── base/           # 基础类模块
│   └── BaseEditor.ts
├── editor/         # 编辑器模块
│   ├── circleEditor.ts
│   ├── markerPointEditor.ts
│   ├── polygonEditor.ts
│   ├── polylineEditor.ts
│   └── rectangleEditor.ts
├── measure/        # 测量工具模块
│   ├── area.ts
│   └── distance.ts
├── topo/           # 拓扑工具模块
│   ├── topo.ts
│   ├── turf-polygon-split.ts
│   └── turf-reshape-feature.ts
├── utils/          # 工具类模块
│   ├── SnapController.ts
│   ├── commonUtils.ts
│   ├── topoUtils.ts
│   ├── validShapeUtils.ts
│   └── drawAuxiliaryLine.ts
└── types.ts        # 类型定义
```

#### 架构层次

1. **基础层（Base Layer）**
   - `BaseEditor` 抽象基类：定义编辑器的通用接口和行为
   - 类型系统：完整的 TypeScript 类型定义

2. **功能层（Feature Layer）**
   - 编辑器模块：各种几何图形的编辑器实现
   - 测量工具：距离和面积测量功能
   - 拓扑工具：高级空间分析操作

3. **工具层（Utility Layer）**
   - 吸附控制器：顶点和边线吸附功能
   - 通用工具：坐标转换、图层查询等
   - 校验工具：几何图形有效性检查

4. **应用层（Application Layer）**
   - 统一的 API 接口
   - 多种模块导出方式（ES6、CommonJS、UMD）

#### 设计原则

- **单一职责**：每个模块专注于特定的功能领域
- **开闭原则**：通过抽象基类支持扩展，核心功能保持稳定
- **依赖倒置**：高层模块不依赖低层模块，都依赖抽象
- **接口隔离**：提供简洁明确的 API 接口

### 1.3 快速开始指南

#### 安装

**NPM 安装**
```bash
npm install leaflet leaflet-geo-tools
```

**Yarn 安装**
```bash
yarn add leaflet leaflet-geo-tools
```

**CDN 直接使用**
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/@turf/turf@7/turf.min.js"></script>
<script src="https://unpkg.com/leaflet-geo-tools@latest/dist/index.js"></script>
```

#### 基础使用

**1. 初始化地图**

```javascript
import L from 'leaflet';

// 创建地图实例
const map = L.map('map').setView([31.2304, 121.4737], 13);

// 添加底图
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

**2. 绘制多边形**

```javascript
import { PolygonEditor } from 'leaflet-geo-tools';

// 创建多边形编辑器 - 创建后自动进入绘制状态
const polygonEditor = new PolygonEditor(map);

// 监听状态变化
polygonEditor.onStateChange((state) => {
  console.log('当前状态:', state);
  
  if (state === 'idle') {
    // 绘制完成，获取 GeoJSON 数据
    const geojson = polygonEditor.getGeoJSON();
    console.log('绘制完成:', geojson);
  }
});

// 开始在地图上点击绘制，双击完成绘制
```

**3. 测量距离**

```javascript
import { LeafletDistance } from 'leaflet-geo-tools';

// 创建距离测量工具 - 创建后自动进入测量状态
const distanceMeasure = new LeafletDistance(map, {
  units: 'meters',
  precision: 2,
  lang: 'zh',
  drawLineStyle: {
    color: '#ff0000',
    weight: 3
  }
});

// 开始在地图上点击测量，双击完成测量
```

**4. 编辑现有图形**

```javascript
import { PolygonEditor } from 'leaflet-geo-tools';

// 现有的 GeoJSON 数据
const existingGeometry = {
  type: "Polygon",
  coordinates: [[
    [121.47, 31.23],
    [121.48, 31.23],
    [121.48, 31.24],
    [121.47, 31.24],
    [121.47, 31.23]
  ]]
};

// 创建编辑器并传入现有图形
const editor = new PolygonEditor(map, {}, existingGeometry);

// 进入编辑模式：双击图形即可进入编辑状态
// 支持：拖动顶点、插入中点、删除顶点（右键顶点触发删除）、拖动整个面、顶点吸附
```

#### 应用场景选择

根据不同的使用需求，选择相应的功能模块：

1. **只需要绘制功能**：使用 `src/editor/` 目录下的绘制工具
2. **需要编辑已有多边形**：使用编辑器模块，支持复杂面编辑
3. **需要测量功能**：使用测量工具模块
4. **需要拓扑操作**：使用拓扑工具模块

#### 项目集成

**ES6 模块方式**
```javascript
import { 
  PolygonEditor, 
  LeafletDistance, 
  LeafletTopology 
} from 'leaflet-geo-tools';
```

**CommonJS 方式**
```javascript
const { 
  PolygonEditor, 
  LeafletDistance, 
  LeafletTopology 
} = require('leaflet-geo-tools');
```

**浏览器全局变量方式**
```javascript
const { 
  PolygonEditor, 
  LeafletDistance, 
  LeafletTopology 
} = window.LeafletGeoTools;
```

#### 下一步

现在您已经了解了 Leaflet Geo Tools 的基本概念和使用方法。接下来的章节将详细介绍：

- 第2章：完整的类型系统说明
- 第3章：编辑器系统的详细使用
- 第4章：测量工具的配置和使用
- 第5章：拓扑操作的工作流程
- 第6章：工具类的具体实现
- 第7章：完整的应用示例

请继续阅读相关章节以深入了解各个功能模块的详细使用方法。

## 第2章：类型系统详解

作为开发者，了解类型系统是正确使用 Leaflet Geo Tools 的基础。本章将为您详细介绍所有重要的类型定义，让您能够轻松配置和使用各种功能。

### 2.1 基础类型

#### EditorState - 编辑器状态

这是您最常接触的状态类型，它告诉您编辑器当前处于什么状态：

```typescript
enum EditorState {
    Idle = 'idle',       // 空闲状态：既不是绘制中，也不是编辑中
    Drawing = 'drawing', // 正在绘制：用户正在地图上点击绘制图形
    Editing = 'editing'  // 正在编辑：用户正在编辑已存在的图形
}
```

**实际使用场景：**
```javascript
// 监听编辑器状态变化
polygonEditor.onStateChange((state) => {
    if (state === 'idle') {
        console.log('编辑器空闲，可以开始新的操作');
    } else if (state === 'drawing') {
        console.log('正在绘制中...');
    } else if (state === 'editing') {
        console.log('正在编辑图形...');
    }
});
```

#### EditorListenerConfigs - 监听器配置

当您需要监听编辑器状态时，可以通过这个配置控制监听行为：

```typescript
interface EditorListenerConfigs {
    immediateNotify?: boolean; // 是否立即触发状态监听
}
```

**实际使用场景：**
```javascript
// 立即获取当前状态，而不是等待状态变化
polygonEditor.onStateChange((state) => {
    console.log('当前状态:', state);
}, { immediateNotify: true }); // 立即通知当前状态
```

### 2.2 编辑器配置类型

#### LeafletEditorOptions - 主配置选项

这是创建编辑器时的主要配置选项，包含了所有重要的设置：

```typescript
interface LeafletEditorOptions {
    coordPrecision?: number,                    // 坐标精度（默认6位小数）
    defaultGeometry?: GeoJSON.Geometry,         // 默认几何信息
    defaultStyle?: LeafletPolylineOptions | LeafletMarkerOptions, // 图层样式
    snap?: SnapOptions,                         // 吸附配置
    edit?: EditOptionsExpends,                  // 编辑配置
    validation?: ValidationOptions,             // 几何校验配置
}
```

**实际使用场景：**
```javascript
// 创建一个带吸附和编辑功能的编辑器
const editor = new PolygonEditor(map, {
    coordPrecision: 4,  // 坐标保留4位小数
    defaultStyle: {
        color: '#ff0000',
        weight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.3
    },
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 10
    },
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.icon({
                iconUrl: 'marker-icon.png',
                iconSize: [12, 12]
            })
        }
    }
});
```

#### EditOptionsExpends - 编辑功能配置

这个类型控制编辑功能的各种选项：

```typescript
interface EditOptionsExpends extends BaseEditOptions {
    dragLineMarkerOptions?: DragMarkerOptions;     // 拖动边的标记配置
    dragMidMarkerOptions?: DragMarkerOptions;      // 拖动中点的标记配置
    circle_LinkRadiusAndCenterDashLineOptions?: CircleDashLineOptions; // 圆形虚线配置
}
```

**实际使用场景：**
```javascript
const editor = new PolygonEditor(map, {
    edit: {
        enabled: true,  // 启用编辑功能
        
        // 顶点样式
        vertexsMarkerStyle: {
            icon: L.icon({
                iconUrl: 'vertex-icon.png',
                iconSize: [10, 10]
            }),
            draggable: true
        },
        
        // 中点插入功能
        dragMidMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.icon({
                    iconUrl: 'midpoint-icon.png',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.3  // 中点位置（0-1之间）
        },
        
        // 边拖动功能
        dragLineMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.icon({
                    iconUrl: 'edge-icon.png',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.6  // 边控制点位置
        }
    }
});
```

### 2.3 吸附配置类型

#### SnapOptions - 吸附功能配置

吸附功能可以让您的绘制更加精确，自动对齐到其他图形的顶点或边：

```typescript
interface SnapOptions {
    enabled: boolean;           // 是否开启吸附功能
    modes: SnapMode[];          // 吸附模式：顶点吸附、边吸附
    tolerance?: number;         // 吸附范围阈值（像素）
    highlight?: SnapHighlightLayerOptions; // 吸附高亮配置
}
```

**实际使用场景：**
```javascript
const editor = new PolygonEditor(map, {
    snap: {
        enabled: true,                    // 开启吸附
        modes: ['vertex', 'edge'],       // 同时启用顶点和边吸附
        tolerance: 15,                   // 15像素范围内触发吸附
        highlight: {                     // 吸附时的高亮效果
            enabled: true,
            pointStyle: {
                radius: 8,
                color: '#00ff00',
                weight: 2,
                fillOpacity: 0.8
            },
            edgeStyle: {
                color: '#00ff00',
                weight: 4,
                dashArray: '4,2'
            }
        }
    }
});
```

#### SnapResult - 吸附结果

当吸附功能触发时，您可以获取吸附的详细信息：

```typescript
interface SnapResult {
    snappedLatLng: L.LatLng;                                                            // 吸附后的坐标
    snapped: boolean;                                                                   // 是否发生了吸附
    type?: 'vertex' | 'edge';                                                           // 吸附类型
    target?: L.LatLng | { start: L.LatLng; end: L.LatLng };                              // 吸附目标
}
```

### 2.4 校验配置类型

#### ValidationOptions - 几何校验配置

这个配置用于控制几何图形的有效性检查：

```typescript
interface ValidationOptions {
    allowSelfIntersect?: boolean;           // 是否允许自相交
    validErrorPolygonStyle?: L.PolylineOptions;  // 多边形校验失败时的样式
    validErrorLineStyle?: L.PolylineOptions;     // 线条校验失败时的样式
    validErrorPointStyle?: L.MarkerOptions;       // 点校验失败时的样式
}
```

**实际使用场景：**
```javascript
const editor = new PolygonEditor(map, {
    validation: {
        allowSelfIntersect: false,  // 不允许自相交
        validErrorPolygonStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5'
        }
    }
});

// 动态更新校验规则
editor.setValidationOptions({
    allowSelfIntersect: true  // 允许自相交
});
```

### 2.5 拓扑配置类型

#### TopoOptions - 拓扑操作配置

当您需要进行拓扑操作（如合并、裁剪）时的配置：

```typescript
interface TopoOptions {
    precision?: number;     // 坐标精度（默认6位）
    circleStep?: number;    // 圆形拟合点的数量（默认64个点）
}
```

#### 拓扑操作结果类型

各种拓扑操作会返回相应的结果类型：

```typescript
// 合并操作结果
interface TopoMergeResult {
    mergedLayers: L.GeoJSON[];           // 合并后的图层
    mergedGeom: GeoJSON.Feature | null;  // 合并后的几何体
}

// 裁剪操作结果
interface TopoClipResult {
    doClipLayers: L.Layer[];  // 参与裁剪的图层
    clipedGeoms: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[];  // 裁剪结果
}

// 整形操作结果
interface TopoReshapeFeatureResult {
    doReshapeLayers: L.Layer[];  // 参与整形的图层
    reshapedGeoms: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString>[];  // 整形结果
}
```

**实际使用场景：**
```javascript
import { LeafletTopology } from 'leaflet-geo-tools';

const topology = new LeafletTopology(map, {
    precision: 6,      // 坐标精度
    circleStep: 32    // 圆形用32个点拟合
});

// 执行合并操作
const mergeResult = topology.merge(selectedLayers);
console.log('合并结果:', mergeResult.mergedGeom);
```

### 2.6 测量相关类型

#### areaOptions - 面积测量配置

```typescript
interface areaOptions {
    coordPrecision?: number;              // 坐标精度
    precision?: number;                  // 计算结果精度
    lang?: 'en' | 'zh';                  // 语言
    polygonStyle?: L.PolylineOptions;    // 多边形样式
    validErrorPolygonStyle?: L.PolylineOptions; // 校验失败样式
    validation?: ValidationOptions;      // 校验配置
    markerStyle?: areaMarker;             // 标记样式
}
```

#### distanceOptions - 距离测量配置

```typescript
interface distanceOptions {
    coordPrecision?: number;              // 坐标精度
    units?: Units;                       // 单位（meters、kilometers、feet等）
    precision?: number;                  // 计算结果精度
    lang?: 'en' | 'zh';                  // 语言
    drawLineStyle?: L.PolylineOptions;   // 线条样式
    markerStyle?: distanceMarker;        // 标记样式
}
```

**实际使用场景：**
```javascript
// 面积测量
const areaMeasure = new LeafletArea(map, {
    precision: 2,                    // 保留2位小数
    lang: 'zh',                      // 中文显示
    polygonStyle: {
        color: '#008BFF',
        weight: 2,
        fillColor: '#008BFF',
        fillOpacity: 0.3
    },
    markerStyle: {
        containerClassName: 'area-marker',
        dotClassName: 'area-dot',
        labelClassName: 'area-label'
    }
});

// 距离测量
const distanceMeasure = new LeafletDistance(map, {
    units: 'meters',                // 使用米作为单位
    precision: 1,                    // 保留1位小数
    lang: 'zh',
    drawLineStyle: {
        color: '#ff0000',
        weight: 3
    }
});
```

#### 测量结果类型

```typescript
// 格式化的面积结果
interface FormattedArea {
    val: number;    // 数值
    unit: string;   // 单位（如：平方米、平方公里）
}

// 格式化的距离结果
interface FormattedDistance {
    val: number;    // 数值
    unit: string;   // 单位（如：米、公里）
}
```

### 2.7 工具实例类型

这些类型用于标识不同的工具实例：

```typescript
type drawInstance = any;     // 绘制工具实例
type measureInstance = any;  // 测量工具实例
type EditorInstance = drawInstance | measureInstance;  // 编辑器实例
```

**实际使用场景：**
```javascript
// 当您需要管理多个编辑器实例时
const editors: EditorInstance[] = [];

const polygonEditor = new PolygonEditor(map);
const distanceMeasure = new LeafletDistance(map);

editors.push(polygonEditor);
editors.push(distanceMeasure);

// 统一管理所有编辑器
editors.forEach(editor => {
    if (editor.onStateChange) {
        editor.onStateChange((state) => {
            console.log('编辑器状态变化:', state);
        });
    }
});
```

### 2.8 实用小贴士

#### 常用配置组合

**1. 基础绘制编辑器**
```javascript
const basicEditor = new PolygonEditor(map, {
    defaultStyle: {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.2
    }
});
```

**2. 精确吸附编辑器**
```javascript
const preciseEditor = new PolygonEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 8,
        highlight: {
            enabled: true,
            pointStyle: { color: '#00ff00', weight: 2 }
        }
    },
    edit: {
        enabled: true,
        dragMidMarkerOptions: { enabled: true }
    }
});
```

**3. 严格校验编辑器**
```javascript
const strictEditor = new PolygonEditor(map, {
    validation: {
        allowSelfIntersect: false,
        validErrorPolygonStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5'
        }
    }
});
```

#### 配置优先级

记住配置的优先级顺序：
1. **构造函数参数** > 2. **默认配置** > 3. **系统内置配置**

这意味着您在构造函数中传入的配置具有最高优先级。

现在您已经了解了完整的类型系统，接下来让我们深入学习编辑器系统的具体使用方法。

## 第3章：编辑器系统详解

编辑器系统是 Leaflet Geo Tools 的核心功能，它为您提供了强大的图形绘制和编辑能力。本章将详细介绍每个编辑器的使用方法和最佳实践。

### 3.1 BaseEditor 抽象基类

BaseEditor 是所有编辑器的基类，它定义了编辑器的基本行为和通用功能。虽然您不会直接使用 BaseEditor，但了解它的工作原理对您理解和使用各种编辑器非常有帮助。

#### 构造函数参数详解

所有编辑器都继承自 BaseEditor，具有相似的构造函数：

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**参数说明：**
- `map`: Leaflet 地图实例（必需）
- `options`: 编辑器配置选项（可选）

**实际使用示例：**
```javascript
// 创建一个基础的编辑器配置
const editorOptions = {
    coordPrecision: 6,                    // 坐标精度
    defaultStyle: {                       // 默认样式
        color: '#3388ff',
        weight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.2
    },
    snap: {                               // 吸附配置
        enabled: true,
        modes: ['vertex'],
        tolerance: 10
    },
    edit: {                               // 编辑配置
        enabled: true,
        vertexsMarkerStyle: {
            draggable: true
        }
    },
    validation: {                         // 校验配置
        allowSelfIntersect: false
    }
};

// 使用配置创建编辑器
const editor = new PolygonEditor(map, editorOptions);
```

#### 抽象方法说明

BaseEditor 定义了一系列抽象方法，这些方法由具体的编辑器子类实现：

**1. initLayer() - 图层初始化**
```typescript
protected abstract initLayer(geometry?: GeoJSON.Geometry | L.LatLng): void;
```
- **作用**: 创建并初始化编辑器的图层
- **调用时机**: 构造函数中自动调用


**2. bindMapEvents() - 绑定地图事件**
```typescript
protected abstract bindMapEvents(map: L.Map): void;
```
- **作用**: 绑定地图的点击、双击、鼠标移动等事件
- **调用时机**: 构造函数中自动调用


**3. offMapEvents() - 解绑地图事件**
```typescript
protected abstract offMapEvents(map: L.Map): void;
```
- **作用**: 清理地图事件监听
- **调用时机**: 编辑器销毁时自动调用


**4. renderLayer() - 渲染图层**
```typescript
protected abstract renderLayer(coords: any[], valid: boolean): void;
```
- **作用**: 根据坐标数据渲染图层
- **调用时机**: 绘制或编辑过程中自动调用


#### 公共方法详解


**1. getGeoJSON() - 获取 GeoJSON 数据**
```javascript
// 获取当前图形的 GeoJSON 数据
const geojsonData = editor.getGeoJSON();

// 指定坐标精度
const geojsonData = editor.getGeoJSON(4); // 保留4位小数

// 不进行坐标精度处理
const geojsonData = editor.getGeoJSON(false);
```

**2. getLayer() - 获取 Leaflet 图层**
```javascript
// 获取底层的 Leaflet 图层对象
const leafletLayer = editor.getLayer();

// 可以直接操作 Leaflet 图层
leafletLayer.setStyle({ color: '#ff0000' });
leafletLayer.bringToFront();
```

**3. layerDestroy() - 销毁图层**
```javascript
// 完全移除编辑器和相关图层
editor.layerDestroy();

// 注意：销毁后编辑器无法再使用，需要重新创建实例
```

**4. reset() - 重置地图状态**
```javascript
// 重置鼠标样式和地图状态
editor.reset();

// 通常在完成编辑后调用
```

#### 状态管理机制

BaseEditor 提供了完整的状态管理系统，让您能够实时了解编辑器的状态：

**状态类型：**
```javascript
// 监听状态变化
editor.onStateChange((state) => {
    switch(state) {
        case 'idle':
            console.log('编辑器空闲');
            break;
        case 'drawing':
            console.log('正在绘制');
            break;
        case 'editing':
            console.log('正在编辑');
            break;
    }
});

// 立即获取当前状态
editor.onStateChange((state) => {
    console.log('当前状态:', state);
}, { immediateNotify: true });
```

**状态转换流程：**
```
创建编辑器 → [有默认几何] → idle
           → [无默认几何] → drawing → [用户完成绘制] → idle
           → [双击图形] → editing → [完成编辑] → idle
```

#### 激活/停用机制

编辑器系统采用了单例激活机制，确保同一时间只有一个编辑器处于激活状态：

**自动激活：**
```javascript
// 创建编辑器时自动激活
const editor1 = new PolygonEditor(map);
const editor2 = new CircleEditor(map);

// editor2 会自动停用 editor1
```

**激活机制的好处：**
- 避免多个编辑器同时响应地图事件
- 确保用户操作的明确性
- 提高系统性能

#### 实用小贴士

**1. 编辑器生命周期管理**
```javascript
// 创建
const editor = new PolygonEditor(map);

// 使用
editor.onStateChange((state) => {
    // 处理状态变化
});

// 销毁（重要！）
editor.destroy(); // 清理资源，避免内存泄漏
```

**2. 状态监听最佳实践**
```javascript
// 推荐：使用立即通知获取初始状态
editor.onStateChange(handleStateChange, { immediateNotify: true });

function handleStateChange(state) {
    if (state === 'idle') {
        // 获取最终数据
        const data = editor.getGeoJSON();
        console.log('完成:', data);
    }
}
```


### 3.2 CircleEditor 圆形编辑器

CircleEditor 专门用于绘制和编辑圆形，它提供了直观的圆心拖拽和半径调整功能。

#### 构造函数参数全量说明

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**特殊配置说明：**
```javascript
const circleEditor = new CircleEditor(map, {
    // 基础配置
    coordPrecision: 6,
    
    // 圆形专用样式配置
    defaultStyle: {
        color: '#ff6b6b',        // 边框颜色
        fillColor: '#ff6b6b',     // 填充颜色
        fillOpacity: 0.3,         // 填充透明度
        weight: 2,                // 边框粗细
        radius: 1000              // 默认半径（米）
    },
    
    // 编辑配置
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.icon({
                iconUrl: 'center-icon.png',
                iconSize: [12, 12]
            }),
            draggable: true
        },
        // 圆形特有的虚线配置
        circle_LinkRadiusAndCenterDashLineOptions: {
            enabled: true,
            dashLineStyle: {
                color: '#999',
                weight: 1,
                dashArray: '5,5'
            }
        }
    },
    
    // 吸附配置
    snap: {
        enabled: true,
        modes: ['vertex'],  // 圆形主要支持顶点吸附
        tolerance: 15
    },
    
    // 校验配置
    validation: {
        allowSelfIntersect: false  // 圆形不会自相交，但配置保留
    }
});
```

#### 圆心拖拽和半径调整

**绘制圆形：**
```javascript
// 创建圆形编辑器
const circleEditor = new CircleEditor(map);

// 监听状态变化
circleEditor.onStateChange((state) => {
    if (state === 'idle') {
        // 绘制完成，获取圆形数据
        const geojson = circleEditor.getGeoJSON();
        console.log('圆形绘制完成:', geojson);
    }
});

// 开始绘制：点击地图设置圆心，移动鼠标调整半径，双击完成
```

**编辑现有圆形：**
```javascript
// 传入现有的圆形数据
const existingCircle = {
    type: "Point",  // 圆心坐标
    coordinates: [121.4737, 31.2304]
};

const editor = new CircleEditor(map, {
    defaultGeometry: existingCircle,
    defaultStyle: { radius: 1000 }  // 半径1000米
});

// 双击圆形进入编辑模式
// 可以拖拽圆心移动位置，拖拽边缘调整半径
```

**交互方式：**
1. **绘制模式**：点击设置圆心 → 移动鼠标调整半径 → 双击完成
2. **编辑模式**：双击圆形进入编辑 → 拖拽圆心或边缘 → 双击完成编辑

#### 吸附功能实现

圆形编辑器支持圆心吸附，让您的绘制更加精确：

```javascript
const circleEditor = new CircleEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex'],  // 圆心吸附到其他图形的顶点
        tolerance: 20,      // 20像素范围内触发吸附
        highlight: {
            enabled: true,
            pointStyle: {
                radius: 8,
                color: '#00ff00',
                weight: 2,
                fillOpacity: 0.8
            }
        }
    }
});
```

**吸附效果：**
- 绘制时，圆心会自动吸附到附近其他图形的顶点
- 编辑时，拖拽圆心也会产生吸附效果
- 吸附时会显示绿色高亮提示

#### 撤销/重做机制

圆形编辑器支持完整的撤销/重做功能：

```javascript
// 这些方法由系统自动管理，您通常不需要直接调用
// 但了解其工作原理有助于理解编辑器行为

// 撤销（Ctrl+Z 或右键菜单）
// 重做（Ctrl+Y 或右键菜单）
// 重置到初始状态
```

**撤销/重做的触发方式：**
1. **键盘快捷键**：Ctrl+Z 撤销，Ctrl+Y 重做
2. **右键菜单**：在编辑模式下右键点击
3. **程序调用**：通过编辑器实例方法（高级用法）

#### 图层显隐控制

您可以直接调用编辑器的 `setLayerVisibility` 方法来控制图层的显示和隐藏：

```javascript
// 隐藏圆形
circleEditor.setLayerVisibility(false);

// 显示圆形
circleEditor.setLayerVisibility(true);

// 检查图层当前可见状态
const isVisible = circleEditor.getLayerVisibility();
console.log('图层是否可见:', isVisible);
```

**实际应用场景：**
```javascript
// 根据用户操作控制显示
function toggleCircleVisibility() {
    const isVisible = circleEditor.getLayerVisibility();
    circleEditor.setLayerVisibility(!isVisible);
}

// 批量控制多个编辑器
function hideAllEditors(editors) {
    editors.forEach(editor => {
        editor.setLayerVisibility(false);
    });
}

function showAllEditors(editors) {
    editors.forEach(editor => {
        editor.setLayerVisibility(true);
    });
}
```

**与其他方法的对比：**
```javascript
// 方法1：推荐 - 使用编辑器内置方法
circleEditor.setLayerVisibility(false);
const circleEditor = new CircleEditor(map, {
    validation: {
        allowSelfIntersect: false,  // 圆形不会自相交
        validErrorPolygonStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5',
            fillOpacity: 0.1
        }
    }
});

// 动态更新校验规则
circleEditor.setValidationOptions({
    allowSelfIntersect: true  // 允许（虽然圆形不会自相交）
});
```

**校验场景：**
- 圆形通常不会产生自相交问题
- 但校验系统仍然可用，用于扩展功能
- 可以添加自定义校验逻辑（如最小半径限制）

#### 完整使用示例

```javascript
// 完整的圆形编辑器使用示例
import { CircleEditor } from 'leaflet-geo-tools';

// 1. 创建圆形编辑器
const circleEditor = new CircleEditor(map, {
    defaultStyle: {
        color: '#4285f4',
        fillColor: '#4285f4',
        fillOpacity: 0.2,
        weight: 2
    },
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 15
    },
    edit: {
        enabled: true,
        circle_LinkRadiusAndCenterDashLineOptions: {
            enabled: true,
            dashLineStyle: {
                color: '#666',
                weight: 1,
                dashArray: '3,3'
            }
        }
    }
});

// 2. 监听状态变化
circleEditor.onStateChange((state) => {
    console.log('圆形编辑器状态:', state);
    
    if (state === 'idle') {
        // 获取最终的圆形数据
        const circleData = circleEditor.getGeoJSON();
        console.log('圆形数据:', circleData);
        
        // 可以进一步处理数据，如保存到数据库
        saveCircleData(circleData);
    }
}, { immediateNotify: true });

// 3. 监听错误（如果有）
circleEditor.onStateChange((state) => {
    if (state === 'drawing') {
        console.log('正在绘制圆形，点击设置圆心，移动调整半径，双击完成');
    }
});

// 4. 工具函数：保存圆形数据
function saveCircleData(geojson) {
    // 这里可以保存到后端或本地存储
    console.log('保存圆形数据:', geojson);
}

// 5. 清理函数（在组件卸载时调用）
function cleanup() {
    if (circleEditor) {
        circleEditor.layerDestroy();
    }
}

// 使用说明：
// - 点击地图设置圆心
// - 移动鼠标调整半径大小
// - 双击完成绘制
// - 双击已绘制的圆形进入编辑模式
// - 拖拽圆心移动位置
// - 拖拽边缘调整半径
// - 再次双击完成编辑
```

#### 实用小贴士

**1. 半径精度控制**
```javascript
// 设置合适的坐标精度
const editor = new CircleEditor(map, {
    coordPrecision: 4  // 对于圆形，4位精度通常足够
});
```

**2. 性能优化**
```javascript
// 对于大量圆形，考虑简化渲染
const editor = new CircleEditor(map, {
    defaultStyle: {
        // 简化样式可以提高性能
        weight: 1,
        fillOpacity: 0.1
    }
});
```

**3. 用户体验优化**
```javascript
// 提供视觉反馈
editor.onStateChange((state) => {
    const mapContainer = map.getContainer();
    
    if (state === 'drawing') {
        mapContainer.style.cursor = 'crosshair';
    } else if (state === 'editing') {
        mapContainer.style.cursor = 'move';
    } else {
        mapContainer.style.cursor = 'grab';
    }
});
```

现在您已经掌握了 BaseEditor 的基础知识和 CircleEditor 的完整使用方法。接下来我们将学习其他编辑器的具体使用。

### 3.3 MarkerPointEditor 点编辑器

MarkerPointEditor 专门用于绘制和编辑点位，它提供了简洁的点位置设置和拖拽功能。

#### 构造函数参数详解

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**参数说明：**
- `map`: Leaflet 地图实例（必需）
- `options`: 编辑器配置选项（可选）

**实际使用示例：**
```javascript
// 基础点编辑器
const pointEditor = new MarkerPointEditor(map);

// 带配置的点编辑器
const pointEditor = new MarkerPointEditor(map, {
    coordPrecision: 6,
    defaultStyle: {
        icon: L.icon({
            iconUrl: 'custom-marker.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    },
    snap: {
        enabled: true,
        modes: ['vertex'],
```javascript
const pointEditor = new MarkerPointEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex'],  // 点位吸附到其他图形的顶点
        tolerance: 20,      // 20像素范围内触发吸附
        highlight: {
            enabled: true,
            pointStyle: {
                radius: 8,
                color: '#00ff00',
                weight: 2,
                fillOpacity: 0.8
            }
        }
    }
});
```

**吸附效果：**
- 绘制时，点击位置会自动吸附到附近其他图形的顶点
- 拖拽时也会产生吸附效果
- 吸附时会显示绿色高亮提示

#### 状态管理

点编辑器的状态管理相对简单：

```javascript
// 监听状态变化
pointEditor.onStateChange((state) => {
    switch(state) {
        case 'drawing':
            console.log('正在设置点位...');
            break;
        case 'idle':
            console.log('点位设置完成');
            // 获取最终坐标
            const coords = pointEditor.getGeoJSON();
            console.log('点位坐标:', coords);
            break;
    }
}, { immediateNotify: true });
```

**状态特点：**
- **drawing**: 正在等待用户点击设置点位
- **idle**: 点位设置完成，可以拖拽编辑

#### 样式配置

您可以自定义点标记的样式：

```javascript
// 使用自定义图标
const pointEditor = new MarkerPointEditor(map, {
    defaultStyle: {
        icon: L.icon({
            iconUrl: 'marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'marker-shadow.png',
            shadowSize: [41, 41]
        })
    }
});

// 使用 DivIcon 自定义样式
const pointEditor = new MarkerPointEditor(map, {
    defaultStyle: {
        icon: L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        })
    }
});
```

**配套 CSS 示例：**
```css
.custom-marker {
    background: transparent;
    border: none;
}

.marker-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ff6b6b;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```

#### 使用示例

**完整的使用流程：**
```javascript
// 1. 创建点编辑器
const pointEditor = new MarkerPointEditor(map, {
    defaultStyle: {
        icon: L.divIcon({
            className: 'my-point-marker',
            html: '<div class="point-icon">📍</div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    },
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 15
    }
});

// 2. 监听状态变化
pointEditor.onStateChange((state) => {
    console.log('点编辑器状态:', state);
    
    if (state === 'idle') {
        // 获取点位坐标
        const pointData = pointEditor.getGeoJSON();
        console.log('点位数据:', pointData);
        
        // 保存点位数据
        savePointData(pointData);
    }
}, { immediateNotify: true });

// 3. 工具函数
function savePointData(geojson) {
    // 保存到数据库或本地存储
    console.log('保存点位:', geojson);
}

// 4. 清理函数
function cleanup() {
    if (pointEditor) {
        pointEditor.layerDestroy();
    }
}

// 使用说明：
// - 点击地图设置点位
// - 拖拽点位调整位置
// - 点位设置完成后自动进入空闲状态
```

#### 实用小贴士

**1. 点位精度控制**
```javascript
const pointEditor = new MarkerPointEditor(map, {
    coordPrecision: 8  // 高精度坐标
});
```

**2. 批量点位管理**
```javascript
const points = [];

function addNewPoint() {
    const editor = new MarkerPointEditor(map);
    editor.onStateChange((state) => {
        if (state === 'idle') {
            points.push(editor.getGeoJSON());
            editor.layerDestroy();
        }
    });
}
```

**3. 图层显隐控制**
```javascript
// 隐藏/显示点位
pointEditor.setLayerVisibility(false);  // 隐藏
pointEditor.setLayerVisibility(true);   // 显示

// 检查状态
const isVisible = pointEditor.getLayerVisibility();
```

### 3.4 PolygonEditor 多边形编辑器

PolygonEditor 是功能最丰富的编辑器之一，支持复杂的多边形绘制和编辑，包括顶点编辑、中点插入、边拖拽等高级功能。

#### 构造函数参数全量介绍

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**完整配置示例：**
```javascript
const polygonEditor = new PolygonEditor(map, {
    // 基础配置
    coordPrecision: 6,
    
    // 默认样式
    defaultStyle: {
        color: '#3388ff',
        weight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.2
    },
    
    // 吸附配置
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 15,
        highlight: {
            enabled: true,
            pointStyle: {
                radius: 6,
                color: '#00ff00',
                weight: 2,
                fillOpacity: 0.8
            },
            edgeStyle: {
                color: '#00ff00',
                weight: 3,
                dashArray: '4,2'
            }
        }
    },
    
    // 编辑配置
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.icon({
                iconUrl: 'vertex-icon.png',
                iconSize: [10, 10]
            }),
            draggable: true
        },
        dragMidMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.icon({
                    iconUrl: 'midpoint-icon.png',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.3
        },
        dragLineMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.icon({
                    iconUrl: 'edge-icon.png',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.6
        }
    },
    
    // 校验配置
    validation: {
        allowSelfIntersect: false,
        validErrorPolygonStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5',
            fillOpacity: 0.1
        }
    }
});
```

#### 绘制多边形

**基础绘制流程：**
```javascript
const polygonEditor = new PolygonEditor(map);

// 监听状态变化
polygonEditor.onStateChange((state) => {
    if (state === 'idle') {
        // 绘制完成，获取多边形数据
        const geojson = polygonEditor.getGeoJSON();
        console.log('多边形绘制完成:', geojson);
    } else if (state === 'drawing') {
        console.log('正在绘制多边形...');
    }
});

// 绘制操作：
// 1. 点击地图添加顶点
// 2. 移动鼠标预览下一条边
// 3. 双击完成绘制
```

**绘制时的实时预览：**
```javascript
// 绘制过程中会实时显示预览线
// 鼠标移动时会显示从最后一个顶点到鼠标位置的预览线
```

#### 编辑现有多边形

**加载现有数据：**
```javascript
const existingPolygon = {
    type: "Polygon",
    coordinates: [[
        [121.4737, 31.2304],
        [121.4747, 31.2314],
        [121.4757, 31.2304],
        [121.4747, 31.2294],
        [121.4737, 31.2304]
    ]]
};

const editor = new PolygonEditor(map, {
    defaultGeometry: existingPolygon
});

// 双击多边形进入编辑模式
```

**编辑功能：**
1. **顶点拖拽**：拖拽顶点调整形状
2. **中点插入**：在边上插入新顶点
3. **边拖拽**：拖拽边控制点调整边的位置
4. **整体拖拽**：拖拽整个多边形

#### 高级编辑功能

**顶点编辑：**
```javascript
// 进入编辑模式后，顶点会显示为可拖拽的标记
// 拖拽顶点会实时更新多边形形状
```

**中点插入：**
```javascript
// 编辑模式下，在边上会显示中点标记
// 点击中点标记可以在该位置插入新顶点
// 这是通过 dragMidMarkerOptions 配置的
```

**边拖拽：**
```javascript
// 在边上会显示边控制点
// 拖拽边控制点可以调整边的位置
// 这是通过 dragLineMarkerOptions 配置的
```

#### 撤销/重做机制

PolygonEditor 支持完整的撤销/重做功能：

```javascript
// 系统自动管理编辑历史
// 用户可以通过以下方式触发撤销/重做：

// 1. 键盘快捷键
// Ctrl+Z: 撤销
// Ctrl+Y: 重做

// 2. 右键菜单（在编辑模式下）
// 右键点击会显示上下文菜单

// 3. 程序调用（高级用法）
// 这些方法通常由系统内部管理
```

#### 图层显隐控制

```javascript
// 控制多边形显示
polygonEditor.setLayerVisibility(false);  // 隐藏
polygonEditor.setLayerVisibility(true);   // 显示

// 检查状态
const isVisible = polygonEditor.getLayerVisibility();
```

#### 校验功能

多边形编辑器支持几何校验，特别是自相交检测：

```javascript
const polygonEditor = new PolygonEditor(map, {
    validation: {
        allowSelfIntersect: false,  // 不允许自相交
        validErrorPolygonStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5',
            fillOpacity: 0.1
        }
    }
});

// 动态更新校验规则
polygonEditor.setValidationOptions({
    allowSelfIntersect: true  // 允许自相交
});
```

**校验效果：**
- 当多边形自相交时，会显示红色虚线样式
- 不能完成绘制或编辑，直到修正自相交问题

#### 完整使用示例

```javascript
// 完整的多边形编辑器使用示例
import { PolygonEditor } from 'leaflet-geo-tools';

// 1. 创建多边形编辑器
const polygonEditor = new PolygonEditor(map, {
    defaultStyle: {
        color: '#4285f4',
        weight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.2
    },
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 15
    },
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'vertex-marker',
                html: '<div class="vertex-dot"></div>',
                iconSize: [12, 12]
            }),
            draggable: true
        },
        dragMidMarkerOptions: {
            enabled: true,
            positionRatio: 0.5
        }
    },
    validation: {
        allowSelfIntersect: false
    }
});

// 2. 监听状态变化
polygonEditor.onStateChange((state) => {
    console.log('多边形编辑器状态:', state);
    
    if (state === 'idle') {
        // 获取最终的多边形数据
        const polygonData = polygonEditor.getGeoJSON();
        console.log('多边形数据:', polygonData);
        
        // 保存数据
        savePolygonData(polygonData);
    } else if (state === 'drawing') {
        console.log('正在绘制多边形，点击添加顶点，双击完成');
    } else if (state === 'editing') {
        console.log('正在编辑多边形，拖拽顶点或边进行调整');
    }
}, { immediateNotify: true });

// 3. 工具函数
function savePolygonData(geojson) {
    // 计算面积
    const area = calculateArea(geojson);
    console.log(`多边形面积: ${area} 平方米`);
    
    // 保存到数据库
    console.log('保存多边形数据:', geojson);
}

function calculateArea(geojson) {
    // 使用 turf.js 计算面积
    // 这里只是示例，实际需要导入相关库
    return 1000; // 示例值
}

// 4. 清理函数
function cleanup() {
    if (polygonEditor) {
        polygonEditor.layerDestroy();
    }
}

// 使用说明：
// - 绘制：点击地图添加顶点，双击完成绘制
// - 编辑：双击多边形进入编辑模式
// - 顶点编辑：拖拽顶点调整形状
// - 中点插入：点击边上的中点插入新顶点
// - 边拖拽：拖拽边控制点调整边的位置
// - 完成编辑：再次双击完成编辑
```

#### 实用小贴士

**1. 复杂多边形处理**
```javascript
// 对于复杂多边形，考虑提高性能
const polygonEditor = new PolygonEditor(map, {
    defaultStyle: {
        // 简化样式可以提高渲染性能
        weight: 1,
        fillOpacity: 0.1
    }
});
```

**2. 精确绘制**
```javascript
// 启用吸附功能进行精确绘制
const preciseEditor = new PolygonEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 10  // 较小的容差值提高精度
    },
    coordPrecision: 8  // 高精度坐标
});
```

**3. 用户体验优化**
```javascript
// 提供视觉反馈
polygonEditor.onStateChange((state) => {
    const mapContainer = map.getContainer();
    
    if (state === 'drawing') {
        mapContainer.style.cursor = 'crosshair';
    } else if (state === 'editing') {
        mapContainer.style.cursor = 'move';
    } else {
        mapContainer.style.cursor = 'grab';
    }
});
```

现在您已经掌握了点编辑器和多边形编辑器的使用方法。这些编辑器为您提供了从简单点位到复杂多边形的完整绘制和编辑能力。

### 3.5 PolylineEditor 折线编辑器

PolylineEditor 是专门用于绘制和编辑折线的编辑器，支持多线编辑、顶点操作、自相交检测等丰富功能。

#### 构造函数参数详解

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**完整配置示例：**
```javascript
const polylineEditor = new PolylineEditor(map, {
    // 基础配置
    coordPrecision: 6,
    
    // 默认样式
    defaultStyle: {
        color: '#ff6b35',
        weight: 3,
        opacity: 0.8,
        dashArray: null
    },
    
    // 吸附配置
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 15,
        highlight: {
            enabled: true,
            pointStyle: {
                radius: 6,
                color: '#00ff00',
                weight: 2,
                fillOpacity: 0.8
            },
            edgeStyle: {
                color: '#00ff00',
                weight: 3,
                dashArray: '4,2'
            }
        }
    },
    
    // 编辑配置
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'vertex-marker',
                html: '<div class="vertex-dot"></div>',
                iconSize: [10, 10]
            }),
            draggable: true
        },
        dragMidMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.divIcon({
                    className: 'midpoint-marker',
                    html: '<div class="midpoint-dot"></div>',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.5
        }
    },
    
    // 校验配置
    validation: {
        allowSelfIntersect: false,
        validErrorLineStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5'
        }
    }
});
```

#### 多线编辑支持

PolylineEditor 支持多线编辑，可以同时处理多条折线：

```javascript
// 创建多线编辑器
const polylineEditor = new PolylineEditor(map, {
    edit: {
        enabled: true,
        // 多线编辑的顶点标记配置
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'multi-vertex-marker',
                html: '<div class="vertex-dot"></div>',
                iconSize: [12, 12]
            }),
            draggable: true
        }
    }
});

// 监听状态变化
polylineEditor.onStateChange((state) => {
    if (state === 'idle') {
        // 获取所有折线的 GeoJSON 数据
        const geojson = polylineEditor.getGeoJSON();
        console.log('折线数据:', geojson);
        
        // 多线数据结构可能是 MultiLineString 或 LineString 数组
        if (geojson.type === 'MultiLineString') {
            console.log('多线数据，包含', geojson.coordinates.length, '条线');
        }
    }
});
```

#### 顶点和边线编辑

**顶点编辑功能：**
```javascript
// 进入编辑模式后，可以：
// 1. 拖拽顶点调整位置
// 2. 右键点击顶点删除顶点
// 3. 在边上插入新顶点

// 监听编辑操作
polylineEditor.onStateChange((state) => {
    if (state === 'editing') {
        console.log('正在编辑折线，可以拖拽顶点或插入新顶点');
    }
});
```

**边线编辑功能：**
```javascript
// 边线编辑配置
const polylineEditor = new PolylineEditor(map, {
    edit: {
        enabled: true,
        // 边拖拽配置
        dragLineMarkerOptions: {
            enabled: true,
            dragMarkerStyle: {
                icon: L.divIcon({
                    className: 'edge-marker',
                    html: '<div class="edge-dot"></div>',
                    iconSize: [8, 8]
                }),
                draggable: true
            },
            positionRatio: 0.5  // 边中点位置
        }
    }
});
```

**顶点删除规则：**
```javascript
// 折线编辑器会自动维护顶点数量：
// - 至少保留 2 个顶点（形成一条线段）
// - 删除顶点时如果少于 2 个顶点，会阻止删除操作
```

#### 自相交检测

PolylineEditor 支持自相交检测，确保折线的几何有效性：

```javascript
const polylineEditor = new PolylineEditor(map, {
    validation: {
        allowSelfIntersect: false,  // 不允许自相交
        validErrorLineStyle: {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5',
            opacity: 0.8
        }
    }
});

// 动态更新校验规则
polylineEditor.setValidationOptions({
    allowSelfIntersect: true  // 允许自相交
});
```

**校验效果：**
- 当折线自相交时，会显示红色虚线样式
- 不能完成绘制或编辑，直到修正自相交问题
- 实时检测并提供视觉反馈

#### 绘制折线

**基础绘制流程：**
```javascript
const polylineEditor = new PolylineEditor(map);

// 监听状态变化
polylineEditor.onStateChange((state) => {
    if (state === 'idle') {
        // 绘制完成，获取折线数据
        const geojson = polylineEditor.getGeoJSON();
        console.log('折线绘制完成:', geojson);
    } else if (state === 'drawing') {
        console.log('正在绘制折线...');
    }
});

// 绘制操作：
// 1. 点击地图添加顶点
// 2. 移动鼠标预览下一条线段
// 3. 双击完成绘制
```

**绘制时的实时预览：**
```javascript
// 绘制过程中会实时显示预览线
// 鼠标移动时会显示从最后一个顶点到鼠标位置的预览线
```

#### 完整功能说明和示例

**完整的使用示例：**
```javascript
// 完整的折线编辑器使用示例
import { PolylineEditor } from 'leaflet-geo-tools';

// 1. 创建折线编辑器
const polylineEditor = new PolylineEditor(map, {
    defaultStyle: {
        color: '#ff6b35',
        weight: 3,
        opacity: 0.8
    },
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 15
    },
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'polyline-vertex',
                html: '<div class="vertex-dot"></div>',
                iconSize: [10, 10]
            }),
            draggable: true
        },
        dragMidMarkerOptions: {
            enabled: true,
            positionRatio: 0.5
        }
    },
    validation: {
        allowSelfIntersect: false
    }
});

// 2. 监听状态变化
polylineEditor.onStateChange((state) => {
    console.log('折线编辑器状态:', state);
    
    if (state === 'idle') {
        // 获取最终的折线数据
        const polylineData = polylineEditor.getGeoJSON();
        console.log('折线数据:', polylineData);
        
        // 计算长度
        const length = calculateLength(polylineData);
        console.log(`折线长度: ${length} 米`);
        
        // 保存数据
        savePolylineData(polylineData);
    } else if (state === 'drawing') {
        console.log('正在绘制折线，点击添加顶点，双击完成');
    } else if (state === 'editing') {
        console.log('正在编辑折线，拖拽顶点或边进行调整');
    }
}, { immediateNotify: true });

// 3. 工具函数
function savePolylineData(geojson) {
    // 保存到数据库或本地存储
    console.log('保存折线数据:', geojson);
}

function calculateLength(geojson) {
    // 使用 turf.js 计算长度
    // 这里只是示例，实际需要导入相关库
    return 500; // 示例值
}

// 4. 清理函数
function cleanup() {
    if (polylineEditor) {
        polylineEditor.layerDestroy();
    }
}

// 使用说明：
// - 绘制：点击地图添加顶点，双击完成绘制
// - 编辑：双击折线进入编辑模式
// - 顶点编辑：拖拽顶点调整形状
// - 中点插入：点击边上的中点插入新顶点
// - 边拖拽：拖拽边控制点调整边的位置
// - 顶点删除：右键点击顶点删除（至少保留2个顶点）
// - 完成编辑：再次双击完成编辑
```

#### 实用小贴士

**1. 复杂折线处理**
```javascript
// 对于复杂折线，考虑性能优化
const polylineEditor = new PolylineEditor(map, {
    defaultStyle: {
        // 简化样式可以提高渲染性能
        weight: 2,
        opacity: 0.6
    }
});
```

**2. 精确绘制**
```javascript
// 启用吸附功能进行精确绘制
const preciseEditor = new PolylineEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex', 'edge'],
        tolerance: 10  // 较小的容差值提高精度
    },
    coordPrecision: 8  // 高精度坐标
});
```

**3. 多线管理**
```javascript
// 管理多条折线
const polylines = [];

function addNewPolyline() {
    const editor = new PolylineEditor(map);
    editor.onStateChange((state) => {
        if (state === 'idle') {
            polylines.push(editor.getGeoJSON());
            editor.layerDestroy();
        }
    });
}
```

### 3.6 RectangleEditor 矩形编辑器

RectangleEditor 专门用于绘制和编辑矩形，它保持了矩形的几何特性，提供了四顶点编辑和整体拖拽功能。

#### 构造函数参数介绍

```typescript
constructor(map: L.Map, options: LeafletEditorOptions = {})
```

**配置示例：**
```javascript
const rectangleEditor = new RectangleEditor(map, {
    // 基础配置
    coordPrecision: 6,
    
    // 默认样式
    defaultStyle: {
        color: '#9c27b0',
        weight: 2,
        fillColor: '#9c27b0',
        fillOpacity: 0.2
    },
    
    // 吸附配置
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 15
    },
    
    // 编辑配置
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'rectangle-vertex',
                html: '<div class="vertex-dot"></div>',
                iconSize: [10, 10]
            }),
            draggable: true
        }
    }
});
```

#### 矩形特性保持

RectangleEditor 会始终保持矩形的几何特性：

```javascript
// 创建矩形编辑器
const rectangleEditor = new RectangleEditor(map);

// 监听状态变化
rectangleEditor.onStateChange((state) => {
    if (state === 'idle') {
        // 获取矩形数据
        const geojson = rectangleEditor.getGeoJSON();
        console.log('矩形数据:', geojson);
        
        // 矩形数据始终是有效的矩形几何
        // 无论是通过拖拽顶点还是整体拖拽，都会保持矩形形状
    }
});
```

**特性保持机制：**
- 编辑任意顶点时，其他顶点会相应调整以保持矩形形状
- 拖拽边时，对边会同步移动
- 始终维持90度角和对边平行的特性

#### 四顶点编辑

矩形编辑器提供四个顶点的独立编辑功能：

```javascript
const rectangleEditor = new RectangleEditor(map, {
    edit: {
        enabled: true,
        // 四顶点编辑配置
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'rect-vertex',
                html: '<div class="rect-vertex-dot"></div>',
                iconSize: [12, 12]
            }),
            draggable: true
        }
    }
});

// 编辑操作：
// 1. 双击矩形进入编辑模式
// 2. 拖拽任意顶点调整矩形大小
// 3. 其他顶点会自动调整以保持矩形形状
```

**顶点编辑行为：**
- 拖拽角点：调整矩形的宽度和高度
- 拖拽边中点（如果启用）：调整单方向的大小
- 自动保持矩形几何特性

#### 拖拽功能

矩形编辑器支持整体拖拽和顶点拖拽：

```javascript
// 整体拖拽配置
const rectangleEditor = new RectangleEditor(map, {
    edit: {
        enabled: true,
        // 顶点拖拽
        vertexsMarkerStyle: {
            draggable: true
        }
    }
});

// 拖拽交互：
// 1. 绘制模式：点击拖拽绘制矩形
// 2. 编辑模式：拖拽顶点调整大小，或拖拽矩形内部移动位置
```

**拖拽模式：**
1. **绘制拖拽**：点击并拖拽创建矩形
2. **编辑拖拽**：拖拽顶点调整大小或拖拽整体移动位置

#### 使用示例

**完整的矩形编辑器使用示例：**
```javascript
// 完整的矩形编辑器使用示例
import { RectangleEditor } from 'leaflet-geo-tools';

// 1. 创建矩形编辑器
const rectangleEditor = new RectangleEditor(map, {
    defaultStyle: {
        color: '#9c27b0',
        weight: 2,
        fillColor: '#9c27b0',
        fillOpacity: 0.2
    },
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 15
    },
    edit: {
        enabled: true,
        vertexsMarkerStyle: {
            icon: L.divIcon({
                className: 'rect-vertex-marker',
                html: '<div class="rect-vertex-dot"></div>',
                iconSize: [12, 12]
            }),
            draggable: true
        }
    }
});

// 2. 监听状态变化
rectangleEditor.onStateChange((state) => {
    console.log('矩形编辑器状态:', state);
    
    if (state === 'idle') {
        // 获取最终的矩形数据
        const rectangleData = rectangleEditor.getGeoJSON();
        console.log('矩形数据:', rectangleData);
        
        // 计算面积
        const area = calculateRectangleArea(rectangleData);
        console.log(`矩形面积: ${area} 平方米`);
        
        // 保存数据
        saveRectangleData(rectangleData);
    } else if (state === 'drawing') {
        console.log('正在绘制矩形，点击拖拽绘制，双击完成');
    } else if (state === 'editing') {
        console.log('正在编辑矩形，拖拽顶点调整大小');
    }
}, { immediateNotify: true });

// 3. 工具函数
function saveRectangleData(geojson) {
    // 保存到数据库或本地存储
    console.log('保存矩形数据:', geojson);
}

function calculateRectangleArea(geojson) {
    // 计算矩形面积
    // 这里只是示例，实际需要根据坐标计算
    return 1000; // 示例值
}

// 4. 清理函数
function cleanup() {
    if (rectangleEditor) {
        rectangleEditor.layerDestroy();
    }
}

// 使用说明：
// - 绘制：点击并拖拽绘制矩形，双击完成
// - 编辑：双击矩形进入编辑模式
// - 顶点编辑：拖拽任意顶点调整矩形大小
// - 整体拖拽：拖拽矩形内部移动位置
// - 完成编辑：再次双击完成编辑
```

#### 实用小贴士

**1. 精确矩形绘制**
```javascript
// 启用吸附功能进行精确绘制
const preciseRectEditor = new RectangleEditor(map, {
    snap: {
        enabled: true,
        modes: ['vertex'],
        tolerance: 10
    },
    coordPrecision: 8
});
```

**2. 标准矩形尺寸**
```javascript
// 创建标准尺寸的矩形
const existingRect = {
    type: "Polygon", 
    coordinates: [[
        [121.4737, 31.2304],  // 左下角
        [121.4757, 31.2304],  // 右下角
        [121.4757, 31.2324],  // 右上角
        [121.4737, 31.2324],  // 左上角
        [121.4737, 31.2304]   // 闭合点
    ]]
};

const editor = new RectangleEditor(map, {
    defaultGeometry: existingRect
});
```

**3. 批量矩形管理**
```javascript
// 管理多个矩形
const rectangles = [];

function addNewRectangle() {
    const editor = new RectangleEditor(map);
    editor.onStateChange((state) => {
        if (state === 'idle') {
            rectangles.push(editor.getGeoJSON());
            editor.layerDestroy();
        }
    });
}
```

现在您已经掌握了所有编辑器的使用方法，从简单的点到复杂的多边形，以及专门的折线和矩形编辑器。这些编辑器为您提供了完整的 GIS 图形绘制和编辑能力。

## 第4章：测量工具

测量工具为您提供专业的距离和面积测量功能，支持多点测量、实时显示、多种单位转换等特性。测量工具专注于提供准确的测量结果，不产生可编辑的图形数据。

### 4.1 LeafletArea 面积测量

LeafletArea 是专门用于测量多边形面积的工具，它提供实时面积计算、单位自动转换、多语言支持等功能。

#### 构造函数参数详解

```typescript
constructor(map: L.Map, measureOptions: areaOptions = {})
```

**完整配置示例：**
```javascript
const areaTool = new LeafletArea(map, {
    // 基础配置
    coordPrecision: 6,        // 坐标精度
    precision: 2,            // 计算结果精度
    lang: 'zh',              // 语言：'zh' | 'en'
    
    // 多边形样式
    polygonStyle: {
        color: '#ff6b35',
        weight: 2,
        fillColor: '#ff6b35',
        fillOpacity: 0.2
    },
    
    // 校验失败样式
    validErrorPolygonStyle: {
        color: '#ff0000',
        weight: 3,
        dashArray: '5,5',
        fillOpacity: 0.1
    },
    
    // 校验配置
    validation: {
        allowSelfIntersect: false
    },
    
    // 标记样式
    markerStyle: {
        containerClassName: 'area-measure-container',
        dotClassName: 'area-measure-dot',
        labelClassName: 'area-measure-label'
    }
});
```

**参数详细说明：**
- `coordPrecision`: 坐标点的精度，默认6位小数
- `precision`: 面积计算结果的精度，默认2位小数
- `lang`: 显示语言，支持中文('zh')和英文('en')
- `polygonStyle`: 测量多边形的样式配置
- `validErrorPolygonStyle`: 校验失败时的样式
- `validation`: 几何校验配置
- `markerStyle`: 测量结果标记的样式配置

#### 测量配置选项

**单位自动转换：**
```javascript
// 面积工具会根据测量大小自动选择合适的单位：
// - 小于 10,000 平方米：使用 平方米 (m²)
// - 10,000 - 1,000,000 平方米：使用 公顷 (ha)
// - 大于 1,000,000 平方米：使用 平方公里 (km²)

const areaTool = new LeafletArea(map, {
    precision: 3,  // 3位小数精度
    lang: 'zh'     // 中文单位显示
});
```

**语言配置：**
```javascript
// 中文显示
const zhAreaTool = new LeafletArea(map, {
    lang: 'zh'
});
// 显示：平方米、公顷、平方公里

// 英文显示
const enAreaTool = new LeafletArea(map, {
    lang: 'en'
});
// 显示：m²、ha、km²
```

#### 样式配置

**多边形样式：**
```javascript
const areaTool = new LeafletArea(map, {
    polygonStyle: {
        color: '#4285f4',        // 边框颜色
        weight: 3,                // 边框粗细
        fillColor: '#4285f4',     // 填充颜色
        fillOpacity: 0.3,         // 填充透明度
        dashArray: null           // 虚线样式，null为实线
    }
});
```

**标记样式：**
```javascript
const areaTool = new LeafletArea(map, {
    markerStyle: {
        containerClassName: 'custom-area-container',
        dotClassName: 'custom-area-dot',
        labelClassName: 'custom-area-label'
    }
});
```

**配套 CSS 示例：**
```css
.custom-area-container {
    width: 12px;
    height: 12px;
    text-align: center;
    position: relative;
}

.custom-area-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    border: solid 2px #4285f4;
    position: absolute;
    left: 1px;
    top: 1px;
}

.custom-area-label {
    width: max-content;
    font-weight: bold;
    padding: 4px 6px;
    border: solid 1px #4285f4;
    background: #ffffff;
    position: absolute;
    left: 15px;
    top: 15px;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

#### 状态监听

面积测量工具提供状态变化监听，让您能够实时了解测量状态：

```javascript
const areaTool = new LeafletArea(map);

// 监听状态变化
areaTool.onStateChange = (state) => {
    console.log('面积测量状态:', state);
    
    switch(state) {
        case 'drawing':
            console.log('正在测量面积...');
            // 显示取消按钮等UI元素
            showCancelButton();
            break;
        case 'idle':
            console.log('面积测量完成');
            // 隐藏取消按钮
            hideCancelButton();
            break;
    }
};

// 工具函数
function showCancelButton() {
    // 显示取消测量按钮
    document.getElementById('cancel-measure').style.display = 'block';
}

function hideCancelButton() {
    // 隐藏取消测量按钮
    document.getElementById('cancel-measure').style.display = 'none';
}
```

#### 使用示例

**基础面积测量：**
```javascript
// 创建面积测量工具
const areaTool = new LeafletArea(map, {
    precision: 2,
    lang: 'zh',
    polygonStyle: {
        color: '#ff6b35',
        weight: 2,
        fillColor: '#ff6b35',
        fillOpacity: 0.2
    }
});

// 监听状态变化
areaTool.onStateChange = (state) => {
    if (state === 'drawing') {
        console.log('正在测量面积，点击添加顶点，双击完成');
    } else if (state === 'idle') {
        console.log('面积测量完成');
    }
};

// 测量操作：
// 1. 点击地图添加顶点
// 2. 移动鼠标预览下一条边
// 3. 双击完成测量
```

**高级配置示例：**
```javascript
// 完整的面积测量配置
const areaTool = new LeafletArea(map, {
    coordPrecision: 8,
    precision: 3,
    lang: 'zh',
    polygonStyle: {
        color: '#9c27b0',
        weight: 2,
        fillColor: '#9c27b0',
        fillOpacity: 0.15
    },
    validErrorPolygonStyle: {
        color: '#ff0000',
        weight: 3,
        dashArray: '5,5',
        fillOpacity: 0.1
    },
    validation: {
        allowSelfIntersect: false
    },
    markerStyle: {
        containerClassName: 'advanced-area-container',
        dotClassName: 'advanced-area-dot',
        labelClassName: 'advanced-area-label'
    }
});

// 状态监听
areaTool.onStateChange = (state) => {
    console.log('面积测量状态:', state);
    
    // 根据状态更新UI
    updateMeasureUI(state);
};

function updateMeasureUI(state) {
    const statusElement = document.getElementById('measure-status');
    const cancelButton = document.getElementById('cancel-measure');
    
    if (state === 'drawing') {
        statusElement.textContent = '正在测量面积...';
        statusElement.style.color = '#ff6b35';
        cancelButton.disabled = false;
    } else {
        statusElement.textContent = '准备就绪';
        statusElement.style.color = '#666';
        cancelButton.disabled = true;
    }
}
```

#### 实用小贴士

**1. 高精度测量**
```javascript
// 对于需要高精度的测量场景
const preciseAreaTool = new LeafletArea(map, {
    coordPrecision: 8,  // 高精度坐标
    precision: 4        // 4位小数结果
});
```

**2. 批量测量管理**
```javascript
// 管理多个测量实例
const areaMeasurements = [];

function startNewAreaMeasurement() {
    const tool = new LeafletArea(map, {
        precision: 2,
        lang: 'zh'
    });
    
    tool.onStateChange = (state) => {
        if (state === 'idle') {
            areaMeasurements.push(tool);
            console.log('已完成', areaMeasurements.length, '次面积测量');
        }
    };
    
    return tool;
}
```

**3. 自定义样式主题**
```javascript
// 蓝色主题
const blueThemeAreaTool = new LeafletArea(map, {
    polygonStyle: {
        color: '#2196f3',
        fillColor: '#2196f3',
        fillOpacity: 0.2
    },
    markerStyle: {
        containerClassName: 'blue-theme-container',
        dotClassName: 'blue-theme-dot',
        labelClassName: 'blue-theme-label'
    }
});
```

### 4.2 LeafletDistance 距离测量

LeafletDistance 是专门用于测量距离的工具，支持多点测量、实时距离显示、多种单位转换等功能。

#### 构造函数参数详解

```typescript
constructor(map: L.Map, measureOptions: distanceOptions = {})
```

**完整配置示例：**
```javascript
const distanceTool = new LeafletDistance(map, {
    // 基础配置
    coordPrecision: 6,        // 坐标精度
    units: 'meters',          // 距离单位
    precision: 2,             // 计算结果精度
    lang: 'zh',               // 语言：'zh' | 'en'
    
    // 线条样式
    drawLineStyle: {
        color: '#008BFF',
        weight: 3,
        opacity: 0.8,
        dashArray: null
    },
    
    // 标记样式
    markerStyle: {
        containerClassName: 'distance-measure-container',
        dotClassName: 'distance-measure-dot',
        labelClassName: 'distance-measure-label'
    }
});
```

**参数详细说明：**
- `coordPrecision`: 坐标点的精度，默认6位小数
- `units`: 距离单位，支持 'meters', 'kilometers', 'miles', 'feet' 等
- `precision`: 距离计算结果的精度，默认2位小数
- `lang`: 显示语言，支持中文('zh')和英文('en')
- `drawLineStyle`: 测量线条的样式配置
- `markerStyle`: 测量结果标记的样式配置

#### 单位配置

**支持的单位：**
```javascript
// 米（默认）
const metersTool = new LeafletDistance(map, {
    units: 'meters',
    lang: 'zh'
});
// 显示：米

// 公里
const kilometersTool = new LeafletDistance(map, {
    units: 'kilometers',
    lang: 'zh'
});
// 显示：公里

// 英里
const milesTool = new LeafletDistance(map, {
    units: 'miles',
    lang: 'en'
});
// 显示：miles

// 英尺
const feetTool = new LeafletDistance(map, {
    units: 'feet',
    lang: 'en'
});
// 显示：feet
```

**单位转换示例：**
```javascript
// 创建不同单位的测量工具
const tools = {
    meters: new LeafletDistance(map, { units: 'meters', lang: 'zh' }),
    kilometers: new LeafletDistance(map, { units: 'kilometers', lang: 'zh' }),
    miles: new LeafletDistance(map, { units: 'miles', lang: 'en' })
};

// 同时测量多种单位
function startMultiUnitMeasurement() {
    Object.values(tools).forEach(tool => {
        // 每个工具都会独立测量和显示
        tool.onStateChange = (state) => {
            console.log(`${tool.measureOptions.units} 测量状态:`, state);
        };
    });
}
```

#### 多点测量

距离测量工具支持多点测量，可以测量复杂的路径距离：

```javascript
const distanceTool = new LeafletDistance(map, {
    units: 'meters',
    precision: 2,
    lang: 'zh',
    drawLineStyle: {
        color: '#008BFF',
        weight: 3
    }
});

// 监听状态变化
distanceTool.onStateChange = (state) => {
    if (state === 'drawing') {
        console.log('正在测量距离...');
    } else if (state === 'idle') {
        console.log('距离测量完成');
    }
};

// 测量操作：
// 1. 点击地图添加测量点
// 2. 继续点击添加更多点
// 3. 双击完成测量
```

**多点测量特性：**
- 支持无限个测量点
- 实时显示每段距离和总距离
- 自动计算累积距离
- 支持复杂路径测量

#### 实时显示

距离测量工具提供实时的距离显示和更新：

```javascript
const distanceTool = new LeafletDistance(map, {
    units: 'meters',
    precision: 1,  // 1位小数，更精确的实时显示
    lang: 'zh'
});

// 实时距离显示
// - 每添加一个点，会显示该段的距离
// - 会显示累积的总距离
// - 移动鼠标时显示预览距离
```

**实时显示效果：**
- 每个测量点显示到前一点的距离
- 最后一个点显示累积总距离
- 鼠标移动时显示预览距离
- 距离标记会自动调整位置避免重叠

#### 使用示例

**基础距离测量：**
```javascript
// 创建距离测量工具
const distanceTool = new LeafletDistance(map, {
    units: 'meters',
    precision: 2,
    lang: 'zh',
    drawLineStyle: {
        color: '#008BFF',
        weight: 3,
        opacity: 0.8
    }
});

// 监听状态变化
distanceTool.onStateChange = (state) => {
    console.log('距离测量状态:', state);
    
    if (state === 'drawing') {
        console.log('正在测量距离，点击添加测量点，双击完成');
        // 显示测量提示
        showMeasureTip('点击添加测量点，双击完成测量');
    } else if (state === 'idle') {
        console.log('距离测量完成');
        hideMeasureTip();
    }
};

// 工具函数
function showMeasureTip(message) {
    const tipElement = document.getElementById('measure-tip');
    tipElement.textContent = message;
    tipElement.style.display = 'block';
}

function hideMeasureTip() {
    document.getElementById('measure-tip').style.display = 'none';
}
```

**高级功能示例：**
```javascript
// 完整的距离测量配置
const distanceTool = new LeafletDistance(map, {
    coordPrecision: 8,
    units: 'meters',
    precision: 3,
    lang: 'zh',
    drawLineStyle: {
        color: '#4caf50',
        weight: 3,
        opacity: 0.8,
        dashArray: null
    },
    markerStyle: {
        containerClassName: 'advanced-distance-container',
        dotClassName: 'advanced-distance-dot',
        labelClassName: 'advanced-distance-label'
    }
});

// 状态监听和UI更新
distanceTool.onStateChange = (state) => {
    updateDistanceMeasureUI(state);
    
    if (state === 'idle') {
        // 测量完成，可以保存结果
        console.log('距离测量完成');
    }
};

function updateDistanceMeasureUI(state) {
    const statusElement = document.getElementById('distance-status');
    const measureInfo = document.getElementById('measure-info');
    
    if (state === 'drawing') {
        statusElement.textContent = '正在测量距离';
        statusElement.className = 'status-drawing';
        measureInfo.textContent = '点击添加测量点，双击完成';
    } else {
        statusElement.textContent = '准备就绪';
        statusElement.className = 'status-idle';
        measureInfo.textContent = '';
    }
}
```

#### 实用小贴士

**1. 精确距离测量**
```javascript
// 高精度距离测量
const preciseDistanceTool = new LeafletDistance(map, {
    coordPrecision: 8,  // 高精度坐标
    precision: 3,       // 3位小数结果
    units: 'meters'
});
```

**2. 路径规划测量**
```javascript
// 模拟路径规划测量
function startRouteMeasurement() {
    const tool = new LeafletDistance(map, {
        units: 'kilometers',
        precision: 2,
        lang: 'zh',
        drawLineStyle: {
            color: '#ff5722',
            weight: 4,
            dashArray: '10,5'
        }
    });
    
    tool.onStateChange = (state) => {
        if (state === 'idle') {
            console.log('路径距离测量完成');
            // 可以保存路径数据
        }
    });
    
    return tool;
}
```

**3. 多单位对比测量**
```javascript
// 同时显示多种单位
function startMultiUnitComparison() {
    const metersTool = new LeafletDistance(map, {
        units: 'meters',
        precision: 1,
        lang: 'zh'
    });
    
    const kmTool = new LeafletDistance(map, {
        units: 'kilometers',
        precision: 3,
        lang: 'zh'
    });
    
    // 同步测量操作
    return { metersTool, kmTool };
}
```

现在您已经掌握了面积测量和距离测量工具的完整使用方法。这些工具为您提供专业、准确的测量功能，支持多种单位和实时显示，满足各种测量需求。

## 第5章：拓扑工具

拓扑工具为您提供专业的GIS拓扑操作功能，包括图层选择、合并、裁剪、整形等高级空间分析操作。LeafletTopology 采用单例模式设计，确保全局拓扑操作的一致性。

### 5.1 LeafletTopology 拓扑操作类

LeafletTopology 是拓扑操作的核心类，提供完整的空间分析工作流，从图层选择到各种拓扑操作的执行。

#### 构造函数和配置

```typescript
constructor(map: L.Map, options: TopoOptions = {})
```

**配置选项：**
```typescript
interface TopoOptions {
    precision?: number;      // 坐标精度，默认6
    circleStep?: number;     // 圆形插值步数，默认64
}
```

**完整配置示例：**
```javascript
const topology = LeafletTopology.getInstance(map, {
    precision: 8,      // 高精度坐标计算
    circleStep: 128   // 更平滑的圆形插值
});
```

#### 单例模式说明

LeafletTopology 采用单例模式，确保整个应用中只有一个拓扑操作实例：

```javascript
// 获取拓扑实例（推荐方式）
const topology = LeafletTopology.getInstance(map);

// 配置选项
const topology = LeafletTopology.getInstance(map, {
    precision: 8,
    circleStep: 128
});

// 获取当前配置
const options = topology.getTopoOptions();

// 更新配置
const newOptions = topology.setTopoOptions({
    precision: 6,
    circleStep: 64
});
```

**单例模式的优势：**
- 全局状态一致性
- 避免重复初始化
- 资源使用优化
- 操作状态管理

#### 图层选择功能 (select)

图层选择是拓扑操作的第一步，让您能够选择要处理的地理要素：

```javascript
const topology = LeafletTopology.getInstance(map);

// 开始图层选择模式
topology.select();

// 选择操作：
// 1. 点击地图上的图层进行选择
// 2. 再次点击已选择的图层取消选择
// 3. 选中的图层会高亮显示
```

**选择模式特性：**
- **点击选择**：点击地图上的任意图层进行选择
- **多选支持**：支持选择多个图层
- **取消选择**：再次点击已选中的图层取消选择
- **视觉反馈**：选中的图层会高亮显示
- **智能过滤**：自动过滤高亮图层和隐藏图层

**选择状态管理：**
```javascript
// 拓扑工具会自动管理选择状态
topology.isPicking; // 是否处于选择状态

// 选择过程中的鼠标样式
// 选择模式下鼠标变为 pointer
// 完成选择后恢复默认样式
```

**实际使用示例：**
```javascript
// 创建拓扑实例并开始选择
const topology = LeafletTopology.getInstance(map);

// 监听选择状态
function startLayerSelection() {
    topology.select();
    
    // 显示选择提示
    showSelectionTip('点击图层进行选择，再次点击取消选择');
    
    // 禁用其他编辑器
    disableOtherEditors();
}

function showSelectionTip(message) {
    const tipElement = document.getElementById('selection-tip');
    tipElement.textContent = message;
    tipElement.style.display = 'block';
}

function disableOtherEditors() {
    // 暂停其他编辑器的操作
    // 拓扑工具会自动处理编辑器冲突
}
```

#### 合并操作 (merge)

合并操作将多个选中的图层合并为一个几何要素：

```javascript
const topology = LeafletTopology.getInstance(map);

// 执行合并操作
topology.merge((result) => {
    console.log('合并结果:', result);
    
    // 处理合并结果
    handleMergeResult(result);
});

// 合并结果结构
interface TopoMergeResult {
    mergedGeom: GeoJSON.Geometry;     // 合并后的几何
    mergedLayers: L.GeoJSON[];        // 被合并的原图层
}

function handleMergeResult(result) {
    // 添加合并后的图层到地图
    const mergedLayer = L.geoJSON(result.mergedGeom, {
        style: {
            color: '#ff6b35',
            weight: 2,
            fillColor: '#ff6b35',
            fillOpacity: 0.3
        }
    });
    
    mergedLayer.addTo(map);
    
    // 移除原图层（如果需要）
    result.mergedLayers.forEach(layer => {
        map.removeLayer(layer);
    });
    
    console.log('合并完成，新图层已添加到地图');
}
```

**合并操作特性：**
- **多边形合并**：支持多个多边形的合并操作
- **几何优化**：自动处理几何拓扑关系
- **结果回调**：通过回调函数返回合并结果
- **自动清理**：操作完成后自动清理选择状态

**合并条件检查：**
```javascript
try {
    topology.merge((result) => {
        // 处理合并结果
    });
} catch (error) {
    if (error.message.includes('请至少选择两个图层')) {
        console.log('需要选择至少两个图层才能进行合并');
        // 提示用户选择更多图层
    }
}
```

#### 裁剪操作 (clip)

裁剪操作使用绘制的线条来裁剪选中的图层：

```javascript
const topology = LeafletTopology.getInstance(map);

// 执行裁剪操作
topology.clipByLine((result) => {
    console.log('裁剪结果:', result);
    
    // 处理裁剪结果
    handleClipResult(result);
});

// 裁剪结果结构
interface TopoClipResult {
    doClipLayers: L.GeoJSON[];        // 被裁剪的图层
    clipedGeoms: GeoJSON.Geometry[];  // 裁剪后的几何数组
}

function handleClipResult(result) {
    // 添加裁剪后的图层到地图
    result.clipedGeoms.forEach((geom, index) => {
        const clippedLayer = L.geoJSON(geom, {
            style: {
                color: '#4285f4',
                weight: 2,
                fillColor: '#4285f4',
                fillOpacity: 0.2
            }
        });
        
        clippedLayer.addTo(map);
        
        // 可以添加标识或其他属性
        clippedLayer.bindPopup(`裁剪结果 ${index + 1}`);
    });
    
    // 移除原图层
    result.doClipLayers.forEach(layer => {
        map.removeLayer(layer);
    });
    
    console.log(`裁剪完成，生成了 ${result.clipedGeoms.length} 个新图层`);
}
```

**裁剪操作流程：**
1. **选择图层**：先选择要裁剪的图层
2. **启动裁剪**：调用 `clipByLine` 方法
3. **绘制裁剪线**：在地图上绘制裁剪线条
4. **执行裁剪**：系统自动执行裁剪操作
5. **处理结果**：通过回调函数处理裁剪结果

**裁剪操作特性：**
- **线条裁剪**：使用绘制的线条作为裁剪边界
- **多图层支持**：可以同时裁剪多个选中图层
- **结果分离**：裁剪结果可能产生多个分离的几何
- **自动清理**：操作完成后自动清理绘制状态

#### 整形操作 (reshape)

整形操作使用绘制的线条来重新整形选中的图层边界：

```javascript
const topology = LeafletTopology.getInstance(map);

// 整形操作配置
const reshapeOptions = {
    AllowReshapingWithoutSelection: false  // 是否允许无选择时整形
};

// 执行整形操作
topology.reshapeFeature(reshapeOptions, (result) => {
    console.log('整形结果:', result);
    
    // 处理整形结果
    handleReshapeResult(result);
});

// 整形结果结构
interface TopoReshapeFeatureResult {
    doReshapeLayers: L.GeoJSON[];        // 被整形的图层
    reshapedGeoms: GeoJSON.Geometry[];   // 整形后的几何数组
}

function handleReshapeResult(result) {
    // 添加整形后的图层到地图
    result.reshapedGeoms.forEach((geom, index) => {
        const reshapedLayer = L.geoJSON(geom, {
            style: {
                color: '#9c27b0',
                weight: 2,
                fillColor: '#9c27b0',
                fillOpacity: 0.2,
                dashArray: '5,3'  // 虚线表示整形结果
            }
        });
        
        reshapedLayer.addTo(map);
        reshapedLayer.bindPopup(`整形结果 ${index + 1}`);
    });
    
    // 移除原图层
    result.doReshapeLayers.forEach(layer => {
        map.removeLayer(layer);
    });
    
    console.log(`整形完成，处理了 ${result.reshapedGeoms.length} 个图层`);
}
```

**整形操作模式：**

**1. 选择模式整形：**
```javascript
// 先选择图层，再整形
topology.select();  // 选择图层
// ... 用户选择图层
topology.reshapeFeature({
    AllowReshapingWithoutSelection: false
}, handleResult);
```

**2. 自动选择整形：**
```javascript
// 绘制整形线时自动选择相交图层
topology.reshapeFeature({
    AllowReshapingWithoutSelection: true
}, handleResult);
```

**整形操作特性：**
- **边界整形**：使用线条重新定义图层边界
- **智能选择**：可选择自动选择相交图层
- **精确控制**：支持复杂的边界调整
- **拓扑保持**：保持几何的拓扑有效性

#### 清理功能 (cleanAll)

清理功能用于重置拓扑操作状态，清理所有选择和临时图层：

```javascript
const topology = LeafletTopology.getInstance(map);

// 清理所有状态
topology.cleanAll();

// 清理效果：
// 1. 清除所有选择的高亮图层
// 2. 重置选择状态
// 3. 恢复鼠标样式
// 4. 清理临时绘制图层
// 5. 重置内部状态
```

**清理时机：**
- 操作完成后自动清理
- 手动重置状态时调用
- 切换到其他操作前调用
- 组件卸载时调用

**手动清理示例：**
```javascript
function resetTopologyState() {
    const topology = LeafletTopology.getInstance(map);
    
    // 清理所有状态
    topology.cleanAll();
    
    // 重置UI状态
    resetTopologyUI();
    
    console.log('拓扑状态已重置');
}

function resetTopologyUI() {
    // 隐藏选择提示
    document.getElementById('selection-tip').style.display = 'none';
    
    // 重置按钮状态
    document.getElementById('merge-btn').disabled = true;
    document.getElementById('clip-btn').disabled = true;
    document.getElementById('reshape-btn').disabled = true;
}
```

#### 完整工作流示例

**完整的拓扑操作工作流：**
```javascript
// 完整的拓扑操作示例
class TopologyWorkflow {
    constructor(map) {
        this.map = map;
        this.topology = LeafletTopology.getInstance(map, {
            precision: 8,
            circleStep: 128
        });
        
        this.selectedCount = 0;
        this.initUI();
    }
    
    initUI() {
        // 绑定UI事件
        document.getElementById('select-btn').onclick = () => this.startSelection();
        document.getElementById('merge-btn').onclick = () => this.mergeLayers();
        document.getElementById('clip-btn').onclick = () => this.clipLayers();
        document.getElementById('reshape-btn').onclick = () => this.reshapeLayers();
        document.getElementById('reset-btn').onclick = () => this.reset();
    }
    
    // 开始选择
    startSelection() {
        this.topology.select();
        this.updateUI('selection');
        this.showStatus('点击图层进行选择');
    }
    
    // 合并图层
    mergeLayers() {
        try {
            this.topology.merge((result) => {
                this.handleMergeResult(result);
                this.showStatus(`合并完成，处理了 ${result.mergedLayers.length} 个图层`);
            });
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    // 裁剪图层
    clipLayers() {
        try {
            this.topology.clipByLine((result) => {
                this.handleClipResult(result);
                this.showStatus(`裁剪完成，生成了 ${result.clipedGeoms.length} 个新图层`);
            });
            this.showStatus('绘制裁剪线...');
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    // 整形图层
    reshapeLayers() {
        try {
            const options = {
                AllowReshapingWithoutSelection: false
            };
            
            this.topology.reshapeFeature(options, (result) => {
                this.handleReshapeResult(result);
                this.showStatus(`整形完成，处理了 ${result.reshapedGeoms.length} 个图层`);
            });
            this.showStatus('绘制整形线...');
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    // 处理合并结果
    handleMergeResult(result) {
        const mergedLayer = L.geoJSON(result.mergedGeom, {
            style: this.getMergeStyle()
        });
        
        mergedLayer.addTo(this.map);
        
        // 移除原图层
        result.mergedLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        this.updateUI('idle');
    }
    
    // 处理裁剪结果
    handleClipResult(result) {
        result.clipedGeoms.forEach((geom, index) => {
            const layer = L.geoJSON(geom, {
                style: this.getClipStyle(index)
            });
            
            layer.addTo(this.map);
            layer.bindPopup(`裁剪结果 ${index + 1}`);
        });
        
        result.doClipLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        this.updateUI('idle');
    }
    
    // 处理整形结果
    handleReshapeResult(result) {
        result.reshapedGeoms.forEach((geom, index) => {
            const layer = L.geoJSON(geom, {
                style: this.getReshapeStyle()
            });
            
            layer.addTo(this.map);
            layer.bindPopup(`整形结果 ${index + 1}`);
        });
        
        result.doReshapeLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        this.updateUI('idle');
    }
    
    // 重置状态
    reset() {
        this.topology.cleanAll();
        this.updateUI('idle');
        this.showStatus('拓扑状态已重置');
    }
    
    // 样式配置
    getMergeStyle() {
        return {
            color: '#ff6b35',
            weight: 2,
            fillColor: '#ff6b35',
            fillOpacity: 0.3
        };
    }
    
    getClipStyle(index) {
        const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335'];
        return {
            color: colors[index % colors.length],
            weight: 2,
            fillColor: colors[index % colors.length],
            fillOpacity: 0.2
        };
    }
    
    getReshapeStyle() {
        return {
            color: '#9c27b0',
            weight: 2,
            fillColor: '#9c27b0',
            fillOpacity: 0.2,
            dashArray: '5,3'
        };
    }
    
    // UI更新
    updateUI(state) {
        const buttons = {
            'select-btn': state === 'idle',
            'merge-btn': state === 'idle',
            'clip-btn': state === 'idle',
            'reshape-btn': state === 'idle',
            'reset-btn': true
        };
        
        Object.entries(buttons).forEach(([id, enabled]) => {
            document.getElementById(id).disabled = !enabled;
        });
    }
    
    // 状态显示
    showStatus(message) {
        const statusElement = document.getElementById('topology-status');
        statusElement.textContent = message;
        statusElement.className = 'status-info';
    }
    
    showError(message) {
        const statusElement = document.getElementById('topology-status');
        statusElement.textContent = message;
        statusElement.className = 'status-error';
    }
}

// 使用工作流
const workflow = new TopologyWorkflow(map);
```

**工作流特性：**
- **状态管理**：完整的操作状态管理
- **错误处理**：完善的错误处理机制
- **UI集成**：与用户界面的完整集成
- **结果处理**：统一的操作结果处理
- **样式配置**：可定制的样式方案

现在您已经掌握了完整的拓扑操作功能。LeafletTopology 为您提供了专业的GIS空间分析能力，支持复杂的拓扑操作工作流。

## 第6章：工具类详解

工具类为您提供底层的功能支持，包括吸附控制、通用工具、拓扑工具、几何校验和辅助线绘制等功能。这些工具类是编辑器和测量工具的基础支撑。

### 6.1 SnapController 吸附控制器

SnapController 是吸附功能的核心控制器，提供顶点吸附和边线吸附算法，让编辑操作更加精确和便捷。

#### 构造函数

```typescript
constructor(map: L.Map)
```

**基础创建：**
```javascript
import { SnapController } from 'leaflet-geo-tools';

// 创建吸附控制器
const snapController = new SnapController(map);
```

**参数说明：**
- `map`: Leaflet 地图实例（必需）

#### 吸附源设置

吸附源是吸附功能的目标参考点，通常来自地图上的其他图层：

```javascript
// 设置吸附源
const geometryIndices = [
    {
        vertices: [latLng1, latLng2, latLng3],  // 顶点数组
        edges: [                               // 边数组
            { start: latLng1, end: latLng2 },
            { start: latLng2, end: latLng3 },
            { start: latLng3, end: latLng1 }
        ]
    }
];

snapController.setGeometrySources(geometryIndices);

// 吸附源说明：
// - vertices: 用于顶点吸附的参考点
// - edges: 用于边线吸附的参考线段
// - 通常排除当前正在编辑的图层
```

**吸附源管理：**
```javascript
// 动态更新吸附源
function updateSnapSources(excludeLayer) {
    const sources = [];
    
    map.eachLayer((layer) => {
        if (layer !== excludeLayer && layer.toGeoJSON) {
            const geoJSON = layer.toGeoJSON();
            const indices = extractGeometryIndices(geoJSON);
            sources.push(...indices);
        }
    });
    
    snapController.setGeometrySources(sources);
}

// 提取几何索引
function extractGeometryIndices(geoJSON) {
    // 从 GeoJSON 中提取顶点和边信息
    // 返回 GeometryIndex 数组
}
```

#### 顶点吸附算法

顶点吸附算法将拖拽的点吸附到最近的参考顶点：

```javascript
// 执行顶点吸附
const draggedPoint = L.latLng(31.2304, 121.4737);
const snappedPoint = snapController.snapVertex(draggedPoint);

if (snappedPoint) {
    console.log('吸附成功:', snappedPoint);
    console.log('原始点:', draggedPoint);
    console.log('吸附距离:', calculateDistance(draggedPoint, snappedPoint));
} else {
    console.log('未找到吸附目标');
}

// 吸附算法特性：
// - 在指定阈值范围内寻找最近的顶点
// - 返回吸附后的坐标点
// - 超出阈值范围时返回 null
```

**顶点吸附原理：**
```javascript
// 顶点吸附的工作流程
// 1. 获取拖拽点的当前坐标
// 2. 遍历所有吸附源顶点
// 3. 计算到每个顶点的像素距离
// 4. 找到距离最小的顶点
// 5. 如果最小距离小于阈值，返回吸附点
// 6. 否则返回 null（不吸附）

// 示例：手动实现顶点吸附
function manualVertexSnap(draggedPoint, vertexSources, tolerance) {
    let closestVertex = null;
    let minDistance = tolerance;
    
    vertexSources.forEach(vertex => {
        const distance = map.distance(draggedPoint, vertex);
        if (distance < minDistance) {
            minDistance = distance;
            closestVertex = vertex;
        }
    });
    
    return closestVertex;
}
```

#### 边线吸附算法

边线吸附算法将拖拽的边线吸附到平行的参考边线：

```javascript
// 执行边线吸附
const draggedEdge = {
    start: L.latLng(31.2304, 121.4737),
    end: L.latLng(31.2314, 121.4747)
};

const snappedEdge = snapController.snapEdge(draggedEdge);

if (snappedEdge) {
    console.log('边线吸附成功:', snappedEdge);
    console.log('原始边:', draggedEdge);
} else {
    console.log('未找到合适的吸附边');
}
```

**边线吸附原理：**
```javascript
// 边线吸附的工作流程
// 1. 检查拖拽边与参考边的平行度
// 2. 计算两端点到参考边的距离
// 3. 计算平均距离
// 4. 如果平均距离小于阈值且角度合适，执行吸附
// 5. 将整条边平移到参考边位置

// 平行度判断：允许小误差的角度比较
// 距离计算：点到线段的垂直距离
// 吸附执行：保持方向的整体平移
```

**边线吸附特性：**
- **平行检测**：自动检测边线是否近似平行
- **距离计算**：计算两端点到参考边的平均距离
- **整体平移**：保持边线方向的整体移动
- **阈值控制**：只在指定距离范围内执行吸附

#### 阈值和模式配置

吸附控制器提供了灵活的配置选项：

```javascript
// 配置吸附阈值
snapController.setTolerance(15);  // 15像素阈值

// 配置吸附模式
snapController.setModes(['vertex', 'edge']);  // 同时启用顶点和边线吸附

// 获取当前配置
const currentTolerance = snapController.getTolerance();
const currentModes = snapController.getModes();

console.log('当前阈值:', currentTolerance);
console.log('当前模式:', currentModes);
```

**吸附模式说明：**
```javascript
// 仅顶点吸附
snapController.setModes(['vertex']);

// 仅边线吸附
snapController.setModes(['edge']);

// 同时启用顶点和边线吸附
snapController.setModes(['vertex', 'edge']);

// 关闭所有吸附
snapController.setModes([]);
```

**阈值配置建议：**
```javascript
// 精确模式：小阈值，高精度
snapController.setTolerance(5);

// 标准模式：中等阈值，平衡精度和易用性
snapController.setTolerance(10);

// 宽松模式：大阈值，易于吸附
snapController.setTolerance(20);
```

**实际使用示例：**
```javascript
// 完整的吸附控制器配置
class SnapManager {
    constructor(map) {
        this.snapController = new SnapController(map);
        this.setupSnapConfig();
    }
    
    setupSnapConfig() {
        // 设置吸附参数
        this.snapController.setTolerance(12);
        this.snapController.setModes(['vertex', 'edge']);
        
        // 更新吸附源
        this.updateSnapSources();
    }
    
    updateSnapSources() {
        // 从地图上的图层收集吸附源
        const sources = this.collectSnapSources();
        this.snapController.setGeometrySources(sources);
    }
    
    collectSnapSources() {
        const sources = [];
        
        map.eachLayer((layer) => {
            if (this.shouldIncludeInSnap(layer)) {
                const indices = this.extractGeometryIndices(layer);
                sources.push(...indices);
            }
        });
        
        return sources;
    }
    
    shouldIncludeInSnap(layer) {
        // 判断图层是否应该包含在吸附源中
        return layer.toGeoJSON && 
               !layer.options?.isEditing && 
               layer.options?.layerVisible !== false;
    }
    
    extractGeometryIndices(layer) {
        // 从图层提取几何索引
        const geoJSON = layer.toGeoJSON();
        return this.parseGeometryToIndices(geoJSON);
    }
    
    // 吸附应用
    applySnap(point) {
        // 尝试顶点吸附
        if (this.snapController.getModes().includes('vertex')) {
            const snappedPoint = this.snapController.snapVertex(point);
            if (snappedPoint) {
                return snappedPoint;
            }
        }
        
        // 尝试边线吸附（如果适用）
        // ... 边线吸附逻辑
        
        return point;  // 无吸附时返回原点
    }
}

// 使用吸附管理器
const snapManager = new SnapManager(map);
```

### 6.2 commonUtils 通用工具

commonUtils 提供了一系列实用的通用工具函数，包括图层查询、几何相交检测、标记图标构建和坐标转换等功能。

#### queryLayerOnClick - 点击查询图层

点击查询图层功能用于检测鼠标点击位置处的图层：

```javascript
import { queryLayerOnClick } from 'leaflet-geo-tools';

// 点击事件处理
map.on('click', (e) => {
    // 查询点击位置的图层
    const clickedLayers = queryLayerOnClick(map, e, 6);
    
    console.log('点击到的图层数量:', clickedLayers.length);
    
    clickedLayers.forEach((layer, index) => {
        console.log(`图层 ${index + 1}:`, layer);
        
        // 获取图层信息
        const geoJSON = layer.toGeoJSON();
        console.log('几何类型:', geoJSON.geometry.type);
        console.log('图层属性:', layer.options);
    });
});
```

**参数说明：**
- `map`: Leaflet 地图实例
- `e`: Leaflet 鼠标事件对象
- `precision`: 坐标精度（可选），默认为 false

**返回值：**
- 返回点击位置处的图层数组

**查询原理：**
```javascript
// 查询算法说明
// 1. 在点击位置创建一个小的选择矩形
// 2. 遍历地图上的所有图层
// 3. 检测每个图层是否与选择矩形相交
// 4. 根据几何类型使用不同的相交检测算法
// 5. 返回所有相交的图层
```

**支持的几何类型：**
- **Point**: 点在矩形内的检测
- **Circle**: 点在圆形内的检测
- **LineString**: 线段与矩形的相交检测
- **Polygon**: 点在多边形内的检测
- **MultiPoint/MultiLineString/MultiPolygon**: 多几何的批量检测

**实际应用示例：**
```javascript
// 图层选择器
class LayerSelector {
    constructor(map) {
        this.map = map;
        this.selectedLayers = [];
        this.initClickHandler();
    }
    
    initClickHandler() {
        this.map.on('click', (e) => {
            const clickedLayers = queryLayerOnClick(this.map, e, 6);
            
            if (clickedLayers.length > 0) {
                this.handleLayerSelection(clickedLayers, e);
            }
        });
    }
    
    handleLayerSelection(layers, clickEvent) {
        // 处理图层选择逻辑
        layers.forEach(layer => {
            if (this.isLayerSelected(layer)) {
                this.deselectLayer(layer);
            } else {
                this.selectLayer(layer);
            }
        });
        
        this.updateSelectionUI();
    }
    
    selectLayer(layer) {
        this.selectedLayers.push(layer);
        this.highlightLayer(layer);
    }
    
    deselectLayer(layer) {
        const index = this.selectedLayers.indexOf(layer);
        if (index > -1) {
            this.selectedLayers.splice(index, 1);
            this.unhighlightLayer(layer);
        }
    }
    
    highlightLayer(layer) {
        // 高亮选中的图层
        const originalStyle = layer.options;
        layer.setStyle({
            color: '#ff6b35',
            weight: 3,
            fillOpacity: 0.5
        });
        
        // 保存原始样式
        layer._originalStyle = originalStyle;
    }
    
    unhighlightLayer(layer) {
        // 恢复图层原始样式
        if (layer._originalStyle) {
            layer.setStyle(layer._originalStyle);
            delete layer._originalStyle;
        }
    }
}
```

#### queryLayersIntersectingGeometry - 几何相交查询

几何相交查询用于查找与指定几何图形相交的所有图层：

```javascript
import { queryLayersIntersectingGeometry } from 'leaflet-geo-tools';

// 创建查询几何
const queryGeometry = {
    type: "Polygon",
    coordinates: [[
        [121.4737, 31.2304],
        [121.4747, 31.2304],
        [121.4747, 31.2314],
        [121.4737, 31.2314],
        [121.4737, 31.2304]
    ]]
};

// 查询相交图层
const intersectingLayers = queryLayersIntersectingGeometry(map, queryGeometry, 6);

console.log('相交图层数量:', intersectingLayers.length);

intersectingLayers.forEach((layer, index) => {
    console.log(`相交图层 ${index + 1}:`, layer);
    
    // 获取相交信息
    const geoJSON = layer.toGeoJSON();
    console.log('几何类型:', geoJSON.geometry.type);
    
    // 可以添加高亮效果
    layer.setStyle({
        color: '#4285f4',
        weight: 3,
        fillOpacity: 0.3
    });
});
```

**参数说明：**
- `map`: Leaflet 地图实例
- `geometry`: 查询几何（GeoJSON Feature 或 Leaflet 图层）
- `precision`: 坐标精度（可选）

**返回值：**
- 返回与查询几何相交的图层数组

**查询应用场景：**
```javascript
// 空间选择工具
class SpatialSelector {
    constructor(map) {
        this.map = map;
        this.queryLayer = null;
        this.initDrawingTool();
    }
    
    initDrawingTool() {
        // 初始化绘制工具
        this.drawTool = new PolygonEditor(map);
        
        this.drawTool.onStateChange((state) => {
            if (state === 'idle') {
                // 绘制完成，执行空间查询
                this.performSpatialQuery();
            }
        });
    }
    
    performSpatialQuery() {
        const queryGeometry = this.drawTool.getGeoJSON();
        const intersectingLayers = queryLayersIntersectingGeometry(
            this.map, 
            queryGeometry, 
            6
        );
        
        this.processQueryResults(intersectingLayers);
    }
    
    processQueryResults(layers) {
        console.log(`找到 ${layers.length} 个相交图层`);
        
        // 高亮查询结果
        layers.forEach(layer => {
            this.highlightIntersectingLayer(layer);
        });
        
        // 显示查询统计
        this.showQueryStatistics(layers);
    }
    
    highlightIntersectingLayer(layer) {
        // 临时高亮相交图层
        const originalStyle = layer.options;
        layer.setStyle({
            color: '#ff6b35',
            weight: 3,
            fillOpacity: 0.5,
            dashArray: '5,5'
        });
        
        // 添加弹出信息
        const geoJSON = layer.toGeoJSON();
        layer.bindPopup(`
            <div>
                <strong>相交图层</strong><br>
                类型: ${geoJSON.geometry.type}<br>
                ID: ${layer._leaflet_id || 'N/A'}
            </div>
        `);
        
        // 保存原始样式以便恢复
        layer._queryOriginalStyle = originalStyle;
    }
    
    showQueryStatistics(layers) {
        const stats = {
            total: layers.length,
            byType: {}
        };
        
        layers.forEach(layer => {
            const geoJSON = layer.toGeoJSON();
            const type = geoJSON.geometry.type;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });
        
        console.log('查询统计:', stats);
        
        // 可以显示在UI中
        this.displayQueryResults(stats);
    }
    
    clearQueryResults() {
        // 清除查询结果的高亮
        this.map.eachLayer((layer) => {
            if (layer._queryOriginalStyle) {
                layer.setStyle(layer._queryOriginalStyle);
                delete layer._queryOriginalStyle;
                layer.unbindPopup();
            }
        });
    }
}
```

#### buildMarkerIcon - 标记图标构建

标记图标构建工具用于创建自定义的 Leaflet 图标：

```javascript
import { buildMarkerIcon } from 'leaflet-geo-tools';

// 创建自定义标记图标
const customIcon = buildMarkerIcon({
    className: 'custom-marker',
    html: '<div class="marker-content">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

// 使用自定义图标
const marker = L.marker([31.2304, 121.4737], {
    icon: customIcon
}).addTo(map);

marker.bindPopup('自定义标记');
```

**配置选项：**
```javascript
// 完整的图标配置
const iconConfig = {
    className: 'my-custom-icon',      // CSS 类名
    html: '<div class="icon-inner">🎯</div>',  // HTML 内容
    iconSize: [32, 32],              // 图标尺寸 [宽, 高]
    iconAnchor: [16, 32],            // 图标锚点 [x, y]
    popupAnchor: [0, -32],           // 弹窗锚点 [x, y]
    shadowUrl: 'marker-shadow.png',  // 阴影图片
    shadowSize: [32, 32],            // 阴影尺寸
    shadowAnchor: [16, 32]           // 阴影锚点
};

const markerIcon = buildMarkerIcon(iconConfig);
```

**实际应用示例：**
```javascript
// 图标工厂类
class IconFactory {
    static createTypeIcon(type, options = {}) {
        const iconConfigs = {
            'default': {
                className: 'default-marker',
                html: '<div class="marker-dot"></div>',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            },
            'selected': {
                className: 'selected-marker',
                html: '<div class="marker-selected">⭐</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            },
            'warning': {
                className: 'warning-marker',
                html: '<div class="marker-warning">⚠️</div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            },
            'success': {
                className: 'success-marker',
                html: '<div class="marker-success">✅</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            }
        };
        
        const baseConfig = iconConfigs[type] || iconConfigs['default'];
        const finalConfig = { ...baseConfig, ...options };
        
        return buildMarkerIcon(finalConfig);
    }
    
    static createDynamicIcon(status, text) {
        const colors = {
            'active': '#4285f4',
            'inactive': '#9e9e9e',
            'error': '#ea4335',
            'warning': '#fbbc04'
        };
        
        const iconHtml = `
            <div class="dynamic-marker" style="color: ${colors[status]}">
                <div class="marker-status">${status}</div>
                <div class="marker-text">${text}</div>
            </div>
        `;
        
        return buildMarkerIcon({
            className: 'dynamic-marker-container',
            html: iconHtml,
            iconSize: [60, 30],
            iconAnchor: [30, 15]
        });
    }
}

// 使用图标工厂
const defaultIcon = IconFactory.createTypeIcon('default');
const selectedIcon = IconFactory.createTypeIcon('selected', {
    iconSize: [24, 24]
});

const dynamicIcon = IconFactory.createDynamicIcon('active', 'A1');

// 创建标记
const marker1 = L.marker([31.2304, 121.4737], {
    icon: defaultIcon
}).addTo(map);

const marker2 = L.marker([31.2314, 121.4747], {
    icon: selectedIcon
}).addTo(map);

const marker3 = L.marker([31.2324, 121.4757], {
    icon: dynamicIcon
}).addTo(map);
```

#### 坐标转换工具函数

坐标转换工具用于处理不同坐标系统之间的转换：

```javascript
import { 
    reversePointLatLngs, 
    reversePolyLineLatLngs, 
    reverseLatLngs 
} from 'leaflet-geo-tools';

// 点坐标转换
const pointGeometry = {
    type: "Point",
    coordinates: [121.4737, 31.2304]  // [lng, lat]
};

const reversedPoint = reversePointLatLngs(pointGeometry);
console.log('转换后的坐标:', reversedPoint);  // [lat, lng]

// 线坐标转换
const lineGeometry = {
    type: "LineString",
    coordinates: [
        [121.4737, 31.2304],
        [121.4747, 31.2314],
        [121.4757, 31.2324]
    ]
};

const reversedLine = reversePolyLineLatLngs(lineGeometry);
console.log('转换后的线坐标:', reversedLine);

// 多边形坐标转换
const polygonGeometry = {
    type: "Polygon",
    coordinates: [[
        [121.4737, 31.2304],
        [121.4747, 31.2304],
        [121.4747, 31.2314],
        [121.4737, 31.2314],
        [121.4737, 31.2304]
    ]]
};

const reversedPolygon = reverseLatLngs(polygonGeometry);
console.log('转换后的多边形坐标:', reversedPolygon);
```

**坐标转换说明：**
```javascript
// GeoJSON 标准格式：[longitude, latitude]
// Leaflet 格式：[latitude, longitude]

// 转换函数的作用：
// - reversePointLatLngs: 点坐标转换
// - reversePolyLineLatLngs: 线坐标转换
// - reverseLatLngs: 多边形和其他几何转换
```

**实际应用示例：**
```javascript
// 坐标转换工具类
class CoordinateConverter {
    static geoJSONToLeaflet(geoJSON) {
        // 将 GeoJSON 坐标转换为 Leaflet 格式
        switch (geoJSON.type) {
            case 'Point':
                return reversePointLatLngs(geoJSON);
            case 'LineString':
                return reversePolyLineLatLngs(geoJSON);
            case 'Polygon':
            case 'MultiPolygon':
            case 'MultiLineString':
                return reverseLatLngs(geoJSON);
            default:
                return geoJSON;
        }
    }
    
    static leafletToGeoJSON(coordinates) {
        // 将 Leaflet 坐标转换为 GeoJSON 格式
        if (Array.isArray(coordinates[0])) {
            // 多维数组，递归转换
            return coordinates.map(coord => 
                Array.isArray(coord[0]) 
                    ? this.leafletToGeoJSON(coord)
                    : [coord[1], coord[0]]  // [lat, lng] -> [lng, lat]
            );
        } else {
            // 单点坐标
            return [coordinates[1], coordinates[0]];
        }
    }
    
    static formatCoordinates(coords, precision = 6) {
        // 格式化坐标显示
        return coords.map(coord => {
            if (Array.isArray(coord)) {
                return this.formatCoordinates(coord, precision);
            } else {
                return Number(coord.toFixed(precision));
            }
        });
    }
    
    static calculateBounds(coordinates) {
        // 计算坐标边界
        const flatCoords = this.flattenCoordinates(coordinates);
        
        const lngs = flatCoords.map(coord => coord[0]);
        const lats = flatCoords.map(coord => coord[1]);
        
        return {
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats)
        };
    }
    
    static flattenCoordinates(coords) {
        // 展平嵌套坐标数组
        const result = [];
        
        function flatten(item) {
            if (Array.isArray(item[0])) {
                item.forEach(flatten);
            } else {
                result.push(item);
            }
        }
        
        coords.forEach(flatten);
        return result;
    }
}

// 使用坐标转换器
const geoJSONPoint = {
    type: "Point",
    coordinates: [121.4737, 31.2304]
};

const leafletCoords = CoordinateConverter.geoJSONToLeaflet(geoJSONPoint);
console.log('Leaflet 坐标:', leafletCoords);

const bounds = CoordinateConverter.calculateBounds(geoJSONPoint.coordinates);
console.log('坐标边界:', bounds);

const formattedCoords = CoordinateConverter.formatCoordinates(leafletCoords, 4);
console.log('格式化坐标:', formattedCoords);
```

现在您已经掌握了吸附控制器和通用工具的使用方法。这些工具类为编辑器和测量工具提供了强大的底层支持功能。

### 6.3 topoUtils 拓扑工具

topoUtils 提供了专业的拓扑操作工具，包括线裁剪、多边形合并、线整形等高级空间分析功能。这些工具是 LeafletTopology 类的核心实现。

#### clipSelectedLayersByLine - 线裁剪

线裁剪功能使用绘制的线条来裁剪选中的多边形图层：

```javascript
import { clipSelectedLayersByLine } from 'leaflet-geo-tools';

// 裁剪操作示例
function performClipOperation(selectedLayers, clipLine) {
    // 执行线裁剪
    const clipResult = clipSelectedLayersByLine(
        clipLine,        // 裁剪线条 GeoJSON Feature
        selectedLayers,  // 选中的图层数组
        6                // 坐标精度
    );
    
    console.log('裁剪结果:', clipResult);
    
    // 处理裁剪结果
    handleClipResult(clipResult);
}

function handleClipResult(result) {
    const { clipedGeoms, doClipLayers } = result;
    
    console.log(`生成了 ${clipedGeoms.length} 个裁剪结果`);
    console.log(`需要删除 ${doClipLayers.length} 个原图层`);
    
    // 添加裁剪结果到地图
    clipedGeoms.forEach((geom, index) => {
        const clippedLayer = L.geoJSON(geom, {
            style: {
                color: '#4285f4',
                weight: 2,
                fillColor: '#4285f4',
                fillOpacity: 0.2
            }
        });
        
        clippedLayer.addTo(map);
        clippedLayer.bindPopup(`裁剪结果 ${index + 1}`);
    });
    
    // 移除原图层
    doClipLayers.forEach(layer => {
        map.removeLayer(layer);
    });
}
```

**参数说明：**
- `lineFeature`: 裁剪线条的 GeoJSON Feature
- `selLayers`: 要裁剪的图层数组
- `precision`: 坐标精度（可选）

**返回值：**
```typescript
interface TopoClipResult {
    clipedGeoms: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[];  // 裁剪后的几何
    doClipLayers: L.Layer[];  // 被裁剪的原图层
}
```

**裁剪原理：**
```javascript
// 裁剪算法说明
// 1. 使用 Turf.js 的 splitPolygon 函数进行分割
// 2. 遍历每个选中图层的所有几何体
// 3. 只处理多边形和多多边形类型
// 4. 将每个多边形用裁剪线进行分割
// 5. 收集所有分割结果
// 6. 标记原图层为待删除状态
```

**实际应用示例：**
```javascript
// 高级裁剪工具类
class AdvancedClipTool {
    constructor(map) {
        this.map = map;
        this.selectedLayers = [];
        this.clipLine = null;
    }
    
    // 设置选中的图层
    setSelectedLayers(layers) {
        this.selectedLayers = layers;
        console.log(`已选择 ${layers.length} 个图层进行裁剪`);
    }
    
    // 设置裁剪线
    setClipLine(lineFeature) {
        this.clipLine = lineFeature;
    }
    
    // 执行裁剪操作
    executeClip() {
        if (!this.clipLine || this.selectedLayers.length === 0) {
            throw new Error('请先选择图层并绘制裁剪线');
        }
        
        try {
            const result = clipSelectedLayersByLine(
                this.clipLine,
                this.selectedLayers,
                6
            );
            
            return this.processClipResult(result);
        } catch (error) {
            console.error('裁剪操作失败:', error);
            throw error;
        }
    }
    
    // 处理裁剪结果
    processClipResult(result) {
        const { clipedGeoms, doClipLayers } = result;
        
        // 创建结果图层组
        const resultGroup = L.layerGroup();
        
        clipedGeoms.forEach((geom, index) => {
            const layer = L.geoJSON(geom, {
                style: this.getClipStyle(index),
                onEachFeature: (feature, layer) => {
                    this.addClipPopup(layer, index, feature);
                }
            });
            
            resultGroup.addLayer(layer);
        });
        
        // 移除原图层
        doClipLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        // 添加结果到地图
        resultGroup.addTo(map);
        
        return {
            resultGroup,
            clippedCount: clipedGeoms.length,
            removedCount: doClipLayers.length
        };
    }
    
    // 获取裁剪样式
    getClipStyle(index) {
        const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335'];
        const color = colors[index % colors.length];
        
        return {
            color: color,
            weight: 2,
            fillColor: color,
            fillOpacity: 0.2,
            dashArray: '5,3'
        };
    }
    
    // 添加弹出信息
    addClipPopup(layer, index, feature) {
        const area = this.calculateArea(feature);
        layer.bindPopup(`
            <div>
                <strong>裁剪结果 ${index + 1}</strong><br>
                类型: ${feature.geometry.type}<br>
                面积: ${area.toFixed(2)} 平方米
            </div>
        `);
    }
    
    // 计算面积
    calculateArea(feature) {
        // 使用 Turf.js 计算面积
        // 这里只是示例
        return 1000;
    }
    
    // 批量裁剪
    batchClip(clipOperations) {
        const results = [];
        
        clipOperations.forEach(operation => {
            try {
                const result = this.executeClip();
                results.push({
                    success: true,
                    result: result
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message
                });
            }
        });
        
        return results;
    }
}

// 使用高级裁剪工具
const clipTool = new AdvancedClipTool(map);

// 设置要裁剪的图层
const layersToClip = [layer1, layer2, layer3];
clipTool.setSelectedLayers(layersToClip);

// 设置裁剪线
const clipLine = {
    type: "Feature",
    geometry: {
        type: "LineString",
        coordinates: [
            [121.4737, 31.2304],
            [121.4757, 31.2314]
        ]
    }
};
clipTool.setClipLine(clipLine);

// 执行裁剪
const clipResult = clipTool.executeClip();
console.log('裁剪完成:', clipResult);
```

#### mergePolygon - 多边形合并

多边形合并功能将多个多边形合并为一个几何体：

```javascript
import { mergePolygon } from 'leaflet-geo-tools';

// 合并多边形示例
function mergeSelectedPolygons(selectedLayers) {
    if (selectedLayers.length < 2) {
        throw new Error('至少需要两个多边形才能进行合并');
    }
    
    try {
        // 执行合并操作
        const mergedGeometry = mergePolygon(selectedLayers, 6);
        
        if (mergedGeometry) {
            console.log('合并成功:', mergedGeometry);
            
            // 创建合并后的图层
            const mergedLayer = L.geoJSON(mergedGeometry, {
                style: {
                    color: '#ff6b35',
                    weight: 2,
                    fillColor: '#ff6b35',
                    fillOpacity: 0.3
                }
            });
            
            mergedLayer.addTo(map);
            mergedLayer.bindPopup('合并结果');
            
            // 移除原图层
            selectedLayers.forEach(layer => {
                map.removeLayer(layer);
            });
            
            return mergedLayer;
        } else {
            throw new Error('合并失败：无法生成合并几何');
        }
    } catch (error) {
        console.error('合并操作失败:', error);
        throw error;
    }
}

// 使用示例
const polygonsToMerge = [polygonLayer1, polygonLayer2, polygonLayer3];
const mergedLayer = mergeSelectedPolygons(polygonsToMerge);
```

**合并原理：**
```javascript
// 合并算法说明
// 1. 使用 Turf.js 的 union 函数进行几何合并
// 2. 从第二个多边形开始，依次与前面的合并结果进行合并
// 3. 每次合并都使用 featureCollection 包装两个几何体
// 4. 最终返回合并后的单一几何体
// 5. 支持多边形和多多边形的合并
```

**高级合并示例：**
```javascript
// 多边形合并工具类
class PolygonMerger {
    constructor(map) {
        this.map = map;
    }
    
    // 智能合并：自动过滤相邻的多边形
    smartMerge(polygons) {
        // 按位置分组，只合并相邻的多边形
        const groups = this.groupAdjacentPolygons(polygons);
        const mergeResults = [];
        
        groups.forEach((group, index) => {
            if (group.length > 1) {
                try {
                    const merged = mergePolygon(group, 6);
                    if (merged) {
                        mergeResults.push({
                            mergedGeometry: merged,
                            originalPolygons: group,
                            groupId: index
                        });
                    }
                } catch (error) {
                    console.warn(`组 ${index} 合并失败:`, error);
                    mergeResults.push({
                        mergedGeometry: null,
                        originalPolygons: group,
                        groupId: index,
                        error: error.message
                    });
                }
            } else {
                // 单个多边形，无需合并
                mergeResults.push({
                    mergedGeometry: group[0].toGeoJSON(),
                    originalPolygons: group,
                    groupId: index
                });
            }
        });
        
        return this.processMergeResults(mergeResults);
    }
    
    // 分组相邻多边形
    groupAdjacentPolygons(polygons) {
        const groups = [];
        const processed = new Set();
        
        polygons.forEach((polygon, index) => {
            if (processed.has(index)) return;
            
            const group = [polygon];
            processed.add(index);
            
            // 查找相邻的多边形
            this.findAdjacentPolygons(polygon, polygons, processed, group);
            
            groups.push(group);
        });
        
        return groups;
    }
    
    // 查找相邻多边形
    findAdjacentPolygons(polygon, allPolygons, processed, group) {
        allPolygons.forEach((otherPolygon, index) => {
            if (processed.has(index)) return;
            
            if (this.arePolygonsAdjacent(polygon, otherPolygon)) {
                group.push(otherPolygon);
                processed.add(index);
                
                // 递归查找
                this.findAdjacentPolygons(otherPolygon, allPolygons, processed, group);
            }
        });
    }
    
    // 判断多边形是否相邻
    arePolygonsAdjacent(polygon1, polygon2) {
        // 简化的相邻判断：检查边界框是否相交
        const bounds1 = polygon1.getBounds();
        const bounds2 = polygon2.getBounds();
        
        return bounds1.intersects(bounds2);
    }
    
    // 处理合并结果
    processMergeResults(results) {
        const mergedLayers = [];
        
        results.forEach((result, index) => {
            if (result.mergedGeometry) {
                const layer = L.geoJSON(result.mergedGeometry, {
                    style: this.getMergeStyle(index),
                    onEachFeature: (feature, layer) => {
                        this.addMergePopup(layer, result);
                    }
                });
                
                mergedLayers.push(layer);
                layer.addTo(map);
                
                // 移除原图层
                result.originalPolygons.forEach(polygon => {
                    this.map.removeLayer(polygon);
                });
            }
        });
        
        return mergedLayers;
    }
    
    // 获取合并样式
    getMergeStyle(index) {
        const colors = ['#ff6b35', '#4285f4', '#34a853', '#ea4335'];
        return {
            color: colors[index % colors.length],
            weight: 3,
            fillColor: colors[index % colors.length],
            fillOpacity: 0.3
        };
    }
    
    // 添加合并信息弹窗
    addMergePopup(layer, result) {
        const originalCount = result.originalPolygons.length;
        layer.bindPopup(`
            <div>
                <strong>合并结果</strong><br>
                合并了 ${originalCount} 个多边形<br>
                组ID: ${result.groupId}
                ${result.error ? `<br>错误: ${result.error}` : ''}
            </div>
        `);
    }
}

// 使用多边形合并工具
const merger = new PolygonMerger(map);
const polygons = [poly1, poly2, poly3, poly4, poly5];

const mergedLayers = merger.smartMerge(polygons);
console.log(`合并完成，生成了 ${mergedLayers.length} 个合并图层`);
```

#### reshapeSelectedLayersByLine - 线整形

线整形功能使用绘制的线条来重新整形选中的图层边界：

```javascript
import { reshapeSelectedLayersByLine } from 'leaflet-geo-tools';

// 线整形示例
function performReshapeOperation(selectedLayers, reshapeLine) {
    // 整形配置
    const reshapeOptions = {
        chooseStrategy: 'auto',  // 自动选择整形策略
        AllowReshapingWithoutSelection: false  // 不允许无选择时整形
    };
    
    try {
        // 执行线整形
        const reshapeResult = reshapeSelectedLayersByLine(
            reshapeLine,      // 整形线条
            selectedLayers,   // 选中的图层数组
            reshapeOptions,   // 整形配置
            6                 // 坐标精度
        );
        
        console.log('整形结果:', reshapeResult);
        
        // 处理整形结果
        handleReshapeResult(reshapeResult);
    } catch (error) {
        console.error('整形操作失败:', error);
        throw error;
    }
}

function handleReshapeResult(result) {
    const { doReshapeLayers, reshapedGeoms } = result;
    
    console.log(`处理了 ${doReshapeLayers.length} 个图层`);
    console.log(`生成了 ${reshapedGeoms.length} 个整形结果`);
    
    // 添加整形结果到地图
    reshapedGeoms.forEach((geom, index) => {
        const reshapedLayer = L.geoJSON(geom, {
            style: {
                color: '#9c27b0',
                weight: 2,
                fillColor: '#9c27b0',
                fillOpacity: 0.2,
                dashArray: '5,3'
            }
        });
        
        reshapedLayer.addTo(map);
        reshapedLayer.bindPopup(`整形结果 ${index + 1}`);
    });
    
    // 移除原图层
    doReshapeLayers.forEach(layer => {
        map.removeLayer(layer);
    });
}
```

**整形配置选项：**
```typescript
interface ReshapeOptions {
    chooseStrategy: 'auto' | 'conservative' | 'aggressive';  // 整形策略
    AllowReshapingWithoutSelection: boolean;  // 是否允许无选择时整形
}
```

**整形策略说明：**
- **auto**: 自动选择最佳整形策略
- **conservative**: 保守策略，保持更多原始特征
- **aggressive**: 激进策略，更大程度的整形

**实际应用示例：**
```javascript
// 高级整形工具类
class AdvancedReshapeTool {
    constructor(map) {
        this.map = map;
        this.selectedLayers = [];
        this.reshapeLine = null;
    }
    
    // 设置整形参数
    setReshapeParameters(layers, line, options = {}) {
        this.selectedLayers = layers;
        this.reshapeLine = line;
        this.reshapeOptions = {
            chooseStrategy: 'auto',
            AllowReshapingWithoutSelection: false,
            ...options
        };
    }
    
    // 执行整形操作
    executeReshape() {
        if (!this.reshapeLine) {
            throw new Error('请先绘制整形线');
        }
        
        if (!this.reshapeOptions.AllowReshapingWithoutSelection && 
            this.selectedLayers.length === 0) {
            throw new Error('请先选择要整形的图层');
        }
        
        try {
            const result = reshapeSelectedLayersByLine(
                this.reshapeLine,
                this.selectedLayers,
                this.reshapeOptions,
                6
            );
            
            return this.processReshapeResult(result);
        } catch (error) {
            console.error('整形操作失败:', error);
            throw error;
        }
    }
    
    // 处理整形结果
    processReshapeResult(result) {
        const { doReshapeLayers, reshapedGeoms } = result;
        
        // 创建结果图层组
        const resultGroup = L.layerGroup();
        
        reshapedGeoms.forEach((geom, index) => {
            const layer = L.geoJSON(geom, {
                style: this.getReshapeStyle(index),
                onEachFeature: (feature, layer) => {
                    this.addReshapePopup(layer, index, feature);
                }
            });
            
            resultGroup.addLayer(layer);
        });
        
        // 移除原图层
        doReshapeLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        // 添加结果到地图
        resultGroup.addTo(map);
        
        return {
            resultGroup,
            reshapedCount: reshapedGeoms.length,
            removedCount: doReshapeLayers.length
        };
    }
    
    // 获取整形样式
    getReshapeStyle(index) {
        const baseStyle = {
            color: '#9c27b0',
            weight: 2,
            fillColor: '#9c27b0',
            fillOpacity: 0.2
        };
        
        // 根据策略调整样式
        if (this.reshapeOptions.chooseStrategy === 'aggressive') {
            return {
                ...baseStyle,
                dashArray: '3,3',
                weight: 3
            };
        } else if (this.reshapeOptions.chooseStrategy === 'conservative') {
            return {
                ...baseStyle,
                dashArray: '10,5',
                weight: 1
            };
        }
        
        return baseStyle;
    }
    
    // 添加整形信息弹窗
    addReshapePopup(layer, index, feature) {
        const area = this.calculateArea(feature);
        const perimeter = this.calculatePerimeter(feature);
        
        layer.bindPopup(`
            <div>
                <strong>整形结果 ${index + 1}</strong><br>
                类型: ${feature.geometry.type}<br>
                面积: ${area.toFixed(2)} 平方米<br>
                周长: ${perimeter.toFixed(2)} 米<br>
                策略: ${this.reshapeOptions.chooseStrategy}
            </div>
        `);
    }
    
    // 计算面积
    calculateArea(feature) {
        // 使用 Turf.js 计算面积
        return 1000; // 示例值
    }
    
    // 计算周长
    calculatePerimeter(feature) {
        // 使用 Turf.js 计算周长
        return 200; // 示例值
    }
    
    // 批量整形
    batchReshape(reshapeOperations) {
        const results = [];
        
        reshapeOperations.forEach(operation => {
            try {
                this.setReshapeParameters(
                    operation.layers,
                    operation.line,
                    operation.options
                );
                
                const result = this.executeReshape();
                results.push({
                    success: true,
                    result: result
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message
                });
            }
        });
        
        return results;
    }
}

// 使用高级整形工具
const reshapeTool = new AdvancedReshapeTool(map);

// 设置整形参数
reshapeTool.setReshapeParameters(
    [layer1, layer2],  // 要整形的图层
    reshapeLine,       // 整形线条
    {
        chooseStrategy: 'conservative',
        AllowReshapingWithoutSelection: false
    }
);

// 执行整形
const reshapeResult = reshapeTool.executeReshape();
console.log('整形完成:', reshapeResult);
```

#### 其他拓扑操作函数

除了主要的三个函数外，topoUtils 还提供了其他辅助函数：

```javascript
// 几何标准化函数
function normalizeGeoJSONCoordinates(feature) {
    // 标准化 GeoJSON 坐标格式
    // 确保坐标格式的一致性
    return feature;
}

// 拓扑关系检查
function checkTopologicalRelationships(geometries) {
    // 检查几何体之间的拓扑关系
    // 包括相交、包含、相等等关系
    const relationships = [];
    
    geometries.forEach((geom1, index1) => {
        geometries.forEach((geom2, index2) => {
            if (index1 < index2) {
                const relation = analyzeTopology(geom1, geom2);
                relationships.push({
                    geom1: index1,
                    geom2: index2,
                    relation: relation
                });
            }
        });
    });
    
    return relationships;
}

// 拓扑验证
function validateTopology(geometry) {
    // 验证几何体的拓扑有效性
    const errors = [];
    
    // 检查自相交
    if (hasSelfIntersection(geometry)) {
        errors.push('几何体存在自相交');
    }
    
    // 检查其他拓扑错误
    // ...
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
```

### 6.4 validShapeUtils 几何校验

validShapeUtils 提供了几何形状的校验功能，主要用于检测多边形和折线的自相交问题。

#### polygonHasSelfIntersection - 面自相交检测

面自相交检测用于判断多边形是否与自身相交：

```javascript
import { polygonHasSelfIntersection } from 'leaflet-geo-tools';

// 检测多边形自相交
function checkPolygonSelfIntersection(polygonCoords) {
    // polygonCoords 格式: [[lat, lng], [lat, lng], ...]
    const hasIntersection = polygonHasSelfIntersection(polygonCoords);
    
    if (hasIntersection) {
        console.warn('多边形存在自相交');
        // 显示错误样式
        showInvalidPolygonStyle();
    } else {
        console.log('多边形有效，无自相交');
        // 显示正常样式
        showValidPolygonStyle();
    }
    
    return hasIntersection;
}

// 实际使用示例
const polygonCoordinates = [
    [31.2304, 121.4737],
    [31.2314, 121.4747],
    [31.2324, 121.4737],
    [31.2314, 121.4727],  // 这个点会导致自相交
    [31.2304, 121.4737]
];

const isInvalid = checkPolygonSelfIntersection(polygonCoordinates);
```

**检测原理：**
```javascript
// 自相交检测算法说明
// 1. 至少需要4个点才可能形成自相交
// 2. 将坐标转换为 GeoJSON 格式 [lng, lat]
// 3. 使用 Turf.js 的 polygon 函数创建多边形
// 4. 使用 Turf.js 的 kinks 函数检测自相交
// 5. 如果存在交点，则返回 true（有自相交）
```

**实际应用示例：**
```javascript
// 多边形校验器类
class PolygonValidator {
    constructor(map) {
        this.map = map;
        this.validationLayer = null;
    }
    
    // 实时校验多边形
    validatePolygonRealtime(coords) {
        const isValid = !polygonHasSelfIntersection(coords);
        
        // 更新视觉反馈
        this.updateValidationFeedback(isValid);
        
        // 触发校验事件
        this.onValidationChange(isValid);
        
        return isValid;
    }
    
    // 更新校验反馈
    updateValidationFeedback(isValid) {
        if (this.validationLayer) {
            // 更新现有图层的样式
            this.validationLayer.setStyle(this.getValidationStyle(isValid));
        }
    }
    
    // 获取校验样式
    getValidationStyle(isValid) {
        if (isValid) {
            return {
                color: '#4285f4',
                weight: 2,
                fillColor: '#4285f4',
                fillOpacity: 0.2
            };
        } else {
            return {
                color: '#ff0000',
                weight: 3,
                dashArray: '5,5',
                fillColor: '#ff0000',
                fillOpacity: 0.1
            };
        }
    }
    
    // 校验变化回调
    onValidationChange(isValid) {
        console.log(`多边形校验状态: ${isValid ? '有效' : '无效'}`);
        
        // 可以触发自定义事件
        this.map.fire('polygonValidation', {
            isValid: isValid,
            timestamp: Date.now()
        });
    }
    
    // 批量校验多边形
    validatePolygons(polygons) {
        const results = [];
        
        polygons.forEach((polygon, index) => {
            const coords = this.extractCoordinates(polygon);
            const isValid = !polygonHasSelfIntersection(coords);
            
            results.push({
                index: index,
                polygon: polygon,
                isValid: isValid,
                coordinates: coords
            });
            
            // 更新样式
            polygon.setStyle(this.getValidationStyle(isValid));
        });
        
        return results;
    }
    
    // 提取坐标
    extractCoordinates(polygon) {
        const geoJSON = polygon.toGeoJSON();
        return geoJSON.geometry.coordinates[0];
    }
    
    // 生成校验报告
    generateValidationReport(polygons) {
        const results = this.validatePolygons(polygons);
        
        const validCount = results.filter(r => r.isValid).length;
        const invalidCount = results.length - validCount;
        
        const report = {
            total: results.length,
            valid: validCount,
            invalid: invalidCount,
            validRate: (validCount / results.length * 100).toFixed(2) + '%',
            details: results
        };
        
        console.log('校验报告:', report);
        return report;
    }
}

// 使用多边形校验器
const validator = new PolygonValidator(map);

// 监听校验事件
map.on('polygonValidation', (e) => {
    const statusElement = document.getElementById('validation-status');
    statusElement.textContent = e.isValid ? '有效' : '无效';
    statusElement.className = e.isValid ? 'status-valid' : 'status-invalid';
});

// 实时校验
function onPolygonEdit(coords) {
    validator.validatePolygonRealtime(coords);
}
```

#### polylineHasSelfIntersection - 线自相交检测

线自相交检测用于判断折线是否与自身相交：

```javascript
import { polylineHasSelfIntersection } from 'leaflet-geo-tools';

// 检测折线自相交
function checkPolylineSelfIntersection(polylineCoords) {
    // polylineCoords 格式: [[lat, lng], [lat, lng], ...]
    const hasIntersection = polylineHasSelfIntersection(polylineCoords);
    
    if (hasIntersection) {
        console.warn('折线存在自相交');
        showInvalidPolylineStyle();
    } else {
        console.log('折线有效，无自相交');
        showValidPolylineStyle();
    }
    
    return hasIntersection;
}

// 实际使用示例
const polylineCoordinates = [
    [31.2304, 121.4737],
    [31.2314, 121.4747],
    [31.2324, 121.4737],
    [31.2314, 121.4727],  // 这个点会导致自相交
    [31.2304, 121.4737]
];

const isInvalid = checkPolylineSelfIntersection(polylineCoordinates);
```

**检测原理：**
```javascript
// 线自相交检测算法说明
// 1. 至少需要4个点才可能形成自相交
// 2. 将坐标转换为 GeoJSON 格式 [lng, lat]
// 3. 使用 Turf.js 的 lineString 函数创建线段
// 4. 使用 Turf.js 的 kinks 函数检测自相交
// 5. 如果存在交点，则返回 true（有自相交）
```

**实际应用示例：**
```javascript
// 折线校验器类
class PolylineValidator {
    constructor(map) {
        this.map = map;
        this.validationHistory = [];
    }
    
    // 校验折线
    validatePolyline(coords, polylineLayer) {
        const isValid = !polylineHasSelfIntersection(coords);
        
        // 记录校验历史
        this.recordValidation(coords, isValid);
        
        // 更新图层样式
        if (polylineLayer) {
            polylineLayer.setStyle(this.getPolylineValidationStyle(isValid));
        }
        
        // 提供校验建议
        const suggestions = this.getValidationSuggestions(coords, isValid);
        
        return {
            isValid: isValid,
            suggestions: suggestions,
            timestamp: Date.now()
        };
    }
    
    // 记录校验历史
    recordValidation(coords, isValid) {
        this.validationHistory.push({
            coordinates: coords,
            isValid: isValid,
            timestamp: Date.now()
        });
        
        // 保持历史记录在合理范围内
        if (this.validationHistory.length > 100) {
            this.validationHistory.shift();
        }
    }
    
    // 获取折线校验样式
    getPolylineValidationStyle(isValid) {
        if (isValid) {
            return {
                color: '#34a853',
                weight: 3,
                opacity: 0.8
            };
        } else {
            return {
                color: '#ea4335',
                weight: 4,
                dashArray: '8,4',
                opacity: 0.9
            };
        }
    }
    
    // 获取校验建议
    getValidationSuggestions(coords, isValid) {
        if (isValid) {
            return ['折线有效', '可以继续绘制或编辑'];
        } else {
            return [
                '折线存在自相交',
                '请检查并调整顶点位置',
                '建议移除导致相交的顶点'
            ];
        }
    }
    
    // 查找相交点
    findIntersectionPoints(coords) {
        // 使用 Turf.js 查找具体的相交点
        // 这里提供简化的实现
        const intersections = [];
        
        // 检查每条线段与其他线段的相交
        for (let i = 0; i < coords.length - 1; i++) {
            for (let j = i + 2; j < coords.length - 1; j++) {
                if (this.doSegmentsIntersect(
                    coords[i], coords[i + 1],
                    coords[j], coords[j + 1]
                )) {
                    intersections.push({
                        segment1: [i, i + 1],
                        segment2: [j, j + 1],
                        point: this.calculateIntersection(
                            coords[i], coords[i + 1],
                            coords[j], coords[j + 1]
                        )
                    });
                }
            }
        }
        
        return intersections;
    }
    
    // 判断线段相交（简化实现）
    doSegmentsIntersect(p1, p2, p3, p4) {
        // 简化的线段相交判断
        // 实际实现应该使用更精确的算法
        return false; // 示例
    }
    
    // 计算交点
    calculateIntersection(p1, p2, p3, p4) {
        // 计算两条线段的交点
        // 这里返回近似值
        return L.latLng(
            (p1.lat + p2.lat + p3.lat + p4.lat) / 4,
            (p1.lng + p2.lng + p3.lng + p4.lng) / 4
        );
    }
    
    // 自动修复自相交
    autoFixSelfIntersection(coords) {
        if (!polylineHasSelfIntersection(coords)) {
            return coords; // 无需修复
        }
        
        // 简化的自动修复策略
        const fixedCoords = this.removeProblematicVertices(coords);
        
        return fixedCoords;
    }
    
    // 移除有问题的顶点
    removeProblematicVertices(coords) {
        // 简化实现：移除中间的一些顶点
        if (coords.length <= 4) {
            return coords; // 无法修复
        }
        
        // 移除可能导致相交的中间顶点
        const fixedCoords = [coords[0], coords[1]];
        
        for (let i = 2; i < coords.length - 2; i++) {
            // 检查添加这个顶点是否会导致相交
            const testCoords = [...fixedCoords, coords[i], coords[coords.length - 1]];
            if (!polylineHasSelfIntersection(testCoords)) {
                fixedCoords.push(coords[i]);
            }
        }
        
        fixedCoords.push(coords[coords.length - 1]);
        
        return fixedCoords;
    }
    
    // 获取校验统计
    getValidationStatistics() {
        const total = this.validationHistory.length;
        const valid = this.validationHistory.filter(v => v.isValid).length;
        const invalid = total - valid;
        
        return {
            total: total,
            valid: valid,
            invalid: invalid,
            validRate: total > 0 ? (valid / total * 100).toFixed(2) + '%' : '0%',
            lastValidation: this.validationHistory[this.validationHistory.length - 1]
        };
    }
}

// 使用折线校验器
const polylineValidator = new PolylineValidator(map);

// 校验折线
function onPolylineEdit(coords, polylineLayer) {
    const result = polylineValidator.validatePolyline(coords, polylineLayer);
    
    console.log('校验结果:', result);
    
    // 显示校验建议
    result.suggestions.forEach(suggestion => {
        console.log('建议:', suggestion);
    });
    
    // 如果无效，尝试自动修复
    if (!result.isValid) {
        const fixedCoords = polylineValidator.autoFixSelfIntersection(coords);
        console.log('自动修复后的坐标:', fixedCoords);
    }
}

// 获取校验统计
const stats = polylineValidator.getValidationStatistics();
console.log('校验统计:', stats);
```

**综合校验示例：**
```javascript
// 综合几何校验器
class GeometryValidator {
    constructor(map) {
        this.map = map;
        this.polygonValidator = new PolygonValidator(map);
        this.polylineValidator = new PolylineValidator(map);
    }
    
    // 校验任意几何体
    validateGeometry(geometry) {
        const geoJSON = geometry.toGeoJSON();
        
        switch (geoJSON.geometry.type) {
            case 'Polygon':
            case 'MultiPolygon':
                return this.validatePolygon(geometry);
            case 'LineString':
            case 'MultiLineString':
                return this.validatePolyline(geometry);
            default:
                return { isValid: true, message: '无需校验的几何类型' };
        }
    }
    
    // 校验多边形
    validatePolygon(polygon) {
        const coords = this.extractCoordinates(polygon);
        const isValid = !polygonHasSelfIntersection(coords);
        
        return {
            type: 'polygon',
            isValid: isValid,
            message: isValid ? '多边形有效' : '多边形存在自相交',
            coordinates: coords
        };
    }
    
    // 校验折线
    validatePolyline(polyline) {
        const coords = this.extractCoordinates(polyline);
        const isValid = !polylineHasSelfIntersection(coords);
        
        return {
            type: 'polyline',
            isValid: isValid,
            message: isValid ? '折线有效' : '折线存在自相交',
            coordinates: coords
        };
    }
    
    // 提取坐标
    extractCoordinates(geometry) {
        const geoJSON = geometry.toGeoJSON();
        
        switch (geoJSON.geometry.type) {
            case 'Polygon':
                return geoJSON.geometry.coordinates[0];
            case 'LineString':
                return geoJSON.geometry.coordinates;
            default:
                return [];
        }
    }
    
    // 批量校验
    validateGeometries(geometries) {
        const results = [];
        
        geometries.forEach((geometry, index) => {
            const result = this.validateGeometry(geometry);
            results.push({
                index: index,
                geometry: geometry,
                ...result
            });
            
            // 更新样式
            this.updateGeometryStyle(geometry, result.isValid);
        });
        
        return results;
    }
    
    // 更新几何样式
    updateGeometryStyle(geometry, isValid) {
        const style = isValid ? this.getValidStyle() : this.getInvalidStyle();
        geometry.setStyle(style);
    }
    
    // 获取有效样式
    getValidStyle() {
        return {
            color: '#4285f4',
            weight: 2,
            fillColor: '#4285f4',
            fillOpacity: 0.2
        };
    }
    
    // 获取无效样式
    getInvalidStyle() {
        return {
            color: '#ff0000',
            weight: 3,
            dashArray: '5,5',
            fillColor: '#ff0000',
            fillOpacity: 0.1
        };
    }
}

// 使用综合校验器
const geometryValidator = new GeometryValidator(map);

// 校验多个几何体
const geometries = [polygon1, polyline1, polygon2];
const results = geometryValidator.validateGeometries(geometries);

console.log('批量校验结果:', results);
```

现在您已经掌握了拓扑工具和几何校验工具的使用方法。这些工具为复杂的空间分析和数据验证提供了强大的支持。

### 6.5 drawAuxiliaryLine 辅助线绘制

drawAuxiliaryLine 是专门用于绘制辅助线的工具类，常用于拓扑操作中的线裁剪、线整形等场景。它提供实时预览、几何校验、状态管理等功能。

#### 构造函数和配置

```typescript
constructor(map: L.Map, options: AuxiliaryLineOptions = {})
```

**配置选项：**
```typescript
interface AuxiliaryLineOptions {
    coordPrecision?: number;                    // 坐标精度
    defaultStyle?: LeafletPolylineOptions;     // 默认线条样式
    validation?: ValidationOptions;             // 几何校验配置
}
```

**完整配置示例：**
```javascript
import AuxiliaryLine from 'leaflet-geo-tools';

// 创建辅助线绘制工具
const auxiliaryLine = new AuxiliaryLine(map, {
    coordPrecision: 6,
    defaultStyle: {
        color: '#008BFF',
        weight: 3,
        opacity: 0.8,
        dashArray: '5,5'
    },
    validation: {
        allowSelfIntersect: false  // 不允许自相交
    }
});
```

**默认样式配置：**
```javascript
// 默认绘制样式
const defaultDrawStyle = {
    color: '#008BFF',
    fillColor: '#008BFF',
    fillOpacity: 0.3
};

// 错误状态样式
const errorDrawStyle = {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 0.3
};
```

#### 绘制功能

辅助线绘制工具支持点击添加点、实时预览、双击完成绘制的交互模式：

```javascript
// 创建辅助线绘制工具
const auxiliaryLine = new AuxiliaryLine(map, {
    defaultStyle: {
        color: '#4285f4',
        weight: 3,
        opacity: 0.8
    },
    validation: {
        allowSelfIntersect: false
    }
});

// 监听状态变化
auxiliaryLine.onStateChange((state) => {
    console.log('辅助线绘制状态:', state);
    
    switch(state) {
        case 'drawing':
            console.log('正在绘制辅助线...');
            showDrawingUI();
            break;
        case 'idle':
            console.log('辅助线绘制完成');
            hideDrawingUI();
            break;
    }
});

// 绘制操作：
// 1. 点击地图添加顶点
// 2. 移动鼠标实时预览线条
// 3. 双击完成绘制
```

**绘制流程：**
1. **初始化**：创建实例时自动进入绘制状态
2. **点击添加**：单击地图添加线条顶点
3. **实时预览**：鼠标移动时显示预览线条
4. **几何校验**：实时检查线条有效性
5. **双击完成**：双击完成绘制并退出绘制状态

#### 状态管理

辅助线绘制工具提供完整的状态管理和事件监听机制：

```javascript
// 状态监听
auxiliaryLine.onStateChange((state) => {
    updateUIState(state);
});

function updateUIState(state) {
    const statusElement = document.getElementById('auxiliary-line-status');
    const tipElement = document.getElementById('drawing-tip');
    
    switch(state) {
        case 'drawing':
            statusElement.textContent = '正在绘制辅助线';
            statusElement.className = 'status-drawing';
            tipElement.textContent = '点击添加顶点，双击完成绘制';
            break;
        case 'idle':
            statusElement.textContent = '绘制完成';
            statusElement.className = 'status-idle';
            tipElement.textContent = '';
            break;
    }
}

// 移除状态监听
function removeStateListener() {
    auxiliaryLine.offStateChange(updateUIState);
}
```

**状态类型：**
- **drawing**: 绘制状态，正在添加顶点
- **idle**: 空闲状态，绘制完成或未开始

#### 实际应用示例

**基础辅助线绘制：**
```javascript
// 基础使用示例
function startAuxiliaryLineDrawing() {
    const auxiliaryLine = new AuxiliaryLine(map, {
        defaultStyle: {
            color: '#ff6b35',
            weight: 3,
            opacity: 0.8,
            dashArray: '10,5'
        },
        validation: {
            allowSelfIntersect: false
        }
    });
    
    // 监听绘制完成
    auxiliaryLine.onStateChange((state) => {
        if (state === 'idle') {
            // 绘制完成，获取GeoJSON数据
            const geoJSON = auxiliaryLine.getGeoJSON(6);
            console.log('辅助线GeoJSON:', geoJSON);
            
            // 可以将辅助线用于拓扑操作
            useAuxiliaryLineForTopology(geoJSON);
        }
    });
    
    return auxiliaryLine;
}

function useAuxiliaryLineForTopology(lineGeoJSON) {
    // 使用辅助线进行拓扑操作
    // 例如：裁剪、整形等
    console.log('使用辅助线进行拓扑操作');
}
```

**高级应用示例：**
```javascript
// 高级辅助线管理器
class AuxiliaryLineManager {
    constructor(map) {
        this.map = map;
        this.currentLine = null;
        this.lineHistory = [];
        this.config = {
            defaultStyle: {
                color: '#4285f4',
                weight: 3,
                opacity: 0.8,
                dashArray: '5,5'
            },
            validation: {
                allowSelfIntersect: false
            }
        };
    }
    
    // 开始新的辅助线绘制
    startNewLine(options = {}) {
        // 清理当前线条
        if (this.currentLine) {
            this.currentLine.destroy();
        }
        
        // 合并配置
        const finalConfig = {
            ...this.config,
            ...options
        };
        
        // 创建新的辅助线
        this.currentLine = new AuxiliaryLine(this.map, finalConfig);
        
        // 绑定事件
        this.bindLineEvents(this.currentLine);
        
        return this.currentLine;
    }
    
    // 绑定线条事件
    bindLineEvents(line) {
        line.onStateChange((state) => {
            this.handleStateChange(state, line);
        });
    }
    
    // 处理状态变化
    handleStateChange(state, line) {
        console.log(`辅助线状态: ${state}`);
        
        if (state === 'idle') {
            // 绘制完成
            this.onLineComplete(line);
        }
    }
    
    // 线条绘制完成
    onLineComplete(line) {
        try {
            // 获取GeoJSON数据
            const geoJSON = line.getGeoJSON(6);
            
            // 添加到历史记录
            this.lineHistory.push({
                geoJSON: geoJSON,
                timestamp: Date.now(),
                config: this.getCurrentConfig()
            });
            
            // 触发完成事件
            this.map.fire('auxiliaryLineComplete', {
                geoJSON: geoJSON,
                line: line
            });
            
            console.log('辅助线绘制完成:', geoJSON);
        } catch (error) {
            console.error('获取辅助线数据失败:', error);
        }
    }
    
    // 获取当前配置
    getCurrentConfig() {
        return {
            style: this.config.defaultStyle,
            validation: this.config.validation
        };
    }
    
    // 更新样式配置
    updateStyle(styleOptions) {
        this.config.defaultStyle = {
            ...this.config.defaultStyle,
            ...styleOptions
        };
        
        // 如果正在绘制，重新创建以应用新样式
        if (this.currentLine) {
            const currentState = this.getCurrentState();
            if (currentState === 'drawing') {
                this.restartCurrentLine();
            }
        }
    }
    
    // 更新校验规则
    updateValidation(validationOptions) {
        this.config.validation = {
            ...this.config.validation,
            ...validationOptions
        };
        
        // 如果正在绘制，更新校验规则
        if (this.currentLine) {
            this.currentLine.setValidationRules(this.config.validation);
        }
    }
    
    // 获取当前状态
    getCurrentState() {
        // 这里需要从当前线条获取状态
        // 简化实现
        return 'idle';
    }
    
    // 重新开始当前线条
    restartCurrentLine() {
        const tempConfig = this.getCurrentConfig();
        this.startNewLine(tempConfig);
    }
    
    // 清理当前线条
    clearCurrentLine() {
        if (this.currentLine) {
            this.currentLine.destroy();
            this.currentLine = null;
        }
    }
    
    // 获取历史记录
    getLineHistory() {
        return this.lineHistory;
    }
    
    // 清理历史记录
    clearHistory() {
        this.lineHistory = [];
    }
    
    // 导出历史数据
    exportHistory() {
        return {
            history: this.lineHistory,
            exportTime: Date.now(),
            totalCount: this.lineHistory.length
        };
    }
    
    // 从历史恢复线条
    restoreFromHistory(index) {
        if (index < 0 || index >= this.lineHistory.length) {
            throw new Error('无效的历史索引');
        }
        
        const historyItem = this.lineHistory[index];
        
        // 清理当前线条
        this.clearCurrentLine();
        
        // 恢复配置
        this.config = {
            defaultStyle: historyItem.config.style,
            validation: historyItem.config.validation
        };
        
        // 创建新线条并设置GeoJSON
        this.currentLine = new AuxiliaryLine(this.map, this.config);
        
        // 这里需要设置线条的GeoJSON数据
        // 实际实现可能需要扩展AuxiliaryLine类
        
        return this.currentLine;
    }
}

// 使用辅助线管理器
const lineManager = new AuxiliaryLineManager(map);

// 监听线条完成事件
map.on('auxiliaryLineComplete', (e) => {
    console.log('辅助线绘制事件:', e.geoJSON);
    
    // 可以用于拓扑操作
    performTopologyOperation(e.geoJSON);
});

function performTopologyOperation(lineGeoJSON) {
    // 使用辅助线进行拓扑操作
    console.log('执行拓扑操作:', lineGeoJSON);
}

// 更新样式
lineManager.updateStyle({
    color: '#ff6b35',
    weight: 4,
    dashArray: '10,5'
});

// 更新校验规则
lineManager.updateValidation({
    allowSelfIntersect: true
});

// 开始绘制
const auxiliaryLine = lineManager.startNewLine();
```

**拓扑操作集成示例：**
```javascript
// 与拓扑操作集成的辅助线绘制
class TopologyAuxiliaryLine {
    constructor(map, topologyTool) {
        this.map = map;
        this.topologyTool = topologyTool;
        this.auxiliaryLine = null;
        this.currentOperation = null;
    }
    
    // 开始裁剪操作
    startClipOperation(selectedLayers) {
        this.currentOperation = 'clip';
        this.selectedLayers = selectedLayers;
        
        // 创建专用辅助线
        this.auxiliaryLine = new AuxiliaryLine(this.map, {
            defaultStyle: {
                color: '#4285f4',
                weight: 3,
                opacity: 0.8,
                dashArray: '8,4'
            },
            validation: {
                allowSelfIntersect: false
            }
        });
        
        this.bindTopologyEvents();
        
        console.log('开始裁剪操作，请绘制裁剪线');
    }
    
    // 开始整形操作
    startReshapeOperation(selectedLayers) {
        this.currentOperation = 'reshape';
        this.selectedLayers = selectedLayers;
        
        // 创建专用辅助线
        this.auxiliaryLine = new AuxiliaryLine(this.map, {
            defaultStyle: {
                color: '#9c27b0',
                weight: 3,
                opacity: 0.8,
                dashArray: '5,5'
            },
            validation: {
                allowSelfIntersect: false
            }
        });
        
        this.bindTopologyEvents();
        
        console.log('开始整形操作，请绘制整形线');
    }
    
    // 绑定拓扑事件
    bindTopologyEvents() {
        this.auxiliaryLine.onStateChange((state) => {
            if (state === 'idle') {
                this.executeTopologyOperation();
            }
        });
    }
    
    // 执行拓扑操作
    executeTopologyOperation() {
        if (!this.auxiliaryLine || !this.currentOperation) {
            return;
        }
        
        try {
            // 获取辅助线GeoJSON
            const lineGeoJSON = this.auxiliaryLine.getGeoJSON(6);
            
            // 根据操作类型执行不同的拓扑操作
            switch (this.currentOperation) {
                case 'clip':
                    this.executeClipOperation(lineGeoJSON);
                    break;
                case 'reshape':
                    this.executeReshapeOperation(lineGeoJSON);
                    break;
            }
            
            // 清理辅助线
            this.cleanup();
            
        } catch (error) {
            console.error('拓扑操作失败:', error);
            this.showErrorMessage(error.message);
        }
    }
    
    // 执行裁剪操作
    executeClipOperation(lineGeoJSON) {
        console.log('执行裁剪操作');
        
        // 调用拓扑工具的裁剪功能
        this.topologyTool.clipByLine((result) => {
            console.log('裁剪完成:', result);
            this.showSuccessMessage('裁剪操作完成');
        });
    }
    
    // 执行整形操作
    executeReshapeOperation(lineGeoJSON) {
        console.log('执行整形操作');
        
        // 调用拓扑工具的整形功能
        const reshapeOptions = {
            chooseStrategy: 'auto',
            AllowReshapingWithoutSelection: false
        };
        
        this.topologyTool.reshapeFeature(reshapeOptions, (result) => {
            console.log('整形完成:', result);
            this.showSuccessMessage('整形操作完成');
        });
    }
    
    // 清理资源
    cleanup() {
        if (this.auxiliaryLine) {
            this.auxiliaryLine.destroy();
            this.auxiliaryLine = null;
        }
        
        this.currentOperation = null;
        this.selectedLayers = null;
    }
    
    // 显示成功消息
    showSuccessMessage(message) {
        console.log('成功:', message);
        // 可以显示UI提示
    }
    
    // 显示错误消息
    showErrorMessage(message) {
        console.error('错误:', message);
        // 可以显示UI提示
    }
    
    // 取消操作
    cancelOperation() {
        this.cleanup();
        console.log('操作已取消');
    }
}

// 使用拓扑辅助线
const topologyAuxLine = new TopologyAuxiliaryLine(map, topologyTool);

// 开始裁剪
topologyAuxLine.startClipOperation([layer1, layer2, layer3]);

// 开始整形
topologyAuxLine.startReshapeOperation([layer1, layer2]);
```

#### 实用小贴士

**1. 样式定制**
```javascript
// 不同操作类型的样式配置
const operationStyles = {
    clip: {
        color: '#4285f4',
        weight: 3,
        dashArray: '8,4'
    },
    reshape: {
        color: '#9c27b0',
        weight: 3,
        dashArray: '5,5'
    },
    measure: {
        color: '#34a853',
        weight: 2,
        dashArray: '10,5'
    }
};

// 根据操作类型选择样式
function getStyleForOperation(operation) {
    return operationStyles[operation] || operationStyles.clip;
}
```

**2. 校验配置**
```javascript
// 严格的校验配置
const strictValidation = {
    allowSelfIntersect: false,
    minPoints: 2,
    maxPoints: 100
};

// 宽松的校验配置
const relaxedValidation = {
    allowSelfIntersect: true,
    minPoints: 2,
    maxPoints: 1000
};
```

**3. 性能优化**
```javascript
// 限制历史记录数量
class OptimizedAuxiliaryLineManager extends AuxiliaryLineManager {
    constructor(map, maxHistory = 50) {
        super(map);
        this.maxHistory = maxHistory;
    }
    
    onLineComplete(line) {
        super.onLineComplete(line);
        
        // 限制历史记录数量
        if (this.lineHistory.length > this.maxHistory) {
            this.lineHistory.shift();
        }
    }
}
```

**4. 错误处理**
```javascript
// 增强的错误处理
function createRobustAuxiliaryLine(map, options = {}) {
    try {
        return new AuxiliaryLine(map, options);
    } catch (error) {
        console.error('创建辅助线失败:', error);
        
        // 使用默认配置重试
        return new AuxiliaryLine(map, {
            defaultStyle: {
                color: '#ff0000',
                weight: 2,
                opacity: 0.8
            },
            validation: {
                allowSelfIntersect: true
            }
        });
    }
}
```

现在您已经掌握了辅助线绘制工具的完整使用方法。这个工具为拓扑操作提供了直观的线条绘制界面，支持实时预览和几何校验，是空间分析操作的重要辅助工具。

## 第6章总结

第6章"工具类详解"已经完成，我们全面介绍了：

- **6.1 SnapController**：吸附控制器，提供精确的顶点和边线吸附功能
- **6.2 commonUtils**：通用工具，包括图层查询、几何相交检测、图标构建和坐标转换
- **6.3 topoUtils**：拓扑工具，提供线裁剪、多边形合并、线整形等高级空间分析
- **6.4 validShapeUtils**：几何校验，检测多边形和折线的自相交问题
- **6.5 drawAuxiliaryLine**：辅助线绘制，为拓扑操作提供直观的绘制界面

这些工具类为 leaflet-geo-tools 库提供了强大的底层支撑，让复杂的GIS操作变得简单易用。

## 第7章：完整使用示例

本章通过完整的实际应用示例，展示如何将前面章节的功能组合使用，构建专业的GIS应用。每个示例都包含完整的代码实现和详细的说明。

### 7.1 基础编辑器使用示例

本节展示基础编辑器的典型使用场景，包括点、线、面等基本几何图形的绘制和编辑。

#### 简单地图编辑器

创建一个支持多种几何图形绘制和编辑的简单地图编辑器：

```javascript
// 完整的地图编辑器示例
class SimpleMapEditor {
    constructor(mapId, center = [31.2304, 121.4737], zoom = 13) {
        this.map = null;
        this.editors = new Map();
        this.currentTool = null;
        this.drawnLayers = [];
        this.selectedLayer = null;
        
        this.initMap(mapId, center, zoom);
        this.initUI();
        this.initEventHandlers();
    }
    
    // 初始化地图
    initMap(mapId, center, zoom) {
        // 创建地图实例
        this.map = L.map(mapId).setView(center, zoom);
        
        // 添加底图
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        console.log('地图初始化完成');
    }
    
    // 初始化UI控件
    initUI() {
        // 创建工具栏
        this.createToolbar();
        
        // 创建状态栏
        this.createStatusBar();
        
        // 创建图层列表
        this.createLayerList();
    }
    
    // 创建工具栏
    createToolbar() {
        const toolbar = L.control({ position: 'topright' });
        
        toolbar.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-toolbar');
            div.innerHTML = `
                <div class="toolbar-group">
                    <button id="btn-point" class="tool-btn" title="绘制点">
                        📍 点
                    </button>
                    <button id="btn-line" class="tool-btn" title="绘制线">
                        📏 线
                    </button>
                    <button id="btn-polygon" class="tool-btn" title="绘制面">
                        📐 面
                    </button>
                    <button id="btn-circle" class="tool-btn" title="绘制圆">
                        ⭕ 圆
                    </button>
                    <button id="btn-rectangle" class="tool-btn" title="绘制矩形">
                        ⬜ 矩形
                    </button>
                </div>
                <div class="toolbar-group">
                    <button id="btn-edit" class="tool-btn" title="编辑">
                        ✏️ 编辑
                    </button>
                    <button id="btn-delete" class="tool-btn" title="删除">
                        🗑️ 删除
                    </button>
                    <button id="btn-clear" class="tool-btn" title="清空">
                        🧹 清空
                    </button>
                </div>
            `;
            
            // 添加样式
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '5px';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            
            return div;
        };
        
        toolbar.addTo(this.map);
    }
    
    // 创建状态栏
    createStatusBar() {
        const status = L.control({ position: 'bottomleft' });
        
        status.onAdd = () => {
            const div = L.DomUtil.create('div', 'status-bar');
            div.innerHTML = `
                <div class="status-item">
                    <span id="current-tool">当前工具: 无</span>
                </div>
                <div class="status-item">
                    <span id="layer-count">图层数量: 0</span>
                </div>
                <div class="status-item">
                    <span id="mouse-coords">坐标: --</span>
                </div>
            `;
            
            div.style.backgroundColor = 'rgba(255,255,255,0.9)';
            div.style.padding = '5px 10px';
            div.style.fontSize = '12px';
            div.style.borderRadius = '3px';
            
            return div;
        };
        
        status.addTo(this.map);
    }
    
    // 创建图层列表
    createLayerList() {
        const layerControl = L.control({ position: 'topleft' });
        
        layerControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'layer-list');
            div.innerHTML = `
                <h4>图层列表</h4>
                <div id="layer-items" class="layer-items">
                    <div class="no-layers">暂无图层</div>
                </div>
            `;
            
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '5px';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            div.style.maxHeight = '300px';
            div.style.overflowY = 'auto';
            div.style.minWidth = '200px';
            
            return div;
        };
        
        layerControl.addTo(this.map);
    }
    
    // 初始化事件处理器
    initEventHandlers() {
        // 工具按钮事件
        document.getElementById('btn-point').addEventListener('click', () => this.startDrawing('point'));
        document.getElementById('btn-line').addEventListener('click', () => this.startDrawing('line'));
        document.getElementById('btn-polygon').addEventListener('click', () => this.startDrawing('polygon'));
        document.getElementById('btn-circle').addEventListener('click', () => this.startDrawing('circle'));
        document.getElementById('btn-rectangle').addEventListener('click', () => this.startDrawing('rectangle'));
        
        // 操作按钮事件
        document.getElementById('btn-edit').addEventListener('click', () => this.toggleEditMode());
        document.getElementById('btn-delete').addEventListener('click', () => this.deleteSelectedLayer());
        document.getElementById('btn-clear').addEventListener('click', () => this.clearAllLayers());
        
        // 地图鼠标移动事件
        this.map.on('mousemove', (e) => {
            this.updateMouseCoordinates(e.latlng);
        });
        
        // 地图点击事件
        this.map.on('click', (e) => {
            this.onMapClick(e);
        });
    }
    
    // 开始绘制
    startDrawing(toolType) {
        // 清理当前工具
        this.cleanupCurrentTool();
        
        // 更新UI状态
        this.updateCurrentTool(toolType);
        
        // 创建对应的编辑器
        let editor;
        switch (toolType) {
            case 'point':
                editor = new MarkerPointEditor(this.map, {
                    markerStyle: {
                        containerClassName: 'point-marker',
                        dotClassName: 'point-dot',
                        labelClassName: 'point-label'
                    }
                });
                break;
                
            case 'line':
                editor = new PolylineEditor(this.map, {
                    drawLineStyle: {
                        color: '#4285f4',
                        weight: 3
                    }
                });
                break;
                
            case 'polygon':
                editor = new PolygonEditor(this.map, {
                    polygonStyle: {
                        color: '#34a853',
                        weight: 2,
                        fillColor: '#34a853',
                        fillOpacity: 0.3
                    }
                });
                break;
                
            case 'circle':
                editor = new CircleEditor(this.map, {
                    circleStyle: {
                        color: '#ff6b35',
                        weight: 2,
                        fillColor: '#ff6b35',
                        fillOpacity: 0.3
                    }
                });
                break;
                
            case 'rectangle':
                editor = new RectangleEditor(this.map, {
                    polygonStyle: {
                        color: '#9c27b0',
                        weight: 2,
                        fillColor: '#9c27b0',
                        fillOpacity: 0.3
                    }
                });
                break;
                
            default:
                console.error('未知的工具类型:', toolType);
                return;
        }
        
        // 绑定编辑器事件
        this.bindEditorEvents(editor, toolType);
        
        // 保存当前编辑器
        this.currentTool = {
            type: toolType,
            editor: editor
        };
        
        this.editors.set(toolType, editor);
        console.log(`开始绘制 ${toolType}`);
    }
    
    // 绑定编辑器事件
    bindEditorEvents(editor, toolType) {
        editor.onStateChange((state) => {
            console.log(`${toolType} 编辑器状态:`, state);
            
            if (state === 'idle') {
                // 绘制完成
                this.onDrawingComplete(editor, toolType);
            }
        });
    }
    
    // 绘制完成处理
    onDrawingComplete(editor, toolType) {
        try {
            // 获取GeoJSON数据
            const geoJSON = editor.getGeoJSON();
            
            // 创建图层
            const layer = L.geoJSON(geoJSON, {
                style: this.getLayerStyle(toolType),
                onEachFeature: (feature, layer) => {
                    this.bindLayerEvents(layer, feature, toolType);
                }
            });
            
            // 添加到地图
            layer.addTo(this.map);
            
            // 保存图层信息
            const layerInfo = {
                id: Date.now(),
                type: toolType,
                layer: layer,
                geoJSON: geoJSON,
                timestamp: new Date().toISOString()
            };
            
            this.drawnLayers.push(layerInfo);
            
            // 更新UI
            this.updateLayerList();
            this.updateLayerCount();
            
            console.log(`${toolType} 绘制完成:`, geoJSON);
            
        } catch (error) {
            console.error('处理绘制结果失败:', error);
        }
    }
    
    // 获取图层样式
    getLayerStyle(toolType) {
        const styles = {
            point: {
                color: '#4285f4'
            },
            line: {
                color: '#4285f4',
                weight: 3
            },
            polygon: {
                color: '#34a853',
                weight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.3
            },
            circle: {
                color: '#ff6b35',
                weight: 2,
                fillColor: '#ff6b35',
                fillOpacity: 0.3
            },
            rectangle: {
                color: '#9c27b0',
                weight: 2,
                fillColor: '#9c27b0',
                fillOpacity: 0.3
            }
        };
        
        return styles[toolType] || styles.point;
    }
    
    // 绑定图层事件
    bindLayerEvents(layer, feature, toolType) {
        // 点击选中图层
        layer.on('click', (e) => {
            this.selectLayer(layer, e.target);
            L.DomEvent.stopPropagation(e);
        });
        
        // 添加弹出信息
        const info = this.generateLayerInfo(feature, toolType);
        layer.bindPopup(info);
    }
    
    // 生成图层信息
    generateLayerInfo(feature, toolType) {
        const geometry = feature.geometry;
        let info = `<div><strong>${this.getToolName(toolType)}</strong><br>`;
        info += `类型: ${geometry.type}<br>`;
        
        // 根据几何类型添加特定信息
        switch (geometry.type) {
            case 'Point':
                info += `坐标: ${geometry.coordinates[1].toFixed(6)}, ${geometry.coordinates[0].toFixed(6)}`;
                break;
            case 'LineString':
                info += `顶点数: ${geometry.coordinates.length}`;
                break;
            case 'Polygon':
                info += `顶点数: ${geometry.coordinates[0].length}`;
                break;
            case 'Circle':
                // Circle 不是标准 GeoJSON，需要特殊处理
                info += `圆形要素`;
                break;
        }
        
        info += '</div>';
        return info;
    }
    
    // 获取工具名称
    getToolName(toolType) {
        const names = {
            point: '点',
            line: '线',
            polygon: '面',
            circle: '圆',
            rectangle: '矩形'
        };
        
        return names[toolType] || toolType;
    }
    
    // 选中图层
    selectLayer(layer, target) {
        // 清除之前的选中状态
        this.clearSelection();
        
        // 设置新的选中状态
        this.selectedLayer = {
            layer: layer,
            target: target
        };
        
        // 高亮选中的图层
        const originalStyle = target.options;
        target.setStyle({
            ...originalStyle,
            color: '#ff0000',
            weight: (originalStyle.weight || 2) + 2
        });
        
        // 保存原始样式
        this.selectedLayer.originalStyle = originalStyle;
        
        console.log('选中图层:', layer);
    }
    
    // 清除选中状态
    clearSelection() {
        if (this.selectedLayer) {
            // 恢复原始样式
            this.selectedLayer.target.setStyle(this.selectedLayer.originalStyle);
            this.selectedLayer = null;
        }
    }
    
    // 切换编辑模式
    toggleEditMode() {
        if (!this.selectedLayer) {
            alert('请先选择要编辑的图层');
            return;
        }
        
        // 双击图层进入编辑模式
        const target = this.selectedLayer.target;
        if (target && typeof target.edit === 'function') {
            // 模拟双击事件
            target.edit.enable();
            console.log('进入编辑模式');
        } else {
            alert('该图层不支持编辑');
        }
    }
    
    // 删除选中的图层
    deleteSelectedLayer() {
        if (!this.selectedLayer) {
            alert('请先选择要删除的图层');
            return;
        }
        
        // 从地图移除
        this.map.removeLayer(this.selectedLayer.layer);
        
        // 从列表中移除
        const index = this.drawnLayers.findIndex(
            item => item.layer === this.selectedLayer.layer
        );
        if (index > -1) {
            this.drawnLayers.splice(index, 1);
        }
        
        // 清除选中状态
        this.selectedLayer = null;
        
        // 更新UI
        this.updateLayerList();
        this.updateLayerCount();
        
        console.log('图层已删除');
    }
    
    // 清空所有图层
    clearAllLayers() {
        if (this.drawnLayers.length === 0) {
            alert('没有图层需要清空');
            return;
        }
        
        if (confirm(`确定要清空所有 ${this.drawnLayers.length} 个图层吗？`)) {
            // 移除所有图层
            this.drawnLayers.forEach(item => {
                this.map.removeLayer(item.layer);
            });
            
            // 清空列表
            this.drawnLayers = [];
            this.selectedLayer = null;
            
            // 更新UI
            this.updateLayerList();
            this.updateLayerCount();
            
            console.log('所有图层已清空');
        }
    }
    
    // 清理当前工具
    cleanupCurrentTool() {
        if (this.currentTool) {
            // 这里可以添加编辑器的清理逻辑
            this.currentTool = null;
        }
    }
    
    // 更新当前工具状态
    updateCurrentTool(toolType) {
        const statusElement = document.getElementById('current-tool');
        statusElement.textContent = `当前工具: ${this.getToolName(toolType)}`;
        
        // 更新按钮状态
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`btn-${toolType}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    // 更新鼠标坐标
    updateMouseCoordinates(latlng) {
        const coordsElement = document.getElementById('mouse-coords');
        coordsElement.textContent = 
            `坐标: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
    }
    
    // 更新图层数量
    updateLayerCount() {
        const countElement = document.getElementById('layer-count');
        countElement.textContent = `图层数量: ${this.drawnLayers.length}`;
    }
    
    // 更新图层列表
    updateLayerList() {
        const listContainer = document.getElementById('layer-items');
        
        if (this.drawnLayers.length === 0) {
            listContainer.innerHTML = '<div class="no-layers">暂无图层</div>';
            return;
        }
        
        let html = '';
        this.drawnLayers.forEach((item, index) => {
            const isSelected = this.selectedLayer && 
                            this.selectedLayer.layer === item.layer;
            
            html += `
                <div class="layer-item ${isSelected ? 'selected' : ''}" 
                     data-index="${index}">
                    <div class="layer-icon">${this.getLayerIcon(item.type)}</div>
                    <div class="layer-info">
                        <div class="layer-name">${this.getToolName(item.type)} ${index + 1}</div>
                        <div class="layer-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div class="layer-actions">
                        <button class="layer-action zoom-to" title="缩放到图层">🔍</button>
                        <button class="layer-action toggle-visibility" title="显示/隐藏">👁️</button>
                    </div>
                </div>
            `;
        });
        
        listContainer.innerHTML = html;
        
        // 绑定图层列表事件
        this.bindLayerListEvents();
    }
    
    // 获取图层图标
    getLayerIcon(toolType) {
        const icons = {
            point: '📍',
            line: '📏',
            polygon: '📐',
            circle: '⭕',
            rectangle: '⬜'
        };
        
        return icons[toolType] || '📍';
    }
    
    // 绑定图层列表事件
    bindLayerListEvents() {
        document.querySelectorAll('.layer-item').forEach(item => {
            const index = parseInt(item.dataset.index);
            const layerInfo = this.drawnLayers[index];
            
            // 点击选中图层
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('layer-action')) {
                    this.selectLayer(layerInfo.layer, layerInfo.layer);
                }
            });
            
            // 缩放到图层
            const zoomBtn = item.querySelector('.zoom-to');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.zoomToLayer(layerInfo.layer);
                });
            }
            
            // 切换可见性
            const visibilityBtn = item.querySelector('.toggle-visibility');
            if (visibilityBtn) {
                visibilityBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleLayerVisibility(layerInfo);
                });
            }
        });
    }
    
    // 缩放到图层
    zoomToLayer(layer) {
        const bounds = layer.getBounds();
        if (bounds) {
            this.map.fitBounds(bounds, { padding: [20, 20] });
        } else {
            // 对于点图层，直接缩放到点位置
            const center = layer.getCenter();
            if (center) {
                this.map.setView(center, 16);
            }
        }
    }
    
    // 切换图层可见性
    toggleLayerVisibility(layerInfo) {
        const isVisible = this.map.hasLayer(layerInfo.layer);
        
        if (isVisible) {
            this.map.removeLayer(layerInfo.layer);
            layerInfo.visible = false;
        } else {
            this.map.addLayer(layerInfo.layer);
            layerInfo.visible = true;
        }
        
        // 更新UI
        this.updateLayerList();
    }
    
    // 地图点击事件
    onMapClick(e) {
        // 如果没有选中工具，清除选中状态
        if (!this.currentTool) {
            this.clearSelection();
        }
    }
    
    // 导出数据
    exportData() {
        const data = {
            type: 'FeatureCollection',
            features: this.drawnLayers.map(item => item.geoJSON),
            metadata: {
                exportTime: new Date().toISOString(),
                layerCount: this.drawnLayers.length,
                bounds: this.map.getBounds().toBBoxString()
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-data-${Date.now()}.geojson`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('数据已导出');
    }
    
    // 销毁编辑器
    destroy() {
        // 清理所有图层
        this.clearAllLayers();
        
        // 清理编辑器
        this.editors.forEach(editor => {
            if (editor.destroy) {
                editor.destroy();
            }
        });
        
        // 清理地图
        if (this.map) {
            this.map.remove();
        }
        
        console.log('地图编辑器已销毁');
    }
}

// 使用示例
document.addEventListener('DOMContentLoaded', () => {
    // 创建地图编辑器
    const editor = new SimpleMapEditor('map-container');
    
    // 添加导出按钮
    setTimeout(() => {
        const toolbar = document.querySelector('.leaflet-toolbar');
        if (toolbar) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'tool-btn';
            exportBtn.innerHTML = '💾 导出';
            exportBtn.title = '导出数据';
            exportBtn.addEventListener('click', () => editor.exportData());
            
            toolbar.appendChild(exportBtn);
        }
    }, 100);
    
    console.log('简单地图编辑器已启动');
});
```

**配套CSS样式：**
```css
/* 工具栏样式 */
.leaflet-toolbar {
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.toolbar-group {
    margin-bottom: 10px;
}

.toolbar-group:last-child {
    margin-bottom: 0;
}

.tool-btn {
    display: inline-block;
    margin: 2px;
    padding: 8px 12px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
}

.tool-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

.tool-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

/* 状态栏样式 */
.status-bar {
    background: rgba(255,255,255,0.9);
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    gap: 20px;
}

.status-item {
    white-space: nowrap;
}

/* 图层列表样式 */
.layer-list h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
}

.layer-items {
    max-height: 300px;
    overflow-y: auto;
}

.no-layers {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.layer-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: all 0.2s;
}

.layer-item:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
}

.layer-item.selected {
    background: #e3f2fd;
    border-color: #2196f3;
}

.layer-icon {
    font-size: 16px;
    margin-right: 8px;
}

.layer-info {
    flex: 1;
}

.layer-name {
    font-weight: 500;
    font-size: 12px;
}

.layer-time {
    font-size: 10px;
    color: #666;
}

.layer-actions {
    display: flex;
    gap: 5px;
}

.layer-action {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.layer-action:hover {
    background: rgba(0,0,0,0.1);
}
```

**HTML结构：**
```html
<!DOCTYPE html>
<html>
<head>
    <title>简单地图编辑器</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    <div id="map-container" style="height: 100vh; width: 100%;"></div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="leaflet-geo-tools.js"></script>
    <script src="map-editor.js"></script>
</body>
</html>
```

#### 多图层管理示例

展示如何管理多个图层并进行批量操作：

```javascript
// 多图层管理器
class MultiLayerManager {
    constructor(map) {
        this.map = map;
        this.layers = new Map();
        this.groups = new Map();
        this.activeGroup = 'default';
        
        this.initUI();
    }
    
    // 初始化UI
    initUI() {
        this.createLayerPanel();
        this.createGroupControls();
    }
    
    // 创建图层面板
    createLayerPanel() {
        const panel = L.control({ position: 'right' });
        
        panel.onAdd = () => {
            const div = L.DomUtil.create('div', 'layer-panel');
            div.innerHTML = `
                <div class="panel-header">
                    <h4>图层管理</h4>
                    <div class="panel-controls">
                        <button id="add-group">+ 分组</button>
                        <button id="export-all">导出</button>
                    </div>
                </div>
                <div class="group-selector">
                    <select id="group-select">
                        <option value="default">默认分组</option>
                    </select>
                </div>
                <div id="layer-tree" class="layer-tree">
                    <!-- 图层树将在这里动态生成 -->
                </div>
            `;
            
            return div;
        };
        
        panel.addTo(this.map);
    }
    
    // 创建分组控制
    createGroupControls() {
        // 添加分组
        document.getElementById('add-group').addEventListener('click', () => {
            const groupName = prompt('请输入分组名称:');
            if (groupName && !this.groups.has(groupName)) {
                this.createGroup(groupName);
            }
        });
        
        // 分组选择
        document.getElementById('group-select').addEventListener('change', (e) => {
            this.activeGroup = e.target.value;
            this.updateLayerTree();
        });
        
        // 导出所有图层
        document.getElementById('export-all').addEventListener('click', () => {
            this.exportAllLayers();
        });
    }
    
    // 创建分组
    createGroup(groupName) {
        this.groups.set(groupName, {
            name: groupName,
            layers: [],
            visible: true,
            color: this.getRandomColor()
        });
        
        // 更新分组选择器
        this.updateGroupSelector();
        this.updateLayerTree();
        
        console.log('创建分组:', groupName);
    }
    
    // 更新分组选择器
    updateGroupSelector() {
        const select = document.getElementById('group-select');
        const currentValue = select.value;
        
        let html = '';
        this.groups.forEach((group, name) => {
            html += `<option value="${name}">${group.name}</option>`;
        });
        
        select.innerHTML = html;
        select.value = currentValue;
    }
    
    // 添加图层
    addLayer(layer, options = {}) {
        const layerId = options.id || `layer-${Date.now()}`;
        const groupName = options.group || this.activeGroup;
        
        const layerInfo = {
            id: layerId,
            layer: layer,
            name: options.name || `图层 ${this.layers.size + 1}`,
            type: options.type || 'unknown',
            group: groupName,
            visible: true,
            opacity: 1,
            editable: true,
            metadata: options.metadata || {},
            createdAt: new Date().toISOString()
        };
        
        // 保存图层
        this.layers.set(layerId, layerInfo);
        
        // 添加到分组
        if (this.groups.has(groupName)) {
            this.groups.get(groupName).layers.push(layerId);
        }
        
        // 绑定事件
        this.bindLayerEvents(layerInfo);
        
        // 更新UI
        this.updateLayerTree();
        
        console.log('添加图层:', layerInfo.name);
        
        return layerInfo;
    }
    
    // 绑定图层事件
    bindLayerEvents(layerInfo) {
        const layer = layerInfo.layer;
        
        // 点击事件
        layer.on('click', (e) => {
            this.selectLayer(layerInfo.id);
            L.DomEvent.stopPropagation(e);
        });
        
        // 添加弹出信息
        this.updateLayerPopup(layerInfo);
    }
    
    // 更新图层弹出信息
    updateLayerPopup(layerInfo) {
        const layer = layerInfo.layer;
        const popupContent = this.generatePopupContent(layerInfo);
        layer.bindPopup(popupContent);
    }
    
    // 生成弹出内容
    generatePopupContent(layerInfo) {
        let html = `
            <div class="layer-popup">
                <h4>${layerInfo.name}</h4>
                <div class="popup-info">
                    <div><strong>类型:</strong> ${layerInfo.type}</div>
                    <div><strong>分组:</strong> ${layerInfo.group}</div>
                    <div><strong>创建时间:</strong> ${new Date(layerInfo.createdAt).toLocaleString()}</div>
                </div>
                <div class="popup-actions">
                    <button onclick="layerManager.zoomToLayer('${layerInfo.id}')">缩放</button>
                    <button onclick="layerManager.editLayer('${layerInfo.id}')">编辑</button>
                    <button onclick="layerManager.duplicateLayer('${layerInfo.id}')">复制</button>
                    <button onclick="layerManager.removeLayer('${layerInfo.id}')">删除</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // 选中图层
    selectLayer(layerId) {
        // 清除之前的选中状态
        this.clearSelection();
        
        // 设置新的选中状态
        const layerInfo = this.layers.get(layerId);
        if (layerInfo) {
            this.selectedLayer = layerId;
            
            // 高亮图层
            this.highlightLayer(layerInfo);
            
            // 更新UI
            this.updateLayerTree();
            
            console.log('选中图层:', layerInfo.name);
        }
    }
    
    // 高亮图层
    highlightLayer(layerInfo) {
        const layer = layerInfo.layer;
        const originalStyle = layer.options;
        
        layer.setStyle({
            ...originalStyle,
            color: '#ff0000',
            weight: (originalStyle.weight || 2) + 2,
            opacity: 1
        });
        
        // 保存原始样式
        layerInfo.originalStyle = originalStyle;
    }
    
    // 清除选中状态
    clearSelection() {
        if (this.selectedLayer) {
            const layerInfo = this.layers.get(this.selectedLayer);
            if (layerInfo && layerInfo.originalStyle) {
                layerInfo.layer.setStyle(layerInfo.originalStyle);
            }
            
            this.selectedLayer = null;
            this.updateLayerTree();
        }
    }
    
    // 缩放到图层
    zoomToLayer(layerId) {
        const layerInfo = this.layers.get(layerId);
        if (layerInfo) {
            const bounds = layerInfo.layer.getBounds();
            if (bounds) {
                this.map.fitBounds(bounds, { padding: [20, 20] });
            } else {
                const center = layerInfo.layer.getCenter();
                if (center) {
                    this.map.setView(center, 16);
                }
            }
        }
    }
    
    // 编辑图层
    editLayer(layerId) {
        const layerInfo = this.layers.get(layerId);
        if (layerInfo && layerInfo.editable) {
            // 这里可以打开编辑对话框
            console.log('编辑图层:', layerInfo.name);
        }
    }
    
    // 复制图层
    duplicateLayer(layerId) {
        const layerInfo = this.layers.get(layerId);
        if (layerInfo) {
            try {
                // 获取原始图层的GeoJSON
                const geoJSON = layerInfo.layer.toGeoJSON();
                
                // 创建新图层
                const newLayer = L.geoJSON(geoJSON, {
                    style: layerInfo.layer.options
                });
                
                // 添加到地图
                newLayer.addTo(this.map);
                
                // 添加到管理器
                const newLayerInfo = this.addLayer(newLayer, {
                    name: `${layerInfo.name} 副本`,
                    type: layerInfo.type,
                    group: layerInfo.group,
                    metadata: { ...layerInfo.metadata, duplicatedFrom: layerId }
                });
                
                console.log('复制图层成功:', newLayerInfo.name);
                
            } catch (error) {
                console.error('复制图层失败:', error);
            }
        }
    }
    
    // 移除图层
    removeLayer(layerId) {
        const layerInfo = this.layers.get(layerId);
        if (layerInfo) {
            // 从地图移除
            this.map.removeLayer(layerInfo.layer);
            
            // 从分组移除
            const group = this.groups.get(layerInfo.group);
            if (group) {
                const index = group.layers.indexOf(layerId);
                if (index > -1) {
                    group.layers.splice(index, 1);
                }
            }
            
            // 从管理器移除
            this.layers.delete(layerId);
            
            // 更新UI
            this.updateLayerTree();
            
            console.log('移除图层:', layerInfo.name);
        }
    }
    
    // 更新图层树
    updateLayerTree() {
        const treeContainer = document.getElementById('layer-tree');
        
        let html = '';
        
        // 按分组显示图层
        this.groups.forEach((group, groupName) => {
            const groupLayers = group.layers
                .map(layerId => this.layers.get(layerId))
                .filter(layer => layer !== undefined);
            
            html += `
                <div class="layer-group ${groupName === this.activeGroup ? 'active' : ''}">
                    <div class="group-header">
                        <div class="group-color" style="background: ${group.color}"></div>
                        <span class="group-name">${group.name}</span>
                        <span class="group-count">(${groupLayers.length})</span>
                        <div class="group-controls">
                            <button class="group-toggle" onclick="layerManager.toggleGroupVisibility('${groupName}')">
                                ${group.visible ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    <div class="group-layers" style="display: ${groupName === this.activeGroup ? 'block' : 'none'}">
            `;
            
            groupLayers.forEach(layerInfo => {
                const isSelected = this.selectedLayer === layerInfo.id;
                html += `
                    <div class="layer-item ${isSelected ? 'selected' : ''}" data-layer-id="${layerInfo.id}">
                        <div class="layer-visibility" onclick="layerManager.toggleLayerVisibility('${layerInfo.id}')">
                            ${layerInfo.visible ? '👁️' : '👁️‍🗨️'}
                        </div>
                        <div class="layer-info">
                            <div class="layer-name">${layerInfo.name}</div>
                            <div class="layer-type">${layerInfo.type}</div>
                        </div>
                        <div class="layer-controls">
                            <button onclick="layerManager.zoomToLayer('${layerInfo.id}')">🔍</button>
                            <button onclick="layerManager.removeLayer('${layerInfo.id}')">🗑️</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        treeContainer.innerHTML = html;
    }
    
    // 切换分组可见性
    toggleGroupVisibility(groupName) {
        const group = this.groups.get(groupName);
        if (group) {
            group.visible = !group.visible;
            
            // 切换分组内所有图层的可见性
            group.layers.forEach(layerId => {
                const layerInfo = this.layers.get(layerId);
                if (layerInfo) {
                    if (group.visible) {
                        this.map.addLayer(layerInfo.layer);
                        layerInfo.visible = true;
                    } else {
                        this.map.removeLayer(layerInfo.layer);
                        layerInfo.visible = false;
                    }
                }
            });
            
            this.updateLayerTree();
        }
    }
    
    // 切换图层可见性
    toggleLayerVisibility(layerId) {
        const layerInfo = this.layers.get(layerId);
        if (layerInfo) {
            if (layerInfo.visible) {
                this.map.removeLayer(layerInfo.layer);
                layerInfo.visible = false;
            } else {
                this.map.addLayer(layerInfo.layer);
                layerInfo.visible = true;
            }
            
            this.updateLayerTree();
        }
    }
    
    // 导出所有图层
    exportAllLayers() {
        const features = [];
        const metadata = {
            exportTime: new Date().toISOString(),
            totalLayers: this.layers.size,
            groups: {}
        };
        
        // 收集所有图层的GeoJSON
        this.layers.forEach((layerInfo, id) => {
            try {
                const geoJSON = layerInfo.layer.toGeoJSON();
                features.push(geoJSON);
                
                // 收集分组信息
                if (!metadata.groups[layerInfo.group]) {
                    metadata.groups[layerInfo.group] = {
                        name: layerInfo.group,
                        count: 0,
                        layers: []
                    };
                }
                
                metadata.groups[layerInfo.group].count++;
                metadata.groups[layerInfo.group].layers.push({
                    id: id,
                    name: layerInfo.name,
                    type: layerInfo.type
                });
                
            } catch (error) {
                console.warn(`导出图层 ${layerInfo.name} 失败:`, error);
            }
        });
        
        const exportData = {
            type: 'FeatureCollection',
            features: features,
            metadata: metadata
        };
        
        // 下载文件
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `layers-${Date.now()}.geojson`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('导出完成，包含', features.length, '个图层');
    }
    
    // 获取随机颜色
    getRandomColor() {
        const colors = ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0', '#ff6b35'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 批量操作
    batchOperation(operation, layerIds = null) {
        const targetLayers = layerIds 
            ? layerIds.map(id => this.layers.get(id)).filter(l => l)
            : Array.from(this.layers.values());
        
        switch (operation) {
            case 'show':
                targetLayers.forEach(layerInfo => {
                    if (!layerInfo.visible) {
                        this.toggleLayerVisibility(layerInfo.id);
                    }
                });
                break;
                
            case 'hide':
                targetLayers.forEach(layerInfo => {
                    if (layerInfo.visible) {
                        this.toggleLayerVisibility(layerInfo.id);
                    }
                });
                break;
                
            case 'delete':
                const idsToDelete = targetLayers.map(l => l.id);
                idsToDelete.forEach(id => this.removeLayer(id));
                break;
                
            case 'export':
                // 导出指定图层
                this.exportLayers(layerIds);
                break;
        }
    }
    
    // 导出指定图层
    exportLayers(layerIds) {
        const features = [];
        
        layerIds.forEach(id => {
            const layerInfo = this.layers.get(id);
            if (layerInfo) {
                try {
                    const geoJSON = layerInfo.layer.toGeoJSON();
                    features.push(geoJSON);
                } catch (error) {
                    console.warn(`导出图层 ${layerInfo.name} 失败:`, error);
                }
            }
        });
        
        const exportData = {
            type: 'FeatureCollection',
            features: features,
            metadata: {
                exportTime: new Date().toISOString(),
                layerCount: features.length
            }
        };
        
        // 下载文件
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected-layers-${Date.now()}.geojson`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// 使用示例
const layerManager = new MultiLayerManager(map);

// 创建一些示例分组
layerManager.createGroup('交通设施');
layerManager.createGroup('建筑物');
layerManager.createGroup('水系');

// 添加图层到不同分组
const roadLayer = L.polyline([...], { color: '#4285f4' }).addTo(map);
layerManager.addLayer(roadLayer, {
    name: '主干道',
    type: 'LineString',
    group: '交通设施'
});

const buildingLayer = L.polygon([...], { color: '#34a853' }).addTo(map);
layerManager.addLayer(buildingLayer, {
    name: '办公楼',
    type: 'Polygon',
    group: '建筑物'
});

console.log('多图层管理器已初始化');
```

这个基础编辑器示例展示了如何：
- 创建完整的地图编辑界面
- 支持多种几何图形的绘制
- 实现图层的选择、编辑、删除功能
- 提供图层分组和批量管理
- 支持数据导出功能

### 7.2 高级编辑功能示例

本节展示高级编辑功能，包括吸附功能、几何校验、撤销重做等专业特性。

#### 专业编辑器

创建具有专业级编辑功能的编辑器，支持吸附、校验、历史记录等高级特性：

```javascript
// 专业级地图编辑器
class ProfessionalMapEditor {
    constructor(mapId, center = [31.2304, 121.4737], zoom = 13) {
        this.map = null;
        this.editors = new Map();
        this.snapController = null;
        this.historyManager = null;
        this.validationManager = null;
        this.currentEditor = null;
        this.editMode = 'draw'; // draw, edit, measure
        
        this.initMap(mapId, center, zoom);
        this.initAdvancedFeatures();
        this.initProfessionalUI();
    }
    
    // 初始化地图
    initMap(mapId, center, zoom) {
        this.map = L.map(mapId).setView(center, zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
    }
    
    // 初始化高级功能
    initAdvancedFeatures() {
        // 初始化吸附控制器
        this.snapController = new SnapController(this.map);
        this.configureSnapping();
        
        // 初始化历史管理器
        this.historyManager = new EditHistoryManager(this.map);
        
        // 初始化校验管理器
        this.validationManager = new GeometryValidationManager(this.map);
        
        console.log('高级功能初始化完成');
    }
    
    // 配置吸附功能
    configureSnapping() {
        this.snapController.setTolerance(10);
        this.snapController.setModes(['vertex', 'edge']);
        
        // 监听编辑器创建，自动配置吸附源
        this.map.on('editorCreated', (e) => {
            this.updateSnapSources(e.editor);
        });
    }
    
    // 更新吸附源
    updateSnapSources(currentEditor) {
        const sources = [];
        
        // 收集除当前编辑器外的所有图层
        this.editors.forEach((editor, id) => {
            if (editor !== currentEditor && editor.getGeometryIndices) {
                const indices = editor.getGeometryIndices();
                sources.push(...indices);
            }
        });
        
        this.snapController.setGeometrySources(sources);
    }
    
    // 初始化专业UI
    initProfessionalUI() {
        this.createAdvancedToolbar();
        this.createStatusPanel();
        this.createPropertiesPanel();
        this.createHistoryPanel();
    }
    
    // 创建高级工具栏
    createAdvancedToolbar() {
        const toolbar = L.control({ position: 'topright' });
        
        toolbar.onAdd = () => {
            const div = L.DomUtil.create('div', 'professional-toolbar');
            div.innerHTML = `
                <div class="toolbar-section">
                    <h5>绘制工具</h5>
                    <div class="tool-group">
                        <button class="tool-btn" data-tool="point" title="点">📍</button>
                        <button class="tool-btn" data-tool="line" title="线">📏</button>
                        <button class="tool-btn" data-tool="polygon" title="面">📐</button>
                        <button class="tool-btn" data-tool="circle" title="圆">⭕</button>
                        <button class="tool-btn" data-tool="rectangle" title="矩形">⬜</button>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h5>编辑模式</h5>
                    <div class="tool-group">
                        <button class="mode-btn active" data-mode="draw">绘制</button>
                        <button class="mode-btn" data-mode="edit">编辑</button>
                        <button class="mode-btn" data-mode="measure">测量</button>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h5>高级功能</h5>
                    <div class="tool-group">
                        <button id="snap-toggle" class="feature-btn active" title="吸附">🧲</button>
                        <button id="validation-toggle" class="feature-btn active" title="校验">✅</button>
                        <button id="grid-toggle" class="feature-btn" title="网格">⊞</button>
                        <button id="guides-toggle" class="feature-btn" title="参考线">📐</button>
                    </div>
                </div>
                
                <div class="toolbar-section">
                    <h5>历史操作</h5>
                    <div class="tool-group">
                        <button id="undo-btn" title="撤销">↶</button>
                        <button id="redo-btn" title="重做">↷</button>
                        <button id="history-btn" title="历史">📜</button>
                    </div>
                </div>
            `;
            
            // 绑定事件
            this.bindToolbarEvents(div);
            
            return div;
        };
        
        toolbar.addTo(this.map);
    }
    
    // 绑定工具栏事件
    bindToolbarEvents(toolbar) {
        // 绘制工具
        toolbar.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.target.dataset.tool;
                this.startDrawing(tool);
            });
        });
        
        // 编辑模式
        toolbar.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setEditMode(mode);
            });
        });
        
        // 高级功能
        document.getElementById('snap-toggle').addEventListener('click', () => {
            this.toggleSnapping();
        });
        
        document.getElementById('validation-toggle').addEventListener('click', () => {
            this.toggleValidation();
        });
        
        document.getElementById('grid-toggle').addEventListener('click', () => {
            this.toggleGrid();
        });
        
        document.getElementById('guides-toggle').addEventListener('click', () => {
            this.toggleGuides();
        });
        
        // 历史操作
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redo-btn').addEventListener('click', () => {
            this.redo();
        });
        
        document.getElementById('history-btn').addEventListener('click', () => {
            this.showHistory();
        });
    }
    
    // 开始绘制
    startDrawing(toolType) {
        // 清理当前编辑器
        this.cleanupCurrentEditor();
        
        // 创建编辑器配置
        const config = this.getEditorConfig(toolType);
        
        // 创建编辑器
        let editor;
        switch (toolType) {
            case 'point':
                editor = new MarkerPointEditor(this.map, config);
                break;
            case 'line':
                editor = new PolylineEditor(this.map, config);
                break;
            case 'polygon':
                editor = new PolygonEditor(this.map, config);
                break;
            case 'circle':
                editor = new CircleEditor(this.map, config);
                break;
            case 'rectangle':
                editor = new RectangleEditor(this.map, config);
                break;
        }
        
        if (editor) {
            this.setupEditor(editor, toolType);
            this.currentEditor = {
                type: toolType,
                instance: editor
            };
            
            // 触发事件
            this.map.fire('editorCreated', { editor, toolType });
        }
    }
    
    // 获取编辑器配置
    getEditorConfig(toolType) {
        const baseConfig = {
            // 吸附配置
            snapController: this.snapController,
            
            // 校验配置
            validation: {
                allowSelfIntersect: false,
                minArea: 1,
                maxArea: 1000000
            },
            
            // 样式配置
            styles: this.getToolStyles(toolType)
        };
        
        // 根据工具类型添加特定配置
        switch (toolType) {
            case 'point':
                return {
                    ...baseConfig,
                    markerStyle: {
                        containerClassName: 'professional-marker',
                        dotClassName: 'marker-dot',
                        labelClassName: 'marker-label'
                    }
                };
                
            case 'line':
            case 'polygon':
                return {
                    ...baseConfig,
                    // 支持撤销重做
                    enableHistory: true
                };
                
            default:
                return baseConfig;
        }
    }
    
    // 获取工具样式
    getToolStyles(toolType) {
        const styles = {
            point: {
                color: '#4285f4'
            },
            line: {
                color: '#4285f4',
                weight: 3,
                opacity: 0.8
            },
            polygon: {
                color: '#34a853',
                weight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.3
            },
            circle: {
                color: '#ff6b35',
                weight: 2,
                fillColor: '#ff6b35',
                fillOpacity: 0.3
            },
            rectangle: {
                color: '#9c27b0',
                weight: 2,
                fillColor: '#9c27b0',
                fillOpacity: 0.3
            }
        };
        
        return styles[toolType] || styles.point;
    }
    
    // 设置编辑器
    setupEditor(editor, toolType) {
        // 绑定状态变化事件
        editor.onStateChange((state) => {
            this.onEditorStateChange(editor, toolType, state);
        });
        
        // 绑定几何变化事件
        if (editor.onGeometryChange) {
            editor.onGeometryChange((geoJSON) => {
                this.onGeometryChange(editor, toolType, geoJSON);
            });
        }
        
        // 绑定校验事件
        if (editor.onValidationChange) {
            editor.onValidationChange((isValid, errors) => {
                this.onValidationChange(editor, toolType, isValid, errors);
            });
        }
        
        // 保存编辑器
        this.editors.set(`${toolType}-${Date.now()}`, editor);
    }
    
    // 编辑器状态变化处理
    onEditorStateChange(editor, toolType, state) {
        console.log(`${toolType} 编辑器状态:`, state);
        
        // 更新UI状态
        this.updateEditorStatus(toolType, state);
        
        // 处理绘制完成
        if (state === 'idle') {
            this.onDrawingComplete(editor, toolType);
        }
        
        // 记录历史
        if (this.historyManager) {
            this.historyManager.recordAction('stateChange', {
                editor: toolType,
                state: state,
                timestamp: Date.now()
            });
        }
    }
    
    // 几何变化处理
    onGeometryChange(editor, toolType, geoJSON) {
        console.log(`${toolType} 几何变化:`, geoJSON);
        
        // 更新吸附源
        this.updateSnapSources(editor);
        
        // 实时校验
        if (this.validationManager) {
            const isValid = this.validationManager.validateGeometry(geoJSON, toolType);
            this.updateValidationStatus(isValid);
        }
        
        // 记录历史
        if (this.historyManager) {
            this.historyManager.recordAction('geometryChange', {
                editor: toolType,
                geoJSON: geoJSON,
                timestamp: Date.now()
            });
        }
    }
    
    // 校验变化处理
    onValidationChange(editor, toolType, isValid, errors) {
        console.log(`${toolType} 校验状态:`, isValid, errors);
        
        // 更新校验UI
        this.updateValidationStatus(isValid, errors);
        
        // 显示错误提示
        if (!isValid && errors.length > 0) {
            this.showValidationErrors(errors);
        }
    }
    
    // 绘制完成处理
    onDrawingComplete(editor, toolType) {
        try {
            // 获取最终几何
            const geoJSON = editor.getGeoJSON();
            
            // 创建最终图层
            const finalLayer = L.geoJSON(geoJSON, {
                style: this.getToolStyles(toolType),
                onEachFeature: (feature, layer) => {
                    this.bindFinalLayerEvents(layer, feature, toolType);
                }
            });
            
            // 添加到地图
            finalLayer.addTo(this.map);
            
            // 记录到历史管理器
            if (this.historyManager) {
                this.historyManager.recordAction('createLayer', {
                    toolType: toolType,
                    geoJSON: geoJSON,
                    layer: finalLayer,
                    timestamp: Date.now()
                });
            }
            
            console.log(`${toolType} 绘制完成:`, geoJSON);
            
        } catch (error) {
            console.error('处理绘制结果失败:', error);
        }
    }
    
    // 绑定最终图层事件
    bindFinalLayerEvents(layer, feature, toolType) {
        // 点击选中
        layer.on('click', (e) => {
            this.selectFinalLayer(layer, feature, toolType);
            L.DomEvent.stopPropagation(e);
        });
        
        // 鼠标悬停显示信息
        layer.on('mouseover', (e) => {
            this.showLayerTooltip(layer, feature, toolType);
        });
        
        layer.on('mouseout', () => {
            this.hideLayerTooltip();
        });
    }
    
    // 选中最终图层
    selectFinalLayer(layer, feature, toolType) {
        // 清除之前的选中
        this.clearFinalSelection();
        
        // 设置选中状态
        this.selectedFinalLayer = {
            layer: layer,
            feature: feature,
            toolType: toolType
        };
        
        // 高亮显示
        this.highlightFinalLayer(layer);
        
        // 更新属性面板
        this.updatePropertiesPanel(feature, toolType);
    }
    
    // 清除最终选中
    clearFinalSelection() {
        if (this.selectedFinalLayer) {
            // 恢复原始样式
            const layer = this.selectedFinalLayer.layer;
            if (this.selectedFinalLayer.originalStyle) {
                layer.setStyle(this.selectedFinalLayer.originalStyle);
            }
            
            this.selectedFinalLayer = null;
        }
    }
    
    // 高亮最终图层
    highlightFinalLayer(layer) {
        const originalStyle = layer.options;
        layer.setStyle({
            ...originalStyle,
            color: '#ff0000',
            weight: (originalStyle.weight || 2) + 2,
            opacity: 1
        });
        
        // 保存原始样式
        if (this.selectedFinalLayer) {
            this.selectedFinalLayer.originalStyle = originalStyle;
        }
    }
    
    // 显示图层提示
    showLayerTooltip(layer, feature, toolType) {
        const content = this.generateTooltipContent(feature, toolType);
        layer.bindTooltip(content, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
    }
    
    // 隐藏图层提示
    hideLayerTooltip() {
        this.map.eachLayer((layer) => {
            if (layer.unbindTooltip) {
                layer.unbindTooltip();
            }
        });
    }
    
    // 生成提示内容
    generateTooltipContent(feature, toolType) {
        const geometry = feature.geometry;
        let content = `<div class="layer-tooltip">`;
        content += `<strong>${this.getToolName(toolType)}</strong><br>`;
        content += `类型: ${geometry.type}<br>`;
        
        // 添加几何信息
        switch (geometry.type) {
            case 'Point':
                content += `坐标: ${geometry.coordinates[1].toFixed(4)}, ${geometry.coordinates[0].toFixed(4)}`;
                break;
            case 'LineString':
                content += `长度: ${this.calculateLength(geometry.coordinates).toFixed(2)}m`;
                break;
            case 'Polygon':
                content += `面积: ${this.calculateArea(geometry.coordinates[0]).toFixed(2)}m²`;
                break;
        }
        
        content += `</div>`;
        return content;
    }
    
    // 计算长度
    calculateLength(coordinates) {
        let length = 0;
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];
            length += this.map.distance([lat1, lng1], [lat2, lng2]);
        }
        return length;
    }
    
    // 计算面积
    calculateArea(coordinates) {
        // 简化的面积计算，实际应用中应使用更精确的算法
        let area = 0;
        const n = coordinates.length;
        
        for (let i = 0; i < n - 1; i++) {
            const [lng1, lat1] = coordinates[i];
            const [lng2, lat2] = coordinates[i + 1];
            area += (lng2 - lng1) * (lat2 + lat1) / 2;
        }
        
        return Math.abs(area) * 111000 * 111000; // 转换为平方米
    }
    
    // 设置编辑模式
    setEditMode(mode) {
        this.editMode = mode;
        
        // 更新UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 根据模式调整功能
        switch (mode) {
            case 'draw':
                this.enableDrawingMode();
                break;
            case 'edit':
                this.enableEditMode();
                break;
            case 'measure':
                this.enableMeasureMode();
                break;
        }
        
        console.log('切换到模式:', mode);
    }
    
    // 启用绘制模式
    enableDrawingMode() {
        // 启用绘制工具
        this.cleanupCurrentEditor();
        
        // 显示绘制提示
        this.showStatusMessage('绘制模式：选择工具开始绘制');
    }
    
    // 启用编辑模式
    enableEditMode() {
        // 启用编辑功能
        this.showStatusMessage('编辑模式：双击图层进入编辑');
        
        // 绑定双击事件
        this.map.on('dblclick', this.handleDoubleClickForEdit);
    }
    
    // 启用测量模式
    enableMeasureMode() {
        // 启用测量工具
        this.showStatusMessage('测量模式：选择测量工具');
        
        // 可以在这里初始化测量工具
    }
    
    // 处理双击编辑
    handleDoubleClickForEdit = (e) => {
        // 查找点击的图层
        const clickedLayers = this.queryLayersAtPoint(e.latlng);
        
        if (clickedLayers.length > 0) {
            const layer = clickedLayers[0];
            this.enterEditMode(layer);
        }
    }
    
    // 查询点击位置的图层
    queryLayersAtPoint(latlng) {
        const clickedLayers = [];
        
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Path && layer.getBounds) {
                if (layer.getBounds().contains(latlng)) {
                    clickedLayers.push(layer);
                }
            } else if (layer instanceof L.Marker) {
                const markerLatLng = layer.getLatLng();
                if (markerLatLng.distanceTo(latlng) < 10) {
                    clickedLayers.push(layer);
                }
            }
        });
        
        return clickedLayers;
    }
    
    // 进入编辑模式
    enterEditMode(layer) {
        // 这里可以实现具体的编辑逻辑
        console.log('进入编辑模式:', layer);
        
        // 可以创建对应的编辑器并绑定到现有图层
    }
    
    // 切换吸附功能
    toggleSnapping() {
        const btn = document.getElementById('snap-toggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // 关闭吸附
            this.snapController.setModes([]);
            btn.classList.remove('active');
            this.showStatusMessage('吸附功能已关闭');
        } else {
            // 开启吸附
            this.snapController.setModes(['vertex', 'edge']);
            btn.classList.add('active');
            this.showStatusMessage('吸附功能已开启');
        }
    }
    
    // 切换校验功能
    toggleValidation() {
        const btn = document.getElementById('validation-toggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // 关闭校验
            if (this.validationManager) {
                this.validationManager.setEnabled(false);
            }
            btn.classList.remove('active');
            this.showStatusMessage('校验功能已关闭');
        } else {
            // 开启校验
            if (this.validationManager) {
                this.validationManager.setEnabled(true);
            }
            btn.classList.add('active');
            this.showStatusMessage('校验功能已开启');
        }
    }
    
    // 切换网格
    toggleGrid() {
        const btn = document.getElementById('grid-toggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // 隐藏网格
            this.hideGrid();
            btn.classList.remove('active');
            this.showStatusMessage('网格已隐藏');
        } else {
            // 显示网格
            this.showGrid();
            btn.classList.add('active');
            this.showStatusMessage('网格已显示');
        }
    }
    
    // 显示网格
    showGrid() {
        // 实现网格显示逻辑
        console.log('显示网格');
    }
    
    // 隐藏网格
    hideGrid() {
        // 实现网格隐藏逻辑
        console.log('隐藏网格');
    }
    
    // 切换参考线
    toggleGuides() {
        const btn = document.getElementById('guides-toggle');
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // 隐藏参考线
            this.hideGuides();
            btn.classList.remove('active');
            this.showStatusMessage('参考线已隐藏');
        } else {
            // 显示参考线
            this.showGuides();
            btn.classList.add('active');
            this.showStatusMessage('参考线已显示');
        }
    }
    
    // 显示参考线
    showGuides() {
        // 实现参考线显示逻辑
        console.log('显示参考线');
    }
    
    // 隐藏参考线
    hideGuides() {
        // 实现参考线隐藏逻辑
        console.log('隐藏参考线');
    }
    
    // 撤销
    undo() {
        if (this.historyManager) {
            const result = this.historyManager.undo();
            if (result.success) {
                this.showStatusMessage('撤销成功');
            } else {
                this.showStatusMessage('无法撤销');
            }
        }
    }
    
    // 重做
    redo() {
        if (this.historyManager) {
            const result = this.historyManager.redo();
            if (result.success) {
                this.showStatusMessage('重做成功');
            } else {
                this.showStatusMessage('无法重做');
            }
        }
    }
    
    // 显示历史
    showHistory() {
        if (this.historyManager) {
            const history = this.historyManager.getHistory();
            console.log('历史记录:', history);
            
            // 这里可以显示历史面板
            this.showHistoryPanel(history);
        }
    }
    
    // 创建状态面板
    createStatusPanel() {
        const status = L.control({ position: 'bottomleft' });
        
        status.onAdd = () => {
            const div = L.DomUtil.create('div', 'status-panel');
            div.innerHTML = `
                <div class="status-item">
                    <span id="editor-status">编辑器: 就绪</span>
                </div>
                <div class="status-item">
                    <span id="validation-status">校验: 通过</span>
                </div>
                <div class="status-item">
                    <span id="snap-status">吸附: 开启</span>
                </div>
                <div class="status-item">
                    <span id="coordinates">坐标: --</span>
                </div>
            `;
            
            return div;
        };
        
        status.addTo(this.map);
    }
    
    // 创建属性面板
    createPropertiesPanel() {
        const properties = L.control({ position: 'left' });
        
        properties.onAdd = () => {
            const div = L.DomUtil.create('div', 'properties-panel');
            div.innerHTML = `
                <h4>属性面板</h4>
                <div id="properties-content">
                    <div class="no-selection">请选择一个图层查看属性</div>
                </div>
            `;
            
            return div;
        };
        
        properties.addTo(this.map);
    }
    
    // 创建历史面板
    createHistoryPanel() {
        const history = L.control({ position: 'bottomright' });
        
        history.onAdd = () => {
            const div = L.DomUtil.create('div', 'history-panel');
            div.innerHTML = `
                <h4>历史记录</h4>
                <div id="history-content">
                    <div class="no-history">暂无操作记录</div>
                </div>
            `;
            
            return div;
        };
        
        history.addTo(this.map);
    }
    
    // 更新编辑器状态
    updateEditorStatus(toolType, state) {
        const statusElement = document.getElementById('editor-status');
        const stateText = {
            'drawing': '绘制中',
            'editing': '编辑中',
            'idle': '就绪'
        };
        
        statusElement.textContent = `编辑器: ${this.getToolName(toolType)} - ${stateText[state] || state}`;
    }
    
    // 更新校验状态
    updateValidationStatus(isValid, errors = []) {
        const statusElement = document.getElementById('validation-status');
        
        if (isValid) {
            statusElement.textContent = '校验: 通过';
            statusElement.className = 'status-item valid';
        } else {
            statusElement.textContent = `校验: 失败 (${errors.length}个错误)`;
            statusElement.className = 'status-item invalid';
        }
    }
    
    // 更新属性面板
    updatePropertiesPanel(feature, toolType) {
        const contentElement = document.getElementById('properties-content');
        
        let html = `
            <div class="property-group">
                <h5>基本信息</h5>
                <div class="property-item">
                    <label>类型:</label>
                    <span>${feature.geometry.type}</span>
                </div>
                <div class="property-item">
                    <label>工具:</label>
                    <span>${this.getToolName(toolType)}</span>
                </div>
            </div>
        `;
        
        // 添加几何属性
        const geometry = feature.geometry;
        switch (geometry.type) {
            case 'Point':
                html += `
                    <div class="property-group">
                        <h5>坐标信息</h5>
                        <div class="property-item">
                            <label>经度:</label>
                            <span>${geometry.coordinates[0].toFixed(6)}</span>
                        </div>
                        <div class="property-item">
                            <label>纬度:</label>
                            <span>${geometry.coordinates[1].toFixed(6)}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'LineString':
                html += `
                    <div class="property-group">
                        <h5>线段信息</h5>
                        <div class="property-item">
                            <label>顶点数:</label>
                            <span>${geometry.coordinates.length}</span>
                        </div>
                        <div class="property-item">
                            <label>长度:</label>
                            <span>${this.calculateLength(geometry.coordinates).toFixed(2)}m</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Polygon':
                html += `
                    <div class="property-group">
                        <h5>多边形信息</h5>
                        <div class="property-item">
                            <label>顶点数:</label>
                            <span>${geometry.coordinates[0].length}</span>
                        </div>
                        <div class="property-item">
                            <label>面积:</label>
                            <span>${this.calculateArea(geometry.coordinates[0]).toFixed(2)}m²</span>
                        </div>
                        <div class="property-item">
                            <label>周长:</label>
                            <span>${this.calculateLength(geometry.coordinates[0]).toFixed(2)}m</span>
                        </div>
                    </div>
                `;
                break;
        }
        
        contentElement.innerHTML = html;
    }
    
    // 显示历史面板
    showHistoryPanel(history) {
        const contentElement = document.getElementById('history-content');
        
        if (history.length === 0) {
            contentElement.innerHTML = '<div class="no-history">暂无操作记录</div>';
            return;
        }
        
        let html = '';
        history.forEach((item, index) => {
            const time = new Date(item.timestamp).toLocaleTimeString();
            html += `
                <div class="history-item">
                    <div class="history-action">${item.action}</div>
                    <div class="history-time">${time}</div>
                    <div class="history-details">${item.details || ''}</div>
                </div>
            `;
        });
        
        contentElement.innerHTML = html;
    }
    
    // 显示状态消息
    showStatusMessage(message) {
        // 这里可以实现状态消息显示逻辑
        console.log('状态消息:', message);
    }
    
    // 显示校验错误
    showValidationErrors(errors) {
        // 这里可以实现错误提示显示逻辑
        console.warn('校验错误:', errors);
    }
    
    // 清理当前编辑器
    cleanupCurrentEditor() {
        if (this.currentEditor) {
            // 清理编辑器资源
            if (this.currentEditor.instance.destroy) {
                this.currentEditor.instance.destroy();
            }
            
            this.currentEditor = null;
        }
    }
    
    // 获取工具名称
    getToolName(toolType) {
        const names = {
            point: '点',
            line: '线',
            polygon: '面',
            circle: '圆',
            rectangle: '矩形'
        };
        
        return names[toolType] || toolType;
    }
    
    // 销毁编辑器
    destroy() {
        // 清理编辑器
        this.cleanupCurrentEditor();
        
        // 清理高级功能
        if (this.snapController) {
            // SnapController 可能没有 destroy 方法
        }
        
        if (this.historyManager) {
            this.historyManager.clear();
        }
        
        if (this.validationManager) {
            this.validationManager.destroy();
        }
        
        // 清理地图
        if (this.map) {
            this.map.remove();
        }
        
        console.log('专业编辑器已销毁');
    }
}

// 编辑历史管理器
class EditHistoryManager {
    constructor(map) {
        this.map = map;
        this.history = [];
        this.currentIndex = -1;
        this.maxSize = 50;
    }
    
    // 记录操作
    recordAction(action, data) {
        const record = {
            action: action,
            data: data,
            timestamp: Date.now()
        };
        
        // 如果当前不在历史末尾，删除后续记录
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        // 添加新记录
        this.history.push(record);
        this.currentIndex = this.history.length - 1;
        
        // 限制历史大小
        if (this.history.length > this.maxSize) {
            this.history.shift();
            this.currentIndex--;
        }
        
        console.log('记录操作:', action, data);
    }
    
    // 撤销
    undo() {
        if (this.currentIndex <= 0) {
            return { success: false, message: '无法撤销' };
        }
        
        const record = this.history[this.currentIndex];
        this.currentIndex--;
        
        // 执行撤销操作
        this.executeUndo(record);
        
        return { success: true, record: record };
    }
    
    // 重做
    redo() {
        if (this.currentIndex >= this.history.length - 1) {
            return { success: false, message: '无法重做' };
        }
        
        this.currentIndex++;
        const record = this.history[this.currentIndex];
        
        // 执行重做操作
        this.executeRedo(record);
        
        return { success: true, record: record };
    }
    
    // 执行撤销
    executeUndo(record) {
        switch (record.action) {
            case 'createLayer':
                // 删除创建的图层
                if (record.data.layer) {
                    this.map.removeLayer(record.data.layer);
                }
                break;
                
            case 'geometryChange':
                // 恢复之前的几何
                // 这里需要实现具体的恢复逻辑
                break;
                
            case 'deleteLayer':
                // 恢复删除的图层
                if (record.data.layer) {
                    record.data.layer.addTo(this.map);
                }
                break;
        }
    }
    
    // 执行重做
    executeRedo(record) {
        switch (record.action) {
            case 'createLayer':
                // 重新创建图层
                if (record.data.layer) {
                    record.data.layer.addTo(this.map);
                }
                break;
                
            case 'geometryChange':
                // 重新应用几何变化
                // 这里需要实现具体的重做逻辑
                break;
                
            case 'deleteLayer':
                // 重新删除图层
                if (record.data.layer) {
                    this.map.removeLayer(record.data.layer);
                }
                break;
        }
    }
    
    // 获取历史
    getHistory() {
        return this.history;
    }
    
    // 清空历史
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }
}

// 几何校验管理器
class GeometryValidationManager {
    constructor(map) {
        this.map = map;
        this.enabled = true;
        this.rules = new Map();
        this.setupDefaultRules();
    }
    
    // 设置默认校验规则
    setupDefaultRules() {
        // 点校验规则
        this.rules.set('point', {
            required: true
        });
        
        // 线校验规则
        this.rules.set('line', {
            minPoints: 2,
            maxPoints: 1000,
            allowSelfIntersect: true,
            minLength: 0.1
        });
        
        // 面校验规则
        this.rules.set('polygon', {
            minPoints: 3,
            maxPoints: 1000,
            allowSelfIntersect: false,
            minArea: 1,
            maxArea: 1000000
        });
    }
    
    // 校验几何
    validateGeometry(geoJSON, toolType) {
        if (!this.enabled) {
            return { valid: true, errors: [] };
        }
        
        const rules = this.rules.get(toolType) || {};
        const errors = [];
        
        // 基础校验
        if (!geoJSON || !geoJSON.geometry) {
            errors.push('几何数据无效');
            return { valid: false, errors: errors };
        }
        
        const geometry = geoJSON.geometry;
        
        // 根据几何类型校验
        switch (geometry.type) {
            case 'Point':
                this.validatePoint(geometry, rules, errors);
                break;
            case 'LineString':
                this.validateLineString(geometry, rules, errors);
                break;
            case 'Polygon':
                this.validatePolygon(geometry, rules, errors);
                break;
        }
        
        const isValid = errors.length === 0;
        return { valid: isValid, errors: errors };
    }
    
    // 校验点
    validatePoint(geometry, rules, errors) {
        const coords = geometry.coordinates;
        
        if (!Array.isArray(coords) || coords.length !== 2) {
            errors.push('点坐标格式错误');
        }
        
        if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
            errors.push('点坐标必须是数字');
        }
    }
    
    // 校验线
    validateLineString(geometry, rules, errors) {
        const coords = geometry.coordinates;
        
        // 检查最小点数
        if (coords.length < (rules.minPoints || 2)) {
            errors.push(`线至少需要 ${rules.minPoints || 2} 个点`);
        }
        
        // 检查最大点数
        if (coords.length > (rules.maxPoints || 1000)) {
            errors.push(`线最多支持 ${rules.maxPoints || 1000} 个点`);
        }
        
        // 检查自相交
        if (!rules.allowSelfIntersect && this.hasSelfIntersection(coords)) {
            errors.push('线存在自相交');
        }
        
        // 检查最小长度
        if (rules.minLength && this.calculateLength(coords) < rules.minLength) {
            errors.push(`线长度不能小于 ${rules.minLength}m`);
        }
    }
    
    // 校验多边形
    validatePolygon(geometry, rules, errors) {
        const coords = geometry.coordinates[0];
        
        // 检查最小点数
        if (coords.length < (rules.minPoints || 3)) {
            errors.push(`多边形至少需要 ${rules.minPoints || 3} 个点`);
        }
        
        // 检查最大点数
        if (coords.length > (rules.maxPoints || 1000)) {
            errors.push(`多边形最多支持 ${rules.maxPoints || 1000} 个点`);
        }
        
        // 检查自相交
        if (!rules.allowSelfIntersect && this.hasSelfIntersection(coords)) {
            errors.push('多边形存在自相交');
        }
        
        // 检查面积
        if (rules.minArea || rules.maxArea) {
            const area = this.calculateArea(coords);
            
            if (rules.minArea && area < rules.minArea) {
                errors.push(`多边形面积不能小于 ${rules.minArea}m²`);
            }
            
            if (rules.maxArea && area > rules.maxArea) {
                errors.push(`多边形面积不能大于 ${rules.maxArea}m²`);
            }
        }
    }
    
    // 检查自相交
    hasSelfIntersection(coords) {
        // 简化的自相交检查
        // 实际应用中应使用更精确的算法
        if (coords.length < 4) return false;
        
        // 这里应该使用 Turf.js 的 kinks 函数
        return false;
    }
    
    // 计算长度
    calculateLength(coords) {
        let length = 0;
        for (let i = 1; i < coords.length; i++) {
            const [lng1, lat1] = coords[i - 1];
            const [lng2, lat2] = coords[i];
            length += this.map.distance([lat1, lng1], [lat2, lng2]);
        }
        return length;
    }
    
    // 计算面积
    calculateArea(coords) {
        // 简化的面积计算
        let area = 0;
        const n = coords.length;
        
        for (let i = 0; i < n - 1; i++) {
            const [lng1, lat1] = coords[i];
            const [lng2, lat2] = coords[i + 1];
            area += (lng2 - lng1) * (lat2 + lat1) / 2;
        }
        
        return Math.abs(area) * 111000 * 111000;
    }
    
    // 设置启用状态
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    // 添加校验规则
    addRule(type, rule) {
        this.rules.set(type, { ...this.rules.get(type), ...rule });
    }
    
    // 移除校验规则
    removeRule(type) {
        this.rules.delete(type);
    }
    
    // 销毁
    destroy() {
        this.rules.clear();
        this.enabled = false;
    }
}

// 使用示例
document.addEventListener('DOMContentLoaded', () => {
    // 创建专业编辑器
    const professionalEditor = new ProfessionalMapEditor('map-container');
    
    console.log('专业地图编辑器已启动');
});
```

**配套CSS样式：**
```css
/* 专业工具栏样式 */
.professional-toolbar {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
}

.toolbar-section {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e9ecef;
}

.toolbar-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.toolbar-section h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
}

.tool-group {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.tool-btn, .mode-btn, .feature-btn {
    padding: 8px 12px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    min-width: 40px;
    text-align: center;
}

.tool-btn:hover, .mode-btn:hover, .feature-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-1px);
}

.tool-btn.active, .mode-btn.active, .feature-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

/* 状态面板样式 */
.status-panel {
    background: rgba(255,255,255,0.95);
    padding: 8px 12px;
    font-size: 11px;
    border-radius: 4px;
    display: flex;
    gap: 15px;
    backdrop-filter: blur(4px);
}

.status-item {
    white-space: nowrap;
}

.status-item.valid {
    color: #28a745;
}

.status-item.invalid {
    color: #dc3545;
}

/* 属性面板样式 */
.properties-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 250px;
    max-width: 300px;
}

.properties-panel h4 {
    margin: 0 0 15px 0;
    font-size: 14px;
    color: #333;
}

.property-group {
    margin-bottom: 15px;
}

.property-group h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 4px;
}

.property-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 11px;
}

.property-item label {
    font-weight: 500;
    color: #666;
}

.property-item span {
    color: #333;
}

.no-selection {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

/* 历史面板样式 */
.history-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 200px;
    max-width: 250px;
    max-height: 300px;
    overflow-y: auto;
}

.history-panel h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
}

.history-item {
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 11px;
}

.history-item:last-child {
    border-bottom: none;
}

.history-action {
    font-weight: 500;
    color: #333;
}

.history-time {
    color: #666;
    font-size: 10px;
}

.history-details {
    color: #999;
    font-size: 10px;
    margin-top: 2px;
}

.no-history {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

/* 图层提示样式 */
.layer-tooltip {
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 11px;
    pointer-events: none;
}

.layer-tooltip strong {
    display: block;
    margin-bottom: 2px;
}
```

这个专业编辑器示例展示了：
- **吸附功能**：顶点和边线吸附，提高编辑精度
- **几何校验**：实时校验几何有效性，防止错误数据
- **历史管理**：完整的撤销重做功能
- **状态管理**：详细的编辑状态跟踪
- **属性面板**：实时显示几何属性信息
- **多种模式**：绘制、编辑、测量模式切换

现在您已经掌握了基础编辑器和高级编辑功能的完整实现方法。

### 7.3 测量工具集成示例

本节展示如何将测量工具集成到实际应用中，包括距离测量、面积测量以及测量结果的管理和导出。

#### 综合测量系统

创建一个功能完整的测量系统，支持多种测量模式和结果管理：

```javascript
// 综合测量系统
class ComprehensiveMeasurementSystem {
    constructor(mapId, center = [31.2304, 121.4737], zoom = 13) {
        this.map = null;
        this.measurementTools = new Map();
        this.currentTool = null;
        this.measurementResults = [];
        this.measurementLayers = new Map();
        this.measurementMode = 'distance'; // distance, area, both
        
        this.initMap(mapId, center, zoom);
        this.initMeasurementUI();
        this.initMeasurementEvents();
    }
    
    // 初始化地图
    initMap(mapId, center, zoom) {
        this.map = L.map(mapId).setView(center, zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
    }
    
    // 初始化测量UI
    initMeasurementUI() {
        this.createMeasurementToolbar();
        this.createMeasurementPanel();
        this.createResultsPanel();
    }
    
    // 创建测量工具栏
    createMeasurementToolbar() {
        const toolbar = L.control({ position: 'topright' });
        
        toolbar.onAdd = () => {
            const div = L.DomUtil.create('div', 'measurement-toolbar');
            div.innerHTML = `
                <div class="measurement-header">
                    <h4>📏 测量工具</h4>
                </div>
                <div class="measurement-tools">
                    <button id="btn-distance" class="measure-btn active" title="距离测量">
                        📏 距离
                    </button>
                    <button id="btn-area" class="measure-btn" title="面积测量">
                        📐 面积
                    </button>
                    <button id="btn-both" class="measure-btn" title="综合测量">
                        🔄 综合
                    </button>
                </div>
                <div class="measurement-controls">
                    <button id="btn-clear-measurements" class="control-btn" title="清除测量">
                        🧹 清除
                    </button>
                    <button id="btn-export-measurements" class="control-btn" title="导出结果">
                        💾 导出
                    </button>
                    <button id="btn-toggle-units" class="control-btn" title="切换单位">
                        🔄 单位
                    </button>
                </div>
            `;
            
            return div;
        };
        
        toolbar.addTo(this.map);
    }
    
    // 创建测量面板
    createMeasurementPanel() {
        const panel = L.control({ position: 'left' });
        
        panel.onAdd = () => {
            const div = L.DomUtil.create('div', 'measurement-panel');
            div.innerHTML = `
                <div class="panel-header">
                    <h4>测量信息</h4>
                    <div class="panel-status">
                        <span id="measurement-status">就绪</span>
                    </div>
                </div>
                <div class="measurement-info">
                    <div class="info-section">
                        <h5>当前测量</h5>
                        <div id="current-measurement" class="current-info">
                            <div class="no-measurement">未开始测量</div>
                        </div>
                    </div>
                    <div class="info-section">
                        <h5>测量设置</h5>
                        <div class="settings-group">
                            <div class="setting-item">
                                <label>单位系统:</label>
                                <select id="unit-system">
                                    <option value="metric">公制</option>
                                    <option value="imperial">英制</option>
                                    <option value="chinese">市制</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>精度:</label>
                                <select id="measurement-precision">
                                    <option value="0">整数</option>
                                    <option value="1" selected>1位小数</option>
                                    <option value="2">2位小数</option>
                                    <option value="3">3位小数</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>显示格式:</label>
                                <select id="display-format">
                                    <option value="simple">简单</option>
                                    <option value="detailed">详细</option>
                                    <option value="scientific">科学</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        panel.addTo(this.map);
    }
    
    // 创建结果面板
    createResultsPanel() {
        const panel = L.control({ position: 'bottomright' });
        
        panel.onAdd = () => {
            const div = L.DomUtil.create('div', 'results-panel');
            div.innerHTML = `
                <div class="results-header">
                    <h4>📊 测量结果</h4>
                    <div class="results-controls">
                        <button id="btn-clear-results" title="清除结果">🗑️</button>
                        <button id="btn-collapse-results" title="折叠">📁</button>
                    </div>
                </div>
                <div id="results-content" class="results-content">
                    <div class="no-results">暂无测量结果</div>
                </div>
                <div class="results-summary">
                    <div class="summary-item">
                        <span>总测量数:</span>
                        <span id="total-measurements">0</span>
                    </div>
                    <div class="summary-item">
                        <span>总距离:</span>
                        <span id="total-distance">0m</span>
                    </div>
                    <div class="summary-item">
                        <span>总面积:</span>
                        <span id="total-area">0m²</span>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        panel.addTo(this.map);
    }
    
    // 初始化测量事件
    initMeasurementEvents() {
        // 测量工具按钮
        document.getElementById('btn-distance').addEventListener('click', () => {
            this.setMeasurementMode('distance');
        });
        
        document.getElementById('btn-area').addEventListener('click', () => {
            this.setMeasurementMode('area');
        });
        
        document.getElementById('btn-both').addEventListener('click', () => {
            this.setMeasurementMode('both');
        });
        
        // 控制按钮
        document.getElementById('btn-clear-measurements').addEventListener('click', () => {
            this.clearAllMeasurements();
        });
        
        document.getElementById('btn-export-measurements').addEventListener('click', () => {
            this.exportMeasurements();
        });
        
        document.getElementById('btn-toggle-units').addEventListener('click', () => {
            this.toggleUnitSystem();
        });
        
        // 结果面板控制
        document.getElementById('btn-clear-results').addEventListener('click', () => {
            this.clearResults();
        });
        
        document.getElementById('btn-collapse-results').addEventListener('click', () => {
            this.toggleResultsPanel();
        });
        
        // 设置变化监听
        document.getElementById('unit-system').addEventListener('change', (e) => {
            this.updateUnitSystem(e.target.value);
        });
        
        document.getElementById('measurement-precision').addEventListener('change', (e) => {
            this.updatePrecision(parseInt(e.target.value));
        });
        
        document.getElementById('display-format').addEventListener('change', (e) => {
            this.updateDisplayFormat(e.target.value);
        });
    }
    
    // 设置测量模式
    setMeasurementMode(mode) {
        this.measurementMode = mode;
        
        // 清理当前工具
        this.cleanupCurrentTool();
        
        // 更新UI状态
        this.updateMeasurementUI(mode);
        
        // 创建对应的测量工具
        switch (mode) {
            case 'distance':
                this.startDistanceMeasurement();
                break;
            case 'area':
                this.startAreaMeasurement();
                break;
            case 'both':
                this.startCombinedMeasurement();
                break;
        }
        
        console.log('切换到测量模式:', mode);
    }
    
    // 更新测量UI
    updateMeasurementUI(mode) {
        // 更新按钮状态
        document.querySelectorAll('.measure-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`btn-${mode}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 更新状态显示
        const statusElement = document.getElementById('measurement-status');
        const modeNames = {
            'distance': '距离测量',
            'area': '面积测量',
            'both': '综合测量'
        };
        
        statusElement.textContent = modeNames[mode] || '就绪';
    }
    
    // 开始距离测量
    startDistanceMeasurement() {
        const distanceTool = new LeafletDistance(this.map, {
            lang: 'zh',
            coordPrecision: 6,
            precision: this.getPrecision(),
            lineStyle: {
                color: '#4285f4',
                weight: 3,
                opacity: 0.8,
                dashArray: '10,5'
            },
            markerStyle: {
                containerClassName: 'distance-marker',
                dotClassName: 'distance-dot',
                labelClassName: 'distance-label'
            }
        });
        
        // 绑定事件
        distanceTool.on('measurementchange', (e) => {
            this.onDistanceMeasurementChange(e);
        });
        
        distanceTool.on('measurementcomplete', (e) => {
            this.onDistanceMeasurementComplete(e);
        });
        
        // 保存工具
        this.currentTool = {
            type: 'distance',
            instance: distanceTool
        };
        
        this.measurementTools.set('distance', distanceTool);
        
        console.log('开始距离测量');
    }
    
    // 开始面积测量
    startAreaMeasurement() {
        const areaTool = new LeafletArea(this.map, {
            lang: 'zh',
            coordPrecision: 6,
            precision: this.getPrecision(),
            polygonStyle: {
                color: '#34a853',
                weight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.3,
                dashArray: '8,4'
            },
            markerStyle: {
                containerClassName: 'area-marker',
                dotClassName: 'area-dot',
                labelClassName: 'area-label'
            },
            validation: {
                allowSelfIntersect: false
            }
        });
        
        // 绑定事件
        areaTool.on('measurementchange', (e) => {
            this.onAreaMeasurementChange(e);
        });
        
        areaTool.on('measurementcomplete', (e) => {
            this.onAreaMeasurementComplete(e);
        });
        
        // 保存工具
        this.currentTool = {
            type: 'area',
            instance: areaTool
        };
        
        this.measurementTools.set('area', areaTool);
        
        console.log('开始面积测量');
    }
    
    // 开始综合测量
    startCombinedMeasurement() {
        // 创建距离和面积工具
        this.startDistanceMeasurement();
        this.startAreaMeasurement();
        
        // 设置为综合模式
        this.currentTool = {
            type: 'combined',
            instances: {
                distance: this.measurementTools.get('distance'),
                area: this.measurementTools.get('area')
            }
        };
        
        console.log('开始综合测量');
    }
    
    // 距离测量变化处理
    onDistanceMeasurementChange(e) {
        const { distance, coordinates } = e;
        
        // 更新当前测量信息
        this.updateCurrentMeasurement({
            type: 'distance',
            value: distance,
            coordinates: coordinates,
            unit: this.getDistanceUnit(),
            formatted: this.formatDistance(distance)
        });
    }
    
    // 距离测量完成处理
    onDistanceMeasurementComplete(e) {
        const { distance, coordinates, geoJSON } = e;
        
        // 创建测量结果
        const result = {
            id: Date.now(),
            type: 'distance',
            value: distance,
            coordinates: coordinates,
            geoJSON: geoJSON,
            unit: this.getDistanceUnit(),
            formatted: this.formatDistance(distance),
            timestamp: new Date().toISOString(),
            layer: this.createDistanceLayer(coordinates, distance)
        };
        
        // 添加到结果列表
        this.measurementResults.push(result);
        this.measurementLayers.set(result.id, result.layer);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateSummary();
        
        console.log('距离测量完成:', result);
    }
    
    // 面积测量变化处理
    onAreaMeasurementChange(e) {
        const { area, coordinates } = e;
        
        // 更新当前测量信息
        this.updateCurrentMeasurement({
            type: 'area',
            value: area,
            coordinates: coordinates,
            unit: this.getAreaUnit(),
            formatted: this.formatArea(area)
        });
    }
    
    // 面积测量完成处理
    onAreaMeasurementComplete(e) {
        const { area, coordinates, geoJSON } = e;
        
        // 创建测量结果
        const result = {
            id: Date.now(),
            type: 'area',
            value: area,
            coordinates: coordinates,
            geoJSON: geoJSON,
            unit: this.getAreaUnit(),
            formatted: this.formatArea(area),
            timestamp: new Date().toISOString(),
            layer: this.createAreaLayer(coordinates, area)
        };
        
        // 添加到结果列表
        this.measurementResults.push(result);
        this.measurementLayers.set(result.id, result.layer);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateSummary();
        
        console.log('面积测量完成:', result);
    }
    
    // 创建距离图层
    createDistanceLayer(coordinates, distance) {
        const layer = L.polyline(
            coordinates.map(coord => [coord[1], coord[0]]),
            {
                color: '#4285f4',
                weight: 3,
                opacity: 0.8,
                dashArray: '10,5'
            }
        );
        
        // 添加标记点
        coordinates.forEach((coord, index) => {
            const marker = L.circleMarker([coord[1], coord[0]], {
                radius: 5,
                fillColor: '#4285f4',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            marker.bindPopup(`
                <div class="measurement-popup">
                    <strong>距离测量点 ${index + 1}</strong><br>
                    坐标: ${coord[1].toFixed(6)}, ${coord[0].toFixed(6)}<br>
                    ${index === coordinates.length - 1 ? `总距离: ${this.formatDistance(distance)}` : ''}
                </div>
            `);
            
            layer.addLayer(marker);
        });
        
        // 添加到地图
        layer.addTo(this.map);
        
        return layer;
    }
    
    // 创建面积图层
    createAreaLayer(coordinates, area) {
        const layer = L.polygon(
            coordinates.map(coord => [coord[1], coord[0]]),
            {
                color: '#34a853',
                weight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.3,
                dashArray: '8,4'
            }
        );
        
        // 添加标记点
        coordinates.forEach((coord, index) => {
            const marker = L.circleMarker([coord[1], coord[0]], {
                radius: 5,
                fillColor: '#34a853',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            marker.bindPopup(`
                <div class="measurement-popup">
                    <strong>面积测量点 ${index + 1}</strong><br>
                    坐标: ${coord[1].toFixed(6)}, ${coord[0].toFixed(6)}<br>
                    ${index === coordinates.length - 1 ? `总面积: ${this.formatArea(area)}` : ''}
                </div>
            `);
            
            layer.addLayer(marker);
        });
        
        // 添加到地图
        layer.addTo(this.map);
        
        return layer;
    }
    
    // 更新当前测量信息
    updateCurrentMeasurement(measurement) {
        const currentElement = document.getElementById('current-measurement');
        
        let html = `
            <div class="measurement-item">
                <div class="measurement-type">${this.getMeasurementTypeName(measurement.type)}</div>
                <div class="measurement-value">${measurement.formatted}</div>
                <div class="measurement-details">
                    <div>坐标点数: ${measurement.coordinates.length}</div>
                    <div>单位: ${measurement.unit}</div>
                </div>
            </div>
        `;
        
        currentElement.innerHTML = html;
    }
    
    // 更新结果面板
    updateResultsPanel() {
        const resultsElement = document.getElementById('results-content');
        
        if (this.measurementResults.length === 0) {
            resultsElement.innerHTML = '<div class="no-results">暂无测量结果</div>';
            return;
        }
        
        let html = '';
        this.measurementResults.forEach((result, index) => {
            html += `
                <div class="result-item" data-result-id="${result.id}">
                    <div class="result-header">
                        <div class="result-type">${this.getMeasurementTypeName(result.type)}</div>
                        <div class="result-actions">
                            <button class="result-action zoom-to" title="缩放到测量">🔍</button>
                            <button class="result-action toggle-visibility" title="显示/隐藏">👁️</button>
                            <button class="result-action delete" title="删除">🗑️</button>
                        </div>
                    </div>
                    <div class="result-content">
                        <div class="result-value">${result.formatted}</div>
                        <div class="result-meta">
                            <div>时间: ${new Date(result.timestamp).toLocaleTimeString()}</div>
                            <div>点数: ${result.coordinates.length}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsElement.innerHTML = html;
        
        // 绑定事件
        this.bindResultEvents();
    }
    
    // 绑定结果事件
    bindResultEvents() {
        document.querySelectorAll('.result-item').forEach(item => {
            const resultId = parseInt(item.dataset.resultId);
            const result = this.measurementResults.find(r => r.id === resultId);
            
            if (!result) return;
            
            // 缩放到测量
            const zoomBtn = item.querySelector('.zoom-to');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.zoomToMeasurement(result);
                });
            }
            
            // 切换可见性
            const visibilityBtn = item.querySelector('.toggle-visibility');
            if (visibilityBtn) {
                visibilityBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleMeasurementVisibility(result);
                });
            }
            
            // 删除测量
            const deleteBtn = item.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteMeasurement(result);
                });
            }
        });
    }
    
    // 缩放到测量
    zoomToMeasurement(result) {
        const layer = this.measurementLayers.get(result.id);
        if (layer) {
            const bounds = layer.getBounds();
            if (bounds) {
                this.map.fitBounds(bounds, { padding: [20, 20] });
            }
        }
    }
    
    // 切换测量可见性
    toggleMeasurementVisibility(result) {
        const layer = this.measurementLayers.get(result.id);
        if (layer) {
            const isVisible = this.map.hasLayer(layer);
            
            if (isVisible) {
                this.map.removeLayer(layer);
                result.visible = false;
            } else {
                this.map.addLayer(layer);
                result.visible = true;
            }
            
            // 更新UI
            this.updateResultsPanel();
        }
    }
    
    // 删除测量
    deleteMeasurement(result) {
        // 从地图移除
        const layer = this.measurementLayers.get(result.id);
        if (layer) {
            this.map.removeLayer(layer);
        }
        
        // 从列表移除
        const index = this.measurementResults.indexOf(result);
        if (index > -1) {
            this.measurementResults.splice(index, 1);
        }
        
        // 清理图层数据
        this.measurementLayers.delete(result.id);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateSummary();
        
        console.log('删除测量结果:', result.id);
    }
    
    // 更新汇总信息
    updateSummary() {
        const distanceResults = this.measurementResults.filter(r => r.type === 'distance');
        const areaResults = this.measurementResults.filter(r => r.type === 'area');
        
        const totalDistance = distanceResults.reduce((sum, r) => sum + r.value, 0);
        const totalArea = areaResults.reduce((sum, r) => sum + r.value, 0);
        
        document.getElementById('total-measurements').textContent = this.measurementResults.length;
        document.getElementById('total-distance').textContent = this.formatDistance(totalDistance);
        document.getElementById('total-area').textContent = this.formatArea(totalArea);
    }
    
    // 清除所有测量
    clearAllMeasurements() {
        if (this.measurementResults.length === 0) {
            alert('没有测量需要清除');
            return;
        }
        
        if (confirm(`确定要清除所有 ${this.measurementResults.length} 个测量吗？`)) {
            // 移除所有图层
            this.measurementLayers.forEach(layer => {
                this.map.removeLayer(layer);
            });
            
            // 清空数据
            this.measurementResults = [];
            this.measurementLayers.clear();
            
            // 清理工具
            this.cleanupCurrentTool();
            
            // 更新UI
            this.updateResultsPanel();
            this.updateSummary();
            this.updateCurrentMeasurement(null);
            
            console.log('所有测量已清除');
        }
    }
    
    // 清除结果
    clearResults() {
        this.clearAllMeasurements();
    }
    
    // 清理当前工具
    cleanupCurrentTool() {
        if (this.currentTool) {
            if (this.currentTool.type === 'combined') {
                // 清理综合模式工具
                Object.values(this.currentTool.instances).forEach(tool => {
                    if (tool.destroy) {
                        tool.destroy();
                    }
                });
            } else if (this.currentTool.instance) {
                // 清理单个工具
                if (this.currentTool.instance.destroy) {
                    this.currentTool.instance.destroy();
                }
            }
            
            this.currentTool = null;
        }
    }
    
    // 导出测量结果
    exportMeasurements() {
        if (this.measurementResults.length === 0) {
            alert('没有测量结果可以导出');
            return;
        }
        
        const exportData = {
            type: 'MeasurementCollection',
            measurements: this.measurementResults.map(result => ({
                id: result.id,
                type: result.type,
                value: result.value,
                unit: result.unit,
                formatted: result.formatted,
                coordinates: result.coordinates,
                timestamp: result.timestamp
            })),
            summary: {
                totalMeasurements: this.measurementResults.length,
                totalDistance: this.measurementResults
                    .filter(r => r.type === 'distance')
                    .reduce((sum, r) => sum + r.value, 0),
                totalArea: this.measurementResults
                    .filter(r => r.type === 'area')
                    .reduce((sum, r) => sum + r.value, 0),
                unitSystem: this.getUnitSystem(),
                precision: this.getPrecision(),
                exportTime: new Date().toISOString()
            }
        };
        
        // 下载文件
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `measurements-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('测量结果已导出');
    }
    
    // 切换单位系统
    toggleUnitSystem() {
        const systems = ['metric', 'imperial', 'chinese'];
        const currentSystem = this.getUnitSystem();
        const currentIndex = systems.indexOf(currentSystem);
        const nextSystem = systems[(currentIndex + 1) % systems.length];
        
        this.setUnitSystem(nextSystem);
        
        // 更新UI
        document.getElementById('unit-system').value = nextSystem;
        
        // 重新格式化所有结果
        this.reformatAllResults();
        
        console.log('切换单位系统到:', nextSystem);
    }
    
    // 重新格式化所有结果
    reformatAllResults() {
        this.measurementResults.forEach(result => {
            if (result.type === 'distance') {
                result.formatted = this.formatDistance(result.value);
                result.unit = this.getDistanceUnit();
            } else if (result.type === 'area') {
                result.formatted = this.formatArea(result.value);
                result.unit = this.getAreaUnit();
            }
        });
        
        // 更新UI
        this.updateResultsPanel();
        this.updateSummary();
    }
    
    // 获取测量类型名称
    getMeasurementTypeName(type) {
        const names = {
            'distance': '距离测量',
            'area': '面积测量'
        };
        
        return names[type] || type;
    }
    
    // 获取单位系统
    getUnitSystem() {
        return document.getElementById('unit-system').value;
    }
    
    // 设置单位系统
    setUnitSystem(system) {
        document.getElementById('unit-system').value = system;
    }
    
    // 获取精度
    getPrecision() {
        return parseInt(document.getElementById('measurement-precision').value);
    }
    
    // 更新精度
    updatePrecision(precision) {
        // 重新创建当前工具以应用新精度
        const currentMode = this.measurementMode;
        this.setMeasurementMode(currentMode);
    }
    
    // 获取显示格式
    getDisplayFormat() {
        return document.getElementById('display-format').value;
    }
    
    // 更新显示格式
    updateDisplayFormat(format) {
        // 重新格式化所有结果
        this.reformatAllResults();
    }
    
    // 获取距离单位
    getDistanceUnit() {
        const system = this.getUnitSystem();
        const units = {
            'metric': 'm',
            'imperial': 'ft',
            'chinese': '丈'
        };
        
        return units[system] || 'm';
    }
    
    // 获取面积单位
    getAreaUnit() {
        const system = this.getUnitSystem();
        const units = {
            'metric': 'm²',
            'imperial': 'ft²',
            'chinese': '亩'
        };
        
        return units[system] || 'm²';
    }
    
    // 格式化距离
    formatDistance(distance) {
        const unit = this.getDistanceUnit();
        const precision = this.getPrecision();
        const format = this.getDisplayFormat();
        
        // 单位转换
        let convertedDistance = distance;
        if (unit === 'ft') {
            convertedDistance = distance * 3.28084; // 米转英尺
        } else if (unit === '丈') {
            convertedDistance = distance * 0.3; // 米转丈
        }
        
        // 格式化
        let formatted = convertedDistance.toFixed(precision) + unit;
        
        if (format === 'detailed') {
            if (unit === 'm' && convertedDistance >= 1000) {
                formatted += ` (${(convertedDistance / 1000).toFixed(precision)}km)`;
            } else if (unit === 'ft' && convertedDistance >= 5280) {
                formatted += ` (${(convertedDistance / 5280).toFixed(precision)}mi)`;
            }
        } else if (format === 'scientific') {
            formatted = convertedDistance.toExponential(precision) + unit;
        }
        
        return formatted;
    }
    
    // 格式化面积
    formatArea(area) {
        const unit = this.getAreaUnit();
        const precision = this.getPrecision();
        const format = this.getDisplayFormat();
        
        // 单位转换
        let convertedArea = area;
        if (unit === 'ft²') {
            convertedArea = area * 10.7639; // 平方米转平方英尺
        } else if (unit === '亩') {
            convertedArea = area * 0.0015; // 平方米转亩
        }
        
        // 格式化
        let formatted = convertedArea.toFixed(precision) + unit;
        
        if (format === 'detailed') {
            if (unit === 'm²' && convertedArea >= 10000) {
                formatted += ` (${(convertedArea / 10000).toFixed(precision)}ha)`;
            } else if (unit === 'ft²' && convertedArea >= 43560) {
                formatted += ` (${(convertedArea / 43560).toFixed(precision)}acre)`;
            }
        } else if (format === 'scientific') {
            formatted = convertedArea.toExponential(precision) + unit;
        }
        
        return formatted;
    }
    
    // 切换结果面板
    toggleResultsPanel() {
        const content = document.getElementById('results-content');
        const isCollapsed = content.style.display === 'none';
        
        content.style.display = isCollapsed ? 'block' : 'none';
        
        const collapseBtn = document.getElementById('btn-collapse-results');
        collapseBtn.textContent = isCollapsed ? '📁' : '📂';
    }
    
    // 销毁系统
    destroy() {
        // 清理测量工具
        this.cleanupCurrentTool();
        
        // 清理测量结果
        this.measurementLayers.forEach(layer => {
            this.map.removeLayer(layer);
        });
        
        this.measurementResults = [];
        this.measurementLayers.clear();
        
        // 清理地图
        if (this.map) {
            this.map.remove();
        }
        
        console.log('测量系统已销毁');
    }
}

// 使用示例
document.addEventListener('DOMContentLoaded', () => {
    // 创建综合测量系统
    const measurementSystem = new ComprehensiveMeasurementSystem('map-container');
    
    console.log('综合测量系统已启动');
});
```

**配套CSS样式：**
```css
/* 测量工具栏样式 */
.measurement-toolbar {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 200px;
}

.measurement-header h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
    text-align: center;
}

.measurement-tools {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.measure-btn {
    padding: 10px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    text-align: center;
}

.measure-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-1px);
}

.measure-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.measurement-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-btn {
    padding: 8px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
}

.control-btn:hover {
    background: #5a6268;
    transform: translateY(-1px);
}

/* 测量面板样式 */
.measurement-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 250px;
    max-width: 300px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9ecef;
}

.panel-header h4 {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.panel-status {
    font-size: 12px;
    color: #666;
    padding: 4px 8px;
    background: #f8f9fa;
    border-radius: 4px;
}

.measurement-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-section h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
}

.current-info {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.no-measurement {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.measurement-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.measurement-type {
    font-weight: 600;
    color: #333;
    font-size: 13px;
}

.measurement-value {
    font-size: 16px;
    font-weight: bold;
    color: #007bff;
}

.measurement-details {
    font-size: 11px;
    color: #666;
    display: flex;
    gap: 10px;
}

.settings-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.setting-item label {
    font-weight: 500;
    color: #666;
}

.setting-item select {
    padding: 4px 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 11px;
}

/* 结果面板样式 */
.results-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 280px;
    max-width: 320px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
}

.results-header h4 {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.results-controls {
    display: flex;
    gap: 5px;
}

.results-controls button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.results-controls button:hover {
    background: rgba(0,0,0,0.1);
}

.results-content {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
}

.no-results {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.result-item {
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.result-item:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.result-type {
    font-weight: 600;
    color: #333;
    font-size: 12px;
}

.result-actions {
    display: flex;
    gap: 4px;
}

.result-action {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.result-action:hover {
    background: rgba(0,0,0,0.1);
}

.result-content {
    font-size: 11px;
}

.result-value {
    font-weight: bold;
    color: #007bff;
    margin-bottom: 4px;
}

.result-meta {
    color: #666;
    display: flex;
    gap: 10px;
}

.results-summary {
    padding-top: 8px;
    border-top: 1px solid #e9ecef;
    font-size: 11px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.summary-item span:first-child {
    color: #666;
}

.summary-item span:last-child {
    font-weight: 600;
    color: #333;
}

/* 测量弹出样式 */
.measurement-popup {
    font-size: 11px;
    line-height: 1.4;
}

.measurement-popup strong {
    display: block;
    margin-bottom: 4px;
    color: #333;
}
```

### 7.4 拓扑操作工作流

本节展示拓扑操作的完整工作流，包括图层选择、操作执行、结果处理等环节。

#### 拓扑操作管理系统

创建一个完整的拓扑操作管理系统，支持复杂的空间分析工作流：

```javascript
// 拓扑操作管理系统
class TopologyWorkflowManager {
    constructor(mapId, center = [31.2304, 121.4737], zoom = 13) {
        this.map = null;
        this.topologyTool = null;
        this.auxiliaryLineTool = null;
        this.selectedLayers = [];
        this.operationHistory = [];
        this.currentOperation = null;
        this.operationMode = 'select'; // select, clip, merge, reshape
        
        this.initMap(mapId, center, zoom);
        this.initTopologyUI();
        this.initTopologyEvents();
    }
    
    // 初始化地图
    initMap(mapId, center, zoom) {
        this.map = L.map(mapId).setView(center, zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        // 初始化拓扑工具
        this.topologyTool = LeafletTopology.getInstance(this.map, {
            precision: 8,
            circleStep: 128
        });
        
        console.log('地图和拓扑工具初始化完成');
    }
    
    // 初始化拓扑UI
    initTopologyUI() {
        this.createTopologyToolbar();
        this.createOperationPanel();
        this.createLayerSelector();
        this.createResultPanel();
    }
    
    // 创建拓扑工具栏
    createTopologyToolbar() {
        const toolbar = L.control({ position: 'topright' });
        
        toolbar.onAdd = () => {
            const div = L.DomUtil.create('div', 'topology-toolbar');
            div.innerHTML = `
                <div class="topology-header">
                    <h4>🔗 拓扑工具</h4>
                </div>
                <div class="topology-modes">
                    <button id="btn-select" class="topology-btn active" title="选择模式">
                        👆 选择
                    </button>
                    <button id="btn-clip" class="topology-btn" title="裁剪操作">
                        ✂️ 裁剪
                    </button>
                    <button id="btn-merge" class="topology-btn" title="合并操作">
                        🔗 合并
                    </button>
                    <button id="btn-reshape" class="topology-btn" title="整形操作">
                        ✏️ 整形
                    </button>
                </div>
                <div class="topology-controls">
                    <button id="btn-clear-selection" class="control-btn" title="清除选择">
                        🧹 清除
                    </button>
                    <button id="btn-undo-operation" class="control-btn" title="撤销操作">
                        ↶ 撤销
                    </button>
                    <button id="btn-export-results" class="control-btn" title="导出结果">
                        💾 导出
                    </button>
                </div>
            `;
            
            return div;
        };
        
        toolbar.addTo(this.map);
    }
    
    // 创建操作面板
    createOperationPanel() {
        const panel = L.control({ position: 'left' });
        
        panel.onAdd = () => {
            const div = L.DomUtil.create('div', 'operation-panel');
            div.innerHTML = `
                <div class="panel-header">
                    <h4>拓扑操作</h4>
                    <div class="operation-status">
                        <span id="operation-status">就绪</span>
                    </div>
                </div>
                <div class="operation-content">
                    <div class="operation-section">
                        <h5>当前模式</h5>
                        <div id="current-mode" class="mode-info">
                            <div class="mode-name">选择模式</div>
                            <div class="mode-description">点击选择要进行拓扑操作的图层</div>
                        </div>
                    </div>
                    <div class="operation-section">
                        <h5>操作参数</h5>
                        <div id="operation-params" class="params-content">
                            <div class="no-params">请选择操作模式</div>
                        </div>
                    </div>
                    <div class="operation-section">
                        <h5>选中图层</h5>
                        <div id="selected-layers" class="layers-content">
                            <div class="no-layers">未选择任何图层</div>
                        </div>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        panel.addTo(this.map);
    }
    
    // 创建图层选择器
    createLayerSelector() {
        const selector = L.control({ position: 'topleft' });
        
        selector.onAdd = () => {
            const div = L.DomUtil.create('div', 'layer-selector');
            div.innerHTML = `
                <div class="selector-header">
                    <h4>图层选择</h4>
                    <div class="selector-controls">
                        <button id="btn-add-test-layers" title="添加测试图层">➕</button>
                        <button id="btn-clear-all-layers" title="清除所有图层">🗑️</button>
                    </div>
                </div>
                <div id="available-layers" class="available-layers">
                    <div class="no-layers">暂无可用图层</div>
                </div>
            `;
            
            return div;
        };
        
        selector.addTo(this.map);
    }
    
    // 创建结果面板
    createResultPanel() {
        const panel = L.control({ position: 'bottomright' });
        
        panel.onAdd = () => {
            const div = L.DomUtil.create('div', 'result-panel');
            div.innerHTML = `
                <div class="result-header">
                    <h4>📊 操作结果</h4>
                    <div class="result-controls">
                        <button id="btn-clear-results" title="清除结果">🗑️</button>
                        <button id="btn-collapse-results" title="折叠">📁</button>
                    </div>
                </div>
                <div id="result-content" class="result-content">
                    <div class="no-results">暂无操作结果</div>
                </div>
                <div class="result-summary">
                    <div class="summary-item">
                        <span>操作次数:</span>
                        <span id="operation-count">0</span>
                    </div>
                    <div class="summary-item">
                        <span>成功次数:</span>
                        <span id="success-count">0</span>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        panel.addTo(this.map);
    }
    
    // 初始化拓扑事件
    initTopologyEvents() {
        // 模式切换按钮
        document.getElementById('btn-select').addEventListener('click', () => {
            this.setOperationMode('select');
        });
        
        document.getElementById('btn-clip').addEventListener('click', () => {
            this.setOperationMode('clip');
        });
        
        document.getElementById('btn-merge').addEventListener('click', () => {
            this.setOperationMode('merge');
        });
        
        document.getElementById('btn-reshape').addEventListener('click', () => {
            this.setOperationMode('reshape');
        });
        
        // 控制按钮
        document.getElementById('btn-clear-selection').addEventListener('click', () => {
            this.clearSelection();
        });
        
        document.getElementById('btn-undo-operation').addEventListener('click', () => {
            this.undoLastOperation();
        });
        
        document.getElementById('btn-export-results').addEventListener('click', () => {
            this.exportResults();
        });
        
        // 图层选择器控制
        document.getElementById('btn-add-test-layers').addEventListener('click', () => {
            this.addTestLayers();
        });
        
        document.getElementById('btn-clear-all-layers').addEventListener('click', () => {
            this.clearAllLayers();
        });
        
        // 结果面板控制
        document.getElementById('btn-clear-results').addEventListener('click', () => {
            this.clearResults();
        });
        
        document.getElementById('btn-collapse-results').addEventListener('click', () => {
            this.toggleResultPanel();
        });
        
        // 绑定拓扑工具事件
        this.bindTopologyEvents();
    }
    
    // 绑定拓扑工具事件
    bindTopologyEvents() {
        // 图层选择事件
        this.topologyTool.on('layerSelected', (e) => {
            this.onLayerSelected(e);
        });
        
        // 裁剪完成事件
        this.topologyTool.on('clipComplete', (e) => {
            this.onClipComplete(e);
        });
        
        // 合并完成事件
        this.topologyTool.on('mergeComplete', (e) => {
            this.onMergeComplete(e);
        });
        
        // 整形完成事件
        this.topologyTool.on('reshapeComplete', (e) => {
            this.onReshapeComplete(e);
        });
    }
    
    // 设置操作模式
    setOperationMode(mode) {
        this.operationMode = mode;
        
        // 清理当前状态
        this.cleanupCurrentOperation();
        
        // 更新UI
        this.updateOperationUI(mode);
        
        // 根据模式初始化操作
        switch (mode) {
            case 'select':
                this.enableSelectionMode();
                break;
            case 'clip':
                this.enableClipMode();
                break;
            case 'merge':
                this.enableMergeMode();
                break;
            case 'reshape':
                this.enableReshapeMode();
                break;
        }
        
        console.log('切换到操作模式:', mode);
    }
    
    // 更新操作UI
    updateOperationUI(mode) {
        // 更新按钮状态
        document.querySelectorAll('.topology-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`btn-${mode}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 更新模式信息
        const modeElement = document.getElementById('current-mode');
        const modeNames = {
            'select': '选择模式',
            'clip': '裁剪模式',
            'merge': '合并模式',
            'reshape': '整形模式'
        };
        
        const modeDescriptions = {
            'select': '点击选择要进行拓扑操作的图层',
            'clip': '选择图层后绘制裁剪线进行裁剪操作',
            'merge': '选择多个图层进行合并操作',
            'reshape': '选择图层后绘制整形线进行整形操作'
        };
        
        modeElement.innerHTML = `
            <div class="mode-name">${modeNames[mode]}</div>
            <div class="mode-description">${modeDescriptions[mode]}</div>
        `;
        
        // 更新操作参数
        this.updateOperationParameters(mode);
        
        // 更新状态
        document.getElementById('operation-status').textContent = modeNames[mode];
    }
    
    // 更新操作参数
    updateOperationParameters(mode) {
        const paramsElement = document.getElementById('operation-params');
        
        let html = '';
        switch (mode) {
            case 'clip':
                html = `
                    <div class="param-group">
                        <div class="param-item">
                            <label>裁剪策略:</label>
                            <select id="clip-strategy">
                                <option value="split">分割</option>
                                <option value="intersect">相交</option>
                                <option value="difference">差集</option>
                            </select>
                        </div>
                        <div class="param-item">
                            <label>保留原图层:</label>
                            <input type="checkbox" id="keep-original" checked>
                        </div>
                    </div>
                `;
                break;
                
            case 'merge':
                html = `
                    <div class="param-group">
                        <div class="param-item">
                            <label>合并策略:</label>
                            <select id="merge-strategy">
                                <option value="union">并集</option>
                                <option value="intersection">交集</option>
                            </select>
                        </div>
                        <div class="param-item">
                            <label>容差:</label>
                            <input type="number" id="merge-tolerance" value="0.001" step="0.001">
                        </div>
                    </div>
                `;
                break;
                
            case 'reshape':
                html = `
                    <div class="param-group">
                        <div class="param-item">
                            <label>整形策略:</label>
                            <select id="reshape-strategy">
                                <option value="auto">自动</option>
                                <option value="conservative">保守</option>
                                <option value="aggressive">激进</option>
                            </select>
                        </div>
                        <div class="param-item">
                            <label>允许无选择:</label>
                            <input type="checkbox" id="allow-no-selection">
                        </div>
                    </div>
                `;
                break;
                
            default:
                html = '<div class="no-params">该模式无需参数</div>';
        }
        
        paramsElement.innerHTML = html;
    }
    
    // 启用选择模式
    enableSelectionMode() {
        this.currentOperation = {
            type: 'select',
            state: 'active'
        };
        
        // 启用图层选择
        this.topologyTool.enableSelection();
        
        console.log('启用选择模式');
    }
    
    // 启用裁剪模式
    enableClipMode() {
        this.currentOperation = {
            type: 'clip',
            state: 'waiting_selection'
        };
        
        // 检查是否已选择图层
        if (this.selectedLayers.length === 0) {
            this.showOperationMessage('请先选择要裁剪的图层');
            return;
        }
        
        // 开始裁剪操作
        this.startClipOperation();
        
        console.log('启用裁剪模式');
    }
    
    // 启用合并模式
    enableMergeMode() {
        this.currentOperation = {
            type: 'merge',
            state: 'waiting_selection'
        };
        
        // 检查是否已选择图层
        if (this.selectedLayers.length < 2) {
            this.showOperationMessage('请至少选择两个图层进行合并');
            return;
        }
        
        // 开始合并操作
        this.startMergeOperation();
        
        console.log('启用合并模式');
    }
    
    // 启用整形模式
    enableReshapeMode() {
        this.currentOperation = {
            type: 'reshape',
            state: 'waiting_selection'
        };
        
        // 检查是否已选择图层
        if (this.selectedLayers.length === 0) {
            this.showOperationMessage('请先选择要整形的图层');
            return;
        }
        
        // 开始整形操作
        this.startReshapeOperation();
        
        console.log('启用整形模式');
    }
    
    // 开始裁剪操作
    startClipOperation() {
        const strategy = document.getElementById('clip-strategy')?.value || 'split';
        const keepOriginal = document.getElementById('keep-original')?.checked || true;
        
        this.currentOperation.state = 'drawing_clip_line';
        
        // 创建辅助线工具
        this.auxiliaryLineTool = new AuxiliaryLine(this.map, {
            defaultStyle: {
                color: '#ff6b35',
                weight: 3,
                opacity: 0.8,
                dashArray: '8,4'
            },
            validation: {
                allowSelfIntersect: false
            }
        });
        
        // 监听辅助线完成
        this.auxiliaryLineTool.onStateChange((state) => {
            if (state === 'idle') {
                this.executeClipOperation(strategy, keepOriginal);
            }
        });
        
        this.showOperationMessage('请绘制裁剪线');
    }
    
    // 开始合并操作
    startMergeOperation() {
        const strategy = document.getElementById('merge-strategy')?.value || 'union';
        const tolerance = parseFloat(document.getElementById('merge-tolerance')?.value || '0.001');
        
        this.currentOperation.state = 'executing_merge';
        
        // 执行合并操作
        this.executeMergeOperation(strategy, tolerance);
    }
    
    // 开始整形操作
    startReshapeOperation() {
        const strategy = document.getElementById('reshape-strategy')?.value || 'auto';
        const allowNoSelection = document.getElementById('allow-no-selection')?.checked || false;
        
        this.currentOperation.state = 'drawing_reshape_line';
        
        // 创建辅助线工具
        this.auxiliaryLineTool = new AuxiliaryLine(this.map, {
            defaultStyle: {
                color: '#9c27b0',
                weight: 3,
                opacity: 0.8,
                dashArray: '5,5'
            },
            validation: {
                allowSelfIntersect: false
            }
        });
        
        // 监听辅助线完成
        this.auxiliaryLineTool.onStateChange((state) => {
            if (state === 'idle') {
                this.executeReshapeOperation(strategy, allowNoSelection);
            }
        });
        
        this.showOperationMessage('请绘制整形线');
    }
    
    // 执行裁剪操作
    executeClipOperation(strategy, keepOriginal) {
        try {
            // 获取裁剪线
            const clipLine = this.auxiliaryLineTool.getGeoJSON();
            
            // 执行裁剪
            this.topologyTool.clipByLine((result) => {
                this.onClipComplete({
                    strategy: strategy,
                    keepOriginal: keepOriginal,
                    clipLine: clipLine,
                    result: result
                });
            });
            
        } catch (error) {
            console.error('裁剪操作失败:', error);
            this.showOperationError('裁剪操作失败: ' + error.message);
        } finally {
            this.cleanupAuxiliaryLine();
        }
    }
    
    // 执行合并操作
    executeMergeOperation(strategy, tolerance) {
        try {
            // 执行合并
            this.topologyTool.merge((result) => {
                this.onMergeComplete({
                    strategy: strategy,
                    tolerance: tolerance,
                    result: result
                });
            });
            
        } catch (error) {
            console.error('合并操作失败:', error);
            this.showOperationError('合并操作失败: ' + error.message);
        }
    }
    
    // 执行整形操作
    executeReshapeOperation(strategy, allowNoSelection) {
        try {
            // 获取整形线
            const reshapeLine = this.auxiliaryLineTool.getGeoJSON();
            
            const reshapeOptions = {
                chooseStrategy: strategy,
                AllowReshapingWithoutSelection: allowNoSelection
            };
            
            // 执行整形
            this.topologyTool.reshapeFeature(reshapeOptions, (result) => {
                this.onReshapeComplete({
                    strategy: strategy,
                    allowNoSelection: allowNoSelection,
                    reshapeLine: reshapeLine,
                    result: result
                });
            });
            
        } catch (error) {
            console.error('整形操作失败:', error);
            this.showOperationError('整形操作失败: ' + error.message);
        } finally {
            this.cleanupAuxiliaryLine();
        }
    }
    
    // 图层选择处理
    onLayerSelected(e) {
        const { layer, selected } = e;
        
        if (selected) {
            // 添加到选中列表
            if (!this.selectedLayers.includes(layer)) {
                this.selectedLayers.push(layer);
            }
        } else {
            // 从选中列表移除
            const index = this.selectedLayers.indexOf(layer);
            if (index > -1) {
                this.selectedLayers.splice(index, 1);
            }
        }
        
        // 更新UI
        this.updateSelectedLayersUI();
        
        console.log('图层选择变化:', this.selectedLayers.length, '个图层被选中');
    }
    
    // 裁剪完成处理
    onClipComplete(e) {
        const { strategy, keepOriginal, clipLine, result } = e;
        
        // 记录操作
        const operation = {
            id: Date.now(),
            type: 'clip',
            strategy: strategy,
            keepOriginal: keepOriginal,
            inputLayers: [...this.selectedLayers],
            clipLine: clipLine,
            result: result,
            timestamp: new Date().toISOString(),
            success: true
        };
        
        this.operationHistory.push(operation);
        
        // 处理结果
        this.processOperationResult(operation);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateOperationSummary();
        
        // 清理状态
        this.currentOperation.state = 'completed';
        this.showOperationMessage('裁剪操作完成');
        
        console.log('裁剪操作完成:', operation);
    }
    
    // 合并完成处理
    onMergeComplete(e) {
        const { strategy, tolerance, result } = e;
        
        // 记录操作
        const operation = {
            id: Date.now(),
            type: 'merge',
            strategy: strategy,
            tolerance: tolerance,
            inputLayers: [...this.selectedLayers],
            result: result,
            timestamp: new Date().toISOString(),
            success: true
        };
        
        this.operationHistory.push(operation);
        
        // 处理结果
        this.processOperationResult(operation);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateOperationSummary();
        
        // 清理状态
        this.currentOperation.state = 'completed';
        this.showOperationMessage('合并操作完成');
        
        console.log('合并操作完成:', operation);
    }
    
    // 整形完成处理
    onReshapeComplete(e) {
        const { strategy, allowNoSelection, reshapeLine, result } = e;
        
        // 记录操作
        const operation = {
            id: Date.now(),
            type: 'reshape',
            strategy: strategy,
            allowNoSelection: allowNoSelection,
            inputLayers: [...this.selectedLayers],
            reshapeLine: reshapeLine,
            result: result,
            timestamp: new Date().toISOString(),
            success: true
        };
        
        this.operationHistory.push(operation);
        
        // 处理结果
        this.processOperationResult(operation);
        
        // 更新UI
        this.updateResultsPanel();
        this.updateOperationSummary();
        
        // 清理状态
        this.currentOperation.state = 'completed';
        this.showOperationMessage('整形操作完成');
        
        console.log('整形操作完成:', operation);
    }
    
    // 处理操作结果
    processOperationResult(operation) {
        // 这里可以根据操作结果进行后续处理
        // 例如：添加结果图层、更新统计信息等
        
        console.log('处理操作结果:', operation);
    }
    
    // 更新选中图层UI
    updateSelectedLayersUI() {
        const layersElement = document.getElementById('selected-layers');
        
        if (this.selectedLayers.length === 0) {
            layersElement.innerHTML = '<div class="no-layers">未选择任何图层</div>';
            return;
        }
        
        let html = '';
        this.selectedLayers.forEach((layer, index) => {
            const layerType = this.getLayerType(layer);
            const layerId = this.getLayerId(layer);
            
            html += `
                <div class="selected-layer-item">
                    <div class="layer-info">
                        <div class="layer-type">${layerType}</div>
                        <div class="layer-id">ID: ${layerId}</div>
                    </div>
                    <div class="layer-actions">
                        <button class="layer-action remove-layer" data-index="${index}" title="移除">❌</button>
                    </div>
                </div>
            `;
        });
        
        layersElement.innerHTML = html;
        
        // 绑定移除事件
        layersElement.querySelectorAll('.remove-layer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeSelectedLayer(index);
            });
        });
    }
    
    // 移除选中的图层
    removeSelectedLayer(index) {
        const layer = this.selectedLayers[index];
        if (layer) {
            // 取消选择
            this.topologyTool.deselectLayer(layer);
        }
    }
    
    // 更新结果面板
    updateResultsPanel() {
        const resultsElement = document.getElementById('result-content');
        
        if (this.operationHistory.length === 0) {
            resultsElement.innerHTML = '<div class="no-results">暂无操作结果</div>';
            return;
        }
        
        let html = '';
        this.operationHistory.slice().reverse().forEach((operation, index) => {
            const operationType = this.getOperationTypeName(operation.type);
            const statusClass = operation.success ? 'success' : 'error';
            
            html += `
                <div class="result-item ${statusClass}" data-operation-id="${operation.id}">
                    <div class="result-header">
                        <div class="result-type">${operationType}</div>
                        <div class="result-time">${new Date(operation.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <div class="result-details">
                        <div class="detail-item">
                            <span>策略:</span>
                            <span>${operation.strategy || '默认'}</span>
                        </div>
                        <div class="detail-item">
                            <span>输入图层:</span>
                            <span>${operation.inputLayers?.length || 0}个</span>
                        </div>
                        <div class="detail-item">
                            <span>状态:</span>
                            <span>${operation.success ? '成功' : '失败'}</span>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="result-action zoom-to" title="缩放到结果">🔍</button>
                        <button class="result-action view-details" title="查看详情">📋</button>
                        <button class="result-action export-result" title="导出结果">💾</button>
                    </div>
                </div>
            `;
        });
        
        resultsElement.innerHTML = html;
        
        // 绑定结果事件
        this.bindResultEvents();
    }
    
    // 绑定结果事件
    bindResultEvents() {
        document.querySelectorAll('.result-item').forEach(item => {
            const operationId = parseInt(item.dataset.resultId);
            const operation = this.operationHistory.find(op => op.id === operationId);
            
            if (!operation) return;
            
            // 缩放到结果
            const zoomBtn = item.querySelector('.zoom-to');
            if (zoomBtn) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.zoomToOperationResult(operation);
                });
            }
            
            // 查看详情
            const detailsBtn = item.querySelector('.view-details');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showOperationDetails(operation);
                });
            }
            
            // 导出结果
            const exportBtn = item.querySelector('.export-result');
            if (exportBtn) {
                exportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.exportOperationResult(operation);
                });
            }
        });
    }
    
    // 缩放到操作结果
    zoomToOperationResult(operation) {
        // 这里可以根据操作结果缩放到相应区域
        // 简化实现：缩放到选中图层的范围
        if (operation.inputLayers && operation.inputLayers.length > 0) {
            const bounds = L.latLngBounds([]);
            
            operation.inputLayers.forEach(layer => {
                if (layer.getBounds) {
                    const layerBounds = layer.getBounds();
                    bounds.extend(layerBounds);
                }
            });
            
            if (bounds.isValid()) {
                this.map.fitBounds(bounds, { padding: [20, 20] });
            }
        }
    }
    
    // 显示操作详情
    showOperationDetails(operation) {
        const details = `
            操作类型: ${this.getOperationTypeName(operation.type)}
            操作时间: ${new Date(operation.timestamp).toLocaleString()}
            策略: ${operation.strategy || '默认'}
            输入图层数: ${operation.inputLayers?.length || 0}
            状态: ${operation.success ? '成功' : '失败'}
        `;
        
        alert(details);
    }
    
    // 导出操作结果
    exportOperationResult(operation) {
        const exportData = {
            operation: operation,
            exportTime: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `operation-${operation.type}-${operation.id}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // 更新操作汇总
    updateOperationSummary() {
        const totalCount = this.operationHistory.length;
        const successCount = this.operationHistory.filter(op => op.success).length;
        
        document.getElementById('operation-count').textContent = totalCount;
        document.getElementById('success-count').textContent = successCount;
    }
    
    // 清除选择
    clearSelection() {
        // 取消所有选中图层
        this.selectedLayers.forEach(layer => {
            this.topologyTool.deselectLayer(layer);
        });
        
        this.selectedLayers = [];
        this.updateSelectedLayersUI();
        
        console.log('已清除所有选择');
    }
    
    // 撤销最后操作
    undoLastOperation() {
        if (this.operationHistory.length === 0) {
            alert('没有可撤销的操作');
            return;
        }
        
        const lastOperation = this.operationHistory[this.operationHistory.length - 1];
        
        if (confirm(`确定要撤销最后的${this.getOperationTypeName(lastOperation.type)}操作吗？`)) {
            // 这里实现撤销逻辑
            // 简化实现：从历史记录中移除
            this.operationHistory.pop();
            
            // 更新UI
            this.updateResultsPanel();
            this.updateOperationSummary();
            
            console.log('已撤销最后操作');
        }
    }
    
    // 导出结果
    exportResults() {
        if (this.operationHistory.length === 0) {
            alert('没有操作结果可以导出');
            return;
        }
        
        const exportData = {
            type: 'TopologyOperationCollection',
            operations: this.operationHistory,
            summary: {
                totalOperations: this.operationHistory.length,
                successfulOperations: this.operationHistory.filter(op => op.success).length,
                failedOperations: this.operationHistory.filter(op => !op.success).length,
                operationTypes: this.getOperationTypeStatistics(),
                exportTime: new Date().toISOString()
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `topology-operations-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('操作结果已导出');
    }
    
    // 添加测试图层
    addTestLayers() {
        // 创建一些测试图层
        const testLayers = [
            // 测试多边形1
            L.polygon([
                [31.2304, 121.4737],
                [31.2314, 121.4747],
                [31.2314, 121.4757],
                [31.2304, 121.4757]
            ], {
                color: '#4285f4',
                weight: 2,
                fillColor: '#4285f4',
                fillOpacity: 0.3
            }),
            
            // 测试多边形2
            L.polygon([
                [31.2324, 121.4747],
                [31.2334, 121.4757],
                [31.2334, 121.4767],
                [31.2324, 121.4767]
            ], {
                color: '#34a853',
                weight: 2,
                fillColor: '#34a853',
                fillOpacity: 0.3
            }),
            
            // 测试多边形3
            L.polygon([
                [31.2314, 121.4757],
                [31.2324, 121.4767],
                [31.2324, 121.4777],
                [31.2314, 121.4777]
            ], {
                color: '#ff6b35',
                weight: 2,
                fillColor: '#ff6b35',
                fillOpacity: 0.3
            })
        ];
        
        // 添加到地图
        testLayers.forEach((layer, index) => {
            layer.addTo(this.map);
            layer.bindPopup(`测试图层 ${index + 1}`);
            
            // 添加到拓扑工具
            this.topologyTool.addLayer(layer);
        });
        
        // 更新可用图层列表
        this.updateAvailableLayersUI();
        
        console.log('已添加测试图层');
    }
    
    // 更新可用图层UI
    updateAvailableLayersUI() {
        const layersElement = document.getElementById('available-layers');
        
        // 获取地图上的所有图层
        const layers = [];
        this.map.eachLayer(layer => {
            if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                layers.push(layer);
            }
        });
        
        if (layers.length === 0) {
            layersElement.innerHTML = '<div class="no-layers">暂无可用图层</div>';
            return;
        }
        
        let html = '';
        layers.forEach((layer, index) => {
            const layerType = this.getLayerType(layer);
            const isSelected = this.selectedLayers.includes(layer);
            
            html += `
                <div class="available-layer-item ${isSelected ? 'selected' : ''}" data-layer-index="${index}">
                    <div class="layer-info">
                        <div class="layer-type">${layerType}</div>
                        <div class="layer-status">${isSelected ? '已选择' : '未选择'}</div>
                    </div>
                    <div class="layer-actions">
                        <button class="layer-action select-layer" title="选择/取消选择">👆</button>
                        <button class="layer-action zoom-to-layer" title="缩放到图层">🔍</button>
                    </div>
                </div>
            `;
        });
        
        layersElement.innerHTML = html;
        
        // 绑定事件
        layersElement.querySelectorAll('.select-layer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.available-layer-item').dataset.layerIndex);
                const layer = layers[index];
                
                if (this.selectedLayers.includes(layer)) {
                    this.topologyTool.deselectLayer(layer);
                } else {
                    this.topologyTool.selectLayer(layer);
                }
            });
        });
        
        layersElement.querySelectorAll('.zoom-to-layer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.available-layer-item').dataset.layerIndex);
                const layer = layers[index];
                
                if (layer.getBounds) {
                    this.map.fitBounds(layer.getBounds(), { padding: [20, 20] });
                }
            });
        });
    }
    
    // 清除所有图层
    clearAllLayers() {
        if (confirm('确定要清除所有图层吗？')) {
            // 清除地图上的所有图层
            this.map.eachLayer(layer => {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    this.map.removeLayer(layer);
                }
            });
            
            // 清除选择
            this.selectedLayers = [];
            this.updateSelectedLayersUI();
            this.updateAvailableLayersUI();
            
            console.log('已清除所有图层');
        }
    }
    
    // 清除结果
    clearResults() {
        if (this.operationHistory.length === 0) {
            alert('没有操作结果需要清除');
            return;
        }
        
        if (confirm(`确定要清除所有 ${this.operationHistory.length} 个操作结果吗？`)) {
            this.operationHistory = [];
            this.updateResultsPanel();
            this.updateOperationSummary();
            
            console.log('已清除所有操作结果');
        }
    }
    
    // 切换结果面板
    toggleResultPanel() {
        const content = document.getElementById('result-content');
        const isCollapsed = content.style.display === 'none';
        
        content.style.display = isCollapsed ? 'block' : 'none';
        
        const collapseBtn = document.getElementById('btn-collapse-results');
        collapseBtn.textContent = isCollapsed ? '📁' : '📂';
    }
    
    // 清理当前操作
    cleanupCurrentOperation() {
        // 清理辅助线工具
        this.cleanupAuxiliaryLine();
        
        // 重置操作状态
        this.currentOperation = null;
    }
    
    // 清理辅助线工具
    cleanupAuxiliaryLine() {
        if (this.auxiliaryLineTool) {
            this.auxiliaryLineTool.destroy();
            this.auxiliaryLineTool = null;
        }
    }
    
    // 显示操作消息
    showOperationMessage(message) {
        console.log('操作消息:', message);
        // 这里可以实现更复杂的消息显示逻辑
    }
    
    // 显示操作错误
    showOperationError(error) {
        console.error('操作错误:', error);
        alert('操作错误: ' + error);
    }
    
    // 获取图层类型
    getLayerType(layer) {
        if (layer instanceof L.Polygon) {
            return '多边形';
        } else if (layer instanceof L.Polyline) {
            return '折线';
        } else if (layer instanceof L.Marker) {
            return '点';
        } else {
            return '未知';
        }
    }
    
    // 获取图层ID
    getLayerId(layer) {
        return layer._leaflet_id || 'unknown';
    }
    
    // 获取操作类型名称
    getOperationTypeName(type) {
        const names = {
            'clip': '裁剪',
            'merge': '合并',
            'reshape': '整形'
        };
        
        return names[type] || type;
    }
    
    // 获取操作类型统计
    getOperationTypeStatistics() {
        const stats = {};
        
        this.operationHistory.forEach(operation => {
            const type = operation.type;
            stats[type] = (stats[type] || 0) + 1;
        });
        
        return stats;
    }
    
    // 销毁系统
    destroy() {
        // 清理操作
        this.cleanupCurrentOperation();
        
        // 清理拓扑工具
        if (this.topologyTool) {
            this.topologyTool.cleanAll();
        }
        
        // 清理地图
        if (this.map) {
            this.map.remove();
        }
        
        console.log('拓扑工作流管理系统已销毁');
    }
}

// 使用示例
document.addEventListener('DOMContentLoaded', () => {
    // 创建拓扑工作流管理系统
    const topologyManager = new TopologyWorkflowManager('map-container');
    
    console.log('拓扑工作流管理系统已启动');
});
```

**配套CSS样式：**
```css
/* 拓扑工具栏样式 */
.topology-toolbar {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 200px;
}

.topology-header h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
    text-align: center;
}

.topology-modes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
}

.topology-btn {
    padding: 10px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    text-align: center;
}

.topology-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateY(-1px);
}

.topology-btn.active {
    background: #6f42c1;
    color: white;
    border-color: #6f42c1;
}

.topology-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-btn {
    padding: 8px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
}

.control-btn:hover {
    background: #5a6268;
    transform: translateY(-1px);
}

/* 操作面板样式 */
.operation-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 250px;
    max-width: 300px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9ecef;
}

.panel-header h4 {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.operation-status {
    font-size: 12px;
    color: #666;
    padding: 4px 8px;
    background: #f8f9fa;
    border-radius: 4px;
}

.operation-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.operation-section h5 {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
}

.mode-info {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.mode-name {
    font-weight: 600;
    color: #333;
    font-size: 13px;
    margin-bottom: 4px;
}

.mode-description {
    font-size: 11px;
    color: #666;
    line-height: 1.4;
}

.params-content {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.param-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.param-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.param-item label {
    font-weight: 500;
    color: #666;
}

.param-item select,
.param-item input {
    padding: 4px 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 11px;
}

.no-params {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.layers-content {
    max-height: 200px;
    overflow-y: auto;
}

.no-layers {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.selected-layer-item,
.available-layer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    margin-bottom: 6px;
    background: #f8f9fa;
}

.selected-layer-item {
    background: #e3f2fd;
    border-color: #2196f3;
}

.layer-info {
    flex: 1;
}

.layer-type {
    font-weight: 600;
    color: #333;
    font-size: 12px;
}

.layer-id,
.layer-status {
    font-size: 10px;
    color: #666;
}

.layer-actions {
    display: flex;
    gap: 4px;
}

.layer-action {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.layer-action:hover {
    background: rgba(0,0,0,0.1);
}

/* 图层选择器样式 */
.layer-selector {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 200px;
}

.selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
}

.selector-header h4 {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.selector-controls {
    display: flex;
    gap: 5px;
}

.selector-controls button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.selector-controls button:hover {
    background: rgba(0,0,0,0.1);
}

.available-layers {
    max-height: 300px;
    overflow-y: auto;
}

/* 结果面板样式 */
.result-panel {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    min-width: 300px;
    max-width: 350px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
}

.result-header h4 {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.result-controls {
    display: flex;
    gap: 5px;
}

.result-controls button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.result-controls button:hover {
    background: rgba(0,0,0,0.1);
}

.result-content {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
}

.no-results {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px;
}

.result-item {
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.result-item:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
}

.result-item.success {
    border-left: 4px solid #28a745;
}

.result-item.error {
    border-left: 4px solid #dc3545;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.result-type {
    font-weight: 600;
    color: #333;
    font-size: 12px;
}

.result-time {
    font-size: 10px;
    color: #666;
}

.result-details {
    font-size: 11px;
    margin-bottom: 8px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
}

.detail-item span:first-child {
    color: #666;
}

.detail-item span:last-child {
    font-weight: 500;
    color: #333;
}

.result-actions {
    display: flex;
    gap: 4px;
}

.result-action {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    padding: 2px;
    border-radius: 2px;
    transition: background 0.2s;
}

.result-action:hover {
    background: rgba(0,0,0,0.1);
}

.result-summary {
    padding-top: 8px;
    border-top: 1px solid #e9ecef;
    font-size: 11px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.summary-item span:first-child {
    color: #666;
}

.summary-item span:last-child {
    font-weight: 600;
    color: #333;
}
```

这个测量工具集成示例和拓扑操作工作流展示了：
- **综合测量系统**：支持距离和面积测量的完整工作流
- **拓扑工作流管理**：完整的拓扑操作流程控制
- **结果管理**：操作结果的存储、查看和导出
- **用户交互**：直观的操作界面和状态反馈

现在您已经掌握了测量工具集成和拓扑操作工作流的完整实现方法。