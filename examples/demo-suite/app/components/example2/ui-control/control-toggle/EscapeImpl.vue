<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：zoomControl.show()/hide()/remove()，Show 内 getMap() 判断复活（对应官网 10.18）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

// 原生 Zoom 实例引用（show/hide/remove 直接调用）
let zoomCtl: any = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.control?.Zoom || !mt.control?.Toolbar) return
    zoomCtl = new mt.control.Zoom({ position: 'top-left', zoomLevel: true })
    zoomCtl.addTo(m as never)
    // Toolbar 三按钮（Show/Hide/Remove）操作 Zoom 控件（官网原味：Show 里 getMap 判断复活）
    new mt.control.Toolbar({
      position: 'top-right',
      items: [
        { item: 'Show', click: () => { doShow(m) } },
        { item: 'Hide', click: () => { zoomCtl?.hide() } },
        { item: 'Remove', click: () => { zoomCtl?.remove() } },
      ],
    }).addTo(m as never)
  },
  { immediate: true },
)

// 官网 show 语义：被 remove 后实例仍在（getMap 为 null），addControl 重新加回复活
function doShow(m: any) {
  if (!zoomCtl) return
  if (zoomCtl.getMap()) zoomCtl.show()
  else m.addControl(zoomCtl)
}

const status = computed(() => (isReady.value ? '地图已创建（控件切换可用）' : '加载中…'))
</script>
