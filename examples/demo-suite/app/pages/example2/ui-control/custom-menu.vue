<template>
  <Example2DemoShell
    description="ui.Menu 自定义模式——custom HTML 叠加层（简单按钮 + 复杂表单），旧 API setMenu vs 新封装 MaptalksMenu/useMaptalksMenu（对应官网 10.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/custom-menu/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/custom-menu/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/custom-menu/EscapeImpl.vue'
import MixedImpl from '~/components/example2/ui-control/custom-menu/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
