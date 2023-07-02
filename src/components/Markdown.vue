<script setup lang="ts">
import hljs from "highlight.js";

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
    type: Object,
    required: false
  }
});

const emits = defineEmits(["update:realHtml"]);

const htmlInst = ref<HTMLElement>();
const strHtmlRef = toRef(props, "strHtml");
const markdown = ref("");

function generateMarkdown() {
  let mtc;
  let str = props.strHtml;
  let regex = /<pre>[\s\S]*?<\/pre>/g;

  while ((mtc = regex.exec(props.strHtml)) !== null) {
    const pre = refactorMarkdown(mtc[0]);
    str = str.replace(mtc[0], pre);
  }

  return str;
}

function refactorMarkdown(str: string) {
  const mtMark = str.match(/file:([a-zA-Z0-9.\-_\/]+)/);
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

  if (mark) str = str.replace(/file:([a-zA-Z0-9.\-_\/]+)/g, "");

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

    emits("update:realHtml", htmlInst.value);
  });
}

onMounted(renderMarkdown);
watch(strHtmlRef, renderMarkdown);
</script>

<template>
  <div class="markdown-textual" ref="htmlInst" :style="styleCss" v-html="markdown"></div>
</template>
