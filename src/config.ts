import type { App } from "vue";

/**
 * 初始化浏览器 LocalStorage
 */
function initStorage() {
  const options = Utils.Storage.getOptions().value;
  const refactoringOfOptions = JSON.stringify(
    Utils.Storage.optionsRefactor(options, Utils.Storage.getOptionsTemplate())
  );
  localStorage.setItem(Consts.OPSTIONS_KEY, refactoringOfOptions);
  document.documentElement.setAttribute("class", options.theme.mode);
}

/**
 * 创建主题全局变量
 */
function createConsts() {
  const __BLEU_CONFIG__ = window["__BLEU_CONFIG__"];

  Consts.config = {
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
      paths: [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-git" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 15v-6" /><path d="M15 11l-2 -2" /><path d="M11 7l-1.9 -1.9" /><path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0z" /></svg>`,
          value: "https://space.bilibili.com/7021686"
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-git" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 15v-6" /><path d="M15 11l-2 -2" /><path d="M11 7l-1.9 -1.9" /><path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0z" /></svg>`,
          value: "https://github.com/himmelbleu"
        }
      ]
    },
    theme: {
      cssvar: {
        codeFamily: "Hack"
      }
    },
    welcome: {
      texts: [
        "一位 Web <Developer />",
        "喜欢日漫、游戏",
        "技术栈 Vue.js、React.js、Python、Java",
        "座右铭 时光飞逝，梦想消逝！"
      ]
    },
    diagram: {
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

  Utils.deepMerge(Consts.config, __BLEU_CONFIG__);
}

/**
 * 创建全局 CSS 变量
 */
function createGlobalVars() {
  const style = document.createElement("style");
  const theme = Consts.config.theme;

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
  icon.href = Consts.config.icon;
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
  createConsts();
  createGlobalVars();
  createIconDiv();
  createAppDiv();
}

/**
 * 在 mount Vue 之后
 */
function onAfterLoad() {
  Utils.PrettifyLog.primary("GitHub", "https://github.com/Himmeltala/cnblogs-theme-bleu");
  Utils.PrettifyLog.primary(
    "v1.2.0",
    "The Theme was Created By Himmeltala, and Powered By Vue3 & Vite."
  );
}

/**
 * 代替博客园
 *
 * @param app Vue 对象
 */
export function useTheme(app: App<Element>) {
  onBeforeLoad();

  app.mount("#app");

  onAfterLoad();
}
