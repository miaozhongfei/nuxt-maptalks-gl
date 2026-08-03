<template>
  <Example2DemoShell
    description="Toolbar 控件——4 个官网布局（位置/方向/子菜单）+ 点击日志，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.11）。"
    :tabs="tabs"
  />
</template>

<style>
/* 恢复 maptalks 原生 content-box：Tailwind preflight 的 border-box 使 dropMenu/li 宽度高度缩水
   （dropMenu 少 20px 宽度、li 少 2px 高度），与 JS 硬编码的偏移/定位不匹配，
   导致子菜单与 menu 之间出现空隙（鼠标移入即触发 mouseout 关闭） */
.maptalks-dropMenu,
.maptalks-dropMenu *,
.maptalks-toolbar-vertical li,
.maptalks-toolbar-horizonal li {
  box-sizing: content-box;
}
</style>

<script setup lang="ts">
import ComponentImpl from '~/components/example2/ui-control/toolbar/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/ui-control/toolbar/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/ui-control/toolbar/EscapeImpl.vue';
import MixedImpl from '~/components/example2/ui-control/toolbar/MixedImpl.vue';
import type { DemoTab } from '~/data/example2-menu';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
