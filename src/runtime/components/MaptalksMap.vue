<template>
  <div ref="el" style="height: 100%; width: 100%"><slot /></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadMaptalks } from '../core/loader'

const props = defineProps<{
  center?: unknown
  zoom?: number
  options?: Record<string, unknown>
}>()

const el = ref<HTMLElement | null>(null)

onMounted(async () => {
  const dom = el.value
  if (!dom) return
  try {
    const mt = await loadMaptalks()
    new mt.Map(dom, { center: props.center ?? [0, 0], zoom: props.zoom ?? 1, ...(props.options ?? {}) })
  } catch (_) { /* ignore */ }
})
</script>
