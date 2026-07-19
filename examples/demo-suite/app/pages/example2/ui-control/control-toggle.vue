<template>
  <Example2DemoShell description="Zoom 控件的 show/hide 切换（对应官网 10.18）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/demos/example2/ui-control/control-toggle/ComponentImpl.vue'
import ComposableImpl from '~/demos/example2/ui-control/control-toggle/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/ui-control/control-toggle/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/ui-control/control-toggle/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
