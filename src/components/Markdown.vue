<script setup lang="ts">
import hljs from "highlight.js";
import { useFancybox } from "@/hooks/use-fancybox";

hljs.configure({
  ignoreUnescapedHTML: true
});

const props = defineProps({
  strHtml: {
    type: String,
    required: true
  },
  realHtml: {
    type: HTMLElement,
    required: false
  },
  unocssImg: {
    type: String
  },
  unocssText: {
    type: String
  },
  fancyGroup: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["update:realHtml"]);

const htmlInst = ref<HTMLElement>();
const strHtmlRef = toRef(props, "strHtml");
const markdown = ref("");

function generateMarkdown() {
  let mtcCode, mtcImg, mtcTip, mtcWar, mtPot;
  let regex1 = /<pre>[\s\S]*?<\/pre>/g;
  let regex2 = /<img[\s\S]*?>/g;
  let regex3 = /tip:\[start\]([\s\S]*?)tip:\[end\]/g;
  let regex4 = /war:\[start\]([\s\S]*?)war:\[end\]/g;
  let regex5 = /<pot>([\s\S]*?)<\/pot>/g;

  let step1 = props.strHtml;
  while ((mtcCode = regex1.exec(step1)) !== null) {
    const r = refactorPreCode(mtcCode[0]);
    step1 = step1.replace(mtcCode[0], r);
  }

  let step2 = step1;
  while ((mtcImg = regex2.exec(step1)) !== null) {
    const r = refactorImg(mtcImg[0]);
    step2 = step2.replace(mtcImg[0], r);
  }

  let step3 = step2;
  while ((mtcTip = regex3.exec(step2)) !== null) {
    const r = refactorTip(mtcTip[1]);
    step3 = step3.replace(mtcTip[0], r);
  }

  let step4 = step3;
  while ((mtcWar = regex4.exec(step3)) !== null) {
    const r = refactorWar(mtcWar[1]);
    step4 = step4.replace(mtcWar[0], r);
  }

  let step5 = step4;
  while ((mtPot = regex5.exec(step4)) !== null) {
    const r = rfactorPorter(mtPot[1]);
    step5 = step5.replace(mtPot[0], r);
  }

  return step5;
}

function refactorImg(str: string) {
  const mtSrc = str.match(/src="([^"]*)/);
  const mtAlt = str.match(/alt="([^"]*)"/);

  const content = `
    <div class="bleu-img ${props.unocssImg}">
      <div>
        <a href="${mtSrc[1]}" data-fancybox="bleu-gallery-${props.fancyGroup}"
          data-download-src="${mtSrc[1]}" data-caption="${mtAlt ? mtAlt[1] : ""}">
          <img src="${mtSrc[1]}" class="rd-2" alt="${mtAlt ? mtAlt[1] : ""}" />
        </a>
        <div class="f-c-c text-0.9rem text-b">${mtAlt ? mtAlt[1] : ""}</div>
      </div>
    </div>
  `;

  return content;
}

function refactorTip(str: string) {
  return `<div class="bleu-tip"><div class="mb-2 font-bold">💡提示</div><div>${str}</div></div>`;
}

function refactorWar(str: string) {
  return `<div class="bleu-war"><div class="mb-2 font-bold">❗注意</div><div>${str}</div></div>`;
}

function rfactorPorter(str: string) {
  const linkMatch = str.match(/link:\((.*?)\)/);
  const titleMatch = str.match(/title:\((.*?)\)/);
  const coverMatch = str.match(/cover:\((.*?)\)/);

  const link = linkMatch ? linkMatch[1].trim() : "";
  const title = titleMatch ? titleMatch[1].trim() : "";
  const cover = coverMatch ? coverMatch[1].trim() : "";

  return `
  <div class="bleu-porter f-c-c">
    <div class="hover-porter lg:w-50% transition-all-500 dark:bg-#232323 light:bg-#f2f2f2 rd-2 px-5 py-5">
      <a href="${link}" target="_blank">
        <div class="f-c-b">
          <img class="w-15 h-15 rd-50% object-cover" src="${cover}" />
          <div class="w-80%">
            <div class="font-bold text-ellipsis line-clamp-1">${title}</div>
            <div class="text-c text-ellipsis line-clamp-1">${link}</div>
          </div>
        </div>
      </a>
    </div>
  </div>`;
}

