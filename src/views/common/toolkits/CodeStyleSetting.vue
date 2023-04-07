<script setup lang="ts">
const setting = EcyUtils.getSetting();
const colors = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#409eff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577"
];

const mode = ref(inspectMode());

function inspectMode() {
  const dark = document.querySelector("html[class='dark']");
  const light = document.querySelector("html[class='light']");
  if (dark) {
    return { name: "dark", dom: dark };
  } else if (light) {
    return { name: "light", dom: light };
  }
}

function setFontColor() {
  mode.value = inspectMode();

  if (mode.value.name === "dark") {
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-code-bg", setting.value.pages.writing.code.dark.color);
  } else if (mode.value.name === "light") {
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-code-bg", setting.value.pages.writing.code.light.color);
  }
}

setFontColor();

watch(setting, val => {
  setFontColor();
});
</script>

<template>
  <div class="mb-4" v-show="mode.name === 'dark'">
    <span class="mr-2">设置黑夜代码块颜色</span>
    <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.pages.writing.code.dark.color" />
  </div>
  <div class="mb-4" v-show="mode.name === 'light'">
    <span class="mr-2">设置白天代码块颜色</span>
    <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.pages.writing.code.light.color" />
  </div>
</template>

<style scoped lang="scss"></style>
