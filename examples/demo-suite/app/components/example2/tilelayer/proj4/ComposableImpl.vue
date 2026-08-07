<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      用 proj4 重新实现 EPSG:3857 投影对象——与内置投影等价，但完全由用户代码控制，说明 maptalks 投影系统可被 proj4 自定义。
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import proj4 from 'proj4'

const el = ref<HTMLElement | null>(null)

// proj4 EPSG:3857 投影定义（Web Mercator）
const proj = proj4('EPSG:4326', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs')

// 自定义 projection 对象：c.constructor 获取 Coordinate 类，无需提前 import（回调入参为原生 Coordinate，x 不在类型内走逃生舱断言）
const projection = {
  code: 'proj4-merc',
  project: (c: { toArray?: () => number[]; constructor: new (x: number, y: number) => unknown }) => {
    // proj4 forward 入参数组长度即返回长度，断言为二元组消除索引 undefined
    const pc = proj.forward(c.toArray?.() ?? [c.x as never, c.y as never]) as [number, number]
    return new c.constructor(pc[0], pc[1])
  },
  unproject: (pc: { toArray?: () => number[]; constructor: new (x: number, y: number) => unknown }) => {
    const c = proj.inverse(pc.toArray?.() ?? [pc.x as never, pc.y as never]) as [number, number]
    return new pc.constructor(c[0], c[1])
  },
  // tell projection how to measure distances
  measure: 'EPSG:4326',
}

// 标准 20 级 EPSG:3857 分辨率
const resolutions = [
  156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512,
  9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282,
  611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625,
  38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516,
  2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974,
]

const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 13,
  spatialReference: {
    projection,
    resolutions,
    fullExtent: { top: 6378137 * Math.PI, left: -6378137 * Math.PI, bottom: -6378137 * Math.PI, right: 6378137 * Math.PI },
  },
} as never)
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  },
})

const status = computed(() => (isReady.value ? '地图已创建（proj4 自定义投影）' : '加载中…'))
</script>
