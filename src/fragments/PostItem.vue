<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as PropType<PostModel[]>,
    require: false
  }
});

const coverIdx = shallowRef<number[]>();
const coverArr = Consts.config.images.stochastic;
coverIdx.value = Utils.Random.get(coverArr, props.data.length);
</script>

<template>
  <div class="item mb-14" v-for="(item, index) in data">
    <router-link class="text-1.2rem hover text-text-regular" :to="Consts.Paths.p(item.id)">
      {{ item.text }}
    </router-link>
    <div class="mt-4 f-s-b flex-gap-4">
      <div class="lg-sm:w-65% lt-sm:w-55%">
        <div class="f-c-s flex-wrap mb-4 text-0.8rem">
          <div class="f-c-c">
            <div class="i-tabler-clock mr-2"></div>
            {{ item.date }}
          </div>
          <div class="mx-2">|</div>
          <div class="f-c-c">
            <div class="i-tabler-eye mr-2"></div>
            {{ item.view }}
          </div>
          <div class="mx-2">|</div>
          <div class="f-c-c">
            <div class="i-tabler-message mr-2"></div>
            {{ item.comm }}
          </div>
          <div class="mx-2">|</div>
          <div class="f-c-c">
            <div class="i-tabler-star mr-2"></div>
            {{ item.digg }}
          </div>
        </div>
        <div class="mb-4 text-0.9rem lt-sm:line-clamp-4">
          {{ item.desc }}
        </div>
        <div class="f-c-e flex-wrap">
          <el-tag type="success" v-if="item.isTop" class="ml-2">置顶随笔</el-tag>
          <el-tag type="danger" v-if="item.isOnlyMe" class="ml-2">自己可见</el-tag>
          <el-tag type="warning" v-if="item.isLocked" class="ml-2">密码锁定</el-tag>
        </div>
      </div>
      <div class="lg-sm:w-30% lt-sm:w-40% lt-sm:h-35 lg-sm:h-40 flow-hidden position-relative">
        <div class="mask position-absolute top-0 left-0 w-100% h-15% z-1"></div>
        <img class="w-100% h-100% object-cover" :src="item.surface || coverArr[coverIdx[index]]" />
        <div class="mask position-absolute bottom-0 left-0 w-100% h-15%"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  .mask::after {
    --uno: block rd-2 w-100% h-100%;
    content: "";
    opacity: 0.8;
    backdrop-filter: blur(6px);
  }

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
