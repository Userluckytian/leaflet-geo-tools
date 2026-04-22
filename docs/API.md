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
## 第2章：使用
见 [docs/api](https://github.com/Userluckytian/leaflet-geo-tools/edit/main/docs/api) 目录
