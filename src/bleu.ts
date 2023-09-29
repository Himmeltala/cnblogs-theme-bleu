import type { App } from "vue";
import { deepMerge, PrettifyLog } from "./utils";

/**
 * 初始化浏览器 LocalStorage
 */
function initStorage() {
  const ops = BleuStorage.getOptions().value;
  const factedOps = JSON.stringify(BleuStorage.refactor(ops, BleuStorage.getOptionsTemp()));
  localStorage.setItem(KeyVals.OPS_KEY, factedOps);
  document.documentElement.setAttribute("class", ops.theme.mode);
}

/**
 * 创建主题全局变量
 */
function createBleuVars() {
  const __BLEU_CONFIG__ = window["__BLEU_CONFIG__"];

  BleuVars.config = {
    icon: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F52685712-3f98-4dd5-b05b-87cd8b8524c3%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1689215021&t=6944511081f659351480894aa55663eb",
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F52685712-3f98-4dd5-b05b-87cd8b8524c3%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1689215021&t=6944511081f659351480894aa55663eb",
    signature: "Time tick away, dream faded away.",
    status: "🐟",
    images: {
      background: {
        src: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201811%2F01%2F20181101135242_aumss.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1691243994&t=0a99f53883ef9459e648874adcf042f8",
        size: "100%",
        repeat: "no-repeat",
        opacity: 0.03,
        position: "100%"
      },
      home: {
        opacity: 0.5,
        interval: 5000,
        carousel: [
          "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv01.jpg",
          "https://img0.baidu.com/it/u=118351316,3411610480&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
        ],
        disabled: true
      },
      stochastic: [
        "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv01.jpg"
      ]
    },
    header: {
      links: [
        {
          name: "bilibili",
          value: "https://space.bilibili.com/7021686"
        },
        {
          name: "github",
          value: "https://github.com/himmelbleu"
        }
      ]
    },
    theme: {
      cssvar: {
        codeFamily: "Hack"
      }
    },
    echart: {
      color: "#409eff",
      technics: {
        radar: {
          indicator: [
            { name: "Vue", max: 5 },
            { name: "React", max: 5 },
            { name: "JS", max: 5 },
            { name: "TS", max: 5 },
            { name: "Python", max: 5 },
            { name: "C", max: 5 },
            { name: "Java", max: 5 },
            { name: "MySQL", max: 5 },
            { name: "Mybatis", max: 5 }
          ]
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [4, 1, 4, 3, 3.5, 1, 3.5, 2.5, 3.5],
                name: "技能掌握程度"
              }
            ]
          }
        ]
      }
    },
    fancybox: ""
  };

  deepMerge(BleuVars.config, __BLEU_CONFIG__);
}

/**
 * 创建全局 CSS 变量
 */
function createGlobalVars() {
  const style = document.createElement("style");
  const theme = BleuVars.config.theme;

  style.textContent = `
    html {
      --bleu-code-family: ${theme.cssvar.codeFamily || `var(--el-font-family)`}
    }
  `;

  document.head.append(style);
}

/**
 * 创建网站 icon
 */
function createIconDiv() {
  const icon = document.createElement("link");
  icon.rel = "shortcut icon";
  icon.href = BleuVars.config.icon;
  document.head.append(icon);
}

/**
 * 创建 Vue App 节点
 */
function createAppDiv() {
  const app = document.createElement("div");
  app.setAttribute("id", "app");
  document.body.append(app);
}

/**
 * 在 mount Vue 之前
 */
function onBeforeLoad() {
  initStorage();
  createBleuVars();
  createGlobalVars();
  createIconDiv();
  createAppDiv();
}

/**
 * 在 mount Vue 之后
 */
function onAfterLoad() {
  PrettifyLog.primary("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-bleu");
  PrettifyLog.primary(
    "v2.11.0",
    "The Theme was Created By Himmelbleu, and Powered By Vue3 & Vite."
  );
}

/**
 * Bleu 主题代替博客园
 *
 * @param app Vue 对象
 */
export function useBleu(app: App<Element>) {
  onBeforeLoad();

  app.mount("#app");

  onAfterLoad();
}
