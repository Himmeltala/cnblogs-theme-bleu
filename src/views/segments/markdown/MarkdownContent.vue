<script setup lang="ts">
import { createCodeTools, createCodeModal } from "./index";
import hljs from "highlight.js";

defineProps({
  htmlStr: {
    type: String,
    required: true
  },
  realHtml: {
    type: HTMLElement,
    required: false
  }
});

const emits = defineEmits(["update:realHtml"]);

const htmlRef = ref<HTMLElement>();

onMounted(() => {
  // hljs
  hljs.configure({
    ignoreUnescapedHTML: true
  });

  const codes = htmlRef.value.querySelectorAll<HTMLElement>("pre code");
  codes.forEach(ele => {
    hljs.highlightElement(ele);
    createCodeTools(ele);
    createCodeModal(ele);
  });

  // math
  const MathJax = window.MathJax;
  const mathNodes = htmlRef.value.getElementsByClassName("math");

  if (MathJax && mathNodes.length > 0) {
    MathJax.startup.promise = MathJax.startup.promise
      .then(() => {
        MathJax.typesetPromise(mathNodes);
      })
      .catch(console.error);
  }

  emits("update:realHtml", htmlRef.value);
});
</script>

<template>
  <div class="markdown-textual" ref="htmlRef" v-html="htmlStr"></div>
</template>
