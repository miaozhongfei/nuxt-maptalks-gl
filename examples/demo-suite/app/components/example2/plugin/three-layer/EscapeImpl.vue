<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——插件 README ES Modules 用法：import * as THREE + import { ThreeLayer }（对应官网 12.4）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 10, pitch: 60, bearing: 30, baseLayer: 'osm' })

const status = ref('加载中…')

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    // README ES Modules 用法：THREE 从 three 模块导入（非 window.THREE），ThreeLayer 从插件导入
    const { ThreeLayer }: any = await import('maptalks.three' as string)
    if (!ThreeLayer) return
    const THREE: any = await import('three' as string)
    try {
      const tLayer = new ThreeLayer('three')
      // prepareToDraw 在图层渲染时回调（gl/scene/camera 为 three.js 对象）——添加灯光与红色方块
      tLayer.prepareToDraw = (gl: unknown, scene: any, camera: any) => {
        const light = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(light)
        const geometry = new THREE.BoxGeometry(200, 200, 200)
        const material = new THREE.MeshStandardMaterial({ color: 0xdc2626 })
        const box = new THREE.Mesh(geometry, material)
        const p = tLayer.coordinateToVector3([121.5057, 31.2453], 300)
        box.position.copy(p)
        scene.add(box)
        tLayer.renderScene()
      }
      tLayer.addTo(m as never)
      status.value = 'ThreeLayer 已添加'
    } catch (e) {
      status.value = `添加失败: ${(e as Error).message}`
    }
  },
  { immediate: true },
)
</script>
