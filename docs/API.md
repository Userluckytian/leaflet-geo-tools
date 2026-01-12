# leaflet-geo-tools API 文档

## 1. 概述

leaflet-geo-tools 是一个基于 Leaflet 的地图绘制、测量工具库，提供丰富的交互式地理要素绘制和测量功能。

**核心特性：**
- 支持点、线、面、矩形、圆等多种几何图形绘制
- 提供面积和距离测量工具
- 统一的状态管理和事件监听机制
- 不暴露底层图层对象，仅提供坐标信息输出

---

## 2. 安装与使用

### 安装

```bash
npm install leaflet-geo-tools
# 或
yarn add leaflet-geo-tools
```

### 基础依赖

需要先安装 Leaflet：

```bash
npm install leaflet
# 或
yarn add leaflet
```

### 类型导入

```typescript
// TypeScript 使用方式
import { LeafletArea, LeafletDistance, PolygonEditorState } from 'leaflet-geo-tools';
import * as L from 'leaflet';

// JavaScript 使用方式
const { LeafletArea, LeafletDistance } = require('leaflet-geo-tools');
```

---

## 3. 类型定义

### 3.1 PolygonEditorState 状态枚举

所有工具组件都使用统一的状态枚举来管理绘制状态：

```ts
import { PolygonEditorState } from 'leaflet-geo-tools';

// 状态值说明
console.log(PolygonEditorState.Idle);      // 'idle' - 空闲状态
console.log(PolygonEditorState.Drawing);   // 'drawing' - 正在绘制
console.log(PolygonEditorState.Editing);   // 'editing' - 正在编辑（编辑功能暂未发布）
```

**状态说明：**
| 状态值 | 描述 | 适用场景 |
|--------|------|----------|
| `Idle` | 空闲状态 | 未处于绘制或编辑中 |
| `Drawing` | 绘制状态 | 正在绘制几何图形 |
| `Editing` | 编辑状态 | 正在编辑已有图形 |

### 3.2 测量相关类型

#### 面积测量选项

```ts
type areaOptions = {
    precision?: number;  // 精度，默认 2（保留小数位数）
    lang: 'en' | 'zh';  // 语言，支持英文或中文
}
```

#### 距离测量选项

```ts
import { Units } from '@turf/turf';

type distanceOptions = {
    units: Units;          // 距离单位（使用 @turf/turf 的 Units 类型）
    precision?: number;    // 精度，默认 2
    lang: 'en' | 'zh';    // 语言，支持英文或中文
}
```

**支持的单位类型：**
- `'meters'` / `'metres'` - 米
- `'kilometers'` / `'kilometres'` - 千米
- `'centimeters'` / `'centimetres'` - 厘米
- `'miles'` - 英里
- `'nauticalmiles'` - 海里
- `'feet'` - 英尺
- `'yards'` - 码
- `'inches'` - 英寸
- `'radians'` - 弧度
- `'degrees'` - 度

#### 格式化后的测量结果

```ts
// 面积测量结果
type FormattedArea = {
    val: number;    // 数值
    unit: string;   // 单位（根据语言自动转换）
}

// 距离测量结果
type FormattedDistance = {
    val: number;    // 数值
    unit: string;   // 单位（根据语言自动转换）
}
```

### 3.3 工具实例类型

```ts
// 绘制工具实例类型
export type drawInstance = LeafletCircle | MarkerPoint | LeafletPolygon | LeafletPolyline | LeafletRectangle;

// 测量工具实例类型
export type measureInstance = LeafletArea | LeafletDistance;

// 编辑工具实例类型（暂未发布）
export type editorInstance = LeafletEditPolygon | LeafletEditRectangle | LeafletRectangleEditor | LeafletPolygonEditor;

// 所有工具实例联合类型
export type leafletGeoEditorInstance = drawInstance | measureInstance | editorInstance;
```

### 3.4 图层选项扩展类型

```ts
// 扩展的 Leaflet 折线选项
export interface LeafletPolylineOptionsExpends extends L.PolylineOptions {
    origin?: any;           // 存放源信息
    defaultStyle?: any;     // 用户自定义的默认样式
    [key: string]: unknown  // 其他自定义属性
}
```

---

## 4. 绘制工具 (Draw)

### 4.1 目录结构

