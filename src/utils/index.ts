import * as Broswer from "./broswer";
import * as Formatter from "./formatter";
import * as Native from "./native";
import * as Navigation from "./navigation";
import * as PrettifyLog from "./prettify-log";
import * as BleuStorage from "./stoage";
import * as Textual from "./textual";
import * as Random from "./random";

function deepMerge(target: any, source: any) {
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

export {
  Broswer,
  Formatter,
  Textual,
  Navigation,
  Native,
  PrettifyLog,
  BleuStorage,
  Random,
  deepMerge
};
