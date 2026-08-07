<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => sort321()"
        >排序 3→2→1（bringToFront）</UButton
      >
      <UButton size="xs" color="primary" @click="() => sort123()">排序 1→2→3（setZIndex）</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.4854, 31.2285], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer } = useMaptalksVectorLayer(map)

const { geometry: r3 } = useMaptalksPolygon(layer, {
  coordinates: [
    [121.4604, 31.225],
    [121.473, 31.225],
    [121.473, 31.234],
    [121.4604, 31.234],
  ],
  options: {
    symbol: [
      { lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 },
      { textName: '3', textWeight: 'bold', textSize: 30, textFill: '#fff' },
    ],
  },
})

const { geometry: r2 } = useMaptalksPolygon(layer, {
  coordinates: [
    [121.4664, 31.231],
    [121.479, 31.231],
    [121.479, 31.24],
    [121.4664, 31.24],
  ],
  options: {
    symbol: [
      { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(216,115,149)', polygonOpacity: 1 },
      { textName: '2', textWeight: 'bold', textSize: 30, textFill: '#fff' },
    ],
  },
})

const { geometry: r1 } = useMaptalksPolygon(layer, {
  coordinates: [
    [121.4724, 31.237],
    [121.485, 31.237],
    [121.485, 31.246],
    [121.4724, 31.246],
  ],
  options: {
    symbol: [
      { lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(135,196,240)', polygonOpacity: 1 },
      { textName: '1', textWeight: 'bold', textSize: 30, textFill: '#fff' },
    ],
  },
})

function sort321() {
  r3.value?.bringToFront?.()
  r1.value?.bringToBack?.()
}

function sort123() {
  r1.value?.setZIndex?.(3)
  r2.value?.setZIndex?.(2)
  r3.value?.setZIndex?.(1)
}

const status = computed(() => (isReady.value ? '地图已创建（可调图形 z-index）' : '加载中…'))
</script>
