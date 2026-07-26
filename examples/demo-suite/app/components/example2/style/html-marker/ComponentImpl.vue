<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="14"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksUIMarker
      :coordinates="[121.5057, 31.2453]"
      content="<div style='font:30px bold sans-serif;color:#34495e;text-shadow:2px 0 #fff'>HTML Marker</div>"
      draggable
    />
  </MaptalksMap>
</template>
