import { brush, quadtree, range, select } from 'd3'
import type { Quadtree, Selection } from 'd3'

const W = 600
const H = 300

type D3Point = [number, number, boolean, boolean]

/** 注入自定义 CSS 样式 */
function injectStyle(container: HTMLElement): void {
  container.innerHTML = ''
  const style = document.createElement('style')
  style.textContent = [
    '.point{fill:#999;stroke:#fff}',
    '.point.scanned{fill:orange;fill-opacity:1;stroke:brown}',
    '.point.selected{fill:red;fill-opacity:1}',
    '.node{fill:none;stroke:#ccc;shape-rendering:crispEdges}',
    '.brush .selection{stroke:#fff;fill-opacity:.125;shape-rendering:crispEdges}',
  ].join('')
  container.append(style)
}

/** 渲染四叉树节点矩形 */
function renderNodes(svg: Selection<SVGSVGElement, unknown, null, undefined>, root: Quadtree<D3Point>): void {
  const nodes: { x: number; y: number; width: number; height: number }[] = []
  root.visit((_node, x1, y1, x2, y2) => {
    nodes.push({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 })
    return false
  })
  svg.selectAll('.node')
    .data(nodes)
    .enter().append('rect')
    .attr('class', 'node')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
}

/** 渲染数据点圆 */
function renderPoints(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  data: D3Point[],
): Selection<SVGCircleElement, D3Point, SVGElement, unknown> {
  return svg.selectAll('.point')
    .data(data)
    .enter().append('circle')
    .attr('class', 'point')
    .attr('cx', (d) => d[0])
    .attr('cy', (d) => d[1])
    .attr('r', 4)
}

/** 挂载画刷交互 */
function mountBrush(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  root: Quadtree<D3Point>,
  data: D3Point[],
  circle: Selection<SVGCircleElement, D3Point, SVGElement, unknown>,
): void {
  const brushGen = brush<SVGGElement>()
    .extent([[0, 0], [W, H]])
    .on('brush', ({ selection }) => {
      if (!selection) return
      const [[x0, y0], [x1, y1]] = selection as [[number, number], [number, number]]
      for (const p of data) { p[2] = false; p[3] = false }
      root.visit((node, qx1, qy1, qx2, qy2) => {
        const nd = node as { data?: D3Point }
        const p = nd.data
        if (p) {
          p[2] = true
          p[3] = p[0] >= x0 && p[0] < x1 && p[1] >= y0 && p[1] < y1
        }
        return qx1 >= x1 || qy1 >= y1 || qx2 < x0 || qy2 < y0
      })
      circle.classed('scanned', (d) => d[2])
      circle.classed('selected', (d) => d[3])
    })

  const g = svg.append('g').attr('class', 'brush').call(brushGen)
  g.call(brushGen.move as unknown as () => void, [[100, 100], [200, 200]])
}

/**
 * 在给定容器中创建 D3 四叉树 + 画刷交互可视化（对应官网 5.30）。
 *
 * @description 生成 5000 随机点，建 d3.quadtree，渲染节点矩形与数据点圆，
 * 挂载 d3.brush 框选，高亮 scanned/selected 点。
 * @param {HTMLElement} container - UIMarker 内的 .d3-container div
 *
 * @example
 * const dom = uiMarker.getDOM()?.querySelector('.d3-container') as HTMLElement
 * if (dom) createD3Viz(dom)
 */
export function createD3Viz(container: HTMLElement): void {
  injectStyle(container)

  const data: D3Point[] = range(5000).map(() => [Math.random() * W, Math.random() * H, false, false])

  const quadtreeRoot = quadtree<D3Point>(
    data,
    (d) => d[0],
    (d) => d[1],
  ).extent([[-1, -1], [W + 1, H + 1]])

  const svg = select(container).append('svg').attr('width', W).attr('height', H)

  renderNodes(svg, quadtreeRoot)
  const circle = renderPoints(svg, data)
  mountBrush(svg, quadtreeRoot, data, circle)
}
