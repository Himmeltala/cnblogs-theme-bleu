<script setup lang="ts">
defineProps({
  data: {
    type: Array as PropType<any>
  }
});
</script>

<template>
  <div class="relative">
    <div class="sm:w-49% lt-sm:mt-15" v-if="data?.length">
      <div id="article-nail" class="caption mb-10">
        <div class="i-tabler-sort-a-z mr-2"></div>
        文章分类
      </div>
      <div class="f-c-b flex-wrap">
        <div class="mb-6 mr-4 hover" v-for="item in data">
          <router-link :to="RouterPath.ArbeitenBySort(item.id, '1', true)">
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
