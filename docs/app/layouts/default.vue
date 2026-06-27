<script setup lang="ts">
import type { Collections } from '@nuxt/content';
import { withLeadingSlash } from 'ufo';

/** TOC 链接节点的最小结构 */
interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

const route = useRoute();
const { locale, locales, setLocale, t } = useI18n();
const localePath = useLocalePath();
const colorMode = useColorMode();

/** 主题切换：点击处圆形扩散动画（View Transition 降级方案） */
function toggleColorMode(e: MouseEvent) {
  const next = colorMode.preference === 'dark' ? 'light' : 'dark';

  // 取当前（旧主题）背景色
  const oldBg = getComputedStyle(document.body).backgroundColor;

  // 直接切换到新主题
  colorMode.preference = next;

  // 等新主题 CSS 生效后，用旧主题色创建 overlay 覆盖全屏
  requestAnimationFrame(() => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.setProperty('--x', x);
    overlay.style.setProperty('--y', y);
    overlay.style.background = oldBg;
    overlay.style.clipPath = `circle(150% at ${x} ${y})`;
    document.body.append(overlay);

    // 动画：从全屏缩到点击处（reveal 新主题）
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(0 at ${x} ${y})`;
    });

    overlay.addEventListener('transitionend', () => overlay.remove());
  });
}

const availableLocales = computed(() =>
  locales.value.map((l) => ({ label: l.name ?? l.code, value: l.code })),
);

// 与 catch-all 页面共享数据，但用不同 key 前缀（'toc-' vs 'page-'）避免 "Incompatible options" 警告
const slug = computed(() => {
  const segments = ((route.params.slug as string[]) || []).filter(Boolean);
  return withLeadingSlash(segments.join('/'));
});

const pageKey = computed(() => 'toc-' + locale.value + '-' + slug.value);

const { data: page } = await useAsyncData(
  pageKey,
  async () => {
    const collection = ('content_' + locale.value) as keyof Collections;
    return (await queryCollection(collection).path(slug.value).first()) || null;
  },
  { watch: [locale, slug] },
);

const tocLinks = computed<TocLink[]>(() => {
  const body = (page.value as unknown as { body?: { toc?: { links?: TocLink[] } } } | null)?.body;
  return body?.toc?.links ?? [];
});

const mainRef = ref<HTMLElement>();

/** 点击 TOC 项时平滑滚动到对应标题 */
function onTocMove(id: string) {
  const el = document.querySelector(`#${id}`) as HTMLElement | null;
  if (el && mainRef.value) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

watch(
  () => route.path,
  () => {
    nextTick(() => {
      if (mainRef.value) {
        mainRef.value.scrollTop = 0;
      }
    });
  },
);

// 侧边栏分组（6 组），label 为 i18n key、to 为各章节路径
const sidebarGroups = [
  {
    label: 'sidebar.welcome',
    defaultOpen: true,
    items: [
      { label: 'sidebar.environment', to: '/guide/environment' },
      { label: 'sidebar.installation', to: '/guide/installation' },
      { label: 'sidebar.first-map', to: '/guide/first-map' },
    ],
  },
  {
    label: 'sidebar.core',
    defaultOpen: false,
    items: [
      { label: 'sidebar.use-maptalks', to: '/guide/use-maptalks' },
      { label: 'sidebar.use-maptalks-layer', to: '/guide/use-maptalks-layer' },
    ],
  },
  {
    label: 'sidebar.multi',
    defaultOpen: false,
    items: [
      { label: 'sidebar.named-instance', to: '/guide/multi/named-instance' },
      { label: 'sidebar.use-maptalks-instance', to: '/guide/multi/use-maptalks-instance' },
      { label: 'sidebar.use-maptalks-registry', to: '/guide/multi/use-maptalks-registry' },
    ],
  },
  {
    label: 'sidebar.crosscutting',
    defaultOpen: false,
    items: [
      { label: 'sidebar.use-maptalks-events', to: '/guide/crosscutting/use-maptalks-events' },
      { label: 'sidebar.use-maptalks-camera', to: '/guide/crosscutting/use-maptalks-camera' },
      {
        label: 'sidebar.use-maptalks-coordinate',
        to: '/guide/crosscutting/use-maptalks-coordinate',
      },
      { label: 'sidebar.use-maptalks-draw-tool', to: '/guide/crosscutting/use-maptalks-draw-tool' },
      { label: 'sidebar.use-maptalks-source', to: '/guide/crosscutting/use-maptalks-source' },
    ],
  },
  {
    label: 'sidebar.presets',
    defaultOpen: false,
    items: [
      { label: 'sidebar.tile-layer', to: '/guide/presets/use-maptalks-tile-layer' },
      { label: 'sidebar.vector-tile-layer', to: '/guide/presets/use-maptalks-vector-tile-layer' },
      { label: 'sidebar.group-gl-layer', to: '/guide/presets/use-maptalks-group-gl-layer' },
      { label: 'sidebar.gltf-layer', to: '/guide/presets/use-maptalks-gltf-layer' },
      { label: 'sidebar.signed-source', to: '/advanced/signed-source' },
    ],
  },
  {
    label: 'sidebar.appendix',
    defaultOpen: false,
    items: [
      { label: 'sidebar.api-reference', to: '/appendix/api-reference' },
      { label: 'sidebar.faq', to: '/appendix/faq' },
      { label: 'sidebar.config-templates', to: '/appendix/config-templates' },
    ],
  },
];

// UNavigationMenu 格式：根据当前路由自动展开所在分组
const navItems = computed(() => {
  const currentPath = route.path.replace(/^\/(en|fa)/u, '') || '/';
  let hasOpen = false;
  const groups = sidebarGroups.map((group) => {
    const open = group.items.some((item) => currentPath.startsWith(item.to));
    if (open) hasOpen = true;
    return {
      label: t(group.label),
      defaultOpen: open,
      children: group.items.map((item) => ({
        label: t(item.label),
        to: localePath(item.to),
      })),
    };
  });
  // 首页或无匹配时展开第一组
  if (!hasOpen && groups.length > 0) {
    groups[0].defaultOpen = true;
  }
  return groups;
});
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg">
          <UIcon name="i-lucide-map" class="w-5 h-5" />
          <span>Nuxt Maptalks GL</span>
        </NuxtLink>
      </template>
      <template #right>
        <UButton color="neutral" variant="ghost" size="sm" @click="toggleColorMode($event)">
          <UIcon
            :name="colorMode.preference === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            class="w-4 h-4"
          />
        </UButton>
        <SearchDialog />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          to="https://github.com/miaozhongfei/nuxt-maptalks-gl"
          target="_blank"
        >
          <UIcon name="i-simple-icons:github" class="w-4 h-4" />
        </UButton>
        <USelect
          :model-value="locale"
          :items="availableLocales"
          size="sm"
          class="w-32"
          @update:model-value="(v: string) => setLocale(v)"
        />
      </template>
    </UHeader>

    <UContainer>
      <div class="flex gap-8 h-[calc(100vh-var(--ui-header-height))]">
        <aside class="hidden lg:block w-56 flex-shrink-0 overflow-y-auto py-4 scrollbar-hide">
          <UNavigationMenu :items="navItems" orientation="vertical" class="text-sm" highlight />
        </aside>

        <main
          ref="mainRef"
          class="flex-1 min-w-0 overflow-y-auto py-8 scrollbar-hide scroll-smooth"
        >
          <slot />
        </main>

        <aside v-if="tocLinks?.length" class="hidden xl:block w-56 flex-shrink-0 py-8">
          <UContentToc :links="tocLinks" :title="$t('common.toc')" @move="onTocMove" />
        </aside>
      </div>
    </UContainer>
  </UApp>
</template>
