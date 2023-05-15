import type { Rule, UserShortcuts } from "unocss";

const rules = <Rule[]>[
  // font size
  [/^l-size-(\d*)$/, ([, d]) => ({ "font-size": `var(--l-size-${d}) !important` })],
  // font color
  [/^l-color-(\d*)$/, ([, d]) => ({ color: `var(--l-color-${d}) !important` })],
  // hight color
  [/^l-hight-color-(\d*)$/, ([, d]) => ({ color: `var(--l-hight-color-${d}) !important` })],
  // flow
  [/^flow-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // flow x
  [/^flow-x-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // flow y
  [/^flow-y-(auto|hidden|inherit|initial|overlay|revert|scroll|unset|visible)$/, ([, d]) => ({ overflow: `${d}` })],
  // background color
  [/^l-([a-z]*)-bg$/, ([, d]) => ({ "background-color": `var(--l-${d}-bg) !important` })]
];

const matches = [
  { prefix: "c", value: "center" },
  { prefix: "s", value: "start" },
  { prefix: "e", value: "end" },
  { prefix: "b", value: "between" }
];

function getMatches(prefix: string) {
  return matches.find(e => e.prefix === prefix);
}

function addFlexItemsAndContent(p1: string) {
  const val = getMatches(p1);
  return `flex items-${val?.value || "center"} content-${val?.value || "center"}`;
}

function addFlexJustify(p2: string) {
  const val = getMatches(p2);
  return ` justify-${val?.value || "center"}`;
}

const shortcuts = <UserShortcuts>[
  [
    /^f-((c|s|e)(-(c|s|e|b))*)$/,
    ([, , p1, , p2]) => {
      let style = ``;

      style = addFlexItemsAndContent(p1);
      if (p2) {
        style += addFlexJustify(p2);
      }

      return style;
    }
  ]
];

export { rules, shortcuts };
