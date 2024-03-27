import * as UseEcharts from "./use-echarts";
import * as UseFancybox from "./use-fancybox";
import * as UseMouse from "./use-mouse";

export namespace Hooks {
  export const Echarts: typeof UseEcharts = UseEcharts;
  export const Fancybox: typeof UseFancybox = UseFancybox;
  export const Mouse: typeof UseMouse = UseMouse;
}
