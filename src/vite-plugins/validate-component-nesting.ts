import { baseParse, NodeTypes } from '@vue/compiler-core'
import type { Plugin } from 'vite'

/** @vue/compiler-core AST 节点位置信息 */
interface Loc {
  start: { line: number; column: number; offset: number }
  end: { line: number; column: number; offset: number }
  source: string
}

/** 嵌套关系违规记录 */
interface NestingError {
  tag: string
  parent: string
  loc: Loc
}

/** 必须在 MaptalksMap 内使用的组件 */
const MAP_CHILDREN = new Set([
  'MaptalksTileLayer',
  'MaptalksVectorTileLayer',
  'MaptalksGroupGLLayer',
  'MaptalksGLTFLayer',
  'MaptalksVectorLayer',
  'MaptalksZoomControl',
  'MaptalksScaleControl',
  'MaptalksAttributionControl',
  'MaptalksCompassControl',
  'MaptalksAreaTool',
  'MaptalksDistanceTool',
  'MaptalksInfoWindow',
])

/** 必须在 MaptalksVectorLayer 内使用的组件 */
const VECTOR_CHILDREN = new Set([
  'MaptalksMarker',
  'MaptalksLineString',
  'MaptalksPolygon',
  'MaptalksCircle',
  'MaptalksRectangle',
  'MaptalksEllipse',
  'MaptalksSector',
  'MaptalksTextBox',
  'MaptalksLabel',
  'MaptalksMultiPoint',
  'MaptalksMultiLineString',
  'MaptalksMultiPolygon',
  'MaptalksGeoJSON',
])

/** 必须在 MaptalksMarker 内使用的组件 */
const MARKER_CHILDREN = new Set([
  'MaptalksMarkerInfoWindow',
])

/** 透明的结构标签——不影响实际的父子层级 */
const STRUCTURAL_TAGS = new Set([
  'template',
  'slot',
  'Transition',
  'TransitionGroup',
  'Teleport',
  'Suspense',
  'KeepAlive',
  'component',
])

/**
 * 遍历 template AST 子树，收集嵌套关系违规。
 *
 * @param {unknown[]} children - 当前节点的子节点列表
 * @param {string[]} parentStack - 从根到当前的标签名栈（不含结构标签）
 * @param {NestingError[]} errors - 已收集的错误列表
 */
function walkAST(
  children: unknown[],
  parentStack: string[],
  errors: NestingError[],
): void {
  for (const child of children) {
    const node = child as Record<string, unknown>
    if (node.type !== NodeTypes.ELEMENT) continue
    const tag = node.tag as string | undefined
    if (!tag) continue

    // 在 parentStack 中找到最近的非结构父标签
    let effectiveParent: string | undefined
    for (let i = parentStack.length - 1; i >= 0; i--) {
      const p = parentStack[i]
      if (p !== undefined && !STRUCTURAL_TAGS.has(p)) {
        effectiveParent = p
        break
      }
    }

    if (MAP_CHILDREN.has(tag)) {
      if (effectiveParent !== 'MaptalksMap') {
        errors.push({ tag, parent: 'MaptalksMap', loc: node.loc as Loc })
      }
    } else if (VECTOR_CHILDREN.has(tag) && effectiveParent !== 'MaptalksVectorLayer') {
      errors.push({ tag, parent: 'MaptalksVectorLayer', loc: node.loc as Loc })
    } else if (MARKER_CHILDREN.has(tag) && effectiveParent !== 'MaptalksMarker') {
      errors.push({ tag, parent: 'MaptalksMarker', loc: node.loc as Loc })
    }

    // 结构标签不加入 parentStack（不影响实际层级）
    const newStack = STRUCTURAL_TAGS.has(tag) ? parentStack : [...parentStack, tag]
    const subChildren = node.children as unknown[] | undefined
    if (subChildren) walkAST(subChildren, newStack, errors)
  }
}

/**
 * Vite 插件：编译期校验 maptalks 声明式组件的嵌套关系。
 *
 * @description 必须以 error 级别报告（与运行时 throw 行为一致）。
 * 图层 / 控件 / 工具 / InfoWindow 必须在 MaptalksMap 内；
 * 几何组件必须在 MaptalksVectorLayer 内。
 * @returns {Plugin} Vite 插件实例
 */
export function createValidateNestingPlugin(): Plugin {
  return {
    name: 'nuxt-maptalks-gl:validate-nesting',
    enforce: 'pre',
    transform(code, id) {
      // 仅检查 .vue 文件，且快速跳过不含 Maptalks 组件的文件
      if (!id.endsWith('.vue')) return
      if (!code.includes('Maptalks')) return

      // 提取 template 块内容
      const templateMatch = /<template[^>]*>([\s\S]*?)<\/template>/iu.exec(code)
      if (!templateMatch) return

      const template = templateMatch[1]
      if (!template) return
      // 二次确认模板中确实有 maptalks 组件
      if (!template.includes('Maptalks')) return

      let ast: { children: unknown[] }
      try {
        ast = baseParse(template, { comments: true }) as { children: unknown[] }
      } catch {
        // 非标准模板语法（如 pug）会解析失败，静默跳过
        return
      }

      const errors: NestingError[] = []
      walkAST(ast.children, [], errors)

      if (errors.length > 0) {
        const messages = errors.map(
          (e) =>
            `[nuxt-maptalks-gl] ${e.tag} 必须在 ${e.parent} 内使用（第 ${e.loc.start.line} 行第 ${e.loc.start.column} 列）`,
        )
        this.error(messages.join('\n'))
      }
    },
  }
}
