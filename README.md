# Leaflet Geo Tools

[![npm version](https://img.shields.io/npm/v/leaflet-geo-tools.svg)](https://www.npmjs.com/package/leaflet-geo-tools)
[![license](https://img.shields.io/npm/l/leaflet-geo-tools.svg)](https://github.com/yourusername/leaflet-geo-tools/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> 基于 Leaflet 的增强型 GIS 工具库，提供专业的绘制、编辑、测量和拓扑操作功能。

## ✨ 特性

- 🎨 **丰富的绘制工具**：点、线、面、矩形、圆形
- ✏️ **强大的编辑功能**：顶点编辑、中点插入、面拖动、挖孔操作
- 📏 **精确测量工具**：距离测量、面积测量
- 🔗 **拓扑操作**：多边形分割、空间分析
- 🚀 **高性能**：优化的渲染和事件处理
- 📦 **TypeScript 支持**：完整的类型定义
- 🔌 **多种使用方式**：支持 ES6、CommonJS 和浏览器直接使用

## 📦 安装

### NPM/Yarn 安装

```bash
# 使用 npm
npm install leaflet leaflet-geo-tools

# 使用 yarn
yarn add leaflet leaflet-geo-tools
```

### CDN 直接使用

```html
<!-- 引入依赖 -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/@turf/turf@7/turf.min.js"></script>

<!-- 引入本库 -->
<script src="https://unpkg.com/leaflet-geo-tools@latest/dist/index.js"></script>
```

## 🚀 快速开始

### 1. 绘制多边形

```javascript
import L from 'leaflet';
import { LeafletPolygonEditor } from 'leaflet-geo-tools';

// 初始化地图
const map = L.map('map').setView([31.2304, 121.4737], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 创建多边形编辑器
const polygonEditor = new LeafletPolygonEditor(map);

// 监听状态变化
polygonEditor.onStateChange((state) => {
  console.log('当前状态:', state);
  
  if (state === 'idle') {
    // 绘制完成，获取 GeoJSON 数据
    const geojson = polygonEditor.geojson();
    console.log('绘制完成:', geojson);
  }
});
```

### 2. 编辑现有图形

```javascript
import { LeafletPolygonEditor } from 'leaflet-geo-tools';

// 传入现有的 GeoJSON 数据
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
const editor = new LeafletPolygonEditor(map, {}, existingGeometry);

// 双击图形进入编辑模式
// 支持：拖动顶点、插入中点、删除顶点、拖动整个面
```

### 3. 测量工具

```javascript
import { LeafletAreaMeasure, LeafletDistanceMeasure } from 'leaflet-geo-tools';

// 面积测量
const areaMeasure = new LeafletAreaMeasure(map);

// 距离测量
const distanceMeasure = new LeafletDistanceMeasure(map);
```

## 📚 API 文档

### 编辑器基类 (BaseEditor)

所有编辑器都继承自 `BaseEditor`，提供以下通用功能：

#### 状态管理
```javascript
// 监听状态变化
editor.onStateChange((state) => {
  console.log('状态:', state); // 'idle' | 'drawing' | 'editing'
}, {
  immediateNotify: false,      // 是否立即触发当前状态
  skipInitialIdle: true        // 是否跳过初始 idle 状态
});

// 移除监听
editor.offStateChange(listener);

// 清空所有监听
editor.clearAllStateListeners();
```

#### 图层控制
```javascript
// 显示/隐藏图层
editor.setVisible(true);

// 获取图层实例
const layer = editor.getLayer();

// 获取 GeoJSON 数据
const geojson = editor.geojson();

// 销毁编辑器
editor.destroy();
```

### 绘制工具

#### 点 (MarkerPoint)
```javascript
import { LeafletMarkerEditor } from 'leaflet-geo-tools';

const markerEditor = new LeafletMarkerEditor(map);
```

#### 线 (Polyline)
```javascript
import { LeafletPolylineEditor } from 'leaflet-geo-tools';

const polylineEditor = new LeafletPolylineEditor(map, {
  color: '#3388ff',
  weight: 3
});
```

#### 面 (Polygon)
```javascript
import { LeafletPolygonEditor } from 'leaflet-geo-tools';

const polygonEditor = new LeafletPolygonEditor(map, {
  color: '#ff7800',
  weight: 2,
  fillColor: '#ff7800',
  fillOpacity: 0.3
});
```

#### 矩形 (Rectangle)
```javascript
import { LeafletRectangleEditor } from 'leaflet-geo-tools';

const rectangleEditor = new LeafletRectangleEditor(map, {
  color: '#ff0000',
  weight: 2
});
```

#### 圆形 (Circle)
```javascript
import { LeafletCircleEditor } from 'leaflet-geo-tools';

const circleEditor = new LeafletCircleEditor(map, {
  color: '#00ff00',
  weight: 2
});
```

### 编辑功能

#### 简单编辑 (支持单面)
```javascript
import { SimplePolygonEditor } from 'leaflet-geo-tools';

const simpleEditor = new SimplePolygonEditor(map, {}, existingGeometry);
```

#### 高级编辑 (支持挖孔、多面)
```javascript
import { AdvancedPolygonEditor } from 'leaflet-geo-tools';

const advancedEditor = new AdvancedPolygonEditor(map, {}, existingGeometry);

// 编辑操作
advancedEditor.undoEdit();    // 撤销
advancedEditor.redoEdit();    // 重做
advancedEditor.commitEdit();  // 完成编辑
advancedEditor.resetToInitial(); // 重置到初始状态
```

### 测量工具

#### 距离测量
```javascript
import { LeafletDistanceMeasure } from 'leaflet-geo-tools';

const measure = new LeafletDistanceMeasure(map, {
  lineStyle: {
    color: '#ff0000',
    weight: 2,
    dashArray: '5,5'
  },
  labelStyle: {
    fontSize: '12px',
    fontWeight: 'bold'
  }
});

// 获取测量结果
measure.getTotalDistance(); // 返回总距离（米）
```

#### 面积测量
```javascript
import { LeafletAreaMeasure } from 'leaflet-geo-tools';

const areaMeasure = new LeafletAreaMeasure(map, {
  polygonStyle: {
    color: '#00ff00',
    weight: 2,
    fillColor: '#00ff00',
    fillOpacity: 0.3
  }
});

// 获取测量结果
areaMeasure.getArea(); // 返回面积（平方米）
```

## 🔧 配置选项

### 通用选项
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `string` | `'#3388ff'` | 线条颜色 |
| `weight` | `number` | `3` | 线条宽度 |
| `fillColor` | `string` | `同color` | 填充颜色 |
| `fillOpacity` | `number` | `0.2` | 填充透明度 |
| `pane` | `string` | `'overlayPane'` | 图层容器 |

### 编辑器选项
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `origin` | `any` | `undefined` | 原始数据（可用于存储业务信息） |
| `defaultStyle` | `object` | `{}` | 默认样式 |
| `markerIcon` | `L.DivIcon` | 圆形红点图标 | 顶点标记图标 |

## 🎯 高级用法

### 1. 多个编辑器实例管理
```javascript
class MapEditorManager {
  constructor(map) {
    this.map = map;
    this.editors = new Map(); // id -> editor
    this.currentEditor = null;
  }
  
  addEditor(id, geometry, options = {}) {
    const editor = new LeafletPolygonEditor(this.map, options, geometry);
    
    editor.onStateChange((state) => {
      if (state === 'editing') {
        // 停用其他编辑器
        this.deactivateOthers(id);
      }
    });
    
    this.editors.set(id, editor);
    return editor;
  }
  
  deactivateOthers(activeId) {
    this.editors.forEach((editor, id) => {
      if (id !== activeId) {
        editor.exitEditMode();
      }
    });
  }
}
```

### 2. 自定义标记图标
```javascript
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background: blue; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [24, 24]
});

const editor = new LeafletPolygonEditor(map, {
  markerIcon: customIcon
});
```

### 3. 与业务数据集成
```javascript
// 创建时携带业务数据
const editor = new LeafletPolygonEditor(map, {
  origin: {
    id: 'feature-123',
    name: '地块A',
    type: 'agriculture',
    owner: '张三'
  }
});

// 获取业务数据
const layer = editor.getLayer();
const businessData = layer.options.origin;

// 保存时携带业务数据
editor.onStateChange((state) => {
  if (state === 'idle') {
    const geojson = editor.geojson();
    const saveData = {
      geometry: geojson,
      properties: businessData
    };
    // 发送到服务器...
  }
});
```

## 🔍 拓扑操作

### 多边形分割
```javascript
import { splitPolygon } from 'leaflet-geo-tools/topo';

// 使用线分割多边形
const result = splitPolygon(polygonGeojson, lineGeojson);

if (result) {
  result.parts.forEach(part => {
    const editor = new LeafletPolygonEditor(map, {}, part);
  });
}
```

## 📖 示例

### 在线示例
查看完整的在线示例：[示例页面](https://yourusername.github.io/leaflet-geo-tools/examples/)

### 本地运行示例
```bash
# 克隆仓库
git clone https://github.com/yourusername/leaflet-geo-tools.git
cd leaflet-geo-tools

# 安装依赖
npm install

# 构建库
npm run build

# 启动示例服务器
npx serve .
# 然后访问 http://localhost:3000/examples/
```

## 🛠️ 开发

### 项目结构
```
leaflet-geo-tools/
├── src/
│   ├── draw/          # 绘制工具
│   │   ├── circle.ts
│   │   ├── markerPoint.ts
│   │   ├── polygon.ts
│   │   ├── polyline.ts
│   │   └── rectangle.ts
│   ├── edit/          # 编辑工具
│   │   ├── BaseEditor.ts
│   │   ├── BasePolygonEditor.ts
│   │   ├── BaseRectangleEditor.ts
│   │   ├── polygon.ts
│   │   └── rectangle.ts
│   ├── simpleEdit/    # 简单编辑
│   ├── measure/       # 测量工具
│   ├── topo/          # 拓扑工具
│   ├── types.ts       # 类型定义
│   └── index.ts       # 主入口
├── dist/              # 构建输出
├── examples/          # 示例代码
├── package.json
├── tsconfig.json
└── README.md
```

### 构建项目
```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 清理构建文件
npm run clean
```

### 测试
```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

## 🤝 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 作者

**Your Name**
- GitHub: [@Userluckytian](https://github.com/Userluckytian)
- Email: tianlukang123@163.com

## 🙏 致谢

- [Leaflet](https://leafletjs.com/) - 优秀的交互式地图库
- [Turf.js](https://turfjs.org/) - 空间分析库
- 所有贡献者和用户

## 📞 支持

- 提交 [Issue](https://github.com/yourusername/leaflet-geo-tools/issues)
- 查看 [常见问题解答](FAQ.md)
- 加入讨论 [Discussions](https://github.com/yourusername/leaflet-geo-tools/discussions)

---

**如果你觉得这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

---

## 更新日志

### v0.1.0 (2024-01-01)
- ✅ 初始版本发布
- ✅ 基本绘制工具（点、线、面、矩形、圆形）
- ✅ 图形编辑功能
- ✅ 距离和面积测量
- ✅ TypeScript 支持
- ✅ 完整的文档和示例