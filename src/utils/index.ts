export * as Broswer from "./broswer";
export * as Formatter from "./formatter";
export * as Native from "./native";
export * as Navigation from "./navigation";
export * as PrettifyLog from "./prettify-log";
export * as BleuStorage from "./stoage";
export * as Textual from "./textual";
export * as Random from "./random";

export function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
