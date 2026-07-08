<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 信息框</h1>
    <p class="text-muted mb-6">演示 <code>MaptalksInfoWindow</code> 与 <code>MaptalksMarkerInfoWindow</code>。</p>

    <UCard class="mb-6"><template #header><h2 class="font-semibold">地图点击弹框</h2><UBadge color="primary" variant="subtle">组件</UBadge></template>
      <MaptalksMap ref="mapCmp1" :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height:380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksInfoWindow :coordinates="iwCoord" :visible="showIW"><div><strong>地图点击信息框</strong><p>经度：{{ iwCoord[0].toFixed(6) }}</p><p>纬度：{{ iwCoord[1].toFixed(6) }}</p><p>{{ iwTime }}</p></div></MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer><span class="text-sm text-muted">点击地图弹出。</span></template>
    </UCard>

    <UCard class="mb-6"><template #header><h2 class="font-semibold">Marker 点击弹框</h2><UBadge color="primary" variant="subtle">组件</UBadge></template>
      <MaptalksMap ref="mapCmp2" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.47,31.23]" :symbol="{markerType:'ellipse',markerFill:'#2563eb',markerWidth:22,markerHeight:22}" @click="onMarkerClick('A',[121.47,31.23])" />
          <MaptalksMarker :coordinates="[121.5,31.24]" :symbol="{markerType:'ellipse',markerFill:'#dc2626',markerWidth:22,markerHeight:22}" @click="onMarkerClick('B',[121.5,31.24])" />
        </MaptalksVectorLayer>
        <MaptalksInfoWindow :coordinates="mkCoord" :visible="showMK"><div style="min-width:180px"><strong>Marker {{ mkLabel }}</strong><p>[{{ mkCoord[0].toFixed(5) }}, {{ mkCoord[1].toFixed(5) }}]</p><p>{{ mkTime }}</p><div style="display:flex;gap:4px"><button class="iw-btn" @click="mkCount+=1">👍 {{ mkCount }}</button><button class="iw-btn" @click="closeMK">关闭</button></div></div></MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer><span class="text-sm text-muted">点蓝/红 Marker。</span></template>
    </UCard>

    <!-- 卡片 3：MaptalksMarkerInfoWindow——对照 composable 页 bindCloseBtn 模式，在 @click 直接 open+bind -->
    <UCard class="mb-6"><template #header><h2 class="font-semibold">MaptalksMarkerInfoWindow · 每个 Marker 独立信息框 · 自定义关闭</h2><UBadge color="primary" variant="subtle">组件</UBadge></template>
      <p class="text-sm text-muted mb-2"><code>&lt;MaptalksMarkerInfoWindow&gt;</code> 放在 <code>&lt;MaptalksMarker&gt;</code> 内，autoOpenOn 默认 'click' 处理打开，<code>@click</code> 只绑 <code>bindCloseBtn</code>（通过 expose 的 <code>close()</code> 调 <code>closeInfoWindow</code>）。</p>
      <MaptalksMap ref="mapCmp3" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:400px">
        <MaptalksTileLayer source="osm" />
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.47,31.23]" :symbol="{markerType:'ellipse',markerFill:'#2563eb',markerWidth:24,markerHeight:24}" @click="bindCloseBtn(miwA)">
            <MaptalksMarkerInfoWindow ref="miwA" title="" :custom="true">
              <div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
                <div style="background:#2563eb;color:#fff;padding:4px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center"><span>东门店 A</span><span class="mt-miw-close" style="cursor:pointer;font-size:16px;line-height:1">×</span></div>
                <div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[121.47000, 31.23000]</div>
              </div>
            </MaptalksMarkerInfoWindow>
          </MaptalksMarker>
          <MaptalksMarker :coordinates="[121.5,31.24]" :symbol="{markerType:'ellipse',markerFill:'#dc2626',markerWidth:24,markerHeight:24}" @click="bindCloseBtn(miwB)">
            <MaptalksMarkerInfoWindow ref="miwB" title="" :custom="true">
              <div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
                <div style="background:#dc2626;color:#fff;padding:4px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center"><span>西门店 B</span><span class="mt-miw-close" style="cursor:pointer;font-size:16px;line-height:1">×</span></div>
                <div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[121.50000, 31.24000]</div>
              </div>
            </MaptalksMarkerInfoWindow>
          </MaptalksMarker>
          <MaptalksMarker :coordinates="[121.52,31.22]" :symbol="{markerType:'ellipse',markerFill:'#16a34a',markerWidth:24,markerHeight:24}" @click="bindCloseBtn(miwC)">
            <MaptalksMarkerInfoWindow ref="miwC" title="" :custom="true">
              <div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
                <div style="background:#16a34a;color:#fff;padding:4px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center"><span>南门店 C</span><span class="mt-miw-close" style="cursor:pointer;font-size:16px;line-height:1">×</span></div>
                <div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[121.52000, 31.22000]</div>
              </div>
            </MaptalksMarkerInfoWindow>
          </MaptalksMarker>
        </MaptalksVectorLayer>
      </MaptalksMap>
      <template #footer><div class="flex gap-2 items-center flex-wrap"><UButton size="sm" :color="cmpAutoClose ? 'success' : 'neutral'" variant="soft" @click="cmpAutoClose = !cmpAutoClose">点别处关闭：{{ cmpAutoClose ? '开' : '关' }}</UButton><span class="text-sm text-muted">点 Marker 弹框，点「×」或点别处关闭。</span></div></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1
