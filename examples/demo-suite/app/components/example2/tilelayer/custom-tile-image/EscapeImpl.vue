<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      urlTemplate 按 (x+y) 奇偶混搭两套底图 + cssFilter 添加 sepia/invert 滤镜 + CanvasLayer 叠加 "hello maptalks" 水印。
    </p>
  </div>
</template>

<script setup lang="ts">
const tileOptions = {
  urlTemplate: (x: number, y: number, z: number) => {
    const light = `https://b.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`;
    const dark = `https://b.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`;
    return (x + y) % 2 === 0 ? light : dark;
  },
  cssFilter: 'sepia(100%) invert(90%)',
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
};

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });

// 逃生舱：useMaptalksLayer 工厂同时创建 TileLayer（底图） + CanvasLayer（水印）
useMaptalksLayer(map, (mt) => new mt.TileLayer('base', tileOptions));
useMaptalksLayer(map, (mt) => {
  const cl = new mt.CanvasLayer('wm');
  cl.draw = function (ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('hello maptalks', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
    (cl as unknown as { completeRender: () => void }).completeRender?.();
  };
  return cl;
});
</script>
