<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 筛选操作区 -->
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" color="primary" @click="showOnly('a')">仅 kind=a（蓝）</UButton>
      <UButton size="sm" color="secondary" @click="showOnly('b')">仅 kind=b（橙）</UButton>
      <UButton size="sm" variant="outline" @click="reset">重置</UButton>
      <span class="text-sm text-muted">当前: kind={{ current }}</span>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const current = ref<string>('全部')
let collectionRef: MaptalksGeometryCollectionGeometry | null = null
let layerRef: MaptalksVectorLayer | null = null
// 一体工厂：6 个 Marker 组成 GeometryCollection（properties 交替 kind: a / b，构造器已建模）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v')
  layerRef = layer
  // 6 个 Marker：a 蓝 b 橙，分布在陆家嘴周边
  const markers = [
    new mt.Marker([121.50, 31.245], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'a' } }),
    new mt.Marker([121.512, 31.248], { symbol: { markerType: 'ellipse', markerFill: '#f97316', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'b' } }),
    new mt.Marker([121.5057, 31.24], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'a' } }),
    new mt.Marker([121.498, 31.25], { symbol: { markerType: 'ellipse', markerFill: '#f97316', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'b' } }),
    new mt.Marker([121.515, 31.242], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'a' } }),
    new mt.Marker([121.493, 31.253], { symbol: { markerType: 'ellipse', markerFill: '#f97316', markerWidth: 18, markerHeight: 18 }, properties: { kind: 'b' } }),
  ]
  const collection = new mt.GeometryCollection(markers)
  collectionRef = collection
  layer.addGeometry(collection)
  return layer
})
// filter 表达式：['==', 'kind', 'a'] 筛选 kind=a 的子几何（窄类型已建模 filter）
function showOnly(kind: string) {
  const col = collectionRef
  const l = layerRef
  if (!col || !l) return
  const filtered = col.filter(['==', 'kind', kind])
  l.clear()
  const geos = filtered.getGeometries()
  for (const g of geos) {
    l.addGeometry(g)
  }
  current.value = kind
}
// 重置：清空图层后加回原始 collection
function reset() {
  const l = layerRef
  if (!l || !collectionRef) return
  l.clear()
  l.addGeometry(collectionRef)
  current.value = '全部'
}

const status = computed(() => (isReady.value ? '地图已创建（可筛选几何）' : '加载中…'))
</script>
