import type { MaptalksMap } from '../types';

/**
 * `MaptalksMap` 组件的运行时可同步快捷 prop 集合。
 *
 * @description 描述可在运行时改 prop 同步到地图的高频字段，均可选。
 *
 * @example
 * const props: MaptalksMapConfigProps = { minZoom: 2, dragPitch: true };
 */
export interface MaptalksMapConfigProps {
  /** 最小缩放级别 */
  minZoom?: number;
  /** 最大缩放级别 */
  maxZoom?: number;
  /** 是否允许拖拽平移 */
  draggable?: boolean;
  /** 是否允许拖拽改变俯仰 */
  dragPitch?: boolean;
  /** 是否允许拖拽旋转方位 */
  dragRotate?: boolean;
  /** 是否允许缩放 */
  zoomable?: boolean;
}

/**
 * 把组件快捷 prop 应用到地图（命令式同步）。
 *
 * @description 缩放区间走 setMinZoom/setMaxZoom；交互开关合并为一次 `config(...)`。
 * map 为 null（SSR / 未就绪）时 no-op；仅应用「已定义」的字段。
 * @param {MaptalksMap | null} map - 地图实例
 * @param {MaptalksMapConfigProps} props - 待应用的快捷 prop
 * @returns {void}
 *
 * @example
 * applyMapConfigProps(map.value, { minZoom: 2, maxZoom: 18, dragPitch: true });
 */
export function applyMapConfigProps(map: MaptalksMap | null, props: MaptalksMapConfigProps): void {
  if (!map) return;
  if (props.minZoom !== undefined) map.setMinZoom(props.minZoom);
  if (props.maxZoom !== undefined) map.setMaxZoom(props.maxZoom);
  const conf: Record<string, boolean> = {};
  if (props.draggable !== undefined) conf.draggable = props.draggable;
  if (props.dragPitch !== undefined) conf.dragPitch = props.dragPitch;
  if (props.dragRotate !== undefined) conf.dragRotate = props.dragRotate;
  if (props.zoomable !== undefined) conf.zoomable = props.zoomable;
  if (Object.keys(conf).length > 0) map.config(conf);
}