```
src/draw 
├── markerPoint.ts  // MarkerPoint (点绘制)
├── polygon.ts      // LeafletPolyline（折线绘制）
├── polyline.ts     // LeafletPolygon（多边形绘制）
├── rectangle.ts    // LeafletRectangle（矩形绘制）
└── circle.ts       // LeafletCircle（圆形绘制）

```

### 4.2 MarkerPoint（点绘制）

MarkerPoint 是一个基于 Leaflet 的单点绘制工具组件，适用于地图标注、位置标记、兴趣点标记等场景。

---

#### 4.2.1 构造函数

```ts
import { MarkerPoint } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const markerTool = new MarkerPoint(
  map: L.Map,
  options?: L.MarkerOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.MarkerOptions` | ❌ | 标记点样式配置 |

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，地图光标会变为十字准星（crosshair），用户需在地图上点击一次即可完成绘制。

---

#### 4.2.2 事件监听

##### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册一个回调函数，用于监听绘制状态的变化。

**示例：**

```ts
import { MarkerPoint, PolygonEditorState } from 'leaflet-geo-tools';

markerTool.onStateChange((state) => {
  if (state === PolygonEditorState.Drawing) {
    console.log('等待用户点击绘制点...');
  } else if (state === PolygonEditorState.Idle) {
    console.log('点绘制完成');
  }
});
```

---

#### 4.2.3 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Point>`

返回绘制完成后的点坐标 GeoJSON 数据（类型为 Point）。

**异常：** 若尚未绘制点，将抛出错误

##### `destroy(): void`

销毁图层并清除所有地图事件监听。

##### `offStateChange(listener: (state: PolygonEditorState) => void): void`

移除指定的状态监听器。

---

#### 4.2.4 使用示例

```ts
import { MarkerPoint, PolygonEditorState } from 'leaflet-geo-tools';
import * as L from 'leaflet';

// 初始化地图
const map = L.map('map').setView([31.23, 121.47], 13);

// 初始化点绘制工具
const markerTool = new MarkerPoint(map);

// 监听状态变化
markerTool.onStateChange((state) => {
    if (state === PolygonEditorState.Idle) {
        // 绘制完成，获取坐标数据
        const geojson = markerTool.geojson();
        console.log('点坐标数据:', geojson);
    }
});
```

---

### 4.3 LeafletPolyline（折线绘制）

LeafletPolyline 是一个基于 Leaflet 的折线绘制工具组件，适用于路径绘制、轨迹标记、线路规划等场景。

---

#### 4.3.1 构造函数

```ts
import { LeafletPolyline } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const polylineTool = new LeafletPolyline(
  map: L.Map,
  options?: L.PolylineOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.PolylineOptions` | ❌ | 折线样式配置 |

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，双击鼠标完成绘制。

---

#### 4.3.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.LineString>`

返回绘制完成后的折线 GeoJSON 数据（类型为 LineString）。

**异常：** 若尚未完成绘制，将抛出错误

##### `destroy(): void`

销毁图层并清除所有地图事件监听。

##### `onStateChange()`, `offStateChange()`

与其他组件相同的事件监听方法。

---

#### 4.3.3 使用示例

```ts
import { LeafletPolyline } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const polylineTool = new LeafletPolyline(map, {
  color: 'blue',
  weight: 3
});

polylineTool.onStateChange((state) => {
    if (state === 'Idle') {
        const geojson = polylineTool.geojson();
        console.log('折线数据:', geojson);
    }
});
```

---

### 4.4 LeafletPolygon（多边形绘制）

LeafletPolygon 是一个基于 Leaflet 的多边形绘制工具组件，适用于区域标注、范围圈选、地理围栏等场景。

---

#### 4.4.1 构造函数

```ts
import { LeafletPolygon } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const polygonTool = new LeafletPolygon(
  map: L.Map,
  options?: L.PolylineOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.PolylineOptions` | ❌ | 多边形样式配置 |

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，双击鼠标完成绘制并自动闭合多边形。

---

#### 4.4.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon>`

返回绘制完成后的多边形 GeoJSON 数据（类型为 Polygon，已自动闭合）。

**异常：** 若尚未完成绘制，将抛出错误

---

#### 4.4.3 使用示例

```ts
import { LeafletPolygon } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const polygonTool = new LeafletPolygon(map, {
  color: 'green',
  fillColor: '#00ff00',
  fillOpacity: 0.3
});
```

---

### 4.5 LeafletRectangle（矩形绘制）

LeafletRectangle 是一个基于 Leaflet 的矩形绘制工具组件，适用于框选区域、范围标注、地理筛选等场景。

