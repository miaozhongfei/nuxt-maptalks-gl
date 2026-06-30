<template><!-- maptalks compass control · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue'

import { useMaptalksCompass } from '../composables/useMaptalksCompass'
import { MAP_KEY } from '../core/map-context'

const props = defineProps<{ options?: Record<string, unknown> }>()

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksCompassControl 必须在 MaptalksMap 内使用')
useMaptalksCompass(map, () => props.options)
</script>
