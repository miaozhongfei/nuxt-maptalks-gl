<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">字符串内容：new mt.ui.InfoWindow({ content })。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle1">{{
        show1 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        自定义内容：new mt.ui.InfoWindow({ custom: true }) + 手建 DOM 计数器。
      </p>
      <UButton size="xs" variant="outline" class="mt-1" @click="toggle2">{{
        show2 ? '隐藏' : '显示'
      }}</UButton>
    </div>
    <div>
      <div
        ref="el3"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">字符串内容 + 事件日志。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events3" :key="i">{{ e }}</div>
      </div>
    </div>
    <div>
      <div
        ref="el4"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">自定义内容：手建 DOM 输入框 + 飞行。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events4" :key="i">{{ e }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const show1 = ref(true);
const show2 = ref(true);

// —— 左上：字符串内容 ——
const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
let iw1: { show(c: unknown): void; hide(): void } | null = null;
watch(
  () => toValue(map1),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    const iw = new mt.ui.InfoWindow({
      title: '字符串内容',
      content: '<div style="padding:8px">字符串 InfoWindow</div>',
    } as any);
    iw.addTo(m as any);
    iw.show([121.5057, 31.2453] as any);
    iw1 = iw;
  },
  { immediate: true },
);
function toggle1() {
  show1.value = !show1.value;
  if (show1.value) iw1?.show([121.5057, 31.2453]);
  else iw1?.hide();
}

// —— 右上：手建 DOM 计数器 ——
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
let iw2: { show(c: unknown): void; hide(): void } | null = null;
let count2 = 0;
function counterEl(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div');
  d.style.cssText = 'padding:8px;min-width:140px';
  const lbl = document.createElement('div');
  lbl.textContent = '计数器：0';
  lbl.style.cssText = 'font-size:14px;margin-bottom:6px';
  const btn = document.createElement('button');
  btn.textContent = '点击 +1';
  btn.style.cssText =
    'padding:2px 10px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer';
  btn.addEventListener('click', () => {
    count2++;
    lbl.textContent = `计数器：${count2}`;
  });
  d.append(lbl, btn);
  return d;
}
watch(
  () => toValue(map2),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    const iw = new mt.ui.InfoWindow({ title: '自定义内容', custom: true } as any);
    iw.addTo(m as any);
    iw.setContent(counterEl() ?? '');
    iw.show([121.5057, 31.2453] as any);
    iw2 = iw;
  },
  { immediate: true },
);
function toggle2() {
  show2.value = !show2.value;
  if (show2.value) iw2?.show([121.5057, 31.2453]);
  else iw2?.hide();
}

// —— 左下：字符串 + 事件日志 ——
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const events3 = ref<string[]>([]);
watch(
  () => toValue(map3),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    const iw = new mt.ui.InfoWindow({
      title: '事件日志',
      content: '<div style="padding:8px">查看下方事件日志</div>',
    } as any);
    iw.on('showstart', () => {
      events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`);
    });
    iw.on('showend', () => {
      events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`);
    });
    iw.addTo(m as any);
    iw.show([121.5057, 31.2453] as any);
  },
  { immediate: true },
);

// —— 右下：手建 DOM 输入框 + 飞行 ——
const el4 = ref<HTMLElement | null>(null);
const { map: map4 } = useMaptalks(el4, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map4, { source: 'osm' });
const events4 = ref<string[]>([]);
watch(
  () => toValue(map4),
  async (m) => {
    if (!m) return;
    const mt = await import('maptalks-gl');
    const iw = new mt.ui.InfoWindow({ title: '坐标飞行', custom: true } as any);
    const d = document.createElement('div');
    d.style.cssText = 'padding:4px;min-width:180px';
    const lbl = document.createElement('div');
    lbl.textContent = '输入坐标（如 121.5,31.2）：';
    lbl.style.cssText = 'font-size:12px;margin-bottom:4px;color:#666';
    const inp = document.createElement('input');
    inp.style.cssText =
      'width:100%;padding:3px 6px;border:1px solid #ccc;border-radius:3px;font-size:13px;margin-bottom:4px;box-sizing:border-box';
    const btn = document.createElement('button');
    btn.textContent = '飞行';
    btn.style.cssText =
      'width:100%;padding:3px 0;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;font-size:13px;cursor:pointer';
    btn.addEventListener('click', () => {
      const parts = inp.value.split(',').map(Number) as [number, number];
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && m) {
        m.flyTo({ center: parts, zoom: 16 });
        events4.value.unshift(`flyTo ${parts.join(',')} ${new Date().toLocaleTimeString()}`);
      }
    });
    d.append(lbl, inp, btn);
    iw.addTo(m as any);
    iw.setContent(d);
    iw.show([121.5057, 31.2453] as any);
  },
  { immediate: true },
);
</script>
