/**
 * 无类型插件模块声明（ts-plugin 7016 修复）。
 *
 * @description mapbox-gl@1.13.3 与 maptalks.mapboxgl@0.3.4 均不携带类型声明、亦无 @types 包；
 * 示例中以 `any` 断言消费其 API，此处仅声明模块存在，避免 IDE 报「隐式 any」。
 */
declare module 'mapbox-gl';
declare module 'maptalks.mapboxgl';
