<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap ref="mc1" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show1" :options="opts1" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">简单 HTML 字符串：content 内联样式。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="() => { show1 = !show1 }">{{ show1 ? '隐藏' : '显示' }}</UButton>
    </div>
    <div>
      <MaptalksMap ref="mc2" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show2" :options="opts2" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">富 HTML：多区块 + 色块 + 列表。</p>
      <UButton size="xs" variant="outline" class="mt-1" @click="() => { show2 = !show2 }">{{ show2 ? '隐藏' : '显示' }}</UButton>
    </div>
    <div>
      <MaptalksMap ref="mc3" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show3" :options="opts3">
          <div class="p-2 min-w-35">
            <div class="text-sm mb-1">计数器：<b>{{ count3 }}</b></div>
            <UButton size="xs" color="primary" @click="() => { count3++ }">点击 +1</UButton>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">Vue slot 交互：custom:true + 计数器按钮（响应式穿透）。</p>
    </div>
    <div>
      <MaptalksMap ref="mc4" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 280px">
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show4" :options="opts4" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">响应式内容：UInput → 更新 opts.content → setContent 实时替换。</p>
      <div class="mt-1 flex gap-1">
        <UInput v-model="newContent4" size="xs" class="flex-1" placeholder="新的 InfoWindow 内容" />
        <UButton size="xs" @click="doUpdate4">更新内容</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const show1 = ref(true)
const show2 = ref(true)
const show3 = ref(true)
const show4 = ref(true)
const count3 = ref(0)
const newContent4 = ref('')

const opts1: MaptalksInfoWindowOptions = {
  title: '简单 HTML',
  content: '<div style="padding:8px;color:#2563eb;font-weight:600">自定义 HTML 字符串内容</div>',
}
const opts2: MaptalksInfoWindowOptions = {
  title: '富 HTML',
  content: [
    '<div style="padding:8px;min-width:180px;font-size:13px">',
    '<div style="height:8px;background:linear-gradient(90deg,#2563eb,#10b981);border-radius:4px;margin-bottom:8px"></div>',
    '<div style="font-weight:600;margin-bottom:6px">信息面板</div>',
    '<ul style="margin:0 0 8px 16px;padding:0;color:#374151">',
    '<li>经度：121.5057</li><li>纬度：31.2453</li>',
    '</ul>',
    '<div style="display:flex;gap:4px">',
    '<span style="background:#2563eb;color:#fff;border-radius:3px;padding:1px 6px;font-size:12px">主</span>',
    '<span style="background:#10b981;color:#fff;border-radius:3px;padding:1px 6px;font-size:12px">次</span>',
    '</div></div>',
  ].join(''),
}
const opts3: MaptalksInfoWindowOptions = { title: 'Vue slot', custom: true }
const opts4 = ref<MaptalksInfoWindowOptions>({
  title: '响应式内容',
  custom: true,
  content: '<div style="padding:8px">初始内容</div>',
})

function doUpdate4() {
  if (!newContent4.value) return
  // 更新 opts4.content → composable content watcher → setContent 增量，弹框保持打开
  opts4.value = { ...opts4.value, content: `<div style="padding:8px">${newContent4.value}</div>` }
}
</script>
