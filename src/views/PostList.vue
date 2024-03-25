<script setup lang="ts">
import { PostsHttp } from "@/requests";

const loading = new Utils.Broswer.Loading();

const router = useRouter();
const postList = ref();
const postCoverIdx = shallowRef<number[]>();
const postCoverArr = Consts.config.images.stochastic;
const currPage = ref(1);

function fetch() {
  loading.startLoading();

  PostsHttp.getList(currPage.value).then(data => {
    postList.value = data;
    postCoverIdx.value = Utils.Random.get(postCoverArr, postList.value.data.length);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  currPage.value = Number(updateGuard.query.page);
  fetch();
});

function onCurrentChange() {
  router.push(Consts.Paths.posts(currPage.value));
}

fetch();
</script>

<template>
  <div v-if="postList?.data" class="page">
    <PostItem
      v-for="(item, index) in postList.data"
      :item="item"
      :cover="postCoverArr[postCoverIdx[index]]" />
    <div class="f-c-e">
      <el-pagination
        :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
        :page-count="postList?.page"
        v-model:current-page="currPage"
        @current-change="onCurrentChange" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
