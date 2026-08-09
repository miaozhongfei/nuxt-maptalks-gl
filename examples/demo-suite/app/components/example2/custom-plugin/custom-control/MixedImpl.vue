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
    <UButton size="sm" class="mt-3" @click="toggleControl">{{ controlVisible ? '隐藏控件' : '显示控件' }}</UButton>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后 addControl 挂载自定义控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const status = ref('加载中…')
const controlVisible = ref(true)
let ctrl: any = null

watch(
  map,
  async (m) => {
    if (!m || status.value.includes('已添加')) return
    const mt: any = await import('maptalks-gl')
    if (!mt.control?.Control) return
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
    // addControl 参数为模块建模的 MaptalksControl，自定义类与 maptalks 类型结构不匹配，as never 兜底
    ctrl = new MyControl({ content: 'Hello, MyControl!' })
    m.addControl(ctrl as never)
    status.value = 'MyControl 已添加（top-right）'
  },
  { immediate: true },
)

function toggleControl() {
  if (!ctrl) return
  if (controlVisible.value) ctrl.hide()
  else ctrl.show()
  controlVisible.value = !controlVisible.value
}
</script>
