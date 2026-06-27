<template>
  <div>
    <h1>签名源 · useMaptalksSource + server route</h1>
    <p style="color: #666">
      签名源 'secure' 经 <code>/api/maptalks/sign</code> 换取签名后的
      URL（密钥仅存于服务端、不进前端 bundle），再用 TileLayer 渲染。
    </p>
    <p style="color: #444">
      解析状态：<strong>{{ pending ? '解析中…' : error ? '失败' : '成功' }}</strong>
    </p>
    <p v-if="source">
      签名后的 urlTemplate：<code data-testid="signed-url">{{ source.urlTemplate }}</code>
    </p>
    <p v-if="error" style="color: #f56c6c">{{ error.code }} — {{ error.message }}</p>
    <div ref="el" data-testid="map" class="map" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
  const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 });

// 展示签名源的解析结果（urlTemplate / pending / error）
const { source, pending, error } = useMaptalksSource('secure');
// 同时用签名源渲染底图（预设内部会走同一条签名解析路径）
useMaptalksTileLayer(map, { source: 'secure' });
</script>

<style scoped>
.map {
  height: 460px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
