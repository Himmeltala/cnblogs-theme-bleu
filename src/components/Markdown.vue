<script setup lang="ts">
import hljs from "highlight.js";
import { Fancybox } from "@fancyapps/ui";

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
  let mtcCode, mtcImg, mtcTip, mtcWar;
  let regex1 = /<pre>[\s\S]*?<\/pre>/g;
  let regex2 = /<img[\s\S]*?>/g;
  let regex3 = /tip:\[start\]([\s\S]*?)tip:\[end\]/g;
  let regex4 = /war:\[start\]([\s\S]*?)war:\[end\]/g;

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

  return step4;
}

function refactorImg(str: string) {
  const mtSrc = str.match(/src="([^"]*)/);
  const mtAlt = str.match(/alt="([^"]*)"/);

  const late = `
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

  return late;
}

function refactorTip(str: string) {
  return `<div class="bleu-tip"><div class="mb-2 font-bold">💡提示</div><div>${str}</div></div>`;
}

function refactorWar(str: string) {
  return `<div class="bleu-war"><div class="mb-2 font-bold">❗注意</div><div>${str}</div></div>`;
}

const size = Number(getComputedStyle(document.documentElement).fontSize.replace("px", ""));
const step = (BleuVars.config.font.code.size || 0.8) * size * 1.7;

function refactorPreCode(str: string) {
  const mtMark = str.match(/file:\[([\s\S]*?)\]/);
  const lines = str.split("\n");

  let addTemp = "",
    delTemp = "";

  lines.forEach((ele, index) => {
    const mtAdd = ele.match(/add:\[([\s\S]*)\]/);
    const mtDel = ele.match(/del:\[([\s\S]*)\]/);

    if (mtAdd) {
      addTemp += `<div class="added-line bg-emerald absolute left-0 w-100% opacity-10" style="top: ${
        index * step
      }px; height: ${step}px"></div>`;

      str = str.replace(`add:[${mtAdd[1]}]`, `${mtAdd[1]}`);
    }

    if (mtDel) {
      delTemp += `<div class="deled-line bg-red absolute left-0 w-100% opacity-10" style="top: ${
        index * step
      }px; height: ${step}px"></div>`;

      str = str.replace(`del:[${mtDel[1]}]`, `${mtDel[1]}`);
    }
  });

  const label = mtMark ? mtMark[1] : "";
  const lang = str.match(/<code class="language-([\d\w]+)"/)[1].toUpperCase();

  const late = `
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
    `<div class="bleu-pre">${late}<pre class="relative">${addTemp}${delTemp}`
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

    let options = {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: BleuVars.isPcDevice()
            ? ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"]
            : [],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Hash: false
    };

    if (BleuVars.config?.fancybox) {
      const merged = Object.assign({}, options, BleuVars.config.fancybox);
      Fancybox.bind("[data-fancybox]", merged);
    } else {
      Fancybox.bind("[data-fancybox]", options);
    }

    emits("update:realHtml", htmlInst.value);
  });
}

onMounted(renderMarkdown);
watch(strHtmlRef, renderMarkdown);
</script>

<template>
  <div class="markdown-textual" :class="unocssText" ref="htmlInst" v-html="markdown"></div>
</template>
