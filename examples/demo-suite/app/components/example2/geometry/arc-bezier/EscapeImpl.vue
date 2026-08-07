<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
// 工厂回调注入 maptalks-gl 命名空间（mt），创建底图
useMaptalksLayer(
  map,
  (mt) =>
    new mt.TileLayer('base', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['b', 'c', 'd'],
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
    }),
)

// 曲线构造器窄化类型（ArcCurve 等未建模，cast 逃生舱）
type CurveCtor = new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry

// 圆弧：两点 + arcDegree 弧度
function addArc(layer: MaptalksVectorLayer, ArcCurve: CurveCtor): void {
  layer.addGeometry(new ArcCurve([[121.49, 31.238], [121.52, 31.252]], {
    symbol: { lineColor: '#2563eb', lineWidth: 3, arcDegree: 90 },
  }))
}

// 二次贝塞尔：起点 + 控制点 + 终点
function addQuad(layer: MaptalksVectorLayer, QuadBezierCurve: CurveCtor): void {
  layer.addGeometry(new QuadBezierCurve([[121.488, 31.246], [121.503, 31.258], [121.518, 31.246]], {
    symbol: { lineColor: '#7c3aed', lineWidth: 3 },
  }))
}

// 三次贝塞尔：起点 + 两控制点 + 终点（组合 symbol：线 + 顶点标记 + 文字）
function addCubic(layer: MaptalksVectorLayer, CubicBezierCurve: CurveCtor): void {
  layer.addGeometry(new CubicBezierCurve([[121.49, 31.232], [121.5, 31.242], [121.512, 31.228], [121.522, 31.24]], {
    symbol: [
      { lineColor: '#dc2626', lineWidth: 3, arcDegree: 90 },
      { markerType: 'ellipse', markerWidth: 8, markerHeight: 8, markerFill: '#f00', markerPlacement: 'vertex' },
      {
        textName: 'Cubic\nBézier',
        textFill: '#f00',
        textWeight: 'bold',
        textHaloColor: '#fff',
        textHaloRadius: 3,
        textSize: 20,
        textWrapCharacter: '\n',
      },
    ],
  }))
}

// 一体工厂：同一矢量图层创建三种曲线
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v')
  // 窄化 cast 取未声明的构造器（ArcCurve / QuadBezierCurve / CubicBezierCurve）
  const ArcCurve = (mt as unknown as { ArcCurve: CurveCtor }).ArcCurve
  const QuadBezierCurve = (mt as unknown as { QuadBezierCurve: CurveCtor }).QuadBezierCurve
  const CubicBezierCurve = (mt as unknown as { CubicBezierCurve: CurveCtor }).CubicBezierCurve
  addArc(layer, ArcCurve)
  addQuad(layer, QuadBezierCurve)
  addCubic(layer, CubicBezierCurve)
  return layer
})

const status = computed(() => (isReady.value ? '地图已创建（三种曲线）' : '加载中…'))
</script>
