import { Rule, UserShortcuts } from "unocss";

const rules = <Rule<any>[]>[
  // font size
  [/^l-([a-z]*)-size$/, ([, d]) => ({ "font-size": `var(--l-${d}-size) !important` })],
  // l-size-1
  [/^l-size-(\d*)$/, ([, d]) => ({ "font-size": `var(--l-size-${d}) !important` })],
  // font color
  [/^l-([a-z]*)-color$/, ([, d]) => ({ color: `var(--l-${d}-color) !important` })],
  // l-color-1
  [/^l-color-(\d*)$/, ([, d]) => ({ color: `var(--l-color-${d}) !important` })],
  // l-hight-color-1
  [/^l-hight-color-(\d*)$/, ([, d]) => ({ color: `var(--l-hight-color-${d}) !important` })],
  // font size
  [
    /^size-(\d*.?\d*)(px|rem)$/,
    ([, d, unit]) => {
      return { "font-size": `${d}${unit} !important` };
    }
  ],
  [/^ofw-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  [/^flow-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // background color
  [/^l-([a-z]*)-bg$/, ([, d]) => ({ "background-color": `var(--l-${d}-bg) !important` })]
];

const matches = [
  { prefix: "c", value: "center" },
  { prefix: "s", value: "start" },
  { prefix: "e", value: "end" },
  { prefix: "b", value: "between" }
];

const shortcuts = <UserShortcuts>[
  [
    /^f-((c|s|e)(-(c|s|e|b))*)$/,
    ([, , p1, , p2]) => {
      let style = ``;

      let val = matches.find(e => e.prefix === p1);
      style += `flex items-${val.value} content-${val.value}`;

      if (p2) {
        val = matches.find(e => e.prefix === p2);
        style += ` justify-${val.value}`;
      }

      return style;
    }
  ]
];

export { rules, shortcuts };
