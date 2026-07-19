<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">CanvasTileLayer — 每块瓦片上绘制蓝色半透明矩形（逃生舱）</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：useMaptalksLayer 工厂创建 CanvasTileLayer
useMaptalksLayer(map, (mt) => {
  const ctl = new mt.CanvasTileLayer('ct', {
    drawTile(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = '#2563eb33';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
  });
  return ctl;
});
</script>
