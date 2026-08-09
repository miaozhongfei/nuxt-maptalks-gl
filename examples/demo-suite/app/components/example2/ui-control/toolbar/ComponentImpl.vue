<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksToolbarControl :options="tbOpts1" />
      <MaptalksToolbarControl :options="tbOpts2" />
      <MaptalksToolbarControl :options="tbOpts3" />
      <MaptalksToolbarControl :options="tbOpts4" />
    </MaptalksMap>
    <p class="text-sm mt-2">点击测试：<b>{{ lastClicked }}</b></p>
    <p class="text-sm text-muted mt-1">MaptalksMap + MaptalksToolbarControl——4 个官网布局 Toolbar（位置/方向/子菜单）（对应官网 10.11）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// 点击日志：任意按钮/子菜单项点击后回显「xxx is clicked」
const lastClicked = ref('未点击')
const info = (s: string): void => { lastClicked.value = `${s} is clicked` }

// 官网 items 模式：menu 含 children 子菜单 + item 2/3 平级按钮
const baseItems = (): MaptalksToolbarItem[] => [
  {
    item: 'menu',
    click: () => info('menu'),
    children: [
      { item: 'child 1', click: () => info('child 1') },
      { item: 'child 2', click: () => info('child 2') },
    ],
  },
  { item: 'item 2', click: () => info('item 2') },
  { item: 'item 3', click: () => info('item 3') },
]

// 官网 4 布局：左上水平 / 左下水平+reverseMenu / 右上垂直 / 左上垂直+自定义位置
const tbOpts1: MaptalksToolbarOptions = { position: 'top-left', vertical: false, items: baseItems() }
const tbOpts2: MaptalksToolbarOptions = { position: 'bottom-left', vertical: false, reverseMenu: true, items: baseItems() }
const tbOpts3: MaptalksToolbarOptions = { position: 'top-right', vertical: true, items: baseItems() }
const tbOpts4: MaptalksToolbarOptions = { position: { top: 120, left: 20 }, vertical: true, reverseMenu: true, items: baseItems() }

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Toolbar 控件可用）' : '加载中…'))
</script>
