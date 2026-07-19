// oxlint-disable max-lines
import type { Component } from 'vue';

/**
 * @description 「示例2」单个示例条目：编号与标题与 maptalks 官网中文示例逐字一致
 */
export interface Example2Demo {
  /** 官网编号，如 '1.1' */
  no: string;
  /** 官网中文标题，逐字一致 */
  title: string;
  /** 路由 slug（本项目自定英文；官网"一模一样"约束仅针对可见文案） */
  slug: string;
  /** 是否已实现（按批次手动置真；驱动菜单 badge 与首页进度） */
  implemented?: boolean;
}

/**
 * @description 「示例2」示例分组：对应官网左侧菜单的一级分组
 */
export interface Example2Group {
  /** 分组序号 1~14 */
  no: number;
  /** 官网分组中文名 */
  title: string;
  /** 分组英文 slug，构成路由 /example2/<group.slug>/<demo.slug> */
  slug: string;
  /** 组内示例列表（顺序与官网一致） */
  demos: Example2Demo[];
}

/**
 * @description DemoShell 的 tab 描述：一个实现方式对应一个懒挂载组件
 */
export interface DemoTab {
  /** 实现方式标识（固定四选一），同时作为 UTabs 的插槽名与 value */
  key: 'component' | 'composable' | 'mixed' | 'escape';
  /** tab 显示名：组件 / Composable / 组合 / 逃生舱 */
  label: string;
  /** 该实现方式的组件（页面显式 import 后传入） */
  comp: Component;
}

