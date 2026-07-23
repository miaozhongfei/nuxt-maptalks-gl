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
useMaptalksTileLayer(map, { options: tileOptions });

// CanvasLayer 叠加水印文字（maptalks-gl 代替 renderercreate 的等效方案）
useMaptalksLayer(map, (mt) => {
  const cl = new mt.CanvasLayer('wm');
  cl.draw = function (ctx: CanvasRenderingContext2D) {
    // 瓦片像素尺寸
    const T = 256;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // 在视口内按瓦片网格逐格绘制水印，模拟官网每张瓦片独立处理的效果
    for (let x = T / 2; x < w; x += T) {
      for (let y = T / 2; y < h; y += T) {
        ctx.fillText('hello maptalks', x, y);
      }
    }
    ctx.restore();
    // CanvasLayer 需要通知 maptalks 渲染完成
    (cl as unknown as { completeRender: () => void }).completeRender?.();
  };
  return cl;
});
</script>
