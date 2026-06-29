<template><!-- maptalks attribution control · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksAttribution } from '../composables/useMaptalksAttribution';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksMap } from '../types';

const props = defineProps<{ options?: Record<string, unknown> }>();

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);
useMaptalksAttribution(map!, () => props.options);
</script>
