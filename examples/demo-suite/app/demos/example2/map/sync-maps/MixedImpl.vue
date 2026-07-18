<template>
  <div>
    <!-- 组合：两张组件地图（name prop 登记注册表）+ useMaptalksSync 按名同步 -->
    <div class="grid grid-cols-2 gap-3">
      <MaptalksMap
        name="sync-m-a"
        :center="[-0.113049, 51.498568]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <MaptalksMap
        name="sync-m-b"
        :center="[-0.113049, 51.498568]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
    </div>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="enable()">开启同步</UButton>
      <UButton size="sm" color="neutral" @click="disable()">关闭同步</UButton>
      <UBadge :color="isEnabled ? 'success' : 'neutral'" variant="subtle">
        {{ isEnabled ? '同步中' : '未同步' }}
      </UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const { enable, disable, isEnabled } = useMaptalksSync(['sync-m-a', 'sync-m-b']);
</script>
