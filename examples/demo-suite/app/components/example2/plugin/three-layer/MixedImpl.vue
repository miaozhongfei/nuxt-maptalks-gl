<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="10"
      :pitch="60"
      :bearing="30"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksLayer 通用原语 + maptalks.three 插件——ThreeLayer 3D 图层（对应官网 12.4）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后经通用图层原语消费插件构造器
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

// 插件与 THREE 模块按需加载（README ES Modules 用法：import * as THREE from 'three'）
// 顺序：先加载 THREE（大模块）再启用门控，避免 prepareToDraw 回调时 THREE 未就绪
const ThreeLayerCtor = ref<any>(null)
const THREE = ref<any>(null)
watch(
  map,
  async (m) => {
    if (!m || ThreeLayerCtor.value) return
    THREE.value = await import('three' as string)
    const mod: any = await import('maptalks.three' as string)
    if (!mod?.ThreeLayer) return
    ThreeLayerCtor.value = mod.ThreeLayer
  },
  { immediate: true },
)

// enabled 门控等插件/THREE 模块就绪后再创建
const { layer } = useMaptalksLayer(
  map,
  () => {
    const tLayer = new ThreeLayerCtor.value('three')
    // prepareToDraw 在图层渲染时回调（gl/scene/camera 为 three.js 对象）——添加灯光与红色方块
    tLayer.prepareToDraw = (gl: unknown, scene: any, camera: any) => {
      const THREE3 = THREE.value
      const light = new THREE3.AmbientLight(0xffffff, 0.6)
      scene.add(light)
      const geometry = new THREE3.BoxGeometry(200, 200, 200)
      const material = new THREE3.MeshStandardMaterial({ color: 0xdc2626 })
      const box = new THREE3.Mesh(geometry, material)
      const p = tLayer.coordinateToVector3([121.5057, 31.2453], 300)
      box.position.copy(p)
      scene.add(box)
      tLayer.renderScene()
    }
    return tLayer
  },
  { enabled: ThreeLayerCtor },
)
const status = computed(() => (layer.value ? 'ThreeLayer 已添加' : '加载中…'))
</script>