/** 「示例2」全量菜单：14 组 × 172 项，与官网 https://maptalks.org/examples/cn/ 逐字一致 */
export const example2Menu: Example2Group[] = [
  {
    no: 1,
    title: '地图',
    slug: 'map',
    demos: [
      { no: '1.1', title: '显示', slug: 'load', implemented: true },
      { no: '1.2', title: '倾斜与旋转', slug: 'pitch-rotate', implemented: true },
      { no: '1.3', title: '拖动倾斜与旋转', slug: 'drag-pitch-rotate', implemented: true },
      { no: '1.4', title: '移动地图', slug: 'pan', implemented: true },
      { no: '1.5', title: '添加常用控件', slug: 'controls', implemented: true },
      { no: '1.6', title: '获取地图状态', slug: 'status', implemented: true },
      { no: '1.7', title: '自动适配区域', slug: 'fit-extent', implemented: true },
      { no: '1.8', title: '限制地图区域', slug: 'max-extent', implemented: true },
      { no: '1.9', title: '限制缩放级别', slug: 'zoom-limit', implemented: true },
      { no: '1.10', title: '细微缩放(Fractional Zoom)', slug: 'fractional-zoom', implemented: true },
      { no: '1.11', title: '在Canvas容器中加载', slug: 'canvas-container', implemented: true },
      { no: '1.12', title: '监听地图事件', slug: 'events', implemented: true },
      { no: '1.13', title: '同步地图', slug: 'sync-maps', implemented: true },
      { no: '1.14', title: '屏幕坐标转换', slug: 'coordinate-convert', implemented: true },
      { no: '1.15', title: '导出为图片', slug: 'export-image', implemented: true },
      { no: '1.16', title: '地图放大镜', slug: 'magnifier', implemented: true },
      { no: '1.17', title: '自定义地图LOD', slug: 'custom-lod', implemented: true },
      { no: '1.18', title: '缩放地图容器解决高分辨率地图卡顿', slug: 'container-scale', implemented: true },
    ],
  },
  {
    no: 2,
    title: '瓦片图层与地理投影',
    slug: 'tilelayer',
    demos: [
      { no: '2.1', title: 'Canvas渲染方式的瓦片图层', slug: 'canvas-renderer', implemented: true },
      { no: '2.2', title: '添加多个瓦片图层', slug: 'multi-tilelayers', implemented: true },
      { no: '2.3', title: '添加瓦片图层组', slug: 'group-tilelayer', implemented: true },
      { no: '2.4', title: 'WMS瓦片图层', slug: 'wms', implemented: true },
      { no: '2.5', title: 'Tilelayer强制重载', slug: 'force-reload', implemented: true },
      { no: '2.6', title: 'Vector-Tile图层', slug: 'vector-tile', implemented: true },
      { no: '2.7', title: 'ArcGIS瓦片图层', slug: 'arcgis', implemented: true },
      { no: '2.8', title: 'WMTS瓦片图层', slug: 'wmts', implemented: true },
      { no: '2.9', title: 'LOD和自定义瓦片图层', slug: 'custom-tile-lod', implemented: true },
      { no: '2.10', title: '用base64编码载入瓦片', slug: 'base64-tile', implemented: true },
      { no: '2.11', title: '设置瓦片图层透明度', slug: 'tile-opacity', implemented: true },
      { no: '2.12', title: '只显示指定范围内的瓦片', slug: 'tile-extent', implemented: true },
      { no: '2.13', title: '4326投影底图', slug: 'epsg4326', implemented: true },
      { no: '2.14', title: 'IDENTITY投影底图', slug: 'identity', implemented: true },
      { no: '2.15', title: '百度投影底图', slug: 'baidu', implemented: true },
      { no: '2.16', title: 'Proj4js自定义投影底图', slug: 'proj4', implemented: true },
      { no: '2.17', title: 'D3投影', slug: 'd3-projection', implemented: true },
      { no: '2.18', title: '载入不同投影的TileLayer', slug: 'mixed-projection', implemented: true },
      { no: '2.19', title: '底图风格滤镜', slug: 'css-filter', implemented: true },
      { no: '2.20', title: '自定义处理瓦片图片', slug: 'custom-tile-image', implemented: true },
      { no: '2.21', title: '增大空间参考的maxZoom', slug: 'max-zoom-extend', implemented: true },
    ],
  },
  {
    no: 3,
    title: '图形',
    slug: 'geometry',
    demos: [
      { no: '3.1', title: 'Marker', slug: 'marker', implemented: true },
      { no: '3.2', title: 'LineString', slug: 'linestring', implemented: true },
      { no: '3.3', title: 'Polygon', slug: 'polygon', implemented: true },
      { no: '3.4', title: 'GeometryCollection', slug: 'collection', implemented: true },
      { no: '3.5', title: 'MultiPoint', slug: 'multipoint' },
      { no: '3.6', title: 'MultiLineString', slug: 'multilinestring' },
      { no: '3.7', title: 'MultiPolygon', slug: 'multipolygon' },
      { no: '3.8', title: '矩形, 圆形, 椭圆和扇形', slug: 'rect-circle-ellipse-sector' },
      { no: '3.9', title: '圆弧和贝塞尔曲线', slug: 'arc-bezier' },
      { no: '3.10', title: '文字标签(Label)', slug: 'label' },
      { no: '3.11', title: '文本框(TextBox)', slug: 'textbox' },
      { no: '3.12', title: '连接线', slug: 'connector-line' },
      { no: '3.13', title: '克隆', slug: 'clone' },
      { no: '3.14', title: '监听图形事件', slug: 'geometry-events' },
      { no: '3.15', title: '闪烁', slug: 'flash' },
      { no: '3.16', title: 'GeometryCollection的条件查询', slug: 'collection-filter' },
    ],
  },
  {
    no: 4,
    title: '三维',
    slug: 'three-d',
    demos: [
      { no: '4.1', title: '有高度的Marker', slug: 'marker-altitude' },
      { no: '4.2', title: '绘制Marker的高度线', slug: 'altitude-line' },
      { no: '4.3', title: '有高度的线', slug: 'line-altitude' },
      { no: '4.4', title: '绘制Line的高度面', slug: 'line-altitude-wall' },
      { no: '4.5', title: '有高度的多边形', slug: 'polygon-altitude' },
      { no: '4.6', title: '设置图形高度', slug: 'set-altitude' },
    ],
  },
  {
    no: 5,
    title: '图形样式',
    slug: 'style',
    demos: [
      { no: '5.1', title: '图片标注', slug: 'image-marker' },
      { no: '5.2', title: '多图片标注', slug: 'multi-image-marker' },
      { no: '5.3', title: '矢量标注', slug: 'vector-marker' },
      { no: '5.4', title: '矢量标注模式填充', slug: 'vector-pattern' },
      { no: '5.5', title: '矢量标注渐变填充', slug: 'vector-gradient' },
      { no: '5.6', title: 'SVG矢量标注', slug: 'svg-marker' },
      { no: '5.7', title: '标注水平和垂直对齐', slug: 'marker-alignment' },
      { no: '5.8', title: '旋转标注', slug: 'marker-rotation' },
      { no: '5.9', title: '文字标注', slug: 'text-marker' },
      { no: '5.10', title: '旋转文字标注', slug: 'text-rotation' },
      { no: '5.11', title: '带文字的图片标注', slug: 'image-text-marker' },
      { no: '5.12', title: '线样式', slug: 'line-style' },
      { no: '5.13', title: '线的模式填充', slug: 'line-pattern' },
      { no: '5.14', title: '线的模式填充动画', slug: 'line-pattern-animation' },
      { no: '5.15', title: '线的渐变填充', slug: 'line-gradient' },
      { no: '5.16', title: '带箭头的线', slug: 'line-arrow' },
      { no: '5.17', title: '带文字的线', slug: 'line-text' },
      { no: '5.18', title: '端点沿线自动旋转Marker', slug: 'line-marker-rotation' },
      { no: '5.19', title: '线的曲线平滑', slug: 'line-smooth' },
      { no: '5.20', title: '面样式', slug: 'polygon-style' },
      { no: '5.21', title: '面的模式填充', slug: 'polygon-pattern' },
      { no: '5.22', title: '面的渐变填充', slug: 'polygon-gradient' },
      { no: '5.23', title: '面的端点样式', slug: 'polygon-vertex' },
      { no: '5.24', title: '组合样式', slug: 'composite-style' },
      { no: '5.25', title: '样式的部分更新', slug: 'update-symbol' },
      { no: '5.26', title: '根据zoom设置样式', slug: 'zoom-style' },
      { no: '5.27', title: '根据属性数据设置样式', slug: 'property-style' },
      { no: '5.28', title: '颜色插值', slug: 'color-interpolate' },
      { no: '5.29', title: 'HTML自定义标注', slug: 'html-marker' },
      { no: '5.30', title: 'D3图表样式', slug: 'd3-chart' },
      { no: '5.31', title: 'Echarts图表样式', slug: 'echarts-chart' },
      { no: '5.32', title: 'Highcharts图表样式', slug: 'highcharts-chart' },
    ],
  },
  {
    no: 6,
    title: '图层',
    slug: 'layer',
    demos: [
      { no: '6.1', title: '添加图层和移除图层', slug: 'add-remove' },
      { no: '6.2', title: '隐藏显示图层', slug: 'show-hide' },
      { no: '6.3', title: '设置图层透明度', slug: 'layer-opacity' },
      { no: '6.4', title: '图层置顶或置底', slug: 'bring-front-back' },
      { no: '6.5', title: '改变图层叠加顺序', slug: 'z-order' },
      { no: '6.6', title: '用鼠标设置图层遮罩', slug: 'layer-mask' },
      { no: '6.7', title: 'globalCompositeOperation', slug: 'composite-operation' },
      { no: '6.8', title: 'VectorLayer: 批量添加图形', slug: 'batch-add' },
      { no: '6.9', title: 'VectorLayer:根据 ID 获取图形', slug: 'get-by-id' },
      { no: '6.10', title: 'VectorLayer: 根据属性条件筛选图形', slug: 'filter' },
      { no: '6.11', title: 'VectorLayer: 批量设置图形样式', slug: 'layer-style' },
      { no: '6.12', title: 'VectorLayer: 设置图形的z-index', slug: 'geometry-zindex' },
      { no: '6.13', title: '图层碰撞', slug: 'collision' },
      { no: '6.14', title: 'CanvasLayer: 画板图层示例', slug: 'canvas-layer' },
      { no: '6.15', title: 'ParticleLayer: 粒子图层示例', slug: 'particle-layer' },
      { no: '6.16', title: 'CanvasTileLayer: 画板瓦片图层示例', slug: 'canvas-tile-layer' },
      { no: '6.17', title: '图层卷帘效果', slug: 'layer-swipe' },
      { no: '6.18', title: 'ImageLayer: 图片图层示例', slug: 'image-layer' },
    ],
  },
  {
    no: 7,
    title: '工具/全局功能',
    slug: 'util',
    demos: [
      { no: '7.1', title: '通过Proxy更新options', slug: 'proxy-options' },
    ],
  },
  {
    no: 8,
    title: '交互',
    slug: 'interaction',
    demos: [
      { no: '8.1', title: '禁用所有交互', slug: 'disable-interaction' },
      { no: '8.2', title: '地图功能开关', slug: 'map-switches' },
      { no: '8.3', title: '测距工具', slug: 'distance-tool' },
      { no: '8.4', title: '测面工具', slug: 'area-tool' },
      { no: '8.5', title: '绘制工具', slug: 'draw-tool' },
      { no: '8.6', title: '拖拽图形', slug: 'drag-geometry' },
      { no: '8.7', title: '编辑标注', slug: 'edit-marker' },
      { no: '8.8', title: '编辑线', slug: 'edit-line' },
      { no: '8.9', title: '编辑多边形', slug: 'edit-polygon' },
      { no: '8.10', title: '编辑矩形/圆形/椭圆', slug: 'edit-shapes' },
      { no: '8.11', title: '编辑文本框', slug: 'edit-textbox' },
      { no: '8.12', title: '编辑文本内容', slug: 'edit-text' },
      { no: '8.13', title: '鼠标点选图形', slug: 'identify' },
      { no: '8.14', title: '鼠标悬停高亮图形', slug: 'hover-highlight' },
      { no: '8.15', title: '鼠标与图形的空间关系', slug: 'spatial-relation' },
    ],
  },
  {
    no: 9,
    title: '动画',
    slug: 'animation',
    demos: [
      { no: '9.1', title: '地图飞行到指定位置', slug: 'fly-to' },
      { no: '9.2', title: 'Marker的变形动画', slug: 'marker-animation' },
      { no: '9.3', title: '点的沿线动画', slug: 'along-line' },
      { no: '9.4', title: 'Geometry.animate方法', slug: 'geometry-animate' },
      { no: '9.5', title: '线的动画展现', slug: 'line-show' },
      { no: '9.6', title: '面的动画展现', slug: 'polygon-show' },
      { no: '9.7', title: '自定义动画', slug: 'custom-animation' },
      { no: '9.8', title: '地图跟随动画', slug: 'map-follow' },
    ],
  },
  {
    no: 10,
    title: '空间与UI组件',
    slug: 'ui-control',
    demos: [
      { no: '10.1', title: '地图右键菜单', slug: 'map-menu' },
      { no: '10.2', title: '图形右键菜单', slug: 'geometry-menu' },
      { no: '10.3', title: '自定义右键菜单', slug: 'custom-menu' },
      { no: '10.4', title: '地图信息框', slug: 'map-infownd' },
      { no: '10.5', title: '图形信息框', slug: 'geometry-infownd' },
      { no: '10.6', title: '自定义信息框', slug: 'custom-infownd' },
      { no: '10.7', title: '信息框内容支持滚动', slug: 'infownd-scroll' },
      { no: '10.8', title: 'UIMarker 对齐', slug: 'ui-marker' },
      { no: '10.9', title: 'UI碰撞', slug: 'ui-collision' },
      { no: '10.10', title: '信息框绑定MVVM组件', slug: 'infownd-mvvm' },
      { no: '10.11', title: 'Toolbar控件', slug: 'toolbar' },
      { no: '10.12', title: 'Panel控件', slug: 'panel' },
      { no: '10.13', title: '鹰眼控件', slug: 'overview' },
      { no: '10.14', title: 'Zoom控件', slug: 'zoom-control' },
      { no: '10.15', title: '指北针控件', slug: 'compass-control' },
      { no: '10.16', title: 'Scale控件', slug: 'scale-control' },
      { no: '10.17', title: 'Attribution控件', slug: 'attribution-control' },
      { no: '10.18', title: '控件显示与隐藏', slug: 'control-toggle' },
      { no: '10.19', title: '图层选择控件', slug: 'layer-switcher' },
    ],
  },
  {
    no: 11,
    title: 'JSON序列化',
    slug: 'json',
    demos: [
      { no: '11.1', title: 'GeoJSON转化为Geometry', slug: 'geojson-to-geometry' },
      { no: '11.2', title: 'Geometry转化为GeoJSON', slug: 'geometry-to-geojson' },
      { no: '11.3', title: '地图转化为JSON', slug: 'map-to-json' },
      { no: '11.4', title: '用JSON载入地图', slug: 'map-from-json' },
      { no: '11.5', title: '用JSON复制地图', slug: 'copy-map' },
      { no: '11.6', title: '用JSON复制Layer', slug: 'copy-layer' },
      { no: '11.7', title: '用JSON复制Geometry', slug: 'copy-geometry' },
    ],
  },
  {
    no: 12,
    title: '常用插件',
    slug: 'plugin',
    demos: [
      { no: '12.1', title: 'Mapbox gl 图层', slug: 'mapboxgl-layer' },
      { no: '12.2', title: 'HeatLayer: 热力图层示例', slug: 'heat-layer' },
      { no: '12.3', title: 'ClusterLayer: 点聚合图层示例', slug: 'cluster-layer' },
      { no: '12.4', title: 'Three.js 图层', slug: 'three-layer' },
      { no: '12.5', title: 'Echarts 图层', slug: 'echarts-layer' },
    ],
  },
  {
    no: 13,
    title: '插件开发示例',
    slug: 'custom-plugin',
    demos: [
      { no: '13.1', title: '创建新的控件', slug: 'custom-control' },
      { no: '13.2', title: '创建新的UI组件', slug: 'custom-ui' },
      { no: '13.3', title: '创建地图工具', slug: 'custom-tool' },
    ],
  },
  {
    no: 14,
    title: '图层开发示例',
    slug: 'custom-layer',
    demos: [
      { no: '14.1', title: 'HelloLayer', slug: 'hello-layer' },
      { no: '14.2', title: 'HelloLayer交互绘制', slug: 'hello-layer-draw' },
      { no: '14.3', title: 'HelloLayer动画图层', slug: 'hello-layer-animation' },
    ],
  },
];

/**
 * @description 按路由路径反查「示例2」菜单项，供 DemoShell 标题与占位页 404 判断使用
 * @param path 路由路径，形如 `/example2/map/load`（允许末尾斜杠）
 * @returns 命中时返回 `{ group, demo }`；路径不属于任何菜单项时返回 `null`
 * @example
 * const hit = findExample2Demo('/example2/map/load');
 * // hit?.demo.no === '1.1'，hit?.demo.title === '显示'
 */
export function findExample2Demo(
  path: string,
): { group: Example2Group; demo: Example2Demo } | null {
  // 去掉末尾斜杠后按 /example2/<group>/<demo> 两段匹配
  const clean = path.replace(/\/+$/u, '');
  const m = clean.match(/^\/example2\/([^/]+)\/([^/]+)$/u);
  if (!m) return null;
  const group = example2Menu.find((g) => g.slug === m[1]);
  const demo = group?.demos.find((d) => d.slug === m[2]);
  return group && demo ? { group, demo } : null;
}
