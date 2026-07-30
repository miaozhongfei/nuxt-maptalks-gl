<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="saveJson">保存当前状态</UButton>
      <UButton size="sm" :disabled="!savedJson" @click="restoreJson">从 JSON 还原</UButton>
    </div>
    <p v-if="savedJson" class="text-xs text-muted mt-1">已保存 JSON 快照</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const { toJSON, fromJSON } = useMaptalksSerialize(map)
const savedJson = ref<Record<string, unknown> | null>(null)
function saveJson() { savedJson.value = toJSON() }
function restoreJson() { if (savedJson.value) fromJSON(savedJson.value) }
</script>
