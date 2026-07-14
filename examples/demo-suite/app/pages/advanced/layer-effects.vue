<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 图层特效</h1>
    <p class="text-muted mb-6">演示图层透明度、blend 模式和样式动态更新。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">图层透明度</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2 items-center"><UButton size="sm" @click="opacity=1">100%</UButton><UButton size="sm" @click="opacity=0.6">60%</UButton><UButton size="sm" @click="opacity=0.3">30%</UButton><span class="text-sm text-muted">当前：{{ Math.round(opacity * 100) }}%</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 样式覆盖</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="toggleDarkLayer()">{{ dark ? '恢复亮色瓦片' : '切换暗色瓦片' }}</UButton><span class="text-sm text-muted">原生 <code>layer.config()</code> / <code>layer.setOpacity()</code></span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · 原生 CanvasLayer</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><span class="text-sm text-muted">native new CanvasLayer() 自定义绘制。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
const { layer: l1 } = useMaptalksTileLayer(map1, { source: 'osm' });
const opacity = ref(0.6);
watch(opacity, (v) => { toValue(l1)?.setOpacity(v); }, { immediate: true });

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
const { layer: l2 } = useMaptalksTileLayer(map2, { source: 'osm' });
const dark = ref(false);
function toggleDarkLayer() {
  dark.value = !dark.value;
  const m = toValue(map2);
  const layer = toValue(l2);
  if (!m || !layer) return;
  if (dark.value) {
    layer.config({ cssFilter: 'invert(1) hue-rotate(180deg) brightness(0.8)' });
  } else {
    layer.config({ cssFilter: null });
  }
}

// 卡片 3：CanvasLayer 逃生舱
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
watch(() => toValue(map3), (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(37,99,235,0.3)';
      ctx.fillRect(0, 0, 200, 100);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.strokeRect(5, 5, 190, 90);
      ctx.fillStyle = '#2563eb';
      ctx.font = '14px sans-serif';
      ctx.fillText('Canvas 绘制', 30, 55);
    }
    const layer = new mt.CanvasLayer('canvas-demo');
    layer.config({ render: () => { layer.drawImage(canvas as CanvasImageSource, [121.47, 31.23], 200, 100); } });
    layer.addTo(m);
    layer.draw();
  });
});
</script>
