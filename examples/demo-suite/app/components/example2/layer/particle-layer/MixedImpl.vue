<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null);
let bound = false;

watch(
  // exposed map 是 Ref——toValue 解包取实例
  () => toValue(mc.value?.map),
  async (mv) => {
    if (!mv || bound) return;
    bound = true;
    const mt = await import('maptalks-gl');
    const m = mv;
    const center = m.getCenter();

    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    const vl = new mt.VectorLayer('v').addTo(m as never);
    new mt.Marker(center as any, {
      symbol: { markerType: 'cross', markerWidth: 10, markerHeight: 10, markerLineWidth: 2 },
    }).addTo(vl);
    new mt.Circle(center as any, 1000, {
      symbol: { lineColor: '#fff', lineWidth: 6, lineOpacity: 0.2, polygonOpacity: 0 },
    }).addTo(vl);

    const pl = new mt.ParticleLayer('p', { forceRenderOnMoving: true });
    // 原生类型未声明 getParticles（官网接口方法，模块建模已含）——逃生舱断言
    (
      pl as unknown as {
        getParticles: (t: number) => Array<{ point: unknown; r: number; color: string }>;
      }
    ).getParticles = (t: number) => {
      // coordinateToContainerPoint 建模返回 unknown——Point.add 按需窄断言
      const point = m.coordinateToContainerPoint(center) as {
        add: (x: number, y: number) => unknown;
      };
      const angle = (((t / 16) % 360) * Math.PI) / 180;
      const pxLen = m.distanceToPixel(1000, 1000);
      const r = pxLen.width;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      return [{ point: point.add(x, y), r: 4, color: 'rgb(135,196,240)' }];
    };
    pl.addTo(m as never);
  },
);

const status = computed(() =>
  toValue(mc.value?.map) ? '地图已创建（粒子沿圆周运动）' : '加载中…',
);
</script>
