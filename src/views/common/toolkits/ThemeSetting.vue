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
const collapseActive = ref("1");
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
    mode.value.dom.style.setProperty("--l-pri-color", setting.value.font.dark.color.level1);
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-sec-color", setting.value.font.dark.color.level2);
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-thr-color", setting.value.font.dark.color.level3);
  } else if (mode.value.name === "light") {
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-pri-color", setting.value.font.light.color.level1);
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-sec-color", setting.value.font.light.color.level2);
    // @ts-ignore
    mode.value.dom.style.setProperty("--l-thr-color", setting.value.font.light.color.level3);
  }
}

function setFontSize() {
  document.querySelector("html").style.setProperty("--l-pri-size", setting.value.font.size.level1 + "rem");
  document.querySelector("html").style.setProperty("--l-sec-size", setting.value.font.size.level2 + "rem");
  document.querySelector("html").style.setProperty("--l-thr-size", setting.value.font.size.level3 + "rem");
  document.querySelector("html").style.setProperty("--l-for-size", setting.value.font.size.level4 + "rem");
  document.querySelector("html").style.setProperty("--l-fiv-size", setting.value.font.size.level5 + "rem");
  document.querySelector("html").style.setProperty("--l-six-size", setting.value.font.size.level6 + "rem");
}

setFontColor();
setFontSize();

watch(setting, val => {
  document.querySelector("html").style.setProperty("--l-theme-color", val.theme.color);
  document.querySelector("html").style.setProperty("--l-bg-filter", val.background.filter + "px");
  setFontColor();
  setFontSize();
});
</script>

<template>
  <div class="mb-4">
    <span class="mr-2">设置主题颜色</span>
    <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.theme.color" />
  </div>
  <div class="mb-4">
    <span><span v-show="setting.card.open">开启</span><span v-show="!setting.card.open">关闭</span>卡片样式</span>
    <el-switch v-model="setting.card.open" size="small" class="ml-2" style="--el-switch-on-color: var(--l-theme-color)" />
  </div>
  <div class="mb-4">
    <span><span v-show="setting.background.open">开启</span><span v-show="!setting.background.open">关闭</span>背景图片</span>
    <el-switch v-model="setting.background.open" size="small" class="ml-2" style="--el-switch-on-color: var(--l-theme-color)" />
  </div>
  <el-collapse v-model="collapseActive" accordion>
    <el-collapse-item title="字体大小设置">
      <div class="mb-4">
        <span class="mr-2">一级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level1" :precision="2" :min="0.6" :step="0.2" :max="6" />
      </div>
      <div class="mb-4">
        <span class="mr-2">二级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level2" :precision="2" :min="0.5" :step="0.2" :max="5" />
      </div>
      <div class="mb-4">
        <span class="mr-2">三级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level3" :precision="2" :min="0.4" :step="0.2" :max="4" />
      </div>
      <div class="mb-4">
        <span class="mr-2">四级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level4" :precision="2" :min="0.3" :step="0.2" :max="3" />
      </div>
      <div class="mb-4">
        <span class="mr-2">五级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level5" :precision="2" :min="0.2" :step="0.2" :max="2" />
      </div>
      <div>
        <span class="mr-2">六级字体大小</span>
        <el-input-number size="small" v-model="setting.font.size.level6" :precision="2" :min="0.1" :step="0.2" :max="1" />
      </div>
    </el-collapse-item>
    <el-collapse-item title="黑夜字体颜色设置" v-show="mode.name === 'dark'">
      <div class="mb-4">
        <span class="mr-2">一级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.dark.color.level1" />
      </div>
      <div class="mb-4">
        <span class="mr-2">二级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.dark.color.level2" />
      </div>
      <div>
        <span class="mr-2">三级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.dark.color.level3" />
      </div>
    </el-collapse-item>
    <el-collapse-item title="白天字体颜色设置" v-show="mode.name === 'light'">
      <div class="mb-4">
        <span class="mr-2">一级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.light.color.level1" />
      </div>
      <div class="mb-4">
        <span class="mr-2">二级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.light.color.level2" />
      </div>
      <div>
        <span class="mr-2">三级字体颜色</span>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.font.light.color.level3" />
      </div>
    </el-collapse-item>
    <el-collapse-item title="卡片样式设置" v-show="setting.card.open">
      <div class="mb-4">
        <div class="mb-2">设置卡片背景颜色</div>
        <el-color-picker size="small" :predefine="colors" show-alpha v-model="setting.card.color" />
      </div>
      <div class="mb-4">
        <div class="mb-2">设置卡片圆角单位</div>
        <el-input-number size="small" v-model="setting.card.radius" :precision="2" :min="0.5" :step="0.5" :max="30" />
      </div>
    </el-collapse-item>
    <el-collapse-item title="背景样式设置" v-show="setting.background.open">
      <div class="mb-4">
        <div class="mb-2">图片网络地址</div>
        <el-input size="small" v-model="setting.background.src" placeholder="请输入网络地址" />
      </div>
      <div>
        <div class="mb-2">背景毛玻璃效果</div>
        <el-slider v-model="setting.background.filter" />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
