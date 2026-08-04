<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + 自定义控件类（extends mt.control.Control + buildOn）——map.addControl 挂载（对应官网 13.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后 addControl 挂载自定义控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const status = ref('加载中…')

watch(
  map,
  async (m) => {
    if (!m || status.value.includes('已添加')) return
    const mt: any = await import('maptalks-gl')
    // 自定义控件类：extends mt.control.Control + buildOn 返回 DOM（官网 13.1 核心）
    // 显式构造器透传 options（Volar 对父类构造器签名解析差异，as never 兜底）
    class MyControl extends mt.control.Control {
      constructor(options?: Record<string, unknown>) {
        super(options as never)
      }

      buildOn(): HTMLElement {
        const dom = document.createElement('div')
        dom.style.cssText = 'background:#051127;border:5px solid #fff;border-radius:5px;color:#fff;height:50px;line-height:50px;text-align:center;font-size:30px;padding:0 8px'
        dom.innerText = (this as unknown as { options: Record<string, unknown> }).options.content as string
        return dom
      }
    }
    MyControl.mergeOptions({ position: 'top-right', content: 'My Control' })
    m.addControl(new MyControl({ content: 'Hello, MyControl!' }))
    status.value = 'MyControl 已添加（top-right）'
  },
  { immediate: true },
)
</script>
