<template>
  <Example2DemoShell
    description="Marker 几何体右键菜单——旧 API (geo.setMenu()) vs 新封装 (MaptalksGeometryMenu / useMaptalksGeometryMenu)（对应官网 10.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/geometry-menu/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/geometry-menu/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/geometry-menu/EscapeImpl.vue'
import MixedImpl from '~/components/example2/ui-control/geometry-menu/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
