<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    />
    <p class="text-sm text-muted mt-2">
      逃生舱——createApp 子应用挂载 detached DOM → setContent(活节点)，弹框内 Vue 自动响应（对应官网
      10.10 MVVM 技巧）。
    </p>
  </div>
</template>

<script setup lang="ts">
import { createApp, h } from 'vue';
import type { App } from 'vue';

// MVVM 模型：弹框内 Vue 子应用 v-model / @click / v-for 实时驱动视图
const name = ref('Hello Maptalks');
const count = ref(1);
const btns = ref([1, 2, 3, 4, 5]);

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 官网原始技巧的 Vue 3 版：createApp 子应用渲染到 detached DOM，作为活节点交给 InfoWindow
let slotApp: App | null = null;
function buildMvvmNode(): HTMLElement {
  const mountEl = document.createElement('div');
  slotApp = createApp({
    render: () =>
      h('div', { style: 'padding:10px;min-width:180px' }, [
        h('h2', { style: 'margin:0 0 6px;font-size:16px' }, name.value),
        h('input', {
          style:
            'width:100%;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:13px;margin-bottom:8px;box-sizing:border-box',
          value: name.value,
          onInput: (e: Event) => {
            name.value = (e.target as HTMLInputElement).value;
          },
        }),
        h('div', { style: 'margin-bottom:6px' }, [
          h('span', null, `count：${count.value}`),
          h(
            'button',
            {
              style:
                'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer;margin-left:6px',
              onClick: () => {
                count.value++;
              },
            },
            'count++',
          ),
        ]),
        h(
          'div',
          { style: 'display:flex;gap:4px' },
          btns.value.map((b) =>
            h(
              'button',
              {
                style:
                  'padding:1px 6px;border:1px solid #2563eb;border-radius:3px;font-size:12px;background:#fff;cursor:pointer',
              },
              String(b),
            ),
          ),
        ),
      ]),
  });
  slotApp.mount(mountEl);
  delete mountEl.dataset.vApp;
  return mountEl;
}

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    if (!mt.ui?.InfoWindow) return;
    const iw = new mt.ui.InfoWindow({ title: 'MVVM 绑定', custom: true } as any);
    iw.addTo(m as any);
    iw.setContent(buildMvvmNode());
    iw.show([121.5057, 31.2453] as any);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (slotApp) {
    slotApp.unmount();
    slotApp = null;
  }
});
</script>
