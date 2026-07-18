<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <USwitch v-model="dragPitch" label="dragPitch" />
      <USwitch v-model="dragRotate" label="dragRotate" />
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

const dragPitch = ref(true);
const dragRotate = ref(true);
// 逃生舱：原生 map.config() 热更新任意 option
watch([dragPitch, dragRotate], ([p, r]) => {
  const m = map.value as unknown as { config: (o: Record<string, unknown>) => void } | null;
  m?.config({ dragPitch: p, dragRotate: r });
});
</script>
