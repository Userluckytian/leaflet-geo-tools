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

### 4.1 MarkerPoint（点绘制）

MarkerPoint 是一个基于 Leaflet 的单点绘制工具组件，适用于地图标注、位置标记、兴趣点标记等场景。

---

#### 4.1.1 构造函数

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

#### 4.1.2 事件监听

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

#### 4.1.3 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Point>`

返回绘制完成后的点坐标 GeoJSON 数据（类型为 Point）。

**异常：** 若尚未绘制点，将抛出错误

##### `destroy(): void`

销毁图层并清除所有地图事件监听。

##### `offStateChange(listener: (state: PolygonEditorState) => void): void`

移除指定的状态监听器。

---

#### 4.1.4 使用示例

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

### 4.2 LeafletPolyline（折线绘制）

LeafletPolyline 是一个基于 Leaflet 的折线绘制工具组件，适用于路径绘制、轨迹标记、线路规划等场景。

---

#### 4.2.1 构造函数

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

#### 4.2.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.LineString>`

返回绘制完成后的折线 GeoJSON 数据（类型为 LineString）。

**异常：** 若尚未完成绘制，将抛出错误

##### `destroy(): void`

销毁图层并清除所有地图事件监听。

##### `onStateChange()`, `offStateChange()`

与其他组件相同的事件监听方法。

---

#### 4.2.3 使用示例

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

### 4.3 LeafletPolygon（多边形绘制）

LeafletPolygon 是一个基于 Leaflet 的多边形绘制工具组件，适用于区域标注、范围圈选、地理围栏等场景。

---

#### 4.3.1 构造函数

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

#### 4.3.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon>`

返回绘制完成后的多边形 GeoJSON 数据（类型为 Polygon，已自动闭合）。

**异常：** 若尚未完成绘制，将抛出错误

---

#### 4.3.3 使用示例

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

### 4.4 LeafletRectangle（矩形绘制）

LeafletRectangle 是一个基于 Leaflet 的矩形绘制工具组件，适用于框选区域、范围标注、地理筛选等场景。

---

#### 4.4.1 构造函数

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

#### 4.4.2 使用示例

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

### 4.5 LeafletCircle（圆形绘制）

LeafletCircle 是一个基于 Leaflet 的圆形绘制工具组件，适用于圆形区域标注、范围圈选等场景。

---

#### 4.5.1 构造函数

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

#### 4.5.2 公共方法

##### `geojson(): GeoJSON.Feature<GeoJSON.Polygon>`

返回绘制完成后的圆形 GeoJSON 数据（使用 turf.js 转换为多边形表示）。

**异常：** 若尚未完成绘制，将抛出错误

---

#### 4.5.3 使用示例

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

### 5.1 LeafletArea（面积测量）

LeafletArea 是一个基于 Leaflet 的面积测量工具，支持多边形面积测量并实时显示测量结果。

---

#### 5.1.1 构造函数

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

#### 5.1.2 使用示例

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

### 5.2 LeafletDistance（距离测量）

LeafletDistance 是一个基于 Leaflet 的距离测量工具，支持多点连续距离测量并实时显示分段和总距离。

---

#### 5.2.1 构造函数

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

#### 5.2.2 使用示例

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


