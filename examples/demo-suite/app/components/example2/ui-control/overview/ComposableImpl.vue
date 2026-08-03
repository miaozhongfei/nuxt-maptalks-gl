<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-2 flex items-center gap-2">
      <!-- 模板中 ref 自动解包：control 直接是 MaptalksOverviewControl | null，无需 .value -->
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            control?.maxmize();
          }
        "
        >展开鹰眼</UButton
      >
      <UButton
        size="sm"
        variant="outline"
        @click="
          () => {
            control?.minimize();
          }
        "
        >收起鹰眼</UButton
      >
    </div>
    <p class="text-sm text-muted mt-2">
      useMaptalks + useMaptalksOverview——鹰眼小地图 + maxmize/minimize 按钮（对应官网 10.13）。
    </p>
  </div>
</template>

<script setup lang="ts">
// 鹰眼配置：右下角 + 小地图尺寸 + 默认展开
const ovOpts: MaptalksOverviewOptions = {
  position: 'bottom-right',
  size: [150, 110],
  maximize: true,
};

const el = ref<HTMLElement | null>(null);
// baseLayer 走 useMaptalks 参数（setBaseLayer）——Overview 鹰眼需 getBaseLayer() 复制底图
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 45, baseLayer: 'osm' });
// control 为窄类型 MaptalksOverviewControl，maxmize/minimize 直接可用
const { control } = useMaptalksOverview(map, { options: ovOpts });
</script>
