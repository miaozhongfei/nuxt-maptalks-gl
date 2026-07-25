<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <MaptalksLabel
        content="文字标注"
        :coordinates="[121.5057, 31.2453]"
        :options="{ symbol: { textFill: '#dc2626', textSize: 18, textHaloFill: '#fff', textHaloRadius: 2 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
