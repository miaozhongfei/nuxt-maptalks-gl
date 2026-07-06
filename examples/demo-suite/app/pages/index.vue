<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">@lacqjs/nuxt-maptalks-gl 示例合集</h1>
    <p class="text-muted mb-6">
      覆盖全部 26 组件 + 40 composable，并含逃生舱进阶示例。左侧按「组件单独 / composable 单独 / 组合 / 进阶」组织。
    </p>
    <UPageGrid>
      <UPageCard
        v-for="c in cards"
        :key="c.to"
        :title="c.title"
        :description="c.description"
        :to="c.to"
      />
    </UPageGrid>
  </div>
</template>

<script setup lang="ts">
// 首页导航卡片（每个模式一张，指向该组第一页）
const cards = [
  { title: '组件单独示例', description: '声明式组件逐类演示', to: '/components/layers' },
  { title: 'Composable 单独示例', description: 'use* 逐类演示', to: '/composables/core' },
  { title: '组合示例', description: '组件/composable/混合三种组合', to: '/combos/components-combo' },
  { title: '进阶·逃生舱', description: '原生 API 补官网能力', to: '/advanced/altitude-3d' },
];
</script>
