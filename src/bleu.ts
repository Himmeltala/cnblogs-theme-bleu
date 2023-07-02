function onLoadedBleu() {
  document.documentElement.style.setProperty(
    "--l-main-family",
    BleuVars.config.font?.main?.name || `var(--el-font-family)`
  );

  document.documentElement.style.setProperty(
    "--l-code-family",
    BleuVars.config.font?.code?.name || `var(--el-font-family)`
  );
  document.documentElement.style.setProperty(
    "--l-code-size",
    BleuVars.config.font?.code?.size || "0.8rem"
  );

  document.documentElement.style.setProperty(
    "--l-art-family",
    BleuVars.config.font?.art?.name || `var(--el-font-family)`
  );
  document.documentElement.style.setProperty(
    "--l-art-size",
    BleuVars.config.font?.art?.size || "1.2rem"
  );

  const oldst = BleuStorage.getOptions().value;
  const newst = JSON.stringify(BleuStorage.refactor(oldst, BleuStorage.getOptionsTemp()));
  localStorage.setItem(`l-${BleuVars.getBlogApp()}-setting`, newst);
  document.documentElement.setAttribute("class", oldst.theme.mode);
}

function beforeUseBleu() {
  const app = document.createElement("div");
  app.setAttribute("id", "app");
  document.body.append(app);
}

function afterUseBleu() {
  const icon = document.createElement("link");
  icon.rel = "shortcut icon";
  icon.href = BleuVars.config.icon || "";
  document.head.append(icon);

  PrettifyLog.primary("GitHub", "https://github.com/Himmelbleu/cnblogs-theme-bleu");
  PrettifyLog.primary("v2.7.3", "The Theme was Created By Himmelbleu, and Powered By Vue3 & Vite.");
}

export function useBleu(develop: Function, product: Function) {
  beforeUseBleu();

  if (import.meta.env.PROD) {
    BleuVars.config = window["__BLEU_CONFIG__"];
    onLoadedBleu();
    product();
  } else if (import.meta.env.DEV) {
    BleuVars.config = {
      signature: "Time tick away, dream faded away.",
      avatar:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F52685712-3f98-4dd5-b05b-87cd8b8524c3%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1689215021&t=6944511081f659351480894aa55663eb",
      images: {
        background: {
          src: "https://th.bing.com/th/id/R.e79036ab9e7ef09bd5951536125c60ac?rik=qzIaIiYX81%2fOAA&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20181103%2ffeaa7d14883047fb81bbaa16f681f583.jpeg&ehk=hywgeurG%2fR6NTPM5A6bkA4YGllkcUFzqDTWm%2fxfDeDU%3d&risl=&pid=ImgRaw&r=0"
        },
        arbeiten: [
          "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv01.jpg",
          "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv02.jpg",
          "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv03.jpg",
          "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv04.jpg"
        ],
        home: {
          carousel: [
            "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv01.jpg",
            "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv02.jpg",
            "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv03.jpg",
            "https://anime.shochiku.co.jp/sukimega/wp-content/themes/sukimega_first_theme/common2/images/top_content_kv04.jpg"
          ],
          disabled: true
        }
      },
      chart: {
        tech: {
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
              areaStyle: {},
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
      font: {
        code: {
          name: "Hack, LXGW WenKai"
        },
        main: {
          name: "LXGW WenKai"
        },
        art: {
          name: "ZCOOL KuaiLe"
        }
      }
    };
    onLoadedBleu();
    develop();
  }

  afterUseBleu();
}
