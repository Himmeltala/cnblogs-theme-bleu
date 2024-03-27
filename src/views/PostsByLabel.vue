<script setup lang="ts">
import { PostsHttp } from "@/requests";

const route = useRoute();
const currPage = ref(1);
const loading = new Utils.Broswer.Loading();
const postList = shallowRef<PostsListModel>();
const postCoverIdx = shallowRef<number[]>();
const postCoverArr = Consts.config.images.stochastic;

function fetch(name: any) {
  loading.startLoading();

  PostsHttp.getListByLabel(name, currPage.value).then(data => {
    postList.value = data;
    Utils.Broswer.setTitle(postList.value.hint);
    postCoverIdx.value = Utils.Random.get(postCoverArr, postList.value.data.length);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  fetch(updateGuard.query.name);
});

fetch(route.query.name);
</script>

<template>
  <div class="page" v-if="postList">
    <div class="text-1.2rem mb-10">{{ postList.hint }}</div>
    <div class="f-c-b flex-wrap">
      <div
        class="item cursor-pointer lg-sm:w-30% lt-sm:w-45% mb-10"
        v-for="(item, index) in postList.data">
        <router-link :to="Consts.Paths.p(item.id)">
          <div class="lt-sm:h-45 lg-sm:h-55 flow-hidden position-relative">
            <div class="mask position-absolute top-0 left-0 w-100% h-15% z-1"></div>
            <img class="w-100% h-100% object-cover rd-2" :src="postCoverArr[postCoverIdx[index]]" />
            <div class="mask position-absolute bottom-0 left-0 w-100% h-15%"></div>
          </div>
          <div
            class="text-ellipsis line-clamp-1 mt-4 text-text-regular"
            :to="Consts.Paths.p(item.id)">
            {{ item.text }}
          </div>
          <div>
            <div class="f-c-s flex-wrap mb-2 text-0.8rem">
              <div class="mr-4 f-c-c">
                <div class="i-tabler-clock mr-2"></div>
                {{ item.date }}
              </div>
              <div class="mr-4 f-c-c">
                <div class="i-tabler-eye mr-1"></div>
                {{ item.view }}
              </div>
              <div class="mr-4 f-c-c">
                <div class="i-tabler-message mr-1"></div>
                {{ item.comm }}
              </div>
              <div class="f-c-c">
                <div class="i-tabler-star mr-1"></div>
                {{ item.digg }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="f-c-e">
      <el-pagination
        :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
        :page-count="postList?.page"
        v-model:current-page="currPage"
        @current-change="() => fetch(route.query.name)" />
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
