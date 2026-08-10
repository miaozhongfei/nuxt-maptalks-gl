import type { MaptalksCoordinate, MaptalksMap } from '../../types';

/**
 * 可插拔坐标转换函数签名。
 *
 * @description 由项目注入的自定义坐标系/投影互转函数（如包装 proj4），用于 maptalks 自身不支持的 CRS 转换。
 * @param {MaptalksCoordinate} coord - 源坐标 `{ x, y }` 或 `{ x, y, z }`
 * @param {string} from - 源坐标系标识（如 `'EPSG:3857'`）
 * @param {string} to - 目标坐标系标识（如 `'EPSG:4326'`）
 * @returns {MaptalksCoordinate} 转换后的坐标
 *
 * @example
 * import proj4 from 'proj4';
 * const transform: MaptalksCoordinateTransform = (c, from, to) => {
 *   const [x, y] = proj4(from, to, [c.x, c.y]);
 *   return { x, y };
 * };
 */
export type MaptalksCoordinateTransform = (
  coord: MaptalksCoordinate,
  from: string,
  to: string,
) => MaptalksCoordinate;

/**
 * useMaptalksCoordinate 的可选项。
 *
 * @description 配置坐标转换助手的行为。通过注入自定义 `transform` 函数扩展坐标系/投影互转能力，
 * 覆盖 maptalks 自带的 CRS 支持之外的转换需求（如不同 EPSG 投影间的转换）。
 *
 * @example
 * const opts: UseMaptalksCoordinateOpts = {
 *   transform: (c, from, to) => { const [x, y] = proj4(from, to, [c.x, c.y]); return { x, y }; },
 * };
 */
export interface UseMaptalksCoordinateOpts {
  /** 自定义坐标系/投影转换函数（maptalks 未覆盖时由项目注入，如 proj4 包装） */
  transform?: MaptalksCoordinateTransform;
}

/**
 * useMaptalksCoordinate 的返回值。
 *
 * @description 提供三个坐标转换方法：`convert`（坐标系/投影互转）、`toContainerPoint`（地理→像素）、
 * `toCoordinate`（像素→地理）。纯函数，无副作用。
 *
 * @example
 * const { convert, toContainerPoint } = useMaptalksCoordinate();
 * const wgs = convert({ x: 12961234, y: 4861234 }, 'EPSG:3857', 'EPSG:4326');
 * const px = toContainerPoint(map, { x: 121, y: 31 });
 */
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
 * @param {UseMaptalksCoordinateOpts} [options] - 可选项，注入 `transform`
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
  options: UseMaptalksCoordinateOpts = {},
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
