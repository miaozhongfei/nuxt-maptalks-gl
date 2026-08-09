<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton
        v-for="m in modes"
        :key="m"
        size="xs"
        :variant="mode === m ? 'solid' : 'outline'"
        @click="switchMode(m)"
        >{{ m }}</UButton
      >
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="disable">禁用</UButton>
      <UButton size="xs" variant="outline" @click="enable">启用</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const;
const mode = ref('Point');

let dt: {
  enable: () => void;
  disable: () => void;
  setMode: (m: string) => void;
  addTo: (target: unknown) => void;
} | null = null;

// 逃生舱：map 就绪后直调原生 maptalks.DrawTool
type RawDrawTool = {
  enable: () => void;
  disable: () => void;
  setMode: (m: string) => void;
  addTo: (target: unknown) => void;
};
type RawMt = { DrawTool?: new (opts?: Record<string, unknown>) => RawDrawTool };

watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    import('maptalks-gl').then((mt) => {
      // 原生 DrawTool.addTo(map: Map) 与窄类型签名逆变不兼容——双重断言
      const Ctor = (mt as unknown as RawMt).DrawTool;
      if (!Ctor) return;
      dt = new Ctor({ mode: mode.value });
      dt.addTo(m);
      dt.enable();
    });
  },
  { once: true },
);

function switchMode(m: string) {
  mode.value = m;
  dt?.setMode(m);
  dt?.enable();
}

function enable() {
  dt?.enable();
}
function disable() {
  dt?.disable();
}

const status = computed(() => (isReady.value ? '地图已创建（选择模式绘制图形）' : '加载中…'));
</script>
