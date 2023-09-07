<script setup lang="ts">
import hljs from "highlight.js";
import { useFancybox } from "@/hooks/use-fancybox";

hljs.configure({
  ignoreUnescapedHTML: true
});

const props = defineProps({
  textual: {
    type: String,
    required: true
  },
  fancyGroup: {
    type: String,
    required: true
  },
  enableCatalog: {
    type: Boolean,
    default: false
  }
});

const textualInst = ref<HTMLElement>();
const textualRef = toRef(props, "textual");
const markdownTemplate = ref("");

function generateMarkdownTemplate() {
  let mtcCode, mtcImg, mtcTip, mtcWar, mtPot;
  let regex1 = /<pre>[\s\S]*?<\/pre>/g;
  let regex2 = /<img[\s\S]*?>/g;
  let regex3 = /tip:\[start\]([\s\S]*?)tip:\[end\]/g;
  let regex4 = /war:\[start\]([\s\S]*?)war:\[end\]/g;
  let regex5 = /<pot>([\s\S]*?)<\/pot>/g;

  let step1 = props.textual;
  while ((mtcCode = regex1.exec(step1)) !== null) {
    const r = generatePreCode(mtcCode[0]);
    step1 = step1.replace(mtcCode[0], r);
  }

  let step2 = step1;
  while ((mtcImg = regex2.exec(step1)) !== null) {
    const r = refactorImg(mtcImg[0]);
    step2 = step2.replace(mtcImg[0], r);
  }

  let step3 = step2;
  while ((mtcTip = regex3.exec(step2)) !== null) {
    const r = generateTip(mtcTip[1]);
    step3 = step3.replace(mtcTip[0], r);
  }

  let step4 = step3;
  while ((mtcWar = regex4.exec(step3)) !== null) {
    const r = generateWar(mtcWar[1]);
    step4 = step4.replace(mtcWar[0], r);
  }

  let step5 = step4;
  while ((mtPot = regex5.exec(step4)) !== null) {
    const r = generatePorter(mtPot[1]);
    step5 = step5.replace(mtPot[0], r);
  }

  return step5;
}

function refactorImg(str: string) {
  const mtSrc = str.match(/src="([^"]*)/);
  const mtAlt = str.match(/alt="([^"]*)"/);

  const content = `
    <div class="bleu-img f-c-c">
      <div class="bleu-img__wrapper">
        <div class="bleu-img__fancybox f-c-c">
          <a href="${mtSrc[1]}" data-fancybox="bleu-gallery-${props.fancyGroup}"
            data-download-src="${mtSrc[1]}" data-caption="${mtAlt ? mtAlt[1] : ""}">
            <img src="${mtSrc[1]}" class="rd-2" />
          </a>
        </div>
        <div class="bleu-img__caption text-center text-0.9rem text-thirdly">${
          mtAlt ? mtAlt[1] : ""
        }</div>
      </div>
    </div>
  `;

  return content;
}

function generateTip(str: string) {
  return `<div class="bleu-tip"><div class="bleu-tip__hint mb-2 font-bold">💡提示</div><div class="bleu-tip__content">${str}</div></div>`;
}

function generateWar(str: string) {
  return `<div class="bleu-war "><div class="bleu-tip__hint mb-2 font-bold">❗注意</div><div class="bleu-tip__content">${str}</div></div>`;
}

function generatePorter(str: string) {
  const linkMt = str.match(/link:\((.*?)\)/);
  const titleMt = str.match(/title:\((.*?)\)/);
  const coverMt = str.match(/cover:\((.*?)\)/);

  const link = linkMt ? linkMt[1].trim() : "";
  const title = titleMt ? titleMt[1].trim() : "";
  const cover = coverMt ? coverMt[1].trim() : "";

  return `
  <div class="bleu-porter f-c-c">
    <div class="hover-porter lg:w-50% transition-all-500 dark:bg-#232323 light:bg-#f2f2f2 rd-2 px-5 py-5">
      <a class="hover-porter__a" href="${link}" target="_blank">
        <div class="hover-porter__wrapper f-c-b">
          <img class="hover-porter__img w-15 h-15 rd-50% object-cover" src="${cover}" />
          <div class="hover-porter__content w-80%">
            <div class="hover-porter__title font-bold text-ellipsis line-clamp-1">${title}</div>
            <div class="hover-porter__link text-0.9rem text-thirdly text-ellipsis line-clamp-1">${link}</div>
          </div>
        </div>
      </a>
    </div>
  </div>`;
}

const size = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""));
const step = BleuVars.config.theme.style.codeFontSize * size * 1.7;

