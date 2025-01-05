<script lang="ts" setup>
const route = useRoute();
const currPage = ref(1);
const postList = shallowRef<PostsModel>();
const postCoverIdx = shallowRef<number[]>();
const postCoverArr = Consts.config.images.stochastic;

async function fetch(name: any) {
  Utils.Browser.startLoading();

  postList.value = await Requests.Posts.getListLabel(name, currPage.value);
  postCoverIdx.value = Utils.Random.get(postCoverArr, postList.value.data.length);

  Utils.Browser.setTitle(postList.value.hint);

  nextTick(() => {
    Utils.Browser.endLoading();
  });
}

onMounted(async () => {
  await fetch(route.query.name);
});

onBeforeRouteUpdate(async updateGuard => {
  await fetch(updateGuard.query.name);
});
</script>

<template>
  <div v-if="postList" class="page">
    <div class="text-1.2rem mb-10">{{ postList.hint }}</div>
    <div class="f-c-b flex-wrap">
      <div
        v-for="(item, index) in postList.data"
        class="item cursor-pointer sm:w-30% lt-sm:w-45% mb-10">
        <router-link :to="Consts.Paths.post(item.id)">
          <div class="lt-sm:h-45 sm:h-55 flow-hidden relative">
            <div class="mask absolute top-0 left-0 w-100% h-15% z-1"></div>
            <img :src="postCoverArr[postCoverIdx[index]]" class="w-100% h-100% object-cover rd-2" />
            <div class="mask absolute bottom-0 left-0 w-100% h-15%"></div>
          </div>
          <div
            :to="Consts.Paths.post(item.id)"
            class="text-ellipsis line-clamp-1 mt-4 text-text-regular">
            {{ item.text }}
          </div>
          <div>
            <div class="f-c-s flex-wrap mb-2 text-0.8rem">
              <div class="mr-4 f-c-c">
                <div class="i-tabler-clock mr-2"></div>
                {{ item.date }}
              </div>
              <div class="mr-4 f-c-c">
                <div class="i-tabler-eye mr-2"></div>
                {{ item.view }}
              </div>
              <div class="mr-4 f-c-c">
                <div class="i-tabler-message mr-2"></div>
                {{ item.comm }}
              </div>
              <div class="f-c-c">
                <div class="i-tabler-star mr-2"></div>
                {{ item.digg }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="f-c-e">
      <el-pagination
        v-model:current-page="currPage"
        layout="pager, next"
        :page-count="postList?.page"
        @current-change="() => fetch(route.query.name)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
