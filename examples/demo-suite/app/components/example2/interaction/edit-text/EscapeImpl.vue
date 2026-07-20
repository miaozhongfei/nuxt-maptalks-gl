<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UInput v-model="content" size="sm" class="w-64" placeholder="输入新文本" />
      <UButton size="sm" variant="outline" @click="updateText">更新文本</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

const content = ref('点击编辑');
let textGeo: unknown = null;

useMaptalksGeometry(layer, (mt) => {
  textGeo = new mt.TextBox(content.value, [121.5057, 31.2453], 200, 50, {
    symbol: { textFaceName: 'sans-serif', textFill: '#1f2937', textSize: 16, boxFill: '#e0e7ff', boxOpacity: 0.8 },
  });
  return textGeo as any;
});

function updateText() {
  if (textGeo) {
    (textGeo as { setContent: (c: string) => void }).setContent(content.value);
  }
}
</script>
