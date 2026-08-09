<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" :variant="toolActive ? 'solid' : 'outline'" @click="toggleTool">{{ toolActive ? '关闭工具' : '开启工具' }}</UButton>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：class extends maptalks.MapTool + onEnable/onDisable/getEvents + new CustomTool().addTo(map)（对应官网 13.3）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const status = ref('加载中…')
const toolActive = ref(false)
let tool: any = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m || tool) return
    const mt: any = await import('maptalks-gl')
    if (!mt.MapTool || !mt.control?.Toolbar) return
    // 官网 13.3 同款：自定义 MapTool 子类 + Toolbar 提示 + new CustomTool().addTo(map)
    class CustomTool extends mt.MapTool {
      private _markerLayer: any = null

      onEnable(): void {
        this['_markerLayer'] = new mt.VectorLayer('CustomTool_layer').addTo(this.getMap())
      }

      onDisable(): void {
        if (this['_markerLayer']) this['_markerLayer'].remove()
      }

      getEvents(): Record<string, unknown> {
        return { click: this['_onClick'], contextmenu: this['_onRightClick'] }
      }

      _onClick(param: any): void {
        this['_markerLayer'].addGeometry(new mt.Marker(param.coordinate, {
          symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
        }))
      }

      _onRightClick(): void {
        this['_markerLayer'].clear()
      }
    }
    // 提示 Toolbar（官网同款文案）
    new mt.control.Toolbar({
      position: 'top-right',
      items: [{
        item: '<div style="background:#34495e;color:#fff;padding:0 4px;font:16px sans-serif">Click to add Marker, right click to clear</div>',
        click: () => {
          // Toolbar 占位点击
        },
      }],
    }).addTo(m as never)
    tool = new CustomTool().addTo(m as never)
    tool.enable()
    toolActive.value = true
    status.value = 'CustomTool 已添加（点击地图添加 Marker，右键清空）'
  },
  { immediate: true },
)

function toggleTool() {
  if (!tool) return
  if (toolActive.value) tool.disable()
  else tool.enable()
  toolActive.value = !toolActive.value
}
</script>
