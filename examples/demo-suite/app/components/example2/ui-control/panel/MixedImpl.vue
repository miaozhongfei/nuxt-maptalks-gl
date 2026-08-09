<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksPanel——2 个官网布局面板（文本可拖拽 / 自定义 HTML）（对应官网 10.12）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 官网 2 布局：右上文本面板（拖拽 + 关闭按钮）/ 右下自定义 HTML 面板（拖拽）
const pOpts1: MaptalksPanelOptions = {
  position: 'top-right',
  draggable: true,
  custom: false,
  content: 'A draggable text panel.',
  closeButton: true,
}
const pOpts2: MaptalksPanelOptions = {
  position: 'bottom-right',
  draggable: true,
  custom: true,
  content: '<div style="background:rgba(135,196,240,0.8);width:200px;height:100px;border:2px #fff solid;padding:10px;color:#fff">A custom panel.<br><input type="text" value="a text input"/></div>',
}

// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

useMaptalksPanel(map, { options: pOpts1 })
useMaptalksPanel(map, { options: pOpts2 })

const status = computed(() => (map.value ? '地图已创建（Panel 可用）' : '加载中…'))
</script>
