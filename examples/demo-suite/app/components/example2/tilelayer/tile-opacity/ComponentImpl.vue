<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
    <p class="text-sm text-muted mt-2">深色页面背景可衬出半透明效果</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksTileLayer(map, { source: 'osm' })
const op = ref(1)
// setOpacity 已建模，watch 滑杆值直接调用
watch(op, (v) => {
  toValue(layer)?.setOpacity(v)
})

const status = computed(() => (map.value ? '地图已创建（透明度可调）' : '加载中…'))
</script>
