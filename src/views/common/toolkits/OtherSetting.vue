<script setup lang="ts">
const setting = EcyUtils.getSetting();
const positions = [
  {
    label: "靠左",
    value: "left"
  },
  {
    label: "靠右",
    value: "right"
  }
];
</script>

<template>
  <div v-if="EcyConfig.pcDevice">
    <span><span v-show="!setting.other.pagation.pin">隐藏</span><span v-show="setting.other.pagation.pin">开启</span>翻页按钮</span>
    <el-switch v-model="setting.other.pagation.pin" size="small" class="ml-2" style="--el-switch-on-color: var(--l-theme-color)" />
  </div>
  <div v-if="EcyConfig.pcDevice" class="mt-4 f-c-s">
    <div>GitHub 角标</div>
    <el-select size="small" v-model="setting.other.github.position" class="ml-2">
      <el-option v-for="item in positions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<style scoped lang="scss"></style>
