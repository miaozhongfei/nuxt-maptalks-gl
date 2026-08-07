<template>
  <Example2DemoShell
    description="maptalks 内部用 Proxy 包装了 options 对象，直接赋值 xxx.options.yyy = value 即自动触发 config()——演示 centerCross / opacity / visible 三个选项的 Proxy 更新（对应官网 7.1）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/util/proxy-options/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/util/proxy-options/ComposableImpl.vue'
import MixedImpl from '~/components/example2/util/proxy-options/MixedImpl.vue'
import EscapeImpl from '~/components/example2/util/proxy-options/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