function extractTempFromPreCode(
  str: string,
  lines: string[],
  regex: { before: RegExp; after: RegExp },
  color: string
) {
  let startIndex = 0;
  let endIndex = 0;
  let temp = "";

  for (let i = 0; i < lines.length; i++) {
    const mtStart = lines[i].match(regex.before);
    const mtEnd = lines[i].match(regex.after);

    if (mtStart) {
      startIndex = i;
      str = str.replace(`${mtStart[0]}`, `${mtStart[1]}`);
    }

    if (mtEnd) {
      endIndex = i;
      str = str.replace(`${mtEnd[0]}`, `${mtEnd[1]}`);

      const gap = endIndex - startIndex + 1;
      temp += `<div class="${color} absolute left-0 w-100%" style="top: ${
        startIndex * step
      }px; height: ${step * gap}px">
      </div>`;
    }
  }

  return {
    temp,
    str
  };
}

function extractLangTempFromPreCode(str: string) {
  const name = str.match(/file:\[([\s\S]*?)\]/);
  const label = name ? name[1] : "";
  const lang = str.match(/<code class="language-([\d\w]+)"/)[1].toUpperCase();

  const temp = `
      <div class="tools ${label ? "f-c-b" : "f-c-e"} f-c-b rd-2 w-100%">
        ${
          label
            ? `<div class="left text-0.9rem flow-auto white-nowrap scroll-none">${label}</div>`
            : ""
        }
        <div class="right text-0.8rem f-c-e flex-auto white-nowrap scroll-none select-none">
          <div class="language mr-2 text-secondary">${lang} 语言</div>
          <div class="clipboard hover mr-2 text-thirdly">复制代码</div>
          <div class="togglecode hover text-thirdly">收起或展开</div>
        </div>
      </div>
      ${!label ? `<div class="mb-6"></div>` : ""}
    `;

  label && (str = str.replace(/file:\[([\s\S]*?)\]/, ""));

  return {
    temp,
    str
  };
}

function generatePreCode(str: string) {
  const lines = str.split("\n");

  const langTemp = extractLangTempFromPreCode(str);
  str = langTemp.str;

  const addTemp = extractTempFromPreCode(
    str,
    lines,
    {
      before: /add:\[([\s\S]*)/,
      after: /\]:([\s\S]*)add/
    },
    "bg-emerald opacity-10"
  );
  str = addTemp.str;

  const delTemp = extractTempFromPreCode(
    str,
    lines,
    {
      before: /del:\[([\s\S]*)/,
      after: /\]:([\s\S]*)del/
    },
    "bg-red opacity-10"
  );
  str = delTemp.str;

  const litTemp = extractTempFromPreCode(
    str,
    lines,
    {
      before: /lit:\[([\s\S]*)/,
      after: /\]:([\s\S]*)lit/
    },
    "dark:bg-#ffffff14 light:bg-#00000012 opacity-90"
  );
  str = litTemp.str;

  str = str.replace(
    "<pre>",
    `<div class="bleu-pre">${langTemp.temp}<pre class="bleu-pre__body scroll-none relative flow-hidden">${addTemp.temp}${delTemp.temp}${litTemp.temp}`
  );

  return str + "</div></pre>";
}

function registerMarkdownEvents(source: HTMLElement, pre: HTMLElement) {
  let isToggled = false;
  let lastHeight = 0;

  source.querySelector(".clipboard").addEventListener("click", () => {
    navigator.clipboard.writeText(pre.innerText).then(
      () => ElMessage({ message: "复制成功！", type: "success", grouping: true }),
      () => ElMessage({ message: "没有权限！", type: "error", grouping: true })
    );
  });

  source.querySelector(".togglecode").addEventListener("click", () => {
    const dom = source.querySelector<HTMLElement>(".bleu-pre-body");
    const currHeight = dom.getBoundingClientRect().height;

    if (!isToggled) {
      dom.style.height = (lastHeight || currHeight) * 0.5 + "px";
    } else {
      dom.style.height = lastHeight + "px";
    }

    isToggled = !isToggled;
    lastHeight = lastHeight || currHeight;
  });
}

function createMarkdown() {
  markdownTemplate.value = generateMarkdownTemplate();

  nextTick(() => {
    textualInst.value.querySelectorAll<HTMLElement>(".bleu-pre").forEach(ele => {
      const pre = ele.querySelector<HTMLElement>("pre code");
      hljs.highlightElement(pre);
      registerMarkdownEvents(ele, pre);
    });

    // mathjax
    const mathjaxEls = textualInst.value.getElementsByClassName("math");
    if (window.MathJax && mathjaxEls?.length > 0) {
      window.MathJax.startup.promise = window.MathJax.startup.promise
        .then(() => {
          window.MathJax.typesetPromise(mathjaxEls);
        })
        .catch(console.error);
    }

    useFancybox();
  });
}

onMounted(() => {
  createMarkdown();
});

watch(textualRef, () => {
  createMarkdown();
});
</script>

<template>
  <div ref="textualInst" class="markdown-textual" v-html="markdownTemplate"></div>
  <Catalog v-if="enableCatalog" :textual="textual" :dom="textualInst" />
</template>

<style lang="scss" scoped></style>
