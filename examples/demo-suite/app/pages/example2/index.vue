<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">示例2 · maptalks 官网示例对照</h1>
    <p class="text-muted mb-6">
      左侧菜单与官网示例一致（14 组 · {{ total }} 项）；每个示例提供最多 4 种实现：
      组件 / Composable / 组合 / 逃生舱。当前已实现 {{ done }} 项。
    </p>
    <UPageGrid>
      <UPageCard
        v-for="g in cards"
        :key="g.slug"
        :title="g.title"
        :description="g.description"
        :to="g.to"
      />
    </UPageGrid>
  </div>
</template>

<script setup lang="ts">
import { example2Menu } from '~/data/example2-menu';

// 每组一张卡片：标题带编号，描述显示实现进度，入口指向组内第一项
const cards = example2Menu.map((g) => {
  const doneCount = g.demos.filter((d) => d.implemented).length;
  return {
    slug: g.slug,
    title: `${g.no} ${g.title}`,
    description: `已实现 ${doneCount} / ${g.demos.length}`,
    to: `/example2/${g.slug}/${g.demos[0]?.slug ?? ''}`,
  };
});
// 全站进度统计
const total = example2Menu.reduce((n, g) => n + g.demos.length, 0);
const done = example2Menu.reduce(
  (n, g) => n + g.demos.filter((d) => d.implemented).length,
  0,
);
</script>
