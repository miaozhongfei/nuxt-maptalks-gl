<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">长文本列表：max-height + overflow:auto（50 行）。</p>
    </div>
    <div>
      <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">长表格：固定高度 + overflow:auto（20 行数据）。</p>
    </div>
    <div>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">混合富内容：多区块（标题+列表+文本）滚动。</p>
    </div>
    <div>
      <div ref="el4" class="relative rounded border border-default overflow-hidden" style="height: 280px" />
      <p class="text-xs text-muted mt-1">enableScrollbar:true——光标悬停内容区时滚轮滚内容、地图不缩放。</p>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 窄类型：show 参数 unknown（运行时坐标）、setContent 接受 string | HTMLElement
type IWHandle = {
  show: (c: unknown) => void
  hide: () => void
  setContent: (c: string | HTMLElement) => void
}

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

async function createIW(m: MaptalksMap, title: string, content: string, enableScrollbar?: boolean): Promise<IWHandle | null> {
  const mt = await import('maptalks-gl')
  // 原生构造器在 mt.ui.InfoWindow（非顶层 mt.InfoWindow）——逃生舱断言
  if (!mt.ui?.InfoWindow) return null
  const iw = enableScrollbar === undefined
    ? new mt.ui.InfoWindow({ title, content } as any)
    : new mt.ui.InfoWindow({ title, content, enableScrollbar } as any)
  iw.addTo(m as never)
  return iw as unknown as IWHandle
}

// —— 左上：长文本列表 ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
watch(
  () => toValue(map1),
  async (m) => {
    if (m) {
      const iw = await createIW(m, '长文本列表', LONG_TEXT)
      iw?.show([121.5057, 31.2453])
    }
  },
  { immediate: true },
)

// —— 右上：长表格 ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
watch(
  () => toValue(map2),
  async (m) => {
    if (m) {
      const iw = await createIW(m, '长表格', TABLE_HTML)
      iw?.show([121.5057, 31.2453])
    }
  },
  { immediate: true },
)

// —— 左下：混合富内容 ——
const el3 = ref<HTMLElement | null>(null)
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
watch(
  () => toValue(map3),
  async (m) => {
    if (m) {
      const iw = await createIW(m, '混合内容', MIXED_HTML)
      iw?.show([121.5057, 31.2453])
    }
  },
  { immediate: true },
)

// —— 右下：enableScrollbar ——
const el4 = ref<HTMLElement | null>(null)
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map4, { source: 'osm' })
watch(
  () => toValue(map4),
  async (m) => {
    if (m) {
      const iw = await createIW(m, 'enableScrollbar', LONG_TEXT, true)
      iw?.show([121.5057, 31.2453])
    }
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（信息窗内容可滚动）' : '加载中…'))
</script>
