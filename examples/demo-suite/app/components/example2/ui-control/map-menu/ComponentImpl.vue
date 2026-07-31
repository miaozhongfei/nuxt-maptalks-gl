<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap
        ref="mc1"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">旧 API：watch → map.setMenu({ items })——标准模式。</p>
    </div>
    <div>
      <MaptalksMap
        ref="mc2"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksMenu :options="menuOpts2" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装：&lt;MaptalksMenu&gt; 组件——标准模式。</p>
    </div>
    <div>
      <MaptalksMap
        ref="mc3"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      />
      <p class="text-xs text-muted mt-1">
        旧 API：watch → map.setMenu({ custom: true })——自定义 HTML。
      </p>
    </div>
    <div>
      <MaptalksMap
        ref="mc4"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksMenu :options="menuOpts4">
          <div class="p-1">
            <UButton
              size="xs"
              variant="ghost"
              block
              @click="
                () => {
                  toValue(mc4?.map)?.zoomIn();
                }
              "
              >放大</UButton
            >
            <UButton
              size="xs"
              variant="ghost"
              block
              @click="
                () => {
                  toValue(mc4?.map)?.zoomOut();
                }
              "
              >缩小</UButton
            >
          </div>
        </MaptalksMenu>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装：&lt;MaptalksMenu&gt; slot——自定义 HTML。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// —— 旧 API：map.setMenu({ items }) ——
const mc1 = ref<MaptalksMapExposed | null>(null);
watch(
  () => mc1.value?.map,
  (m) => {
    if (!m) return;
    m.setMenu({
      width: 160,
      items: [
        { item: '放大', click: () => m.zoomIn() },
        { item: '缩小', click: () => m.zoomOut() },
      ],
    });
  },
);

// —— 新封装：MaptalksMenu 组件标准模式 ——
const mc2 = ref<MaptalksMapExposed | null>(null);
const menuOpts2: MaptalksMenuOptions = {
  width: 160,
  items: [
    { item: '放大', click: () => toValue(mc2.value?.map)?.zoomIn() },
    { item: '缩小', click: () => toValue(mc2.value?.map)?.zoomOut() },
  ],
};

// —— 旧 API：map.setMenu({ custom: true }) ——
const mc3 = ref<MaptalksMapExposed | null>(null);
const customEl3 = customMenuEl(
  () => toValue(mc3.value?.map)?.zoomIn(),
  () => toValue(mc3.value?.map)?.zoomOut(),
);
watch(
  () => mc3.value?.map,
  (m) => {
    if (!m) return;
    m.setMenu({ custom: true, items: customEl3 } as any);
  },
);

// —— 新封装：MaptalksMenu slot 模式 ——
const mc4 = ref<MaptalksMapExposed | null>(null);
const menuOpts4: MaptalksMenuOptions = { custom: true };

function customMenuEl(
  zoomIn: (() => void) | undefined,
  zoomOut: (() => void) | undefined,
): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  const d = document.createElement('div');
  d.style.cssText = 'padding:2px;min-width:120px';
  const b1 = document.createElement('button');
  b1.textContent = '放大';
  b1.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px';
  b1.addEventListener('click', () => zoomIn?.());
  const b2 = document.createElement('button');
  b2.textContent = '缩小';
  b2.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px';
  b2.addEventListener('click', () => zoomOut?.());
  d.append(b1, b2);
  return d;
}
</script>