---

#### 4.5.1 构造函数

```ts
import { LeafletRectangle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const rectangleTool = new LeafletRectangle(
  map: L.Map,
  options?: L.PolylineOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.PolylineOptions` | ❌ | 矩形样式配置 |

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，需要两次点击完成绘制（第一次确定起点，第二次确定对角点）。

---

#### 4.5.2 使用示例

```ts
import { LeafletRectangle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const rectangleTool = new LeafletRectangle(map, {
  color: 'orange',
  fillColor: '#ffa500',
  fillOpacity: 0.3
});
```

---

### 4.6 LeafletCircle（圆形绘制）

LeafletCircle 是一个基于 Leaflet 的圆形绘制工具组件，适用于圆形区域标注、范围圈选等场景。

---

#### 4.6.1 构造函数

```ts
import { LeafletCircle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const circleTool = new LeafletCircle(
  map: L.Map,
  options?: L.CircleOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.CircleOptions` | ❌ | 圆形样式配置 |

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，需要两次点击完成绘制（第一次确定圆心，第二次确定半径）。

---

#### 4.6.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon>`

返回绘制完成后的圆形 GeoJSON 数据（使用 turf.js 转换为多边形表示）。

**异常：** 若尚未完成绘制，将抛出错误

---

#### 4.6.3 使用示例

```ts
import { LeafletCircle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const circleTool = new LeafletCircle(map, {
  color: 'purple',
  fillColor: '#800080',
  fillOpacity: 0.3
});
```

---

## 5. 测量工具 (Measure)

### 5.1 目录结构

```
src/measure 
├── area.ts           // LeafletArea（面积测量）
└── distance.ts       // LeafletDistance（距离测量）

```

### 5.2 LeafletArea（面积测量）

LeafletArea 是一个基于 Leaflet 的面积测量工具，支持多边形面积测量并实时显示测量结果。

---

#### 5.2.1 构造函数

```ts
import { LeafletArea } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const areaTool = new LeafletArea(
  map: L.Map,
  measureOptions?: areaOptions,
  options?: L.PolylineOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `measureOptions` | `areaOptions` | ❌ | 测量配置选项 |
| `options` | `L.PolylineOptions` | ❌ | 多边形样式配置 |

**areaOptions 默认值：**
```ts
{
    precision: 2,   // 精度
    lang: 'zh'      // 语言
}
```

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，双击鼠标完成多边形绘制并计算面积。

---

#### 5.2.2 使用示例

```ts
import { LeafletArea, PolygonEditorState } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const areaTool = new LeafletArea(map, {
    precision: 2,
    lang: 'zh'
}, {
    color: 'red',
    fillColor: '#ff0000',
    fillOpacity: 0.3
});

