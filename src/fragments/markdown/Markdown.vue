<script setup lang="ts">
import { createCodeTools, createCodeModal } from "./index";
import hljs from "highlight.js";

defineProps({
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
    default() {
      return {
        fontSize: "1.1rem"
      };
    }
  }
});

const emits = defineEmits(["update:realHtml"]);

let updatedTimes = 0;
const htmlInst = ref<HTMLElement>();

function renderMarkdown() {
  // hljs
  hljs.configure({
    ignoreUnescapedHTML: true
  });

  const preInst = htmlInst.value.querySelectorAll<HTMLElement>("pre code");

  preInst.forEach(i => {
    hljs.highlightElement(i);
    createCodeTools(i);
    createCodeModal(i);
  });

  // math
  const MathJax = window.MathJax;
  const mathNodes = htmlInst.value.getElementsByClassName("math");

  if (MathJax && mathNodes.length > 0) {
    MathJax.startup.promise = MathJax.startup.promise
      .then(() => {
        MathJax.typesetPromise(mathNodes);
      })
      .catch(console.error);
  }

  emits("update:realHtml", htmlInst.value);
}

onMounted(() => {
  updatedTimes++;
  renderMarkdown();
});

onUpdated(() => {
  updatedTimes++;
  if (updatedTimes > 2) renderMarkdown();
});
</script>

<template>
  <div class="markdown-textual" ref="htmlInst" :style="styleCss" v-html="strHtml"></div>
</template>
