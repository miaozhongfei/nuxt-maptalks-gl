<template>
  <div>
    <h1 class="text-xl font-bold p-4 pb-1">高德瓦片 · 组件方式</h1>
    <p class="px-4 pb-2 text-sm text-gray-500">使用 <code>&lt;MaptalksMap&gt;</code> 组件 —— <NuxtLink to="/" class="text-blue-600 underline">查看 Composable 方式示例</NuxtLink></p>
    <MaptalksMap :center="[121.4737, 31.2304]" :zoom="13" baseLayer="amap" class="mx-4 rounded border overflow-hidden" style="height:500px" />
  </div>
</template>
