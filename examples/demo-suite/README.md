# demo-suite

`@lacqjs/nuxt-maptalks-gl` 的**综合示例应用**，用 `@nuxt/ui` 搭建，系统化演示模块全部能力。

## 运行方式

```bash
# 1. 在仓库根目录安装依赖（pnpm workspace）
pnpm install

# 2. 构建模块并准备（首次或改动 src 后）
pnpm dev:prepare

# 3. 启动 demo-suite 开发服务器
pnpm demo:demo-suite:dev
# 打开 http://localhost:5100
```

## 数据源

`nuxt.config.ts` 里配置了两个命名数据源：

- `osm`：CARTO 公开底图（基于 OpenStreetMap 数据，CDN 可达）
- `secure`：签名底图，经服务端路由 `server/api/maptalks/sign.get.ts` 换取带 token 的 URL（密钥不进前端）

## 侧边栏结构（方案 C）

按「API 风格 × 组合方式」为主轴，子分类对齐 maptalks 官网大类：

1. **组件单独** —— 声明式组件逐类演示（地图·瓦片图层 / 图形 / 控件 / 工具 / 信息框）
2. **Composable 单独** —— `use*` 逐类演示（核心 / 图层预设 / 图形预设 / 相机·事件·坐标 / 绘制·测量 / 状态·序列化 / 控件 / 信息框）
3. **组合示例** —— 组件组合 / composable 组合 / 组件+composable 混合
4. **进阶·逃生舱** —— 用 `useMaptalksLayer` / `useMaptalksGeometry` + 原生 maptalks API 补齐官网热门但模块未封装的能力（3D 高度 / 动画 / 编辑 / 曲线 / UI 组件 / 更多控件 / 图层特效 / 投影 / 插件图层）

每个单独/进阶页顶部标注「对应官网 X.Y」，便于与 <https://maptalks.org/examples/> 对照。
