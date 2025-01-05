<script lang="ts" setup>
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
  <div v-for="(item, index) in data" class="item mb-14">
    <router-link :to="Consts.Paths.post(item.id)" class="text-1.2rem hover text-text-regular">
      {{ item.text }}
    </router-link>
    <div class="mt-4 f-s-b flex-gap-4">
      <div class="sm:w-65% lt-sm:w-55%">
        <div class="mb-4 text-0.9rem lt-sm:line-clamp-4">
          {{ item.desc }}
        </div>
        <div class="f-c-e flex-wrap mb-4">
          <el-tag v-if="item.isTop" class="ml-2" type="success">置顶随笔</el-tag>
          <el-tag v-if="item.isOnlyMe" class="ml-2" type="danger">自己可见</el-tag>
          <el-tag v-if="item.isLocked" class="ml-2" type="warning">密码锁定</el-tag>
        </div>
        <div class="f-c-s flex-wrap text-0.8rem">
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
      </div>
      <div class="sm:w-30% sm:h-40 lt-sm:w-40% lt-sm:h-35 flow-hidden relative">
        <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
        <img :src="item.surface || coverArr[coverIdx[index]]" class="w-100% h-100% object-cover" />
        <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
