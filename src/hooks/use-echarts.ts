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

function renderEChart(dom: HTMLElement, options: any) {
  const theChart = echarts.init(dom);
  theChart.setOption(options);
}

function delayRendering(dom: HTMLElement, options: any, flag?: Ref<number>) {
  if (flag) {
    const clearWatcher = watch(flag, newVal => {
      if (newVal == 1) {
        renderEChart(dom, options);
      } else if (newVal > 1) {
        clearWatcher();
      }
    });
  } else {
    renderEChart(dom, options);
  }
}

export function useRadarChart(dom: HTMLElement) {
  renderEChart(dom, BleuVars.config.chart.tech);
}

export function usePieChart(
  dom: HTMLElement,
  data: { value: number | string; name: string }[],
  flag?: Ref<number>,
  radius?: number | string | string[]
) {
  const options = {
    tooltip: {
      trigger: "item"
    },
    series: [
      {
        type: "pie",
        data,
        radius: radius || "100%",
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

  delayRendering(dom, options, flag);
}

export function useLineChart(
  dom: HTMLElement,
  seriesData: number | string[],
  xAxis: string[],
  flag?: Ref<number>
) {
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" }
    },
    xAxis: {
      type: "category",
      data: xAxis
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
        data: seriesData,
        type: "line",
        areaStyle: {
          color: "rgb(83,102,163)",
          opacity: 0.5
        }
      }
    ]
  };

  delayRendering(dom, options, flag);
}
