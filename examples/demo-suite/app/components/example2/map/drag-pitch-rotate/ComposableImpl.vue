<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <USwitch v-model="dragPitch" label="dragPitch（右键拖拽俯仰）" />
      <USwitch v-model="dragRotate" label="dragRotate（右键拖拽旋转）" />
    </div>
    <p class="text-sm text-muted mt-2">
      按住右键（或 Ctrl+左键）拖拽。
      当前俯仰 {{ (cam.pitch.value ?? 0).toFixed(1) }}° · 旋转 {{ (cam.bearing.value ?? 0).toFixed(1) }}°
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
// 两个开关实时生效
const dragPitch = ref(true)
const dragRotate = ref(true)
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 14,
})
useMaptalksTileLayer(map, { source: 'osm' })
// 相机 ref 实时回流，直观看到拖拽效果
const cam = useMaptalksCamera(map)
// 开关变化时通过 config 热更新地图交互（MaptalksMap 已建模 config）
watch([dragPitch, dragRotate], ([p, r]) => {
  map.value?.config({ dragPitch: p, dragRotate: r })
})

const status = computed(() => (isReady.value ? '地图已创建（拖拽开关实时生效）' : '加载中…'))
</script>
