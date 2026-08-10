<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggleUi">{{ uiVisible ? '隐藏 UI' : '显示 UI' }}</UButton>
    <p class="text-sm text-muted mt-2">useMaptalks + 自定义 UIComponent 子类（buildOn + getOffset 居中 + zoomend 闪烁）——ui.addTo(map).show()（对应官网 13.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')
const uiVisible = ref(true)
let ui: any = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m || ui) return
    const mt: any = await import('maptalks-gl')
    if (!mt.ui?.UIComponent) return
    // 自定义 UIComponent 子类（官网 13.2 核心）：buildOn 返回 DOM + getOffset 居中 + zoomend 闪烁
    class MyUI extends mt.ui.UIComponent {
      private _coordinate: unknown
      private _flashTimeout: ReturnType<typeof setTimeout> | undefined

      constructor(coordinate: unknown, options?: Record<string, unknown>) {
        super(options as never)
        this['_coordinate'] = coordinate
      }

      buildOn(): HTMLElement {
        const dom = document.createElement('div')
        dom.style.cssText = 'background:#051127;border:5px solid #fff;border-radius:5px;color:#fff;width:200px;height:50px;line-height:50px;text-align:center'
        dom.innerText = (this.options as Record<string, unknown>).content as string
        return dom
      }

      getOffset(): unknown {
        const size = this.getSize()
        // 锚点移到 UI 中心
        return new mt.Point(-size.width / 2, -size.height / 2)
      }

      getEvents(): Record<string, unknown> {
        return { zoomend: this['_flash'] }
      }

      onRemove(): void {
        if (this['_flashTimeout']) clearTimeout(this['_flashTimeout'])
      }

      _flash(): void {
        // 缩放后闪烁：隐藏 200ms 再显示（maptalks-gl 下 UIComponent.hide 的 display 不生效，DOM 直操作兜底）
        const dom = this['getDOM']?.() as HTMLElement | null
        if (dom) dom.style.display = 'none'
        this['_flashTimeout'] = setTimeout(() => {
          this.show(this['_coordinate'])
        }, 200)
      }
    }
    MyUI.mergeOptions({ content: '', animationOnHide: false })
    ui = new MyUI(m.getCenter(), { content: 'Hello, MyUI' })
    ui.addTo(m as never)
    ui.show(m.getCenter())
    status.value = 'MyUI 已添加（地图中心）'
  },
  { immediate: true },
)

function toggleUi() {
  // maptalks-gl 的 UIComponent.hide 兼容问题（display 不生效），DOM 直操作兜底
  // 限定 .maptalks-ui 面板内查找——textContent 全匹配会误中图层容器等祖先元素（隐藏整个地图）
  const uiPanel = document.querySelector('.maptalks-ui')
  const dom = uiPanel
    ? [...uiPanel.children].find((d): d is HTMLElement => d.textContent === 'Hello, MyUI')
    : null
  if (!dom) return
  dom.style.display = uiVisible.value ? 'none' : 'block'
  uiVisible.value = !uiVisible.value
}
</script>
