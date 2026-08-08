<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap ref="mc1" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="true" :options="opts1" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">长文本列表：max-height + overflow:auto（50 行）。</p>
    </div>
    <div>
      <MaptalksMap ref="mc2" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="true" :options="opts2" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">长表格：固定高度 + overflow:auto（20 行数据）。</p>
    </div>
    <div>
      <MaptalksMap ref="mc3" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="true" :options="opts3" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">混合富内容：多区块（标题+列表+文本）滚动。</p>
    </div>
    <div>
      <MaptalksMap ref="mc4" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="true" :options="opts4" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">enableScrollbar:true——光标悬停内容区时滚轮滚内容、地图不缩放。</p>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const LONG_TEXT = [
  '<div style="max-height:200px;overflow:auto;padding:4px">',
  ...Array.from({ length: 50 }, (_, i) => `<p style="margin:2px 0;font-size:13px">第 ${i + 1} 行：InfoWindow 滚动内容示例</p>`),
  '</div>',
].join('')

const TABLE_HTML = [
  '<div style="max-height:200px;overflow:auto;padding:4px">',
  '<table style="border-collapse:collapse;font-size:12px;width:100%">',
  '<tr style="background:#2563eb;color:#fff"><th style="padding:2px 6px">ID</th><th style="padding:2px 6px">名称</th><th style="padding:2px 6px">数值</th></tr>',
  ...Array.from({ length: 20 }, (_, i) => `<tr${i % 2 ? ' style="background:#f3f4f6"' : ''}><td style="padding:2px 6px">${i + 1}</td><td style="padding:2px 6px">项目 ${String.fromCodePoint(65 + (i % 26))}</td><td style="padding:2px 6px">${(Math.random() * 100).toFixed(1)}</td></tr>`),
  '</table></div>',
].join('')

const MIXED_HTML = [
  '<div style="max-height:200px;overflow:auto;padding:8px;font-size:13px">',
  '<div style="height:8px;background:linear-gradient(90deg,#2563eb,#10b981);border-radius:4px;margin-bottom:8px"></div>',
  '<div style="font-weight:600;margin-bottom:6px">综合信息面板</div>',
  '<ul style="margin:0 0 8px 16px;padding:0;color:#374151">',
  '<li>坐标：121.5057, 31.2453</li><li>缩放级别：13</li><li>底图：OSM</li>',
  '</ul>',
  ...Array.from({ length: 20 }, (_, i) => `<p style="margin:4px 0;color:#6b7280">区块 ${i + 1}：补充说明文本内容，用于撑高滚动区域。</p>`),
  '</div>',
].join('')

const mc1 = ref<MaptalksMapExposed | null>(null)
const mc2 = ref<MaptalksMapExposed | null>(null)
const mc3 = ref<MaptalksMapExposed | null>(null)
const mc4 = ref<MaptalksMapExposed | null>(null)

const opts1: MaptalksInfoWindowOptions = { title: '长文本列表', content: LONG_TEXT }
const opts2: MaptalksInfoWindowOptions = { title: '长表格', content: TABLE_HTML }
const opts3: MaptalksInfoWindowOptions = { title: '混合内容', content: MIXED_HTML }
const opts4: MaptalksInfoWindowOptions = { title: 'enableScrollbar', content: LONG_TEXT, enableScrollbar: true }

const status = computed(() => (toValue(mc1.value?.map) ? '地图已创建（信息窗内容可滚动）' : '加载中…'))
</script>
