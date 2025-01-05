import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        tabler: () => import("@iconify-json/tabler/icons.json").then(i => i.default)
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
      theme: {
        primary: "var(--bleu-theme-color-primary)",
        "1": "var(--bleu-theme-color-1)",
        "2": "var(--bleu-theme-color-2)",
        "3": "var(--bleu-theme-color-3)",
        "4": "var(--bleu-theme-color-4)",
        "5": "var(--bleu-theme-color-5)",
        "6": "var(--bleu-theme-color-6)"
      },
      text: {
        primary: "var(--bleu-text-color-primary)",
        regular: "var(--bleu-text-color-regular)",
        secondary: "var(--bleu-text-color-secondary)",
        placeholder: "var(--bleu-text-color-placeholder)",
        disabled: "var(--bleu-text-color-disabled)"
      },
      bg: {
        primary: "var(--bleu-bg-color)",
        page: "var(--bleu-bg-color-page)",
        overlay: "var(--bleu-bg-color-overlay)"
      },
      border: {
        primary: "var(--bleu-border-color)",
        darker: "var(--bleu-border-color-darker)",
        dark: "var(--bleu-border-color-dark)",
        light: "var(--bleu-border-color-light)",
        lighter: "var(--bleu-border-color-lighter)",
        extraLight: "var(--bleu-border-color-extra-light)"
      }
    }
  },
  rules: [
    [
      /^flow-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/,
      ([, d]) => ({ overflow: `${d}` })
    ]
  ],
  shortcuts: [
    [
      /^f-(([cse])(-([cseba]))*)$/,
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
    [
      /^hover$/,
      () => {
        return `cursor-pointer hover:text-theme-primary transition-all-300`;
      }
    ],
    [
      /^page$/,
      () => {
        return `lt-lg:px-10 xl:px-40 2xl:px-100`;
      }
    ]
  ]
});
