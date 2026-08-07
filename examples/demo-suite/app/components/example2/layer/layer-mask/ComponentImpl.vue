<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer ref="vlRef" id="vector">
        <MaptalksMarker
          v-for="(p, i) in randomPts"
          :key="i"
          :coordinates="p"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)
let maskMarker: { setCoordinates?: (c: unknown) => unknown } | null = null
let maskBound = false

const randomPts = Array.from({ length: 100 }, () => [
  121.4757 + Math.random() * 0.06,
  31.2153 + Math.random() * 0.06,
] as [number, number])

watch(
  () => toValue(mc.value?.map),
  (mv) => {
    if (!mv || maskBound) return
    maskBound = true
    mv.on('mousemove', (e) => {
      const ev = e as { coordinate?: { x: number; y: number } }
      // coordinate 可能缺省——先提取 const 再守卫（属性收窄进异步闭包会失效，const 变量收窄保留）
      const coord = ev.coordinate
      if (!coord) return
      if (maskMarker) {
        maskMarker.setCoordinates?.(coord)
      } else {
        import('maptalks-gl').then((mt) => {
          // e.coordinate 运行时为原生 Coordinate 实例，类型上无法表达（MarkerCoordinatesType 要求类结构）——逃生舱断言
          maskMarker = new mt.Marker(coord as never, {
            symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
          })
          // exposed layer 是 Ref——toValue 解包；原生 Marker 与建模 MaptalksGeometry 逆变不兼容——断言
          toValue(vlRef.value?.layer)?.setMask?.(maskMarker as unknown as MaptalksGeometry)
        })
      }
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => { maskMarker = null })

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（移动鼠标查看遮罩效果）' : '加载中…'))
</script>
