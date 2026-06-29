<template><!-- maptalks scale control · 纯逻辑组件 --></template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ShallowRef } from 'vue';

import { useMaptalksScale } from '../composables/useMaptalksScale';
import { MAP_KEY } from '../core/map-context';
import type { MaptalksMap } from '../types';

const props = defineProps<{ options?: Record<string, unknown> }>();

const map = inject<ShallowRef<MaptalksMap | null>>(MAP_KEY);
useMaptalksScale(map!, () => props.options);
</script>
