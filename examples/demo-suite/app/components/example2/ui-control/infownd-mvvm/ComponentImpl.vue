<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    >
      <!-- slot 内容经 createApp 子应用挂载，弹框内 Vue 响应式实时更新 -->
      <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="true" :options="{ title: 'MVVM 绑定', custom: true }">
        <div class="p-3 min-w-45">
          <h2 class="text-base font-semibold mb-2">{{ name }}</h2>
          <UInput v-model="name" size="xs" class="mb-2" placeholder="输入名称" />
          <div class="text-sm mb-1">count：<b>{{ count }}</b></div>
          <UButton size="xs" color="primary" class="mb-2" @click="() => { count++ }">count++</UButton>
          <div class="flex gap-1">
            <UButton v-for="b in btns" :key="b" size="xs" variant="outline">{{ b }}</UButton>
          </div>
        </div>
      </MaptalksInfoWindow>
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksInfoWindow slot——createApp 子应用保留 Vue 响应式（对应官网 10.10 MVVM 绑定）。</p>
  </div>
</template>

<script setup lang="ts">
// MVVM 模型：弹框内 v-model / @click / v-for 实时驱动视图
const name = ref('Hello Maptalks')
const count = ref(1)
const btns = ref([1, 2, 3, 4, 5])
</script>
