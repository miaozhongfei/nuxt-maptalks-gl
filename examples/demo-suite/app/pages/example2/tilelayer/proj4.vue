<template>
  <!-- 2.16 Proj4js自定义投影底图 -->
  <Example2DemoShell
    description="用 proj4 重新实现 EPSG:3857 投影对象——与内置投影等价，说明 maptalks 投影系统可被完全自定义（对应官网 2.16）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/tilelayer/proj4/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/proj4/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/proj4/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
