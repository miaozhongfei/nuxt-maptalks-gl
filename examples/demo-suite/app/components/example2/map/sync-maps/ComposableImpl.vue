<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div
        ref="elA"
        class="relative rounded border border-default overflow-hidden"
        style="height: 420px"
      />
      <div
        ref="elB"
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
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null);
const elB = ref<HTMLElement | null>(null);
const { map: mapA } = useMaptalks(elA, { name: 'sync-u-a', center: [121.5057, 31.2453], zoom: 13 });
const { map: mapB } = useMaptalks(elB, { name: 'sync-u-b', center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(mapA, { source: 'osm' });
useMaptalksTileLayer(mapB, { source: 'osm' });

// 两套同步实例：双向 mutual（默认启用） + 单向 master-slave（默认关闭）
const sMutual = useMaptalksSync(['sync-u-a', 'sync-u-b']);
const sMaster = useMaptalksSync(['sync-u-a', 'sync-u-b'], { mode: 'master-slave', master: 'sync-u-a' });
sMaster.disable();

const isDualMode = ref(true);
const isEnabled = computed(() => isDualMode.value ? sMutual.isEnabled.value : sMaster.isEnabled.value);

// 关闭同步：两个实例同时停
function disable() { sMutual.disable(); sMaster.disable(); }
// 开启同步：激活当前模式对应的实例
function dualEnable() {
  if (isDualMode.value) { sMaster.disable(); sMutual.enable(); }
  else { sMutual.disable(); sMaster.enable(); }
}
function onModeChange(v: boolean) {
  if (v) { sMaster.disable(); sMutual.enable(); }
  else { sMutual.disable(); sMaster.enable(); }
}

// 从图交互开关
const slaveLocked = ref(false);
const toggleCfg = (on: boolean) => {
  const m = mapB.value as unknown as { config: (o: Record<string, unknown>) => void } | null;
  m?.config({ draggable: on, scrollWheelZoom: on });
};
function lockSlave() {
  slaveLocked.value = !slaveLocked.value;
  toggleCfg(!slaveLocked.value);
}
</script>
