import * as echarts from "echarts/core";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent
} from "echarts/components";
import { BarChart, LineChart, PieChart, RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  VisualMapComponent,
  RadarChart,
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart
]);

/**
 * 正常渲染图形
 *
 * @param dom 图形实例
 * @param options 配置选项
 */
function rendering(dom: HTMLElement, options: any) {
  const theChart = echarts.init(dom);
  theChart.setOption(options);
}

/**
 * 渲染图表
 *
 * @param config
 */
export function use(config: { dom: HTMLElement; options?: any }) {
  const options = {
    tooltip: {
      trigger: "item"
    }
  };

  rendering(config.dom, { ...options, ...config.options });
}
