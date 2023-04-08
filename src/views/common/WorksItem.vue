<script setup lang="ts">
defineProps({
  item: {
    type: Object as PropType<CustType.IWorks & { id: string }>,
    require: true
  },
  cover: {
    type: String,
    require: false
  },
  index: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div class="f-c-b item h-20rem rd-2">
    <div v-if="index % 2 !== 0" class="w-45% h-100% relative">
      <div class="mask absolute top-0 left-0 w-100% h-15%"></div>
      <img class="w-100% h-100%" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
    <div class="w-52%" :class="{ 'pl-4': index % 2 === 0, 'pr-4': index % 2 !== 0 }">
      <div
        class="hover text-ellipsis line-clamp-2 f-c-s mb-6 l-pri-size"
        @click="EcyUtils.Router.go({ path: RouterPath.works(item.id), router: $router })">
        {{ item.text }}
      </div>
      <div class="f-c-s mb-4 l-fiv-size l-sec-color">
        <div class="mr-3 f-c-c">
          <i-ep-view class="mr-1" />
          {{ item.view }}
        </div>
        <div class="mr-3 f-c-c">
          <i-ep-chat-line-square class="mr-1" />
          {{ item.comm }}
        </div>
        <div class="f-c-c">
          <i-ep-star class="mr-1" />
          {{ item.digg }}
        </div>
      </div>
      <div class="l-thr-color text-ellipsis line-clamp-4">
        {{ item.desc }}
      </div>
      <div class="hover f-c-s mt-6 l-fiv-size">
        <i-ep-caret-right />
        <router-link class="ml-1 b-b-1 b-b-dotted p-b-0.5" :to="'/p/' + item.id"> 阅读全文 </router-link>
      </div>
      <div class="mt-4 f-c-e">
        <div class="l-fiv-size l-sec-color f-c-c">
          <i-ep-clock class="mr-1" />
          {{ item.date }}
        </div>
      </div>
      <div :class="{ 'mt-4': item.isTop || item.isOnlyMe || item.isLocked }">
        <LTag round plain v-if="item.isTop" class="mr-2">置顶随笔</LTag>
        <LTag round plain v-else-if="item.isOnlyMe" class="mr-2">自己可见</LTag>
        <LTag round plain v-else-if="item.isLocked" class="mr-2">密码锁定</LTag>
      </div>
    </div>
    <div v-if="index % 2 === 0" class="w-45% h-100% relative">
      <div class="mask absolute top-0 left-0 w-100% h-15%"></div>
      <img class="w-100% h-100%" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  transition: var(--l-transition);
  margin: {
    top: 1.5rem;
    bottom: 3rem;
  }
}

.mask::after {
  --uno: rd-2;
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  backdrop-filter: blur(6px);
}

.item:hover {
  box-shadow: 0 1px 20px -6px rgba(193, 193, 193, 0.5);
}
</style>
