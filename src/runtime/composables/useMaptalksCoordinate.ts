import type { MaptalksCoordinate, MaptalksMap } from '../types';

/** 可插拔坐标转换函数签名 */
export type MaptalksCoordinateTransform = (
  coord: MaptalksCoordinate,
  from: string,
  to: string,
) => MaptalksCoordinate;

/** useMaptalksCoordinate 的可选项 */
export interface UseMaptalksCoordinateOptions {
  /** 自定义坐标系/投影转换函数（maptalks 未覆盖时由项目注入，如 proj4 包装） */
  transform?: MaptalksCoordinateTransform;
}

/** useMaptalksCoordinate 的返回 */
export interface UseMaptalksCoordinateReturn {
  /** 坐标系/投影互转（依赖注入的 transform，from===to 时原样返回） */
  convert: (coord: MaptalksCoordinate, from: string, to: string) => MaptalksCoordinate;
  /** 地理坐标 → 容器像素点（委托地图原生方法） */
  toContainerPoint: (map: MaptalksMap, coord: MaptalksCoordinate) => unknown;
  /** 容器像素点 → 地理坐标（委托地图原生方法） */
  toCoordinate: (map: MaptalksMap, point: { x: number; y: number }) => unknown;
}

// 地理坐标 → 容器像素点（委托 map.coordinateToContainerPoint，无该方法时返回 null）
function toContainerPoint(map: MaptalksMap, coord: MaptalksCoordinate): unknown {
  const fn = map.coordinateToContainerPoint as ((c: MaptalksCoordinate) => unknown) | undefined;
  return typeof fn === 'function' ? fn.call(map, coord) : null;
}

// 容器像素点 → 地理坐标（委托 map.containerPointToCoordinate，无该方法时返回 null）
function toCoordinate(map: MaptalksMap, point: { x: number; y: number }): unknown {
  const fn = map.containerPointToCoordinate as
    | ((p: { x: number; y: number }) => unknown)
    | undefined;
  return typeof fn === 'function' ? fn.call(map, point) : null;
}

/**
 * 坐标转换助手：可插拔的坐标系/投影互转 + 容器像素与地理坐标互转。
 *
 * @description maptalks 自带的坐标系互转能力之外，跨 CRS/投影的转换由项目通过 `transform` 注入
 * （如包装 proj4）。容器像素与地理坐标互转直接委托地图原生方法。本助手无副作用、无需清理。
 * @param {UseMaptalksCoordinateOptions} [options] - 可选项，注入 `transform`
 * @returns {UseMaptalksCoordinateReturn} `{ convert, toContainerPoint, toCoordinate }`
 *
 * @example
 * import proj4 from 'proj4';
 * const { convert } = useMaptalksCoordinate({
 *   transform: (c, from, to) => {
 *     const [x, y] = proj4(from, to, [c.x, c.y]);
 *     return { x, y };
 *   },
 * });
 * const wgs = convert({ x: 12961234, y: 4861234 }, 'EPSG:3857', 'EPSG:4326');
 */
export function useMaptalksCoordinate(
  options: UseMaptalksCoordinateOptions = {},
): UseMaptalksCoordinateReturn {
  // 坐标系/投影互转：from===to 原样返回；否则依赖注入的 transform
  function convert(coord: MaptalksCoordinate, from: string, to: string): MaptalksCoordinate {
    if (from === to) return coord;
    if (!options.transform) {
      throw new Error('useMaptalksCoordinate.convert：在不同坐标系间转换需要先注入 transform 函数');
    }
    return options.transform(coord, from, to);
  }

  return { convert, toContainerPoint, toCoordinate };
}
