<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Panel 直建 2 个官网布局（文本可拖拽 / 自定义 HTML）（对应官网 10.12）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.control?.Panel) return
    // 官网 2 布局：右上文本面板（拖拽 + 关闭按钮）/ 右下自定义 HTML 面板（拖拽）
    // 原生 control.Panel.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    new mt.control.Panel({
      position: 'top-right',
      draggable: true,
      custom: false,
      content: 'A draggable text panel.',
      closeButton: true,
    }).addTo(m as never)
    new mt.control.Panel({
      position: 'bottom-right',
      draggable: true,
      custom: true,
      content: '<div style="background:rgba(135,196,240,0.8);width:200px;height:100px;border:2px #fff solid;padding:10px;color:#fff">A custom panel.<br><input type="text" value="a text input"/></div>',
    }).addTo(m as never)
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（Panel 可用）' : '加载中…'))
</script>
