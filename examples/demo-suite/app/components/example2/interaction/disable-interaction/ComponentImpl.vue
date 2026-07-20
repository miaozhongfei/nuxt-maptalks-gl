<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    :draggable="false"
    :zoomable="false"
    :scrollwheel-zoomable="false"
    :double-click-zoomable="false"
    :touch-zoomable="false"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>
