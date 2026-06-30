import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  declaration: true,
  // rollup: {
  //   inlineDependencies: true,
  //   esbuild: { minify: true },
  // },
  externals: [
    // Nuxt 全家桶（必须）
    'nuxt',
    '@nuxt/schema',
    '@nuxt/kit',

    // Vue 全家桶（可选）
    'vue',
    '@vue/shared',
    '@vue/reactivity',
    '@vue/runtime-core',
    '@vue/compiler-core',

    // 其他依赖（可选）
    'defu',
    'consola',
    'h3',

    // peerDependency：由各项目自带，绝不打包进产物
    'maptalks-gl',
  ],
});
