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
  },
  length: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div
    v-if="BleuVars.isPcDevice()"
    :class="{ 'mb-20': index !== length - 1 }"
    class="f-c-b item h-20rem rd-2">
    <div v-if="index % 2 !== 0" class="w-45% h-100% flow-hidden relative">
      <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
      <img class="w-100% h-100% object-cover" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
    <div class="w-52%">
      <div class="text-ellipsis line-clamp-2 mb-6 text-1.3rem">
        <router-link :to="RouterPath.Arbeiten(item.id)" class="hover">
          {{ item.text }}
        </router-link>
      </div>
      <div class="f-c-s mb-4 text-0.9rem text-b">
        <div class="mr-3 f-c-c">
          <i-ep-view class="mr-2" />
          {{ item.view }}
        </div>
        <div class="mr-3 f-c-c">
          <i-ep-chat-line-square class="mr-2" />
          {{ item.comm }}
        </div>
        <div class="f-c-c">
          <i-ep-star class="mr-2" />
          {{ item.digg }}
        </div>
      </div>
      <div class="text-c text-ellipsis line-clamp-4">
        {{ item.desc }}
      </div>
      <div class="hover f-c-s mt-6 text-0.9rem text-b">
        <i-ep-caret-right class="mr-2" />
        <router-link class="b-b-1 b-b-dotted p-b-0.5" :to="RouterPath.Arbeiten(item.id)">
          阅读全文
        </router-link>
      </div>
      <div class="mt-4 f-c-e">
        <div class="text-0.9rem text-b f-c-c">
          <i-ep-clock class="mr-2" />
          {{ item.date }}
        </div>
      </div>
      <div v-show="item.isTop || item.isOnlyMe || item.isLocked" class="mt-4 text-c">
        <HollowedBox v-if="item.isTop" class="mr-2">置顶随笔</HollowedBox>
        <HollowedBox v-else-if="item.isOnlyMe" class="mr-2">自己可见</HollowedBox>
        <HollowedBox v-else-if="item.isLocked" class="mr-2">密码锁定</HollowedBox>
      </div>
    </div>
    <div v-if="index % 2 === 0" class="w-45% h-100% flow-hidden relative">
      <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
      <img class="w-100% h-100% object-cover" :src="item.surface || cover" />
      <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
    </div>
  </div>
  <div v-else class="item mb-15 h-20rem rd-2">
    <div class="text-ellipsis line-clamp-2 mb-6 text-1.3rem">
      <router-link :to="RouterPath.Arbeiten(item.id)" class="hover">
        {{ item.text }}
      </router-link>
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
        <i-ep-view class="mr-2" />
        {{ item.view }}
      </div>
      <div class="mr-3 f-c-c">
        <i-ep-chat-line-square class="mr-2" />
        {{ item.comm }}
      </div>
      <div class="f-c-c">
        <i-ep-star class="mr-2" />
        {{ item.digg }}
      </div>
    </div>
    <div v-if="item.isTop || item.isOnlyMe || item.isLocked" class="mt-4">
      <HollowedBox v-if="item.isTop" class="mr-2">置顶随笔</HollowedBox>
      <HollowedBox v-else-if="item.isOnlyMe" class="mr-2">自己可见</HollowedBox>
      <HollowedBox v-else-if="item.isLocked" class="mr-2">密码锁定</HollowedBox>
    </div>
    <div class="f-c-b mt-6 text-0.9rem text-b">
      <div class="f-c-c hover">
        <i-ep-caret-right class="mr-2" />
        <router-link class="b-b-1 b-b-dotted p-b-0.5" :to="RouterPath.Arbeiten(item.id)">
          阅读全文
        </router-link>
      </div>
      <div class="f-c-e">
        <div class="text-0.9rem f-c-c">
          <i-ep-clock class="mr-2" />
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

@include mixins.pc() {
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

@include mixins.mb() {
  .item {
    img {
      --uno: rd-2;
      transition: var(--l-animation-effect);
    }
  }
}
</style>