areaTool.onStateChange((state) => {
    if (state === PolygonEditorState.Idle) {
        const geojson = areaTool.geojson();
        console.log('测量区域数据:', geojson);
    }
});
```

---

### 5.3 LeafletDistance（距离测量）

LeafletDistance 是一个基于 Leaflet 的距离测量工具，支持多点连续距离测量并实时显示分段和总距离。

---

#### 5.3.1 构造函数

```ts
import { LeafletDistance } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const distanceTool = new LeafletDistance(
  map: L.Map,
  measureOptions?: distanceOptions,
  options?: L.PolylineOptions
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `measureOptions` | `distanceOptions` | ❌ | 测量配置选项 |
| `options` | `L.PolylineOptions` | ❌ | 折线样式配置 |

**distanceOptions 默认值：**
```ts
{
    units: 'meters',   // 单位
    precision: 2,      // 精度
    lang: 'zh'         // 语言
}
```

> ⚠️ **注意**：构造函数调用后立即进入绘制模式，双击鼠标完成测量。

---

#### 5.3.2 使用示例

```ts
import { LeafletDistance } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.23, 121.47], 13);
const distanceTool = new LeafletDistance(map, {
    units: 'meters',
    precision: 2,
    lang: 'zh'
}, {
    color: 'blue',
    weight: 3,
    opacity: 0.8
});
```

---

## 6. 编辑工具 (Edit)

编辑工具提供高级的图形绘制与编辑功能，支持撤销/重做、吸附、图层显隐控制、顶点编辑、中点插入等专业GIS编辑功能。

### 6.1 目录结构

编辑工具采用三层继承体系，提供不同级别的功能抽象：

```
src/edit
├── BaseEditor (基础编辑器)
├── BasePolygonEditor (多边形基类)
├── LeafletPolygonEditor (多边形编辑工具)
├── BaseRectangleEditor (矩形基类)
└── LeafletRectangleEditor (矩形编辑工具)
```

**核心特性对比：**

| 特性 | LeafletPolygonEditor | LeafletRectangleEditor |
|------|-------------------|---------------------|
| **图形类型** | 任意多边形、MultiPolygon | 矩形（保持矩形特性） |
| **顶点编辑** | ✅ 支持任意顶点拖拽、删除 | ✅ 支持4顶点拖拽（保持矩形） |
| **中点插入** | ✅ 支持边线中点插入新顶点 | ❌ 不支持（矩形特性限制） |
| **边线拖动** | ✅ 支持拖动整条边线 | ✅ 支持拖动整条边线 |
| **吸附功能** | ✅ 顶点吸附、边线吸附 | ✅ 顶点吸附、边线吸附 |
| **撤销/重做** | ✅ 完整历史记录 | ✅ 完整历史记录 |
| **图层显隐** | ✅ 支持显隐控制 | ✅ 支持显隐控制 |

---

### 6.2 基类说明

#### 6.2.1 BaseEditor (基础编辑器)

所有编辑工具的抽象基类，提供核心功能和状态管理。

**构造函数：**
```ts
abstract class BaseEditor {
  constructor(
    map: L.Map,
    options: { snap?: SnapOptions }
  )
```

**核心功能：**
1. **激活状态管理**：全局单例激活机制，同一时间只有一个编辑器处于激活状态
2. **吸附功能**：支持顶点吸附（vertex）和边线吸附（edge）
3. **状态管理**：统一的状态监听机制（`onStateChange`）
4. **资源清理**：统一的资源释放机制（`cleanupSnapResources`）
5. **几何索引**：构建空间数据索引，支持高效吸附计算

#### 6.2.2 BasePolygonEditor (多边形基类)

多边形编辑工具的抽象基类，扩展撤销/重做和标记管理功能。

**新增特性：**
- 顶点标记管理（三维数组：`[多边形][环][顶点]`）
- 中点标记管理（支持插入中点和边线拖动标记）
- 历史记录栈（支持撤销/重做）
- 坐标快照管理
- 中点标记的动态更新

#### 6.2.3 BaseRectangleEditor (矩形基类)

矩形编辑工具的抽象基类，保持矩形几何特性。

**特性说明：**
- 保持矩形特性（相邻边垂直）
- 4个顶点标记管理（固定数量）
- 矩形特定的坐标转换
- 拖拽时自动重新计算为矩形

---

### 6.3 LeafletPolygonEditor

LeafletPolygonEditor 是一个基于 Leaflet 的多边形绘制与编辑组件，支持绘制、拖拽编辑、插入中点、右键删除、吸附、撤销/重做、图层显隐控制等高级功能。

---

#### 6.3.1 构造函数

```ts
import { LeafletPolygonEditor } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const editor = new LeafletPolygonEditor(
  map: L.Map,
  options?: LeafletPolylineOptionsExpends,
  defaultGeometry?: GeoJSON.Geometry
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `LeafletPolylineOptionsExpends` | ❌ | 图层样式和配置 |
| `defaultGeometry` | `GeoJSON.Geometry` | ❌ | 初始图形（Polygon 或 MultiPolygon） |

**配置选项说明：**
```ts
type LeafletPolylineOptionsExpends = L.PolylineOptions & {
  snap?: SnapOptions;          // 吸附配置
  origin?: any;               // 源信息
  defaultStyle?: any;         // 默认样式
  layerVisible?: boolean;     // 图层可见性
};
```

**初始化行为：**
- **无 defaultGeometry**：进入绘制模式，等待用户绘制新多边形
- **有 defaultGeometry**：直接加载图形，进入查看模式

**支持的地理类型：**
- `Polygon`：单多边形（可包含孔洞）
- `MultiPolygon`：多多边形

---

#### 6.3.2 事件监听

##### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册状态变化监听器，支持以下状态：

| 状态值 | 描述 | 触发条件 |
|--------|------|----------|
| `Idle` | 空闲状态 | 完成绘制/编辑、取消编辑 |
| `Drawing` | 绘制状态 | 创建新多边形（无默认图形时） |
| `Editing` | 编辑状态 | 双击多边形进入编辑模式 |

**示例：**
```ts
editor.onStateChange((state) => {
  switch (state) {
    case 'Drawing':
      console.log('正在绘制多边形...');
      break;
    case 'Editing':
      console.log('进入编辑模式');
      break;
    case 'Idle':
      console.log('编辑器空闲');
      break;
  }
});
```

##### `offStateChange(listener: (state: PolygonEditorState) => void): void`

移除指定的状态监听器。

##### `setCurrentState(status: PolygonEditorState): void`

手动设置编辑器状态（高级用法）。

---

#### 6.3.3 绘制功能

**绘制模式交互：**
1. **单击**：添加多边形顶点
2. **移动鼠标**：实时预览多边形形状
3. **双击**：完成多边形绘制（自动闭合并去重）

**绘制特性：**
- 自动去除连续重复坐标
- 实时视觉反馈
- 自动闭合多边形
- 支持孔洞绘制（通过特定交互模式）

---

#### 6.3.4 编辑功能

**进入编辑模式：**
- 双击多边形：进入编辑模式，显示所有顶点和中点标记

**顶点编辑：**
1. **拖拽顶点**：移动顶点位置，实时更新图形
2. **右键顶点**：删除顶点（确保环点数 ≥ 3）
3. **吸附功能**：拖拽时自动吸附到其他图形的顶点或边线

**边线编辑：**
1. **插入中点**：悬停边线显示红色中点标记，单击插入新顶点
2. **拖动边线**：单击蓝色边线标记拖动整条边线
3. **边线吸附**：拖动时边线可吸附到其他几何要素

**整体操作：**
1. **拖拽多边形**：在编辑模式下按下多边形并拖动，整体移动
2. **退出编辑**：双击空白处或调用 `commitEdit()`

**标记说明：**
- **红色实心圆**（20px）：顶点标记，可拖拽、右键删除
- **红色空心圆**（14px）：中点标记，单击插入新顶点
- **蓝色空心圆**（12px）：边线拖动标记，拖动整条边线

---

#### 6.3.5 撤销/重做功能

##### `undoEdit(): void`
撤回到上一步操作，支持无限撤销。

##### `redoEdit(): void`
重做到下一步操作，支持无限重做。

##### `resetToInitial(): void`
重置到初始状态（建议配合二次确认弹窗使用）。

##### `commitEdit(): void`
完成编辑，保存当前状态为新的初始快照，退出编辑模式。

**历史记录特性：**
- 每次编辑操作自动创建快照
- 支持多级撤销/重做
- 完成编辑后清空重做栈
- 快照包含完整的几何结构

---

#### 6.3.6 吸附功能

**支持的吸附模式：**
1. **顶点吸附**：拖拽顶点接近其他图形的顶点时自动吸附
2. **边线吸附**：拖拽顶点接近其他图形的边线时吸附到线上

**吸附配置示例：**
```ts
const editor = new LeafletPolygonEditor(map, {
  color: 'blue',
  fillOpacity: 0.3,
  snap: {
    enabled: true,
    modes: ['vertex', 'edge'],
    tolerance: 8  // 8像素吸附范围
  }
});
```

**吸附效果：**
- 绿色圆圈：顶点吸附目标
- 绿色虚线：边线吸附目标
- 拖动过程中实时显示吸附目标
- 松开鼠标后清除高亮

---

#### 6.3.7 图层控制

##### `getLayer(): L.Layer`
返回底层 Leaflet 图层实例，可用于高级样式控制。

##### `setVisible(visible: boolean): void`
设置图层可见性。

##### `getLayerVisible(): boolean`
获取图层当前可见状态。

**显隐特性：**
- 隐藏时：图层透明，退出编辑模式，清除所有标记
- 显示时：恢复默认样式
- 不影响几何数据
- 通过 `layerVisible` 属性存储显隐状态

---

#### 6.3.8 数据操作

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>`
返回当前多边形的 GeoJSON 数据。

**返回值示例：**
```json
// 单多边形
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [120.6, 31.2], [120.7, 31.2],
      [120.7, 31.3], [120.6, 31.3],
      [120.6, 31.2]
    ]]
  }
}

// 多多边形
{
  "type": "Feature",
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[120.6, 31.2], [120.7, 31.2], [120.7, 31.3], [120.6, 31.3], [120.6, 31.2]]],
      [[[120.8, 31.4], [120.9, 31.4], [120.9, 31.5], [120.8, 31.5], [120.8, 31.4]]]
    ]
  }
}
```

**异常：** 若图层不存在，抛出错误 `"未捕获到图层，无法获取到geojson数据"`

---

#### 6.3.9 资源管理

##### `destroy(): void`
完全销毁编辑器实例，释放所有资源。

**清理内容：**
1. 移除所有图层和标记
2. 清除所有事件监听
3. 清理吸附资源
4. 清除历史记录
5. 退出激活状态
6. 恢复地图默认交互

##### `exitEditMode(): void`
退出编辑模式，清除所有编辑标记。

##### `reset(): void`
重置地图交互状态（光标、双击缩放等）。

---

#### 6.3.10 使用示例

**示例1：绘制新多边形**
```ts
import { LeafletPolygonEditor, PolygonEditorState } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.2, 120.6], 13);

// 创建多边形编辑器（进入绘制模式）
const editor = new LeafletPolygonEditor(map, {
  color: 'blue',
  fillColor: 'lightblue',
  fillOpacity: 0.3,
  weight: 2,
  snap: {
    enabled: true,
    modes: ['vertex', 'edge']
  }
});

// 监听状态变化
editor.onStateChange((state) => {
  if (state === PolygonEditorState.Idle) {
    // 绘制完成，获取数据
    const geojson = editor.geojson();
    console.log('多边形数据:', geojson);
  }
});

// 用户操作：
// 1. 多次点击：添加顶点
// 2. 移动鼠标：实时预览
// 3. 双击：完成绘制
```

**示例2：编辑已有多边形**
```ts
// 加载已有多边形
const editor = new LeafletPolygonEditor(map, {
  color: 'green',
  fillColor: '#90ee90'
}, {
  type: 'Polygon',
  coordinates: [[
    [120.6, 31.2], [120.7, 31.2],
    [120.7, 31.3], [120.6, 31.3],
    [120.6, 31.2]
  ]]
});

// 用户操作：
// 1. 双击多边形：进入编辑模式（显示顶点和中点标记）
// 2. 拖拽顶点：调整形状
// 3. 悬停边线：显示中点标记，单击插入新顶点
// 4. 拖拽边线标记：移动整条边线
// 5. 右键顶点：删除顶点
// 6. 双击空白处：退出编辑模式

// 获取编辑后的数据
const updatedData = editor.geojson();
```

**示例3：高级工作流管理**
```ts
class PolygonEditorManager {
  private editor: LeafletPolygonEditor | null = null;
  private editHistory: GeoJSON.Feature[] = [];
  
  constructor(private map: L.Map) {}
  
  // 开始绘制新多边形
  startNewPolygon(style?: any) {
    this.cleanup();
    
    this.editor = new LeafletPolygonEditor(this.map, {
      color: '#3388ff',
      fillOpacity: 0.2,
      weight: 3,
      ...style
    });
    
    // 监听编辑完成
    this.editor.onStateChange((state) => {
      if (state === 'Idle' && this.editor) {
        const data = this.editor.geojson();
        this.editHistory.push(data);
        this.onEditComplete(data);
      }
    });
    
    return this.editor;
  }
  
  // 编辑已有多边形
  editExistingPolygon(geojson: GeoJSON.Feature) {
    this.cleanup();
    
    this.editor = new LeafletPolygonEditor(this.map, {
      color: '#ff0000',
      fillOpacity: 0.3
    }, geojson.geometry);
    
    // 提供编辑工具栏
    this.setupEditToolbar();
    
    return this.editor;
  }
  
  // 设置编辑工具栏
  private setupEditToolbar() {
    if (!this.editor) return;
    
    // 撤销按钮
    document.getElementById('undo-btn')?.addEventListener('click', () => {
      this.editor?.undoEdit();
    });
    
    // 重做按钮
    document.getElementById('redo-btn')?.addEventListener('click', () => {
      this.editor?.redoEdit();
    });
    
    // 完成编辑按钮
    document.getElementById('commit-btn')?.addEventListener('click', () => {
      this.editor?.commitEdit();
    });
    
    // 重置按钮
    document.getElementById('reset-btn')?.addEventListener('click', () => {
      if (confirm('确定要重置所有编辑吗？')) {
        this.editor?.resetToInitial();
      }
    });
  }
  
  // 清理资源
  cleanup() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
  
  // 编辑完成回调
  private onEditComplete(data: GeoJSON.Feature) {
    console.log('编辑完成:', data);
    // 保存到服务器、更新UI等
  }
  
  // 获取编辑历史
  getEditHistory() {
    return [...this.editHistory];
  }
}
```

**示例4：多编辑器实例管理**
```ts
class MultiEditorManager {
  private editors: Map<string, LeafletPolygonEditor> = new Map();
  
  // 添加编辑器
  addEditor(id: string, map: L.Map, options?: any, geometry?: any) {
    // 确保同一时间只有一个激活
    this.deactivateAll();
    
    const editor = new LeafletPolygonEditor(map, options, geometry);
    this.editors.set(id, editor);
    
    // 自动激活新编辑器
    editor.onStateChange((state) => {
      if (state === 'Editing') {
        console.log(`编辑器 ${id} 激活`);
      }
    });
    
    return editor;
  }
  
  // 获取编辑器
  getEditor(id: string) {
    return this.editors.get(id);
  }
  
  // 停用所有编辑器
  deactivateAll() {
    this.editors.forEach(editor => {
      if (editor) {
        editor.exitEditMode();
      }
    });
  }
  
  // 保存所有数据
  saveAll() {
    const results: Array<{id: string, data: any}> = [];
    
    this.editors.forEach((editor, id) => {
      try {
        const data = editor.geojson();
        results.push({ id, data });
      } catch (error) {
        console.warn(`编辑器 ${id} 无有效数据`);
      }
    });
    
    return results;
  }
  
  // 批量销毁
  destroyAll() {
    this.editors.forEach(editor => editor.destroy());
    this.editors.clear();
  }
}
```

---

### 6.4 LeafletRectangleEditor

LeafletRectangleEditor 是一个基于 Leaflet 的矩形绘制与编辑组件，支持绘制、拖拽编辑、吸附、撤销/重做、图层显隐控制等功能。

---

#### 6.4.1 构造函数

```ts
import { LeafletRectangleEditor } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const editor = new LeafletRectangleEditor(
  map: L.Map,
  options?: LeafletPolylineOptionsExpends,
  defaultGeometry?: GeoJSON.Geometry
);
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `LeafletPolylineOptionsExpends` | ❌ | 图层样式和配置 |
| `defaultGeometry` | `GeoJSON.Geometry` | ❌ | 初始矩形图形（Polygon类型） |

**配置选项说明：**
```ts
type LeafletPolylineOptionsExpends = L.PolylineOptions & {
  snap?: SnapOptions;          // 吸附配置
  origin?: any;               // 源信息
  defaultStyle?: any;         // 默认样式
  layerVisible?: boolean;     // 图层可见性
};
```

**SnapOptions 配置：**
```ts
type SnapOptions = {
  enabled: boolean;           // 是否启用吸附
  modes: SnapMode[];         // 吸附模式：'vertex' | 'edge'
  tolerance?: number;        // 吸附容差（像素）
};
```

**初始化行为：**
- **无 defaultGeometry**：进入绘制模式，等待用户绘制新矩形
- **有 defaultGeometry**：直接加载矩形，进入查看模式

---

#### 6.4.2 事件监听

##### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册状态变化监听器。

| 状态值 | 描述 | 触发条件 |
|--------|------|----------|
| `Idle` | 空闲状态 | 完成绘制/编辑、取消编辑 |
| `Drawing` | 绘制状态 | 创建新矩形（无默认图形时） |
| `Editing` | 编辑状态 | 双击矩形进入编辑 |

**示例：**
```ts
editor.onStateChange((state) => {
  if (state === 'Drawing') {
    console.log('正在绘制矩形...');
    showDrawingUI();
  } else if (state === 'Editing') {
    console.log('进入编辑模式');
    showEditToolbar();
  } else {
    console.log('编辑器空闲');
    hideAllUI();
  }
});
```

##### `offStateChange(listener: (state: PolygonEditorState) => void): void`

移除指定的状态监听器。

##### `setCurrentState(status: PolygonEditorState): void`

手动设置编辑器状态（高级用法）。

---

#### 6.4.3 编辑功能

**交互模式：**

1. **绘制模式**：
   - 第一次点击：确定矩形起点
   - 移动鼠标：预览矩形大小
   - 第二次点击：确定对角点，完成绘制

2. **查看模式**：
   - 双击矩形：进入编辑模式
   - 拖拽矩形：整体移动
   - 悬停边线：显示中点标记（单击插入顶点）

3. **编辑模式**：
   - 拖拽顶点：调整矩形大小（保持矩形特性）
   - 拖拽边线：移动整个矩形
   - 右键顶点：删除顶点（自动重新计算为矩形）
   - 双击空白处：退出编辑模式

**保持矩形特性：**
- 拖拽顶点时自动保持相邻边垂直
- 删除顶点后自动重新计算为矩形

---

#### 6.4.4 撤销/重做功能

##### `undoEdit(): void`
撤回到上一步操作。

##### `redoEdit(): void`
重做到下一步操作。

##### `resetToInitial(): void`
重置到初始状态（建议配合二次确认弹窗使用）。

##### `commitEdit(): void`
完成编辑，保存当前状态为新的初始快照。

**历史记录特性：**
- 每次编辑操作自动创建快照
- 支持无限撤销/重做（受内存限制）
- 完成编辑后清空重做栈

---

#### 6.4.5 吸附功能

**支持的吸附模式：**
1. **顶点吸附**：拖拽顶点接近其他图形的顶点时自动吸附
2. **边线吸附**：拖拽顶点接近其他图形的边线时吸附到线上

**吸附配置示例：**
```ts
const editor = new LeafletRectangleEditor(map, {
  color: 'blue',
  fillOpacity: 0.3,
  snap: {
    enabled: true,
    modes: ['vertex', 'edge'],
    tolerance: 10  // 10像素吸附范围
  }
});
```

**吸附效果：**
- 吸附时高亮显示吸附目标（绿色圆圈或边线）
- 拖动过程中实时吸附
- 松开鼠标后清除高亮

---

#### 6.4.6 图层控制

##### `getLayer(): L.Layer`
返回底层 Leaflet 图层实例，可用于高级样式控制。

##### `setVisible(visible: boolean): void`
设置图层可见性。

##### `getLayerVisible(): boolean`
获取图层当前可见状态。

**显隐特性：**
- 隐藏时：退出编辑模式，清除所有标记
- 显示时：恢复默认样式
- 不影响几何数据

---

#### 6.4.7 数据操作

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon>`
返回当前矩形的 GeoJSON 数据。

**返回值示例：**
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [120.6, 31.2],  // 左下角
      [120.7, 31.2],  // 右下角
      [120.7, 31.3],  // 右上角
      [120.6, 31.3],  // 左上角
      [120.6, 31.2]   // 闭合点
    ]]
  }
}
```

**异常：** 若图层不存在，抛出错误

---

#### 6.4.8 资源管理

##### `destroy(): void`
完全销毁编辑器实例，释放所有资源。

**清理内容：**
1. 移除所有图层和标记
2. 清除所有事件监听
3. 清理吸附资源
4. 清除历史记录
5. 退出激活状态

##### `exitEditMode(): void`
退出编辑模式，清除编辑标记。

##### `reset(): void`
重置地图交互状态（光标、双击缩放等）。

---

#### 6.4.9 使用示例

**示例1：绘制新矩形**
```ts
import { LeafletRectangleEditor, PolygonEditorState } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.2, 120.6], 13);

