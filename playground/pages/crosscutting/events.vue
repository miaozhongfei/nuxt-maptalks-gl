<template>
  <div>
    <h1>useMaptalksEvents · 事件绑定</h1>
    <p style="color: #666">把地图事件响应式绑定到处理器，组件卸载时自动解绑。点击地图查看坐标。</p>
    <p style="color: #444">
      最近点击坐标：<strong data-testid="last-click">{{ lastClick }}</strong>
    </p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

const lastClick = ref('（点击地图任意位置）');

// 绑定 click 事件；事件对象形状由 maptalks 决定，按需断言
useMaptalksEvents(map, {
  click: (e) => {
    const evt = e as { coordinate?: { x: number; y: number } };
    if (evt.coordinate) {
      lastClick.value = `${evt.coordinate.x.toFixed(4)}, ${evt.coordinate.y.toFixed(4)}`;
    }
  },
});
</script>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