const size = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""));
const step = (BleuVars.config.font?.code?.size || 0.8) * size * 1.7;

function refactorPreCode(str: string) {
  const mtMark = str.match(/file:\[([\s\S]*?)\]/);
  const lines = str.split("\n");

  let addTemp = "",
    delTemp = "";

  lines.forEach((ele, index) => {
    const mtAdd = ele.match(/add:\[([\s\S]*)\]/);
    const mtDel = ele.match(/del:\[([\s\S]*)\]/);

    if (mtAdd) {
      addTemp += `<div class="added-line absolute left-0 w-100%" style="top: ${
        index * step
      }px; height: ${step}px">
        <div class="bg-emerald opacity-10 absolute left-0 top-0 w-100% h-100%"></div>
        <div class="absolute left-0 top-0 w-100% h-100% text-c f-c-s">＋</div>
      </div>`;

      str = str.replace(`add:[${mtAdd[1]}]`, `${mtAdd[1]}`);
    }

    if (mtDel) {
      delTemp += `<div class="added-line absolute left-0 w-100%" style="top: ${
        index * step
      }px; height: ${step}px">
        <div class="bg-red opacity-10 absolute left-0 top-0 w-100% h-100%"></div>
        <div class="absolute left-0 top-0 w-100% h-100% text-c f-c-s">－</div>
      </div>`;

      str = str.replace(`del:[${mtDel[1]}]`, `${mtDel[1]}`);
    }
  });

  const label = mtMark ? mtMark[1] : "";
  const lang = str.match(/<code class="language-([\d\w]+)"/)[1].toUpperCase();

  const content = `
      <div class="tools ${label ? "f-c-b" : "f-c-e"} f-c-b rd-2 text-0.8rem w-100%">
        <div class="left flow-auto white-nowrap scroll-none">${label || lang + " code"}</div>
        <div class="right flex-auto f-c-e text-c">
          <div class="language mr-2">${lang}</div>
          <div class="clipboard hover">复制</div>
        </div>
      </div>
      ${!label ? `<div class="mb-6"></div>` : ""}
    `;

  if (label) str = str.replace(/file:\[([\s\S]*?)\]/, "");

  str = str.replace(
    "<pre>",
    `<div class="bleu-pre">${content}<pre class="relative">${addTemp}${delTemp}`
  );

  return str + "</div></pre>";
}

function registerMarkdown(mkd: HTMLElement, pre: HTMLElement) {
  mkd.querySelector(".clipboard").addEventListener("click", () => {
    navigator.clipboard.writeText(pre.innerText).then(
      () => ElMessage({ message: "复制成功！", type: "success", grouping: true }),
      () => ElMessage({ message: "没有权限！", type: "error", grouping: true })
    );
  });
}

function renderMarkdown() {
  markdown.value = generateMarkdown();

  nextTick(() => {
    htmlInst.value.querySelectorAll<HTMLElement>(".bleu-pre").forEach(i => {
      const pre = i.querySelector<HTMLElement>("pre code");
      hljs.highlightElement(pre);
      registerMarkdown(i, pre);
    });

    // mathjax
    const mathElArr = htmlInst.value.getElementsByClassName("math");
    if (window.MathJax && mathElArr?.length > 0) {
      window.MathJax.startup.promise = window.MathJax.startup.promise
        .then(() => {
          window.MathJax.typesetPromise(mathElArr);
        })
        .catch(console.error);
    }

    useFancybox();

    emits("update:realHtml", htmlInst.value);
  });
}

onMounted(renderMarkdown);
watch(strHtmlRef, renderMarkdown);
</script>

<template>
  <div class="markdown-textual" :class="unocssText" ref="htmlInst" v-html="markdown"></div>
</template>