const iwCoord = ref<[number,number]>([121.4737,31.2304]); const showIW=ref(false); const iwTime=ref('');
const mapCmp1=ref<{map:ReturnType<typeof useMaptalks>['map']}|null>(null); const map1=computed(()=>mapCmp1.value?.map??null);
useMaptalksEvents(map1,{click:(e:unknown)=>{const ev=e as {coordinate:{x:number;y:number}};iwCoord.value=[ev.coordinate.x,ev.coordinate.y];iwTime.value=new Date().toLocaleTimeString();showIW.value=true}});

// 卡片 2
const mkCoord=ref<[number,number]>([121.47,31.23]); const mkLabel=ref('A'); const mkTime=ref(''); const mkCount=ref(0); const showMK=ref(false);
function onMarkerClick(label:string,coord:[number,number]){mkLabel.value=label;mkCoord.value=coord;mkTime.value=new Date().toLocaleTimeString();mkCount.value=0;showMK.value=true}
function closeMK(){showMK.value=false}

// 卡片 3 —— 对照 composable 页 bindCloseBtn 模式
const miwA = ref<{ open:()=>void; close:()=>void }|null>(null);
const miwB = ref<{ open:()=>void; close:()=>void }|null>(null);
const miwC = ref<{ open:()=>void; close:()=>void }|null>(null);
const cmpAutoClose = ref(true);
const mapCmp3=ref<{map:ReturnType<typeof useMaptalks>['map']}|null>(null); const map3=computed(()=>mapCmp3.value?.map??null);

// 同 composable 页 bindCloseBtn(g) 模式：在 @click 直接调用 open+bindCloseBtn
function bindCloseBtn(miw: typeof miwA) {
  setTimeout(() => {
    // innerHTML 让按钮在隐藏 wrapper + 面板两处 DOM，取 visible 的（offsetParent !== null）
    for (const el of document.querySelectorAll('.mt-miw-close')) {
      const btn = el as HTMLElement;
      if (btn.offsetParent !== null) {
        btn.addEventListener('click', () => { miw.value?.close(); }, { once: true });
        return;
      }
    }
  }, 50);
}

let cmpOpenTime = 0;
useMaptalksEvents(map3, { click: () => { if (!cmpAutoClose.value || Date.now()-cmpOpenTime<250) return; [miwA,miwB,miwC].forEach(r=>r.value?.close()); cmpOpenTime=Date.now(); } });
</script>
