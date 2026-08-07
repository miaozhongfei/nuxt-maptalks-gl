<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

let chartDispose: (() => void) | null = null

onMounted(async () => {
  const Highcharts = await import('highcharts')
  const chartDom = document.createElement('div')
  chartDom.style.cssText = 'min-width:300px;height:300px;margin:0 auto;'
  // Highcharts 深嵌套 Options 在 Volar 重载解析下严格（chartDom 的 DOM lang 属性与 Options.lang 冲突），逃生舱断言
  Highcharts.default.chart(chartDom, {
    chart: { backgroundColor: 'rgba(255,255,255,0.8)', type: 'area', spacingBottom: 30 },
    title: { text: 'Fruit consumption *' },
    subtitle: { text: '* Jane\'s banana consumption is unknown', floating: true, align: 'right', verticalAlign: 'bottom', y: 15 },
    legend: { layout: 'vertical', align: 'left', verticalAlign: 'top', x: 150, y: 100, floating: true, borderWidth: 1, backgroundColor: '#FFFFFF' },
    xAxis: { categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries'] },
    yAxis: { title: { text: 'Y-Axis' }, labels: { formatter(this: { value: number }) { return String(this.value) } } },
    tooltip: { formatter(this: { series: { name: string }; x: string; y: number }) { return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}` } },
    plotOptions: { area: { fillOpacity: 0.5 } },
    credits: { enabled: false },
    series: [
      { name: 'John', data: [0, 1, 4, 4, 5, 2, 3, 7] },
      { name: 'Jane', data: [1, 0, 3, null, 3, 1, 2, 1] },
    ],
  } as never)
  chartDispose = () => { chartDom.innerHTML = '' }

  useMaptalksUIMarker(map, {
    options: { coordinates: [121.5057, 31.2453], content: chartDom, draggable: true, single: false },
  })
})

onBeforeUnmount(() => { chartDispose?.() })

const status = computed(() => (map.value ? '地图已创建（Highcharts 图表）' : '加载中…'))
</script>
