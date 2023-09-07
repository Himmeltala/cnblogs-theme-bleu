<script setup lang="ts">
defineProps({
  data: {
    type: Array as PropType<any>
  }
});
</script>

<template>
  <div v-if="data?.length">
    <div id="article-archive-nail" class="caption mb-10">
      <div class="i-tabler-folder-check mr-2"></div>
      文章归档
    </div>
    <div class="f-c-b flex-wrap">
      <div class="mb-6 mr-4 hover" v-for="item in data">
        <router-link :to="RouterPath.ArbeitenByArchive('a', item.id)">
          {{ item.text }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
