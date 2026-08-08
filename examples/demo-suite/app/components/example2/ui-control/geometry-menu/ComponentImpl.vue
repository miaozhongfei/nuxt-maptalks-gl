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
      >
        <MaptalksVectorLayer>
          <MaptalksMarker
            v-for="(c, i) in MARKERS"
            :key="'o1' + i"
            :ref="(el: MaptalksMarkerExposed | null) => (oldSRefs[i] = el)"
            :coordinates="c"
            :options="{ symbol: MKR_SYM }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">
        旧 API：MaptalksMarker ref → geo.setMenu({ items })——标准模式。
      </p>
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
        <MaptalksVectorLayer>
          <MaptalksMarker
            v-for="c in MARKERS"
            :key="'n1' + c[0]"
            :coordinates="c"
            :options="{ symbol: MKR_SYM }"
          >
            <MaptalksGeometryMenu :options="menuStd" />
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装：&lt;MaptalksGeometryMenu&gt; 组件——标准模式。</p>
    </div>
    <div>
      <MaptalksMap
        ref="mc3"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksVectorLayer>
          <MaptalksMarker
            v-for="(c, i) in MARKERS"
            :key="'o2' + i"
            :ref="(el: MaptalksMarkerExposed | null) => (oldCRefs[i] = el)"
            :coordinates="c"
            :options="{ symbol: MKR_SYM }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">
        旧 API：MaptalksMarker ref → geo.setMenu({ custom: true })——自定义 HTML。
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
        <MaptalksVectorLayer>
          <MaptalksMarker
            v-for="c in MARKERS"
            :key="'n2' + c[0]"
            :coordinates="c"
            :options="{ symbol: MKR_SYM }"
          >
            <MaptalksGeometryMenu :options="menuCust">
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
            </MaptalksGeometryMenu>
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">
        新封装：&lt;MaptalksGeometryMenu slot&gt;——自定义 HTML。
      </p>
    </div>
    <p class="text-xs text-muted col-span-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const MARKERS: [number, number][] = [
  [121.5057, 31.2453],
  [121.508, 31.2453],
  [121.502, 31.2453],
]
const MKR_SYM = {
  markerType: 'ellipse' as const,
  markerFill: '#f59e0b',
  markerWidth: 14,
  markerHeight: 14,
}

const mc1 = ref<MaptalksMapExposed | null>(null)
const mc2 = ref<MaptalksMapExposed | null>(null)
const mc3 = ref<MaptalksMapExposed | null>(null)
const mc4 = ref<MaptalksMapExposed | null>(null)

const menuStd: MaptalksMenuOptions = {
  width: 160,
  items: [
    {
      item: '放大',
      click: () => {
        toValue(mc2.value?.map)?.zoomIn()
      },
    },
    {
      item: '缩小',
      click: () => {
        toValue(mc2.value?.map)?.zoomOut()
      },
    },
  ],
}
const menuCust: MaptalksMenuOptions = { custom: true }

const oldSRefs = reactive<(MaptalksMarkerExposed | null)[]>([])
const oldCRefs = reactive<(MaptalksMarkerExposed | null)[]>([])

function customEl(zoomIn: () => void, zoomOut: () => void): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const d = document.createElement('div')
  d.style.cssText = 'padding:2px;min-width:120px'
  const b1 = document.createElement('button')
  b1.textContent = '放大'
  b1.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b1.addEventListener('click', zoomIn)
  const b2 = document.createElement('button')
  b2.textContent = '缩小'
  b2.style.cssText =
    'display:block;width:100%;padding:4px 12px;border:none;background:none;cursor:pointer;text-align:left;font-size:14px'
  b2.addEventListener('click', zoomOut)
  d.append(b1, b2)
  return d
}

// flush: 'post' 延迟到 DOM 更新后，确保 v-for ref 收集完成
watchEffect(
  () => {
    const m = toValue(mc1.value?.map)
    const refs = oldSRefs.filter(Boolean) as MaptalksMarkerExposed[]
    if (!m || refs.length < 3) return
    refs.forEach((r) => {
      // exposed geometry 是 Ref——toValue 解包
      const g = toValue(r.geometry)
      if (g)
        g.setMenu?.({
          width: 160,
          items: [
            { item: '放大', click: () => m.zoomIn() },
            { item: '缩小', click: () => m.zoomOut() },
          ],
        })
    })
  },
  { flush: 'post' },
)

watchEffect(
  () => {
    const m = toValue(mc3.value?.map)
    const refs = oldCRefs.filter(Boolean) as MaptalksMarkerExposed[]
    if (!m || refs.length < 3) return
    refs.forEach((r) => {
      const g = toValue(r.geometry)
      if (g)
        // custom 模式 items 为 HTMLElement（建模 items 为条目数组）——逃生舱断言
        g.setMenu?.({
          custom: true,
          items: customEl(
            () => m.zoomIn(),
            () => m.zoomOut(),
          ),
        } as any)
    })
  },
  { flush: 'post' },
)

const status = computed(() => (toValue(mc1.value?.map) ? '地图已创建（图形右键菜单可用）' : '加载中…'))
</script>
