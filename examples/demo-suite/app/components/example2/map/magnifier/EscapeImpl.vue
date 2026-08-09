<template>
  <div class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <div ref="elMain" class="absolute inset-0" />
    <div
      v-show="visible"
      class="absolute z-10 pointer-events-none rounded-full overflow-hidden border-2 border-primary shadow-lg"
      :style="{ width: '180px', height: '180px', left: `${pos.x}px`, top: `${pos.y}px` }"
    >
      <div ref="elMag" class="absolute inset-0" />
    </div>
    <p class="absolute bottom-1 left-2 text-xs bg-background/80 px-1.5 py-0.5 rounded">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const elMain = ref<HTMLElement | null>(null)
const elMag = ref<HTMLElement | null>(null)
const visible = ref(false)
const pos = ref({ x: 0, y: 0 })

const { map: mainMap, isReady } = useMaptalks(elMain, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(mainMap, { source: 'osm' })
const { map: magMap } = useMaptalks(elMag, {
  center: [121.5057, 31.2453],
  zoom: 15,
  draggable: false,
  zoomable: false,
  controls: false,
})
useMaptalksTileLayer(magMap, {
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '',
  },
})

// 逃生舱：原生 mousemove + setCenterAndZoom（官网 1.16 同款套路；on 已建模）
watch(
  [() => toValue(mainMap), () => toValue(magMap)],
  ([main, mag]) => {
    if (!main || !mag) return
    main.on('mousemove', (e) => {
      const ev = e as { coordinate?: unknown; containerPoint?: { x: number; y: number } }
      if (!ev.coordinate || !ev.containerPoint) return
      visible.value = true
      pos.value = { x: ev.containerPoint.x - 90, y: ev.containerPoint.y - 90 }
      mag.setCenterAndZoom(ev.coordinate, main.getZoom() + 2)
    })
    main.on('mouseout', () => {
      visible.value = false
    })
  },
)

const status = computed(() => (isReady.value ? '地图已创建（放大镜跟随鼠标）' : '加载中…'))
</script>
