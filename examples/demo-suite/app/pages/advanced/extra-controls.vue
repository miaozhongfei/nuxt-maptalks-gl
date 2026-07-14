<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 更多控件</h1>
    <p class="text-muted mb-6">演示 ZoomControl / ScaleControl / CompassControl / AttributionControl 四种地图控件。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">ZoomControl · 缩放控件</h2></template>
        <MaptalksMap ref="map1" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksZoomControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左上角缩放按钮。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">ScaleControl · 比例尺</h2></template>
        <MaptalksMap ref="map2" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksScaleControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左下角比例尺。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">CompassControl · 指南针</h2></template>
        <MaptalksMap ref="map3" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksCompassControl />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">点击复位正北。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">AttributionControl · 版权信息</h2></template>
        <MaptalksMap ref="map4" :center="center" :zoom="13" baseLayer="osm" class="relative rounded border border-default overflow-hidden" style="height:300px">
          <MaptalksAttributionControl :options="{ content: '自定义归属：nuxt-maptalks-gl' }" />
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">左下角灰色文本标注。</span></template>
      </UCard>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 鹰眼 Overview</h2></template>
        <div ref="el5" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted overview-note">创建中…</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 图层选择 LayerSwitcher</h2></template>
        <div ref="el6" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted switcher-note">创建中…</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 逃生舱：Overview 鹰眼
const el5 = ref<HTMLElement | null>(null);
const { map: map5 } = useMaptalks(el5, { center, zoom: 13 });
useMaptalksTileLayer(map5, { source: 'osm' });
watch(() => toValue(map5), (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const Ctor = (mt.control as Record<string, unknown>)?.Overview as { new (): { addTo: (m: unknown) => void } } | undefined;
    if (typeof Ctor === 'function') {
      new Ctor().addTo(m);
      document.querySelector('.overview-note')!.textContent = 'Overview 鹰眼控件已创建。';
    } else {
      document.querySelector('.overview-note')!.textContent = '当前 maptalks-gl 未导出 control.Overview。';
    }
  });
});

// 逃生舱：LayerSwitcher 图层选择
const el6 = ref<HTMLElement | null>(null);
const { map: map6 } = useMaptalks(el6, { center, zoom: 13 });
useMaptalksTileLayer(map6, { source: 'osm' });
useMaptalksVectorLayer(map6);
watch(() => toValue(map6), (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const Ctor = (mt.control as Record<string, unknown>)?.LayerSwitcher as { new (): { addTo: (m: unknown) => void } } | undefined;
    if (typeof Ctor === 'function') {
      new Ctor().addTo(m);
      document.querySelector('.switcher-note')!.textContent = 'LayerSwitcher 图层选择控件已创建。';
    } else {
      document.querySelector('.switcher-note')!.textContent = '当前 maptalks-gl 未导出 control.LayerSwitcher。';
    }
  });
});
</script>
