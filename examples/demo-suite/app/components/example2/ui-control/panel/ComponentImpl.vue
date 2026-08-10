<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksPanelControl :options="pOpts1" />
      <MaptalksPanelControl :options="pOpts2">
        <div style="background:rgba(135,196,240,0.8);width:200px;min-height:100px;border:2px #fff solid;padding:10px;color:#fff">
          A custom panel with Vue slot.<br>
          <input v-model="slotText" style="color:#333" /><br>
          <button style="margin-top:6px" @click="() => { slotCount++ }">点击 +1：{{ slotCount }}</button>
        </div>
      </MaptalksPanelControl>
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksPanelControl——文本面板（options.content）/ 自定义面板（slot，输入不中断）（对应官网 10.12）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// 官网 2 布局：右上文本面板（拖拽 + 关闭按钮）/ 右下自定义面板（slot 响应式内容）
const pOpts1: MaptalksPanelOptions = {
  position: 'top-right',
  draggable: true,
  custom: false,
  content: 'A draggable text panel.',
  closeButton: true,
}
// 面板 2 用 slot：options 只给位置/拖拽，内容由 Vue slot 提供（响应式穿透）
const pOpts2: MaptalksPanelOptions = {
  position: 'bottom-right',
  draggable: true,
  custom: true,
}

// slot 内响应式状态：input 绑定 + 计数器
const slotText = ref('a text input')
const slotCount = ref(0)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Panel 可用）' : '加载中…'))
</script>
