<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggleControl">{{ controlVisible ? '隐藏控件' : '显示控件' }}</UButton>
    <p class="text-sm text-muted mt-2">useMaptalks + 自定义控件类（extends mt.control.Control + buildOn）——控件显隐经 show/hide 控制（对应官网 13.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')
const controlVisible = ref(true)
let ctrl: any = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m || ctrl) return
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
    ctrl = new MyControl({ content: 'Hello, MyControl!' })
    m.addControl(ctrl)
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
