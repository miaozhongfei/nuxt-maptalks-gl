<template><!-- maptalks scale control · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksScale } from '../composables/useMaptalksScale'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksScaleControl 必须在 MaptalksMap 内使用')
useMaptalksScale(map, () => props.options)
</script>
