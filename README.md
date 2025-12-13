# Leaflet Geo Tools

[![npm version](https://img.shields.io/npm/v/leaflet-geo-tools.svg)](https://www.npmjs.com/package/leaflet-geo-tools)
[![license](https://img.shields.io/npm/l/leaflet-geo-tools.svg)](https://github.com/Userluckytian/leaflet-geo-tools/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> 基于 Leaflet 的增强型 GIS 工具库，提供专业的绘制、编辑、测量和拓扑操作功能。

## ✨ 特性

- 🎨 **丰富的绘制工具**：点、线、面、矩形、圆形
- ✏️ **强大的编辑功能**：顶点编辑、中点插入、拖动面、复杂面编辑（polygon、multi-polygon、Polygon with Hole(s)等）编辑
- 📏 **精确测量工具**：距离测量、面积测量
- 🔗 **拓扑操作**：面合并、线分割
- 🚀 **高性能**：优化的渲染和事件处理
- 📦 **TypeScript 支持**：完整的类型定义
- 🔌 **多种使用方式**：支持 ES6、CommonJS 和浏览器直接使用


## 📂 项目结构
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
<script>
    // 检查库是否加载成功
    console.log('检查全局变量:', window.LeafletGeoTools);
</script>
```

## 🎬 应用场景

**1. 我只需要绘制，绘制完成后获取绘制图形的geometry空间信息。**
您需要使用【src/draw】目录下的功能。
**2. 我希望绘制后的多边形是可以被编辑的，而且我有多面（multi-polygon、polygon with hole（s））的需求。**
**3. 我希望传入一个已知的geometry信息，它会被渲染到地图上，可以被编辑。**
2、3的功能，您需要使用【src/edit】目录下的功能。

## 🚀 快速开始

### 1. 绘制多边形，添加事件监听

```javascript
import L from 'leaflet';
import { 
    LeafletCircle,
    MarkerPoint,
    LeafletPolygon,
    LeafletPolyline,
    LeafletRectangle, 
    PolygonEditorState
} from 'leaflet-geo-tools';

// 初始化地图
const map = L.map('map').setView([31.2304, 121.4737], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 创建多边形编辑器
const polygonEditor = new LeafletPolygon(map);

// 监听状态变化
polygonEditor.onStateChange((state) => {
  console.log('当前状态:', state);
  
  if (state === PolygonEditorState.Idle) {
    // 绘制完成，获取 GeoJSON 数据
    const geojson = polygonEditor.geojson();
    console.log('绘制完成:', geojson);
  }
});

// 创建矩形
const rectEditor = new LeafletRectangle(map);
// add listener
rectEditor.onStateChange((state) => {...});

// 创建圆形
const circleEditor = new LeafletCircle(map);
// add listener
circleEditor.onStateChange((state) => {...});

// 创建线
const lineEditor = new LeafletPolyline(map);
// add listener
lineEditor.onStateChange((state) => {...});

// 创建点
const pointEditor = new MarkerPoint(map);
// add listener
pointEditor.onStateChange((state) => {...});


```
### 2. 测量工具

```javascript
import { LeafletArea, LeafletDistance } from 'leaflet-geo-tools';

// 面积测量
const areaMeasure = new LeafletArea(map, {
    color: '#00ff00',
    weight: 2,
    fillColor: '#00ff00',
    fillOpacity: 0.3
});

// 距离测量
const distanceMeasure = new LeafletDistance(map);
```
### 3. 编辑现有图形

```javascript
import { LeafletRectangleEditor, LeafletPolygonEditor } from 'leaflet-geo-tools';

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
const editor = new LeafletRectangleEditor(map, {}, existingGeometry);

// 双击图形进入编辑模式
// 支持：拖动顶点、插入中点、删除顶点（右键顶点触发删除）、拖动整个面
```


### 4. 拓扑操作（待补充）

## 📖 示例

### 在线示例
查看完整的在线示例：[示例页面](https://vite-react19-zustand-tailwindcss-an.vercel.app/#/layout/map)
website login: username: 123 pwd: 123


### 本地运行示例
```bash
# 克隆仓库
git clone https://github.com/Userluckytian/leaflet-geo-tools.git
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

- 提交 [Issue](https://github.com/Userluckytian/leaflet-geo-tools/issues)
- 查看 [常见问题解答](FAQ.md)
- 加入讨论 [Discussions](https://github.com/Userluckytian/leaflet-geo-tools/discussions)

---

**如果你觉得这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

---

## 更新日志

### v0.1.0 (2025-12-11)
- ✅ 初始版本发布
- ✅ 基本绘制工具（点、线、面、矩形、圆形）
- ✅ 图形编辑功能
- ✅ 距离和面积测量
- ✅ TypeScript 支持
- ✅ 完整的文档和示例
- 🎯 topo基本操作（线裁剪、合并面）
- 🎯 复杂topo操作
- 🎯 ...