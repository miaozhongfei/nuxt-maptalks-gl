<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">{{ hit.demo.no }} {{ hit.demo.title }}</h1>
    <p class="text-muted mb-4">分组：{{ hit.group.no }} {{ hit.group.title }}</p>
    <UAlert
      color="warning"
      variant="subtle"
      icon="i-lucide-construction"
      title="建设中"
      description="该示例尚未实现，将按批次逐组补齐。可先浏览已实现的「地图」组。"
    />
  </div>
</template>

<script setup lang="ts">
import { findExample2Demo } from '~/data/example2-menu';

// 兜底页：菜单配置即路由白名单——配置中不存在的路径一律 404
const route = useRoute();
const found = findExample2Demo(route.path);
if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}
const hit = found;
</script>
