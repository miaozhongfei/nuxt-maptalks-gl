import { describe, expect, it, vi } from 'vitest';
import { effectScope, shallowRef } from 'vue';

import { useMaptalksGeoJSON } from '../src/runtime/composables/geo/useMaptalksGeoJSON';
import type { MaptalksGeometry, MaptalksVectorLayer } from '../src/runtime/types';

const { toGeometry } = vi.hoisted(() => ({ toGeometry: vi.fn() }));

vi.mock('../src/runtime/core/geojson-utils', () => ({
  geoJSONToGeometry: (data: unknown) => Promise.resolve(toGeometry(data)),
  geometryToGeoJSON: vi.fn(),
}));

function fakeGeo(id: string) {
  return { id, setSymbol: vi.fn(), remove: vi.fn() } as unknown as MaptalksGeometry;
}
function fakeLayer() {
  const addGeometry = vi.fn();
  return { layer: { addGeometry } as unknown as MaptalksVectorLayer, addGeometry };
}

describe('useMaptalksGeoJSON', () => {
  it('layer 就绪后加载 GeoJSON 并 addGeometry', async () => {
    const geos = [fakeGeo('a'), fakeGeo('b')];
    toGeometry.mockResolvedValue(geos);
    const l = fakeLayer();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeoJSON(shallowRef<MaptalksVectorLayer | null>(l.layer), { data: { type: 'X' } }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalledWith(geos));
    scope.stop();
  });

  it('data 替换后清空旧几何并重建', async () => {
    const first = [fakeGeo('a')];
    const second = [fakeGeo('b')];
    toGeometry.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const l = fakeLayer();
    const data = shallowRef<{ type: string }>({ type: 'A' });
    const scope = effectScope();
    scope.run(() => useMaptalksGeoJSON(shallowRef<MaptalksVectorLayer | null>(l.layer), { data }));
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalledWith(first));
    data.value = { type: 'B' };
    await vi.waitFor(() => expect(first[0]!.remove).toHaveBeenCalled());
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalledWith(second));
    scope.stop();
  });

  it('scope dispose 移除全部几何', async () => {
    const geos = [fakeGeo('a')];
    toGeometry.mockResolvedValue(geos);
    const l = fakeLayer();
    const scope = effectScope();
    scope.run(() =>
      useMaptalksGeoJSON(shallowRef<MaptalksVectorLayer | null>(l.layer), { data: { type: 'X' } }),
    );
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalled());
    scope.stop();
    expect(geos[0]!.remove).toHaveBeenCalled();
  });
});

describe('useMaptalksGeoJSON · 并发取最新', () => {
  it('飞行期间 data 再变化只提交最新（无 lost-update）', async () => {
    const first = [fakeGeo('a')];
    const second = [fakeGeo('b')];
    let resolveFirst!: (v: MaptalksGeometry[]) => void;
    toGeometry
      .mockReturnValueOnce(
        new Promise<MaptalksGeometry[]>((r) => {
          resolveFirst = r;
        }),
      )
      .mockResolvedValueOnce(second);
    const l = fakeLayer();
    const data = shallowRef<{ type: string }>({ type: 'A' });
    const scope = effectScope();
    scope.run(() => useMaptalksGeoJSON(shallowRef<MaptalksVectorLayer | null>(l.layer), { data }));
    data.value = { type: 'B' };
    await vi.waitFor(() => expect(l.addGeometry).toHaveBeenCalledWith(second));
    resolveFirst(first);
    await vi.waitFor(() => expect(first[0]!.remove).toHaveBeenCalled());
    expect(l.addGeometry).not.toHaveBeenCalledWith(first);
    scope.stop();
  });
});
