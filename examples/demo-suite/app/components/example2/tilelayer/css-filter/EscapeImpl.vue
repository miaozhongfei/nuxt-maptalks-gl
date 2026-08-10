<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" @click="applyFilter('sepia(90%) invert(90%)')">暗色反转</UButton>
      <UButton size="sm" @click="applyFilter('grayscale(100%)')">灰度</UButton>
      <UButton size="sm" @click="applyFilter('none')">无滤镜</UButton>
    </div>
    <p class="text-sm mt-2 text-muted">
      当前滤镜：{{ current }}
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })

// 逃生舱：工厂 new 原生 TileLayer，保存 tileRef 引用供 config 直调（工厂推断 MaptalksTileLayer）
let tileRef: MaptalksTileLayer | null = null
const current = ref('无')

useMaptalksLayer(map, (mt) => {
  const l = new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  })
  tileRef = l
  return l
})

// 原生 config 热更新任意 option（cssFilter 即时生效；config 已建模）
function applyFilter(v: string) {
  tileRef?.config({ cssFilter: v })
  current.value = v === 'none' ? '无' : v
}

const status = computed(() => (isReady.value ? '地图已创建（cssFilter 滤镜）' : '加载中…'))
</script>
