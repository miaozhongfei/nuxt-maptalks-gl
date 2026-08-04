<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="clearAll">清空文字</UButton>
    <p class="text-sm text-muted mt-2">useMaptalks + 自定义 HelloLayer + dom renderer（drawOnInteracting 交互重绘 _drawnData）——点击地图添加文字，拖动/缩放跟随（对应官网 14.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')
let layer: any = null
let mtModule: any = null

/** 自定义图层类：extends mt.Layer + setData/getData + mergeOptions 默认配置（官网 14.1 核心） */
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
  HelloLayer.mergeOptions({ color: 'Red', font: '30px sans-serif' })
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
  if (!this['_container']) this['_createContainer']()
  this['_container'].innerHTML = ''
  const data = this.layer.getData()
  const color = this.layer.options.color
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
  // 记录已绘制数据（drawOnInteracting 交互重绘用——官网 14.2 语义）
  this['_drawnData'] = drawn
  this.layer.fire('layerload')
}

HelloLayerRenderer.prototype.drawOnInteracting = function (this: any): void {
  // 交互（拖动/缩放）时只重绘已绘制数据（官网 drawOnInteracting 核心；dom 版全量重建等效）
  if (!this['_drawnData'] || this['_drawnData'].length === 0) return
  this.render()
}

HelloLayerRenderer.prototype.redraw = function (this: any): void {
  this.render()
}

HelloLayerRenderer.prototype.getEvents = function (this: any): Record<string, unknown> {
  // 地图移动/缩放结束后重绘，保证文字跟随地图
  return { moveend: this.render, zoomend: this.render }
}

HelloLayerRenderer.prototype.needToRedraw = function (this: any): boolean {
  const mp = this.layer.getMap()
  const r = mp['_getRenderer']()
  return mp.isInteracting() || (!!r && (r.isStateChanged ? r.isStateChanged() : false))
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

/** 点击地图添加文字（交互绘制演示） */
function addClickedText(e: any): void {
  if (!layer) return
  const coord = e.coordinate.toArray ? e.coordinate.toArray() : [e.coordinate.x, e.coordinate.y]
  layer.setData([...layer.getData(), { coord, text: 'Clicked!' }])
  layer['_getRenderer']().redraw()
  status.value = `已添加文字（当前 ${layer.getData().length} 条）`
}

function clearAll(): void {
  if (!layer) return
  layer.setData([])
  layer['_getRenderer']().redraw()
  status.value = '已清空（点击地图继续添加文字）'
}

watch(
  () => toValue(map),
  async (m) => {
    if (!m || layer) return
    try {
      const mt: any = await import('maptalks-gl')
      mtModule = mt
      layer = createHelloLayer(m, mt)
      m.on('click', addClickedText)
      status.value = 'HelloLayer 已添加（点击地图添加文字，拖动跟随）'
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  const m = toValue(map)
  if (m) m.off('click', addClickedText)
})
</script>
