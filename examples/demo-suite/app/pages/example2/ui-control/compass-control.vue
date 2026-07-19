<template>
  <Example2DemoShell description="Compass 指北针控件（对应官网 10.15）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/demos/example2/ui-control/compass-control/ComponentImpl.vue'
import ComposableImpl from '~/demos/example2/ui-control/compass-control/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/ui-control/compass-control/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/ui-control/compass-control/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
