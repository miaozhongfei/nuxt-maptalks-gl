<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2">
      点击测试：<b>{{ lastClicked }}</b>
    </p>
    <p class="text-sm text-muted mt-1">
      逃生舱——官网原生方式：mt.control.Toolbar 直建 4 个官网布局（位置/方向/子菜单）（对应官网
      10.11）。
    </p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const lastClicked = ref('未点击');

const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    // 官网 items 模式：menu 含 children 子菜单 + item 2/3 平级按钮，点击回显日志
    const items = [
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
    ];
    // 官网 4 布局：左上水平 / 左下水平+reverseMenu / 右上垂直 / 左上垂直+自定义位置
    // cssName 供页面 CSS 定向覆盖子菜单定位（消除 maptalks 原生 22px 间距导致的 hover 中断）
    new mt.control.Toolbar({ position: 'top-left', vertical: false, items }).addTo(m as any);
    new mt.control.Toolbar({
      position: 'bottom-left',
      vertical: false,
      reverseMenu: true,
      items,
    }).addTo(m as any);
    new mt.control.Toolbar({ position: 'top-right', vertical: true, cssName: 'tb-v-left', items }).addTo(m as any);
    new mt.control.Toolbar({
      position: { top: 120, left: 20 },
      vertical: true,
      reverseMenu: true,
      cssName: 'tb-v-right',
      items,
    }).addTo(m as any);
  },
  { immediate: true },
);

// 点击日志：任意按钮/子菜单项点击后回显「xxx is clicked」
function info(s: string): void {
  lastClicked.value = `${s} is clicked`;
}
</script>
