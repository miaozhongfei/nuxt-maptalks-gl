<template>
  <div>
    <div>
      <MaptalksMap
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 480px"
      >
        <MaptalksVectorLayer :options="{ opacity: 0.5 }">
          <MaptalksMarker
            :coordinates="[121.5057, 31.2453]"
            :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <p class="text-sm mt-2 text-muted">静态 opacity: 0.5（声明式组件，无动态滑杆）</p>
    </div>
  </div>
</template>
