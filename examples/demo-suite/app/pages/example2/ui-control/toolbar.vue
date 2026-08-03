<template>
  <Example2DemoShell
    description="Toolbar 控件——4 个官网布局（位置/方向/子菜单）+ 点击日志，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.11）。"
    :tabs="tabs"
  />
</template>

<style>
/* 恢复 maptalks 原生 content-box：Tailwind preflight 的 border-box 使 dropMenu 宽度缩水 20px，
   与 JS 硬编码的 -(宽+22) 偏移不匹配，导致子菜单与 menu 之间出现空隙（鼠标移入即触发 mouseout 关闭） */
.maptalks-dropMenu,
.maptalks-dropMenu * {
  box-sizing: content-box;
}
/* 水平 Toolbar：子菜单贴 li 底部（top-left），消除 top:29px 与 li 高 28px 的 2px 缝隙 */
.tb-h-down li .maptalks-dropMenu {
  top: 100% !important;
  bottom: auto !important;
}
/* 水平 Toolbar（reverse）：子菜单贴 li 顶部（bottom-left，向上弹），消除 1px 缝隙 */
.tb-h-up li .maptalks-dropMenu {
  bottom: calc(100% - 2px) !important;
  top: auto !important;
}
/* 垂直 Toolbar：子菜单贴 li 右缘（top-left 区域），消除 JS 硬编码 22px 间距导致的 hover 中断 */
.tb-v-right li .maptalks-dropMenu {
  top: -1px !important;
  right: auto !important;
  left: calc(100% + 1px) !important;
}
/* 垂直 Toolbar（top-right）：子菜单贴 li 左缘，防溢出地图右边界 */
.tb-v-left li .maptalks-dropMenu {
  top: -1px !important;
  left: auto !important;
  right: calc(100% + 1px) !important;
}
</style>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/toolbar/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/toolbar/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/toolbar/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/toolbar/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>

