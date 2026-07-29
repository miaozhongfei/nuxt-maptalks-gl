<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return;
    const mt = await import('maptalks-gl');
    const cl = new mt.CanvasLayer('c', { forceRenderOnMoving: true, forceRenderOnZooming: true });
    cl.prepareToDraw = () => ['Hello', 'maptalks'];
    cl.draw = function (
      this: any,
      ctx: CanvasRenderingContext2D,
      _view: unknown,
      p1: string,
      p2: string,
    ) {
      const size = mv.getSize();
      const str = `${p1}, ${p2}`;
      ctx.fillStyle = '#f00';
      ctx.font = 'bolder 50px sans-serif';
      const metrics = ctx.measureText(str);
      ctx.fillText(str, size.width / 2 - metrics.width / 2, size.height / 2);
      this.completeRender();
    };
    ;(cl as unknown as { drawOnInteracting: (...args: unknown[]) => void }).drawOnInteracting = cl.draw;
    cl.addTo(mv as any);
  },
);
</script>
