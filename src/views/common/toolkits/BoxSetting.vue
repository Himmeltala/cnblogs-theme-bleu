<script setup lang="ts">
defineProps({
  margin: {
    type: Object as PropType<any>,
    default: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  padding: {
    type: Object as PropType<any>,
    default: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
});

const active = ref("1");
</script>

<template>
  <el-collapse v-model="active" accordion>
    <el-collapse-item title="设置内边距">
      <div class="mb-4">
        <div class="mb-2">设置卡片左内边距</div>
        <el-input-number size="small" v-model="padding.left" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div class="mb-4">
        <div class="mb-2">设置卡片右内边距</div>
        <el-input-number size="small" v-model="padding.right" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div class="mb-4">
        <div class="mb-2">设置卡片上内边距</div>
        <el-input-number size="small" v-model="padding.top" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div>
        <div class="mb-2">设置卡片下内边距</div>
        <el-input-number size="small" v-model="padding.bottom" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
    </el-collapse-item>
    <el-collapse-item title="设置外边距">
      <div class="mb-4">
        <div class="mb-2">设置卡片左外边距</div>
        <el-input-number size="small" v-model="margin.left" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div class="mb-4">
        <div class="mb-2">设置卡片右外边距</div>
        <el-input-number size="small" v-model="margin.right" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div class="mb-4">
        <div class="mb-2">设置卡片上外边距</div>
        <el-input-number size="small" v-model="margin.top" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
      <div>
        <div class="mb-2">设置卡片下外边距</div>
        <el-input-number size="small" v-model="margin.bottom" :precision="2" :min="0" :step="0.1" :max="10" />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss"></style>
