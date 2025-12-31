# leaflet-geo-tools API 文档

leaflet-geo-tools 提供了一系列基于 Leaflet 的地图绘制与编辑工具组件。

---

## 通用类型说明

#### `PolygonEditorState`

```ts
enum PolygonEditorState {
  Idle = 'idle',       // 空闲状态：既不是绘制中，也不是编辑中
  Drawing = 'drawing', // 正在绘制
  Editing = 'editing'  // 正在编辑
}
```

用于表示编辑器当前的状态，配合 `onStateChange()` 使用。



#### `LeafletPolylineOptionsExpends`

```ts
interface LeafletPolylineOptionsExpends extends L.PolylineOptions {
  origin?: any;         // 可选：用于存储原始数据或业务标识
  defaultStyle?: any;   // 可选：用于存储默认样式（如 hover 时恢复）
  [key: string]: unknown;
}
```

## 1. LeafletEditPolygon

LeafletEditPolygon 是一个基于 Leaflet 的多边形绘制与编辑组件，支持绘制、拖拽编辑、插入中点、右键删除、图层显隐控制、GeoJSON 导出等功能，适用于地图标注、空间分析、可视化编辑等场景。


### 1.1 构造函数

```ts
new LeafletEditPolygon(
  map: L.Map,
  options?: LeafletPolylineOptionsExpends,
  defaultGeometry?: GeoJSON.Geometry
)
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `LeafletPolylineOptionsExpends` | ❌ | 图层样式配置（如 color、fillColor、weight 等） |
| `defaultGeometry` | `GeoJSON.Geometry` | ❌ | 初始图形（Polygon 或 MultiPolygon）<br>⚠️ 若传入该参数，组件将**不会进入绘制模式**，而是直接加载图形 |



### 1.2 事件监听

#### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册一个回调函数，用于监听编辑器状态的变化。

##### 状态枚举：`PolygonEditorState`

| 状态值 | 描述 |
|--------|------|
| `Idle` | 空闲状态，未处于绘制或编辑中 |
| `Drawing` | 正在绘制新图形 |
| `Editing` | 正在编辑已有图形 |

##### 示例：

```ts
editor.onStateChange((state) => {
  if (state === 'Drawing') {
    console.log('正在绘制中...');
  } else if (state === 'Editing') {
    console.log('进入编辑模式');
  } else {
    console.log('编辑器空闲');
  }
});
```



### 1.3 公共方法

#### `geojson(): GeoJSON.Feature`
返回当前图层的 GeoJSON 数据。

#### `getLayer(): L.Layer`
返回当前图层实例，可用于设置样式或图层管理。

#### `setVisible(visible: boolean): void`
设置图层是否可见。

#### `getLayerVisible(): boolean`
获取图层当前的可见状态。

#### `destroy(): void`
销毁图层与编辑器实例，释放资源。



### 1.4 使用示例

```ts
import { LeafletEditPolygon } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.2, 120.6], 13);

// 初始化编辑器（进入绘制模式）
const editor = new LeafletEditPolygon(map, {
  color: 'blue',
  fillColor: 'lightblue',
  weight: 2
});

// 或加载已有图形（进入查看模式）
const editor = new LeafletEditPolygon(map, {
  color: 'green'
}, {
  type: 'Polygon',
  coordinates: [[[120.6, 31.2], [120.7, 31.2], [120.7, 31.3], [120.6, 31.3], [120.6, 31.2]]]
});

// 获取绘制结果
const geojson = editor.geojson();

// 控制图层显隐
editor.setVisible(false);

// 销毁图层
editor.destroy();

// 监听状态变化
editor.onStateChange((state) => {
  console.log('当前状态：', state); // Idle / Drawing / Editing
});
```
---

## 2. LeafletEditRectangle

LeafletEditRectangle 是一个基于 Leaflet 的矩形绘制与编辑组件，支持绘制、拖拽编辑、右键删除、图层显隐控制、GeoJSON 导出等功能，适用于地图标注、范围框选、空间分析等场景。


### 2.1 构造函数

```ts
new LeafletEditRectangle(
  map: L.Map,
  options?: LeafletPolylineOptionsExpends,
  defaultGeometry?: GeoJSON.Geometry
)
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `LeafletPolylineOptionsExpends` | ❌ | 图层样式配置（如 color、fillColor、weight 等） |
| `defaultGeometry` | `GeoJSON.Geometry` | ❌ | 初始图形（类型为 Polygon，坐标为矩形）<br>⚠️ 若传入该参数，组件将**不会进入绘制模式**，而是直接加载图形 |


