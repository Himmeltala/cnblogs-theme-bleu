<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    require: false
  },
  cover: {
    type: String,
    require: false
  }
});
</script>

<template>
  <div class="item mb-15 rd-2">
    <router-link
      class="text-ellipsis line-clamp-2 mb-4 text-1.5rem hover text-text-primary"
      :to="RouterPath.PostDetail(item.id)">
      {{ item.text }}
    </router-link>
    <div class="f-s-b flex-gap-4">
      <div class="lg-sm:w-65% lt-sm:w-50%">
        <div class="f-c-s flex-wrap mb-4 text-0.9rem text-text-secondary">
          <div class="mr-4 f-c-c">
            <div class="i-ep-clock mr-2"></div>
            {{ item.date }}
          </div>
          <div class="mr-4 f-c-c">
            <div class="i-ep-view mr-2"></div>
            {{ item.view }}
          </div>
          <div class="mr-4 f-c-c">
            <div class="i-ep-chat-line-square mr-2"></div>
            {{ item.comm }}
          </div>
          <div class="f-c-c">
            <div class="i-ep-star mr-2"></div>
            {{ item.digg }}
          </div>
        </div>
        <div class="text-text-regular mb-6 lt-sm:text-ellipsis lt-sm:line-clamp-3">
          {{ item.desc }}
        </div>
        <div class="hover text-text-regular text-0.9rem f-c-s mb-4">
          <div class="i-ep-caret-right mr-2"></div>
          <router-link class="b-b-1 b-b-dotted p-b-1" :to="RouterPath.PostDetail(item.id)">
            阅读全文
          </router-link>
        </div>
        <div class="f-c-e flex-wrap">
          <el-tag type="success" v-if="item.isTop" class="ml-2">置顶随笔</el-tag>
          <el-tag type="danger" v-if="item.isOnlyMe" class="ml-2">自己可见</el-tag>
          <el-tag type="warning" v-if="item.isLocked" class="ml-2">密码锁定</el-tag>
        </div>
      </div>
      <div class="lg-sm:w-35% lt-sm:w-50% lt-sm:h-45 lg-sm:h-55 flow-hidden relative">
        <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
        <img class="w-100% h-100% object-cover rd-2" :src="item.surface || cover" />
        <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mask::after {
  --uno: block rd-2 w-100% h-100%;
  content: "";
  opacity: 0.8;
  backdrop-filter: blur(6px);
}

.item {
  &:hover {
    img {
      --uno: transition-all-300;
      transform: scale(1.1, 1.1);
    }
  }

  img {
    --uno: rd-2 transition-all-300;
  }
}
</style>
