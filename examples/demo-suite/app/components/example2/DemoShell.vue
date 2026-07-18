<template>
  <div>
    <div class="flex items-center gap-3 mb-1 flex-wrap">
      <h1 class="text-2xl font-bold">{{ heading }}</h1>
      <UBadge color="primary" variant="subtle">本示例支持 {{ tabs.length }} 种实现</UBadge>
    </div>
    <p v-if="description" class="text-muted mb-4">{{ description }}</p>

    <UTabs
      :items="items"
      :unmount-on-hide="true"
      variant="link"
      class="w-full"
    >
      <!-- 每个实现方式一个具名插槽；unmount-on-hide 确保切换 tab 即销毁旧地图实例 -->
      <template v-for="t in tabs" :key="t.key" #[t.key]>
        <component :is="t.comp" class="mt-4" />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import type { DemoTab } from '~/data/example2-menu';
import { findExample2Demo } from '~/data/example2-menu';

const props = defineProps<{
  /** 本示例可行的实现方式集合（政策：能做几种做几种，逃生舱保底） */
  tabs: DemoTab[];
  /** 页首一句话说明（对应官网示例的意图描述） */
  description?: string;
}>();

// 从菜单配置反查编号与标题，页面无需重复维护
const route = useRoute();
const heading = computed(() => {
  const hit = findExample2Demo(route.path);
  return hit ? `${hit.demo.no} ${hit.demo.title}` : '示例';
});

// DemoTab -> TabsItem：key 同时充当插槽名与 value
const items = computed<TabsItem[]>(() =>
  props.tabs.map((t) => ({ label: t.label, slot: t.key, value: t.key })),
);
</script>
