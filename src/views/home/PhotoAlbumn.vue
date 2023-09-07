<script setup lang="ts">
defineProps({
  data: {
    type: Array as PropType<any>
  }
});
</script>

<template>
  <div v-if="data?.length">
    <div id="my-pohoto-nail" class="caption mb-10">
      <div class="i-tabler-photo mr-2"></div>
      我的相册
    </div>
    <div class="f-c-b flex-wrap">
      <div class="mb-6 text-ellipsis line-clamp-2 hover" v-for="item in data">
        <router-link :to="RouterPath.Albumn(item.id)">
          {{ item.text }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
