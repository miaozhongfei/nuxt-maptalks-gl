<template>
  <div>
    <h1 class="text-xl font-bold p-4">高德瓦片 · 组件方式</h1>
    <MaptalksMap :center="[121.4737, 31.2304]" :zoom="13" baseLayer="amap" class="mx-4 rounded border overflow-hidden" style="height:500px" />
  </div>
</template>
