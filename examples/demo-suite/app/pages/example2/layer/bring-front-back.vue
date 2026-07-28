<template>
  <Example2DemoShell
    description="bringToFront / bringToBack 调整图层叠加顺序（对应官网 6.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/layer/bring-front-back/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/layer/bring-front-back/ComposableImpl.vue'
import MixedImpl from '~/components/example2/layer/bring-front-back/MixedImpl.vue'
import EscapeImpl from '~/components/example2/layer/bring-front-back/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
