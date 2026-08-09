<template>
  <!-- 2.21 增大空间参考的maxZoom -->
  <Example2DemoShell
    description="扩展 resolutions 到 22 级 + maxAvailableZoom 超采样，突破默认 maxZoom（对应官网 2.21）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/tilelayer/max-zoom-extend/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/tilelayer/max-zoom-extend/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/max-zoom-extend/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/max-zoom-extend/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
