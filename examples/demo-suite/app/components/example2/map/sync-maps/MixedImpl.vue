<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <MaptalksMap
        name="sync-m-a"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <MaptalksMap
        ref="mcB"
        name="sync-m-b"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
    </div>
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="dualEnable()">开启同步</UButton>
      <UButton size="sm" color="neutral" @click="disable()">关闭同步</UButton>
      <UBadge :color="isEnabled ? 'success' : 'neutral'" variant="subtle">
        {{ isEnabled ? '同步中' : '未同步' }}
      </UBadge>
    </div>
    <div class="flex items-center gap-3 mt-2 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-sm">双向</span>
        <USwitch v-model="isDualMode" @update:model-value="onModeChange" />
        <span class="text-sm">单向（主→从）</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton size="sm" color="neutral" variant="outline" @click="lockSlave">{{ slaveLocked ? '解锁从图交互' : '禁用从图交互' }}</UButton>
      </div>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 从图 ref 用于交互锁定
const mcB = ref<MaptalksMapExposed | null>(null)
const mapB = computed(() => toValue(mcB.value?.map) ?? null)

const sMutual = useMaptalksSync(['sync-m-a', 'sync-m-b'])
const sMaster = useMaptalksSync(['sync-m-a', 'sync-m-b'], { mode: 'master-slave', master: 'sync-m-a' })
sMaster.disable()

const isDualMode = ref(true)
const isEnabled = computed(() => isDualMode.value ? sMutual.isEnabled.value : sMaster.isEnabled.value)

function disable() { sMutual.disable(); sMaster.disable() }
function dualEnable() {
  if (isDualMode.value) { sMaster.disable(); sMutual.enable() }
  else { sMutual.disable(); sMaster.enable() }
}
function onModeChange(v: boolean) {
  if (v) { sMaster.disable(); sMutual.enable() }
  else { sMutual.disable(); sMaster.enable() }
}

const slaveLocked = ref(false)
function lockSlave() {
  slaveLocked.value = !slaveLocked.value
  mapB.value?.config({ draggable: !slaveLocked.value, scrollWheelZoom: !slaveLocked.value })
}

const status = computed(() => (mapB.value ? '地图已创建（双地图同步就绪）' : '加载中…'))
</script>
