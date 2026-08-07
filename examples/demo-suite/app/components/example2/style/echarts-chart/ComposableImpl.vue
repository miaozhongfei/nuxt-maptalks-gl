<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

let chartDispose: (() => void) | null = null

onMounted(async () => {
  const echarts = await import('echarts')
  const chartDom = document.createElement('div')
  chartDom.style.cssText = 'width:650px;height:300px;'
  const chart = echarts.init(chartDom)
  chart.setOption({
    title: { x: 'center' },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { x: 'center', y: 'bottom', data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8'] },
    toolbox: {
      show: true,
      feature: { mark: { show: true }, dataView: { show: true, readOnly: false }, magicType: { show: true, type: ['pie', 'funnel'] }, restore: { show: true }, saveAsImage: { show: true } },
    },
    calculable: true,
    series: [{
      name: 'Area mode', type: 'pie', radius: [30, 110], center: ['50%', '50%'], roseType: 'area',
      data: [
        { value: 10, name: 'rose1' }, { value: 5, name: 'rose2' }, { value: 15, name: 'rose3' }, { value: 25, name: 'rose4' },
        { value: 20, name: 'rose5' }, { value: 35, name: 'rose6' }, { value: 30, name: 'rose7' }, { value: 40, name: 'rose8' },
      ],
    }],
  })
  chartDispose = () => chart.dispose()

  useMaptalksUIMarker(map, {
    options: { coordinates: [121.5057, 31.2453], content: chartDom, draggable: true, single: false },
  })
})

onBeforeUnmount(() => { chartDispose?.() })

const status = computed(() => (isReady.value ? '地图已创建（ECharts 图表）' : '加载中…'))
</script>