### 2.2 事件监听

#### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册一个回调函数，用于监听编辑器状态的变化。

##### 状态枚举：`PolygonEditorState`

| 状态值 | 描述 |
|--------|------|
| `Idle` | 空闲状态，未处于绘制或编辑中 |
| `Drawing` | 正在绘制新图形 |
| `Editing` | 正在编辑已有图形 |

##### 示例：

```ts
editor.onStateChange((state) => {
  if (state === 'Drawing') {
    console.log('正在绘制矩形...');
  } else if (state === 'Editing') {
    console.log('正在编辑矩形');
  } else {
    console.log('矩形编辑器空闲');
  }
});
```



### 2.3 公共方法

#### `geojson(): GeoJSON.Feature`
返回当前图层的 GeoJSON 数据。

#### `getLayer(): L.Layer`
返回当前图层实例，可用于设置样式或图层管理。

#### `setVisible(visible: boolean): void`
设置图层是否可见。

#### `getLayerVisible(): boolean`
获取图层当前的可见状态。

#### `destroy(): void`
销毁图层与编辑器实例，释放资源。



### 2.4 使用示例

```ts
import { LeafletEditRectangle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.2, 120.6], 13);

// 初始化编辑器（进入绘制模式）
const editor = new LeafletEditRectangle(map, {
  color: 'orange',
  fillColor: 'yellow',
  weight: 2
});

// 或加载已有矩形（进入查看模式）
const editor = new LeafletEditRectangle(map, {
  color: 'green'
}, {
  type: 'Polygon',
  coordinates: [[[120.6, 31.2], [120.7, 31.2], [120.7, 31.3], [120.6, 31.3], [120.6, 31.2]]]
});

// 获取绘制结果
const geojson = editor.geojson();

// 控制图层显隐
editor.setVisible(false);

// 销毁图层
editor.destroy();

// 监听状态变化
editor.onStateChange((state) => {
  console.log('当前状态：', state); // Idle / Drawing / Editing
});
```

---


## 3. LeafletCircle 

LeafletCircle 是一个基于 Leaflet 的圆形绘制工具组件，适用于地图标注、范围圈选、空间分析等场景。  
该组件专注于“绘制 → 获取结果 → 监听状态”，不暴露图层对象，仅提供必要的坐标输出与状态监听机制。

---

### 3.1 构造函数

```ts
new LeafletCircle(
  map: L.Map,
  options?: L.CircleOptions
)
```

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| `map` | `L.Map` | ✅ | Leaflet 地图实例 |
| `options` | `L.CircleOptions` | ❌ | 圆图层样式配置（如 color、fillColor、radius 等） |

> ⚠️ 构造函数调用后即进入绘制模式，用户需在地图上点击两次：第一次确定圆心，第二次确定半径。

---

### 3.2 事件监听

#### `onStateChange(callback: (state: PolygonEditorState) => void): void`

注册一个回调函数，用于监听绘制状态的变化。

##### 状态枚举：`PolygonEditorState`

| 状态值 | 描述 |
|--------|------|
| `Idle` | 空闲状态，未处于绘制中 |
| `Drawing` | 正在绘制圆形 |

##### 示例：

```ts
circleTool.onStateChange((state) => {
  if (state === 'Drawing') {
    console.log('正在绘制圆...');
  } else {
    console.log('绘制完成，进入空闲状态');
  }
});
```

---

### 3.3 公共方法

#### `geojson(): GeoJSON.Feature`
返回绘制完成后的圆形 GeoJSON 数据（类型为 Polygon）。

> ⚠️ 若尚未完成绘制，将抛出异常。


#### `destroy(): void`
销毁图层并清除地图事件监听，释放资源。


#### `offStateChange(listener: (state: PolygonEditorState) => void): void`
移除指定的状态监听器。


### 3.4 使用示例

```ts
import { LeafletCircle } from 'leaflet-geo-tools';
import * as L from 'leaflet';

const map = L.map('map').setView([31.2, 120.6], 13);

// 初始化绘制圆工具（进入绘制模式）
const circleTool = new LeafletCircle(map, {
  color: 'red',
  fillColor: 'pink',
  fillOpacity: 0.4
});

// 监听状态变化
circleTool.onStateChange((state) => {
  if (state === 'Idle') {
    const geojson = circleTool.geojson();
    console.log('绘制完成，结果为：', geojson);
  }
});

// 销毁图层
// circleTool.destroy();
```

---
