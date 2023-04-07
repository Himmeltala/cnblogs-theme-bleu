import { Rule, UserShortcuts } from "unocss";

const rules = <Rule<any>[]>[
  // fon size
  [/^l-([a-z]*)-size$/, ([, d]) => ({ "font-size": `var(--l-${d}-size) !important` })],
  // overflow
  [/^ofw-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // white-space
  [/^wce-(normal|pre|nowrap|pre-wrap|pre-line)$/, ([, d]) => ({ "white-space": `${d} !important` })],
  // font color
  [/^l-([a-z]*)-color$/, ([, d]) => ({ color: `var(--l-${d}-color) !important` })],
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
