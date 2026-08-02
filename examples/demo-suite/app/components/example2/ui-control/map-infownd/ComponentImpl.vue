<template>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <MaptalksMap
        ref="mc1"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksInfoWindow :coordinates="[121.5057, 31.2453]" :visible="show1" :options="opts1" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">字符串内容：MaptalksInfoWindow + content HTML string。</p>
      <UButton
        size="xs"
        variant="outline"
        class="mt-1"
        @click="
          () => {
            show1 = !show1;
          }
        "
        >{{ show1 ? '隐藏' : '显示' }}</UButton
      >
    </div>
    <div>
      <MaptalksMap
        ref="mc2"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksInfoWindow
          :coordinates="[121.5057, 31.2453]"
          :visible="show2"
          :options="{ title: 'Slot 内容', custom: true }"
        >
          <div class="p-2 min-w-35">
            <div class="text-sm mb-1">
              计数器：<b>{{ count }}</b>
            </div>
            <UButton
              size="xs"
              color="primary"
              @click="
                () => {
                  count++;
                }
              "
              >点击 +1</UButton
            >
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">
        Slot 内容：custom:true + Vue slot——计数器验证响应式穿透。
      </p>
      <UButton
        size="xs"
        variant="outline"
        class="mt-1"
        @click="
          () => {
            show2 = !show2;
          }
        "
        >{{ show2 ? '隐藏' : '显示' }}</UButton
      >
    </div>
    <div>
      <MaptalksMap
        ref="mc3"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksInfoWindow
          :coordinates="[121.5057, 31.2453]"
          :visible="show3"
          :options="opts3"
          :events="{ showstart: onShowStart, showend: onShowEnd }"
        />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">字符串内容 + 事件日志（showstart/showend）。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events3" :key="i">{{ e }}</div>
      </div>
    </div>
    <div>
      <MaptalksMap
        ref="mc4"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 280px"
      >
        <MaptalksInfoWindow
          :coordinates="[121.5057, 31.2453]"
          :visible="show4"
          :options="{ title: '坐标飞行', custom: true }"
        >
          <div class="p-2 min-w-45">
            <div class="text-xs text-muted mb-1">输入坐标（如 121.5,31.2）：</div>
            <UInput v-model="searchText" size="xs" class="mb-2" placeholder="121.5,31.2" />
            <UButton size="xs" block @click="doFly4">飞行</UButton>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">Slot 内容 + 事件日志：UInput v-model + flyTo。</p>
      <div class="mt-1 text-[11px] text-muted space-y-0.5 max-h-12 overflow-y-auto">
        <div v-for="(e, i) in events4" :key="i">{{ e }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const show1 = ref(true);
const show2 = ref(true);
const show3 = ref(true);
const show4 = ref(true);
const count = ref(0);
const searchText = ref('');
const events3 = ref<string[]>([]);
const events4 = ref<string[]>([]);

const opts1: MaptalksInfoWindowOptions = {
  title: '字符串内容',
  content: '<div style="padding:8px">字符串 InfoWindow</div>',
};
const opts3: MaptalksInfoWindowOptions = {
  title: '事件日志',
  content: '<div style="padding:8px">查看下方事件日志</div>',
};

function onShowStart() {
  events3.value.unshift(`showstart ${new Date().toLocaleTimeString()}`);
}
function onShowEnd() {
  events3.value.unshift(`showend ${new Date().toLocaleTimeString()}`);
}

const mc4 = ref<MaptalksMapExposed | null>(null);
function doFly4() {
  const parts = searchText.value.split(',').map(Number) as [number, number];
  const m = toValue(mc4.value?.map);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && m) {
    m.flyTo({ center: parts, zoom: 16 });
    events4.value.unshift(`flyTo ${parts.join(',')} ${new Date().toLocaleTimeString()}`);
  }
}
</script>