// 创建矩形编辑器（进入绘制模式）
const editor = new LeafletRectangleEditor(map, {
  color: 'orange',
  fillColor: '#ffa500',
  fillOpacity: 0.3,
  weight: 2,
  snap: {
    enabled: true,
    modes: ['vertex', 'edge']
  }
});

// 监听状态变化
editor.onStateChange((state) => {
  if (state === PolygonEditorState.Idle) {
    // 绘制完成，获取数据
    const geojson = editor.geojson();
    console.log('矩形数据:', geojson);
  }
});

// 用户操作：绘制矩形（点击两次）
// 第一次点击：确定起点
// 移动鼠标：预览大小
// 第二次点击：完成绘制
```

**示例2：编辑已有矩形**
```ts
// 加载已有矩形
const editor = new LeafletRectangleEditor(map, {
  color: 'green',
  fillColor: '#90ee90'
}, {
  type: 'Polygon',
  coordinates: [[
    [120.6, 31.2], [120.7, 31.2],
    [120.7, 31.3], [120.6, 31.3],
    [120.6, 31.2]
  ]]
});

// 用户操作：
// 1. 双击矩形：进入编辑模式（显示顶点标记）
// 2. 拖拽顶点：调整矩形大小
// 3. 右键顶点：删除顶点
// 4. 双击空白处：退出编辑模式

// 获取编辑后的数据
const updatedData = editor.geojson();
```

---
