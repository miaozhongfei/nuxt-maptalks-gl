<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
// 逃生舱：底图也用模块托管（osm 命名源），保持与其他 tab 视觉统一
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// 文字标签 Label（工厂模式——纯文字版，可拖拽）
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Label('文字标签 Label', [121.5057, 31.2453], {
      draggable: true,
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#34495e',
        textHaloFill: '#fff',
        textHaloRadius: 4,
        textSize: 18,
        textWeight: 'bold',
        textVerticalAlignment: 'top',
      },
    }),
)
// 文字标签 Label（工厂模式——boxStyle 底色框版）
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Label('文字标签 Label', [121.5057, 31.2553], {
      draggable: true,
      boxStyle: {
        padding: [12, 8],
        verticalAlignment: 'top',
        horizontalAlignment: 'left',
        minWidth: 200,
        minHeight: 30,
        symbol: {
          markerType: 'square',
          markerFill: 'rgb(135,196,240)',
          markerFillOpacity: 0.9,
          markerLineColor: '#34495e',
          markerLineWidth: 1,
        },
      },
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#34495e',
        textHaloFill: '#fff',
        textHaloRadius: 4,
        textSize: 18,
        textWeight: 'bold',
        textVerticalAlignment: 'top',
      },
    }),
)

const status = computed(() => (isReady.value ? '地图已创建（Label 文字标签）' : '加载中…'))
</script>
