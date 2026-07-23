<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      urlTemplate 函数按 (x+y) 奇偶混搭两套底图 + renderercreate 拦截 tile 加载并添加 sepia 滤镜与 "hello maptalks" 水印。
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
  attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
};

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
const { layer } = useMaptalksLayer(map, (mt) => new mt.TileLayer('base', tileOptions));

let wmCanvas: HTMLCanvasElement | null = null;
function getWmCanvas(): HTMLCanvasElement {
  if (wmCanvas) return wmCanvas;
  wmCanvas = document.createElement('canvas');
  return wmCanvas;
}
watch(() => toValue(layer), (l) => {
  const raw = l as unknown as { on?: (e: string, cb: (e: unknown) => void) => void } | null;
  raw?.on?.('renderercreate', (e) => {
    const renderer = (e as { renderer: { loadTileImage: (img: HTMLImageElement, url: string) => void } }).renderer;
    renderer.loadTileImage = function (img: HTMLImageElement, url: string) {
      const remote = new Image();
      remote.crossOrigin = 'anonymous';
      remote.addEventListener('load', () => {
        const c = getWmCanvas();
        c.width = remote.width;
        c.height = remote.height;
        const ctx = c.getContext('2d')!;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.filter = 'sepia(100%) invert(90%)';
        ctx.drawImage(remote, 0, 0);
        ctx.filter = 'none';
        ctx.fillStyle = 'white';
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('hello maptalks', c.width / 2, c.height / 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(0, 0, c.width, c.height);
        img.src = c.toDataURL('image/jpeg', 0.7);
      });
      remote.src = url;
    };
  });
}, { immediate: true });
</script>
