<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">maptalks.three ThreeLayer 3D 图层（对应官网 12.4）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 60, bearing: 30 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  try {
    const three = await import('maptalks.three')
    const ThreeLayer = (three as any).default || (three as any).ThreeLayer
    if (ThreeLayer) {
      const tLayer = new ThreeLayer('three')
      tLayer.prepareToDraw = (gl: any, scene: any, camera: any) => {
        const THREE = (window as any).THREE
        if (!THREE) return
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
      tLayer.addTo(m)
    }
  } catch {
    // Plugin may not be installed
  }
})
</script>
