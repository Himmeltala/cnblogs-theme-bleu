import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { RadarChart, PieChart, LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarChart,
  CanvasRenderer,
  PieChart,
  LineChart
]);

/**
 * 正常渲染图形
 *
 * @param dom 图形实例
 * @param options 配置选项
 */
function normalRendering(dom: HTMLElement, options: any) {
  const theChart = echarts.init(dom);
  theChart.setOption(options);
}

/**
 * 延迟渲染图形
 *
 * @param dom 图形实例
 * @param options 配置选项
 * @param flag 标志，判断打开次数
 */
function delayRendering(dom: HTMLElement, options: any, flag?: Ref<number>) {
  if (flag) {
    const clearWatcher = watch(flag, newVal => {
      if (newVal == 1) {
        normalRendering(dom, options);
      } else if (newVal > 1) {
        clearWatcher();
      }
    });
  } else {
    normalRendering(dom, options);
  }
}

/**
 * 渲染雷达图
 *
 * @param dom 雷达图实例
 */
export function useRadarChart(dom: HTMLElement) {
  Object.assign(BleuVars.config.echart.technics.series[0], {
    areaStyle: { color: `${BleuVars.config.theme.color}` },
    lineStyle: { color: `${BleuVars.config.theme.color}a6` },
    itemStyle: { color: `${BleuVars.config.theme.color}a6` }
  });

  normalRendering(dom, BleuVars.config.echart.technics);
}

/**
 * 渲染饼状图
 *
 * @param config dom、data、flag、radius
 */
export function usePieChart(config: {
  dom: HTMLElement;
  data: { value: number | string; name: string }[];
  flag?: Ref<number>;
  radius?: number | string | string[];
}) {
  const options = {
    tooltip: {
      trigger: "item"
    },
    series: [
      {
        type: "pie",
        data: config.data,
        radius: config.radius || "100%",
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  };

  delayRendering(config.dom, options, config.flag);
}

/**
 * 渲染条形图
 *
 * @param config dom、data、xAxis、flag、series
 */
export function useLineChart(config: {
  dom: HTMLElement;
  data: number | string[];
  xAxis: string[];
  flag?: Ref<number>;
}) {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" }
    },
    xAxis: {
      type: "category",
      data: config.xAxis
    },
    yAxis: {
      type: "value",
      name: "随笔数",
      position: "left",
      axisLabel: {
        formatter: "{value} 篇"
      }
    },
    series: [
      {
        name: "篇数",
        data: config.data,
        type: "line",
        areaStyle: { color: `${BleuVars.config.theme.color}` },
        lineStyle: { color: `${BleuVars.config.theme.color}a6` },
        itemStyle: { color: `${BleuVars.config.theme.color}a6` }
      }
    ]
  };

  delayRendering(config.dom, options, config.flag);
}
