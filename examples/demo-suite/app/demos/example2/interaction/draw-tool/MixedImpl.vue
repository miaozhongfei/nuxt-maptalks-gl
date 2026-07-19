<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
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
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const;
const { enable, mode, setMode } = useMaptalksDrawTool(map, { mode: 'Point' });
</script>
