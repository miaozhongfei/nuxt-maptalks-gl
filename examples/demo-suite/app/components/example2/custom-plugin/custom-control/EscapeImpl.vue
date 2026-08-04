<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：class extends maptalks.control.Control + buildOn + mergeOptions + addControl（对应官网 13.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt: any = await import('maptalks-gl')
    // 官网 13.1 同款：自定义控件类 + mergeOptions 默认项 + buildOn 返回 DOM
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
    m.addControl(new MyControl({ content: 'Hello, MyControl!' }) as never)
    status.value = 'MyControl 已添加（top-right）'
  },
  { immediate: true },
)
</script>
