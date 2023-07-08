import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetIcons,
  transformerDirectives
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        tabler: () => import("@iconify-json/tabler/icons.json").then(i => i.default),
        ep: () => import("@iconify-json/ep/icons.json").then(i => i.default)
      }
    })
  ],
  transformers: [
    transformerDirectives({
      applyVariable: ["--uno"]
    })
  ],
  theme: {
    colors: {
      a: "var(--text-a)",
      b: "var(--text-b)",
      c: "var(--text-c)",
      d: "var(--text-d)",
      primary: "var(--text-primary)",
      b1: "var(--bg-1)",
      b2: "var(--bg-2)",
      b3: "var(--bg-3)",
      b4: "var(--bg-4)"
    }
  },
  preflights: [
    {
      getCSS: ({ theme }) => {
        return `
          * {
            color: inherit;
            line-height: 1.7;
            letter-spacing: 0.05rem;
            scroll-behavior: smooth;
            font-family: var(--l-main-family);
            word-break: break-all;
            line-break: anywhere;
            box-sizing: border-box;
          }
        `;
      }
    }
  ],
  rules: [
    [
      /^flow-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/,
      ([, d]) => ({ overflow: `${d}` })
    ],
    [/^letter-spacing-(\d+|\d+\.\d+)$/, ([, d]) => ({ "letter-spacing": `${d}rem` })],
    [/^white-(normal|nowrap)$/, ([, d]) => ({ "white-space": `${d}` })],
    [
      /^font-(art)$/,
      ([, d]) => ({
        "font-family": `var(--l-${d}-family) !important;`,
        "font-size": `var(--l-${d}-size) !important;`
      })
    ]
  ],
  shortcuts: [
    // flex
    [
      /^f-((c|s|e)(-(c|s|e|b|a))*)$/,
      ([, , g1, , g2]) => {
        let style = ``;
        const temps = [
          { k: "c", v: "center" },
          { k: "s", v: "start" },
          { k: "e", v: "end" },
          { k: "b", v: "between" },
          { k: "a", v: "around" }
        ];

        const r1 = temps.find(i => i.k == g1);
        style = `flex items-${r1?.v || "center"} content-${r1?.v || "center"}`;

        if (g2) {
          const r2 = temps.find(i => i.k == g2);
          style += ` justify-${r2?.v || "center"}`;
        }

        return style;
      }
    ],
    // fixed left-0 right-0
    [
      /^fixed-(l(t|b){0,1}|r(t|b){0,1}|(t|b))$/,
      ([, g1]) => {
        let style = `fixed `;
        const temps = [
          { k: "l", v: "left-0" },
          { k: "r", v: "right-0" },
          { k: "t", v: "top-0" },
          { k: "b", v: "bottom-0" }
        ];

        for (let i = 0; i < g1.length; i++) {
          const r = temps.find(r => r.k == g1[i]);
          style += ` ${r?.v}`;
        }

        return style;
      }
    ],
    // 悬停改变字体颜色
    [
      /^hover$/,
      () => {
        return `cursor-pointer hover:text-primary transition-all-300`;
      }
    ],
    // 设置卡片标题
    [
      /^caption$/,
      () => {
        return `text-primary font-art letter-spacing-0.2 f-c-s`;
      }
    ]
  ]
});
