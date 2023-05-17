<script setup lang="ts">
defineProps({
  item: {
    type: Object,
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
  <div v-if="BleuVars.isPcDevice()" class="f-c-b mt-2rem mb-6rem item h-20rem rd-2">
    <div v-if="index % 2 !== 0" class="w-45% h-100% flow-hidden relative">
      <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
      <img class="w-100% h-100% object-cover" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
    <div class="w-52%" :class="{ 'pl-4': index % 2 === 0, 'pr-4': index % 2 !== 0 }">
      <div
        class="hover text-ellipsis line-clamp-2 f-c-s mb-6 text-1.3rem"
        @click="Navigation.go({ path: RouterPath.Arbeiten(item.id), router: $router })">
        {{ item.text }}
      </div>
      <div class="f-c-s mb-4 text-0.9rem text-b">
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
      <div class="text-c text-ellipsis line-clamp-4">
        {{ item.desc }}
      </div>
      <div class="hover f-c-s mt-6 text-0.9rem text-b">
        <i-ep-caret-right />
        <router-link class="ml-1 b-b-1 b-b-dotted p-b-0.5" :to="'/p/' + item.id">
          阅读全文
        </router-link>
      </div>
      <div class="mt-4 f-c-e">
        <div class="text-0.9rem text-b f-c-c">
          <i-ep-clock class="mr-1" />
          {{ item.date }}
        </div>
      </div>
      <div v-show="item.isTop || item.isOnlyMe || item.isLocked" class="mt-4 text-c">
        <HollowedBox round plain v-if="item.isTop" class="mr-2">置顶随笔</HollowedBox>
        <HollowedBox round plain v-else-if="item.isOnlyMe" class="mr-2">自己可见</HollowedBox>
        <HollowedBox round plain v-else-if="item.isLocked" class="mr-2">密码锁定</HollowedBox>
      </div>
    </div>
    <div v-if="index % 2 === 0" class="w-45% h-100% flow-hidden relative">
      <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
      <img class="w-100% h-100% object-cover" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
  </div>
  <!-- 移动端 -->
  <div v-else class="item mt-2rem mb-4rem h-20rem rd-2">
    <div
      class="hover text-ellipsis line-clamp-2 f-c-s mb-6 text-1.3rem"
      @click="Navigation.go({ path: RouterPath.Arbeiten(item.id), router: $router })">
      {{ item.text }}
    </div>
    <div class="f-c-b mb-4">
      <div v-if="index % 2 !== 0" class="w-45% h-100% relative">
        <div class="mask absolute top-0 left-0 w-100% h-15%"></div>
        <img class="w-100% h-8rem object-cover" :src="item.surface || cover" />
        <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
      </div>
      <div class="w-52% text-c text-ellipsis line-clamp-5">
        {{ item.desc }}
      </div>
      <div v-if="index % 2 === 0" class="w-45% h-100% relative">
        <div class="mask absolute top-0 left-0 w-100% h-15%"></div>
        <img class="w-100% h-8rem object-cover" :src="item.surface || cover" />
        <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
      </div>
    </div>
    <div class="f-c-s mb-4 text-0.9rem text-b">
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
    <div v-show="item.isTop || item.isOnlyMe || item.isLocked" class="mt-4">
      <HollowedBox round plain v-if="item.isTop" class="mr-2">置顶随笔</HollowedBox>
      <HollowedBox round plain v-else-if="item.isOnlyMe" class="mr-2">自己可见</HollowedBox>
      <HollowedBox round plain v-else-if="item.isLocked" class="mr-2">密码锁定</HollowedBox>
    </div>
    <div class="hover f-c-b mt-6 text-0.9rem text-b">
      <div class="f-c-c">
        <i-ep-caret-right />
        <router-link class="ml-1 b-b-1 b-b-dotted p-b-0.5" :to="'/p/' + item.id">
          阅读全文
        </router-link>
      </div>
      <div class="f-c-e">
        <div class="text-0.9rem f-c-c">
          <i-ep-clock class="mr-1" />
          {{ item.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mask::after {
  --uno: rd-2;
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  backdrop-filter: blur(6px);
}

@include pc() {
  .item {
    &:hover {
      img {
        transition: var(--l-animation-effect);
        transform: scale(1.1, 1.1);
      }
    }

    img {
      --uno: rd-2;
      transition: var(--l-animation-effect);
    }
  }
}

@include mb() {
  .item {
    img {
      --uno: rd-2;
      transition: var(--l-animation-effect);
    }
  }
}
</style>
