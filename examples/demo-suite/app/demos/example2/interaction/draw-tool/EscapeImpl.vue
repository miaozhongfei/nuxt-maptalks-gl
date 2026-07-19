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
        @click="switchMode(m)"
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
const mode = ref<string>('Point');
let drawTool: unknown = null;

function switchMode(m: string) {
  mode.value = m;
  if (!toValue(map)) return;
  void import('maptalks-gl').then((mt) => {
    const DT = (mt as unknown as {
      DrawTool: new (o: Record<string, unknown>) => { addTo: (m: unknown) => void; enable: () => void; setMode: (m: string) => void };
    }).DrawTool;
    if (drawTool) {
      (drawTool as { setMode: (m: string) => void }).setMode(m);
    } else {
      drawTool = new DT({ mode: m });
      (drawTool as { addTo: (m: unknown) => void }).addTo(toValue(map));
    }
    (drawTool as { enable: () => void }).enable();
  });
}

watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    switchMode('Point');
  },
  { once: true },
);
</script>
