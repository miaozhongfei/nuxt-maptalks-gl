<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton
        v-for="m in modes"
        :key="m"
        size="sm"
        :variant="mode === m ? 'solid' : 'outline'"
        @click="setMode(m)"
      >
        {{ m }}
      </UButton>
      <UBadge variant="subtle">当前模式: {{ mode }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const;
const { tool, enable, mode, setMode } = useMaptalksDrawTool(map, { mode: 'Point' });
</script>
