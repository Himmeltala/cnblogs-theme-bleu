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
  styleCss: {
    type: String,
    required: false
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
  let mtcCode, mtcImg;
  let str = props.strHtml;
  let codeRegex = /<pre>[\s\S]*?<\/pre>/g;
  let imgRegex = /<img[\s\S]*?>/g;

  while ((mtcCode = codeRegex.exec(str)) !== null) {
    const r = refactorPreCode(mtcCode[0]);
    str = str.replace(mtcCode[0], r);
  }

  let n = str;
  let index = 0;

  while ((mtcImg = imgRegex.exec(str)) !== null) {
    const r = refactorImg(mtcImg[0], index);
    n = n.replace(mtcImg[0], r);
    index++;
  }

  return n;
}

function refactorImg(str: string, index: number) {
  const mtSrc = str.match(/src="([^"]*)/);
  const mtAlt = str.match(/alt="([^"]*)"/);

  const late = `
    <div class="bleu-img ${props.styleCss}">
      <div>
        <a href="${mtSrc[1]}" data-fancybox="bleu-gallery-${props.fancyGroup}"
          data-download-src="${mtSrc[1]}" data-caption="${mtAlt ? mtAlt[1] : ""}">
          <img src="${mtSrc[1]}" class="rd-2" alt="${mtAlt ? mtAlt[1] : ""}" />
        </a>
        <div class="bleu-caption f-c-c text-0.8rem text-b">${mtAlt ? mtAlt[1] : ""}</div>
      </div>
    </div>
  `;

  return late;
}

function refactorPreCode(str: string) {
  const mtMark = str.match(/file:\[([\u4e00-\u9fffa-zA-Z0-9.\-_\s\/]+)\]/);
  const mtAddLine = str.match(/add:\[(.*?)\]/);
  const mtDelLine = str.match(/del:\[(.*?)\]/);

  let addLineNum = 0,
    delLineNum = 0,
    addTemp,
    delTemp;

  if (mtAddLine || mtDelLine) {
    const len = str.split("\n");

    if (mtAddLine) {
      len.forEach((i, index) => {
        const mtAdd = i.match(/add:\[(.*?)\]/);
        if (mtAdd) {
          addLineNum = index;
        }
      });
      addTemp = `<div class="added-line bg-emerald absolute left-0 w-100% opacity-10" style="top: ${
        addLineNum * 1.5
      }rem; height: 1rem"></div>`;
      str = str.replace(/add:\[(.*?)\]/g, `${mtAddLine[1]}`);
    }

    if (mtDelLine) {
      len.forEach((i, index) => {
        const mtDel = i.match(/del:\[(.*?)\]/);
        if (mtDel) {
          delLineNum = index;
        }
      });
      delTemp = `<div class="deled-line bg-red absolute left-0 w-100% opacity-10" style="top: ${
        delLineNum * 1.5
      }rem; height: 1rem"></div>`;
      str = str.replace(/del:\[(.*?)\]/g, `${mtDelLine[1]}`);
    }
  }

  const mark = mtMark ? mtMark[1] : "";
  const lang = str.match(/<code class="language-([\d\w]+)"/)[1].toUpperCase();

  const late = `
    <div class="tools ${mark ? "f-c-b" : "f-c-e"} f-c-b rd-2 text-0.8rem w-100%">
      ${mark ? `<div class="right max-w-70% flow-auto white-nowrap scroll-none">${mark}</div>` : ""}
      <div class="left w-30% f-c-e text-c">
        <div class="language mr-2">${lang}</div>
        <div class="clipboard hover">复制</div>
      </div>
    </div>
  `;

  if (mark) str = str.replace(/file:\[([\u4e00-\u9fffa-zA-Z0-9.\-_\s\/]+)\]/g, "");

  str = str.replace(
    "<pre>",
    `<div class="bleu-pre">${late}<pre class="relative">${addTemp || ""}${delTemp || ""}`
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
          middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Hash: false
    };

    if (!BleuVars.isPcDevice()) {
      options["Toolbar"]["display"]["middle"] = [];
    }

    Fancybox.bind("[data-fancybox]", options);

    emits("update:realHtml", htmlInst.value);
  });
}

onMounted(renderMarkdown);
watch(strHtmlRef, renderMarkdown);
</script>

<template>
  <div class="markdown-textual" ref="htmlInst" :style="styleCss" v-html="markdown"></div>
</template>
