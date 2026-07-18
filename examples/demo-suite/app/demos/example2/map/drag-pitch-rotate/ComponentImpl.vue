<template>
  <div>
    <!-- 组件单独：dragPitch / dragRotate 是运行期响应式 prop（组件内部 watch 并热更新） -->
    <MaptalksMap
      :center="[-0.113049, 51.498568]"
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
  </div>
</template>

<script setup lang="ts">
// 两个开关实时生效
const dragPitch = ref(true);
const dragRotate = ref(true);
</script>
