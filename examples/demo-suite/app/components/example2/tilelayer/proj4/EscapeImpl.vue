<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      用 proj4 重新实现 EPSG:3857 投影对象——与内置投影等价，但完全由用户代码控制，说明 maptalks 投影系统可被 proj4 自定义。
      投影对象的 project/unproject 必须返回 maptalks Coordinate 实例，故本例完全手动建图。
    </p>
  </div>
</template>

<script setup lang="ts">
import proj4 from 'proj4';

const el = ref<HTMLElement | null>(null);
let mapInstance: { remove: () => void } | null = null;

onMounted(async () => {
  const mt = await import('maptalks-gl');
  if (!el.value) return;

  // proj4 EPSG:3857 投影定义（Web Mercator）
  const proj = proj4('EPSG:4326', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');

  // 自定义 projection 对象——逃生舱使用 new mt.Coordinate() 构造返回值
  const projection = {
    code: 'proj4-merc',
    project: (c: { toArray: () => number[] }) => {
      const pc = proj.forward(c.toArray());
      return new mt.Coordinate(pc[0], pc[1]);
    },
    unproject: (pc: { toArray: () => number[] }) => {
      const c = proj.inverse(pc.toArray());
      return new mt.Coordinate(c[0], c[1]);
    },
    measure: 'EPSG:4326',
  };

  const resolutions = [
    156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512,
    9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282,
    611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625,
    38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516,
    2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974,
  ];

  const map = new mt.Map(el.value, {
    center: [121.5057, 31.2453],
    zoom: 13,
    spatialReference: {
      projection,
      resolutions,
      fullExtent: { top: 6378137 * Math.PI, left: -6378137 * Math.PI, bottom: -6378137 * Math.PI, right: 6378137 * Math.PI },
    },
  } as never);
  mapInstance = map as unknown as { remove: () => void };

  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }).addTo(map);
});

onBeforeUnmount(() => {
  mapInstance?.remove();
  mapInstance = null;
});
</script>
