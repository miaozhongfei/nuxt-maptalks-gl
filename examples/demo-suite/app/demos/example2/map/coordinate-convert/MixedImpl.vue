<template>
  <div>
    <!-- 组合：组件建图 + 坐标/事件 composable -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm font-mono mt-3 text-muted">{{ resultText || '点击地图任意位置查看坐标转换结果' }}</p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const coord = useMaptalksCoordinate();
const resultText = ref('');
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } };
    const m = map.value;
    if (!m || !ev.coordinate) return;
    const pt = coord.toContainerPoint(m, ev.coordinate) as { x: number; y: number };
    resultText.value =
      `经纬度 ${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}`
      + ` → 像素 ${Math.round(pt.x)}, ${Math.round(pt.y)}`;
  },
});
</script>
