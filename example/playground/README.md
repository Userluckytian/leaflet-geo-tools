# Leaflet Geo Tools Playground

这是一个基于 Vite + React + TypeScript 的地理工具演示项目，用于展示和测试 Leaflet Geo Tools 的各种功能。

## 项目特性

- 🗺️ 基于 Leaflet 的交互式地图
- 🛠️ 多种地理编辑工具
- 📍 点、线、面编辑功能
- ⭕ 圆形和矩形绘制
- 🔗 拓扑操作工具
- ✏️ 整形操作功能
- 🎨 现代化的 UI 设计

## 地图提供商

应用支持多种地图提供商：

### OpenStreetMap
- 免费开源地图
- 无需API密钥
- 全球覆盖

### 天地图
- 中国官方地图服务
- 提供矢量、影像、地形等多种图层
- 支持API密钥（推荐）和免费版

**获取天地图API密钥：**
1. 访问 [天地图开发者平台](https://console.tianditu.gov.cn/api/key)
2. 注册账号并创建应用
3. 获取API密钥并在地图选择器中输入

**注意：** 使用免费版天地图可能有访问限制，建议申请正式API密钥。

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **地图库**: Leaflet
- **样式**: CSS Modules + Flexbox

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── MapContainer.tsx    # 地图容器组件
│   ├── MapContainer.css
│   ├── ToolPanel.tsx       # 工具面板组件
│   └── ToolPanel.css
├── App.tsx                 # 主应用组件
├── App.css                 # 主应用样式
└── main.tsx               # 应用入口
```

## 可用工具

1. **点编辑** - 在地图上添加和编辑点要素
2. **线编辑** - 绘制和编辑线要素
3. **面编辑** - 创建和编辑多边形要素
4. **圆形编辑** - 绘制和编辑圆形要素
5. **矩形编辑** - 绘制和编辑矩形要素
6. **拓扑操作** - 执行拓扑关系操作
7. **整形操作** - 编辑要素形状

## 开发说明

### 添加新工具

1. 在 `ToolPanel.tsx` 中添加新工具到 `tools` 数组
2. 创建对应的工具组件
3. 在 `App.tsx` 中处理工具选择逻辑

### 自定义地图样式

可以在 `MapContainer.tsx` 中修改地图图层配置：

```typescript
// 使用不同的地图图层
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
}).addTo(map)
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
