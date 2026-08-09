<template>
  <div>
    <!-- 组件单独：dragPitch / dragRotate 是运行期响应式 prop（组件内部 watch 并热更新） -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :drag-pitch="dragPitch"
      :drag-rotate="dragRotate"
      base-layer="osm"
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
// 两个开关实时生效
const dragPitch = ref(true)
const dragRotate = ref(true)
// 经组件 expose 的 map 桥接给相机 composable，只读显示角度
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const cam = useMaptalksCamera(map)

const status = computed(() => (map.value ? '地图已创建（拖拽开关实时生效）' : '加载中…'))
</script>
