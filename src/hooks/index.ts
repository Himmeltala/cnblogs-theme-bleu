import * as UseEchartsModule from "./use-echarts";
import * as UseFancyboxModule from "./use-fancybox";
import * as UseMouseModule from "./use-mouse";

export namespace Hooks {
  export const Echarts: typeof UseEchartsModule = UseEchartsModule;
  export const Fancybox: typeof UseFancyboxModule = UseFancyboxModule;
  export const Mouse: typeof UseMouseModule = UseMouseModule;
}
