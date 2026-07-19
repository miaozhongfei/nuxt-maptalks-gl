<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">CanvasLayer — 左上角绘制蓝色矩形画板（逃生舱）</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：useMaptalksLayer 工厂创建 CanvasLayer
useMaptalksLayer(map, (mt) => {
  const cl = new mt.CanvasLayer('canvas-demo');
  // 重写 draw 方法绘制自定义内容
  cl.draw = function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#2563eb99';
    ctx.fillRect(20, 20, 80, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.fillText('画板', 30, 45);
    cl.completeRender();
  };
  return cl;
});
</script>
