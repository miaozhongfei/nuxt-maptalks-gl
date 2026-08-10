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
    <p class="text-sm text-muted mt-2">MaptalksMap ref + 自定义 HelloLayer + dom renderer（animation 动画图层——needToRedraw 恒 true，文字颜色 300ms 循环）——对应官网 14.3。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后挂载自定义图层
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const status = ref('加载中…')
let layer: any = null
let mtModule: any = null

/** 自定义图层类：extends mt.Layer + setData/getData + mergeOptions（animation 动画配置 + 颜色数组） */
function buildHelloLayerCtor(mt: any): any {
  class HelloLayer extends mt.Layer {
    private data: unknown[] = []

    constructor(id: string, options?: Record<string, unknown>) {
      super(id, options as never)
    }

    setData(data: unknown[]): this {
      this.data = data
      return this
    }

    getData(): unknown[] {
      return this.data
    }
  }
  HelloLayer.mergeOptions({ animation: true, color: ['Red', 'Blue', 'Green', 'Yellow'], font: '30px sans-serif' })
  return HelloLayer
}

/**
 * 自定义渲染器构造器：dom renderer（maptalks-gl 下 canvas renderer 不驱动，改 DOM 渲染文字）。
 * function 构造器 + 原型方法，避开 SFC 下 oxlint max-classes-per-file 限制。
 */
function HelloLayerRenderer(this: any, layerRef: any) {
  this.layer = layerRef
}

HelloLayerRenderer.prototype['_createContainer'] = function (this: any): void {
  // 容器挂到 frontStatic 面板（与 dom 系组件一致）
  const container = this['_container'] = document.createElement('div')
  container.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none'
  this.layer.getMap().getPanels()['frontStatic'].append(container)
  const size = this.layer.getMap().getSize()
  container.style.width = `${size.width}px`
  container.style.height = `${size.height}px`
}

HelloLayerRenderer.prototype.render = function (this: any): void {
  // 按时间循环换色（官网 draw 逻辑：每 300ms 切一种颜色）
  const colors = this.layer.options.color as string[]
  const color = colors[Math.round(Date.now() / 300 % colors.length)]
  // 颜色未变化时跳过重建（动画帧高频调用下避免 DOM 抖动）
  if (this['_lastColor'] === color && this['_container'] && this['_container'].children.length > 0) return
  this['_lastColor'] = color
  if (!this['_container']) this['_createContainer']()
  this['_container'].innerHTML = ''
  const data = this.layer.getData()
  const font = this.layer.options['font']
  if (!Array.isArray(data)) return
  const mp = this.layer.getMap()
  const drawn: unknown[] = []
  data.forEach((d: any) => {
    // 经纬度转容器像素坐标，屏幕外跳过以提高性能
    const point = mp.coordinateToContainerPoint(new mtModule.Coordinate(d.coord))
    if (!mp.getContainerExtent().contains(point)) return
    const textEl = document.createElement('div')
    textEl.style.cssText = `position:absolute;color:${color};font:${font};white-space:nowrap;transform:translate(-50%,0)`
    textEl.style.left = `${point.x}px`
    textEl.style.top = `${point.y}px`
    textEl.textContent = d.text
    this['_container'].append(textEl)
    drawn.push(d)
  })
  this['_drawnData'] = drawn
  this.layer.fire('layerload')
}

HelloLayerRenderer.prototype.drawOnInteracting = function (this: any): void {
  // 交互（拖动/缩放）时重绘已绘制数据（颜色随动画更新）
  if (!this['_drawnData'] || this['_drawnData'].length === 0) return
  this.render()
}

HelloLayerRenderer.prototype.needToRedraw = function (this: any): boolean {
  // animation 选项开启时是动画图层，始终请求重绘（官网 14.3 核心）
  if (this.layer.options['animation']) return true
  const mp = this.layer.getMap()
  const r = mp['_getRenderer']()
  return mp.isInteracting() || (!!r && (r.isStateChanged ? r.isStateChanged() : false))
}

HelloLayerRenderer.prototype.getEvents = function (this: any): Record<string, unknown> {
  // 地图移动/缩放结束后重绘，保证文字跟随地图
  return { moveend: this.render, zoomend: this.render }
}

HelloLayerRenderer.prototype.redraw = function (this: any): void {
  this.render()
}

HelloLayerRenderer.prototype.show = function (this: any): void {
  if (this['_container']) this['_container'].style.display = ''
}

HelloLayerRenderer.prototype.hide = function (this: any): void {
  if (this['_container']) this['_container'].style.display = 'none'
}

HelloLayerRenderer.prototype.remove = function (this: any): void {
  if (this['_container']) this['_container'].remove()
  delete this['_container']
}

HelloLayerRenderer.prototype.clear = function (this: any): void {
  if (this['_container']) this['_container'].innerHTML = ''
}

HelloLayerRenderer.prototype.setZIndex = function (this: any, z: number): void {
  if (this['_container']) this['_container'].style.zIndex = String(z)
}

HelloLayerRenderer.prototype.isCanvasRender = function (this: any): boolean {
  return false
}

/** 组装：注册 renderer + setData + addTo，返回图层实例 */
function createHelloLayer(m: any, mt: any): any {
  const HelloLayer = buildHelloLayerCtor(mt)
  HelloLayer.registerRenderer('dom', HelloLayerRenderer)
  const helloLayer = new HelloLayer('hello', { renderer: 'dom' })
  helloLayer.setData([
    { coord: [121.5057, 31.2453], text: 'Hello World' },
    { coord: [121.5157, 31.2553], text: 'Hello World 2' },
  ])
  helloLayer.addTo(m as never)
  return helloLayer
}

watch(
  map,
  async (m) => {
    if (!m || layer) return
    try {
      const mt: any = await import('maptalks-gl')
      if (!mt.Layer) return
      mtModule = mt
      layer = createHelloLayer(m, mt)
      status.value = 'HelloLayer 已添加（动画图层——文字颜色 300ms 循环）'
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)
</script>
