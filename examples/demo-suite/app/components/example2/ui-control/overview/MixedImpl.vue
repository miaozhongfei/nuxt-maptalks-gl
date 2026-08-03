<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :pitch="45"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-2 flex items-center gap-2">
      <!-- 模板中 ref 自动解包：control 直接是 MaptalksOverviewControl | null，无需 .value -->
      <UButton size="sm" variant="outline" @click="() => { control?.maxmize() }">展开鹰眼</UButton>
      <UButton size="sm" variant="outline" @click="() => { control?.minimize() }">收起鹰眼</UButton>
    </div>
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksOverview——鹰眼小地图 + maxmize/minimize 按钮（对应官网 10.13）。</p>
  </div>
</template>

<script setup lang="ts">
// 鹰眼配置：右下角 + 小地图尺寸 + 默认展开
const ovOpts: MaptalksOverviewOptions = { position: 'bottom-right', size: [150, 110], maximize: true }

// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { control } = useMaptalksOverview(map, { options: ovOpts })
</script>
