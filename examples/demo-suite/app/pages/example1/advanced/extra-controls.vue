<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 更多控件</h1>
    <p class="text-muted mb-6">演示 ZoomControl / ScaleControl / CompassControl / AttributionControl 四种地图控件。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">ZoomControl · 缩放控件</h2></template>
        <MaptalksMap ref="mc1" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksZoomControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左上角缩放按钮。</span><span class="text-xs text-muted ml-2">{{ status1 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">ScaleControl · 比例尺</h2></template>
        <MaptalksMap ref="mc2" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksScaleControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左下角比例尺。</span><span class="text-xs text-muted ml-2">{{ status2 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">CompassControl · 指南针</h2></template>
        <MaptalksMap ref="mc3" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksCompassControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">点击复位正北。</span><span class="text-xs text-muted ml-2">{{ status3 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">AttributionControl · 版权信息</h2></template>
        <MaptalksMap ref="mc4" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksAttributionControl :options="{ content: '自定义归属：nuxt-maptalks-gl' }" />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左下角灰色文本标注。</span><span class="text-xs text-muted ml-2">{{ status4 }}</span></template>
      </UCard>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 鹰眼 Overview</h2></template>
        <div ref="el5" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">{{ overviewNote }}</span><span class="text-xs text-muted ml-2">{{ status5 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 图层选择 LayerSwitcher</h2></template>
        <div ref="el6" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">{{ switcherNote }}</span><span class="text-xs text-muted ml-2">{{ status6 }}</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc1 = ref<MaptalksMapExposed | null>(null)
const mc2 = ref<MaptalksMapExposed | null>(null)
const mc3 = ref<MaptalksMapExposed | null>(null)
const mc4 = ref<MaptalksMapExposed | null>(null)
const center: [number, number] = [121.4737, 31.2304]

// 逃生舱：Overview 鹰眼（overviewControl 为模块原生 Map 选项，配合 baseLayer 自动显示）
const overviewNote = ref('创建中…')
const el5 = ref<HTMLElement | null>(null)
const { map: map5, isReady: ready5 } = useMaptalks(el5, { center, zoom: 13, overviewControl: true, baseLayer: 'osm' })
onMounted(() => {
  overviewNote.value = 'overviewControl:true + baseLayer:"osm" Map 选项——鹰眼自动显示瓦片。'
})

// 逃生舱：LayerSwitcher 图层选择
const switcherNote = ref('创建中…')
const el6 = ref<HTMLElement | null>(null)
const { map: map6, isReady: ready6 } = useMaptalks(el6, { center, zoom: 13 })
useMaptalksTileLayer(map6, { source: 'osm' })
useMaptalksVectorLayer(map6)
watch(
  () => toValue(map6),
  async (m) => {
    if (!m) return
    try {
      const mt = await import('maptalks-gl')
      const Ctor = (mt.control as Record<string, unknown>)?.LayerSwitcher as { new (): { addTo: (m: unknown) => void } } | undefined
      if (typeof Ctor === 'function') {
        new Ctor().addTo(m)
        switcherNote.value = 'LayerSwitcher 图层选择控件已创建。'
      }
      else {
        switcherNote.value = '当前 maptalks-gl 未导出 control.LayerSwitcher。'
      }
    } catch {
      switcherNote.value = 'LayerSwitcher 创建失败（逃生舱失败不拖垮页面）'
    }
  },
)

const status1 = computed(() => (toValue(mc1.value?.map) ? '地图已创建' : '加载中…'))
const status2 = computed(() => (toValue(mc2.value?.map) ? '地图已创建' : '加载中…'))
const status3 = computed(() => (toValue(mc3.value?.map) ? '地图已创建' : '加载中…'))
const status4 = computed(() => (toValue(mc4.value?.map) ? '地图已创建' : '加载中…'))
const status5 = computed(() => (ready5.value ? '地图已创建（鹰眼）' : '加载中…'))
const status6 = computed(() => (ready6.value ? '地图已创建' : '加载中…'))
</script>
