<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })

// 逃生舱：工厂 new 原生 TileLayer，保存 tileRef 引用供 setOpacity 直调（工厂推断 MaptalksTileLayer）
let tileRef: MaptalksTileLayer | null = null
const op = ref(1)

useMaptalksLayer(map, (mt) => {
  const l = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  tileRef = l
  return l
})

// watch 滑杆值，通过保存的 tileRef 引用直调 setOpacity
watch(op, (v) => {
  tileRef?.setOpacity(v)
})

const status = computed(() => (isReady.value ? '地图已创建（透明度可调）' : '加载中…'))
</script>
