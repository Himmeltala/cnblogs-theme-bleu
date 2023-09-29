<script setup lang="ts">
import { PostsHttp } from "@/requests";

const loading = new Broswer.Loading();

const route = useRoute();
const router = useRouter();
const mainData = ref();
const postCoverIndex = shallowRef<number[]>();
const postCoverArr = BleuVars.config.images.stochastic;

const currPage = ref<number>(Number(route.query.page) || 1);

function fetchData() {
  loading.startLoading();
  PostsHttp.getList(currPage.value).then(data => {
    mainData.value = data;
    postCoverIndex.value = Random.get(postCoverArr, mainData.value.data.length);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(() => {
  fetchData();
});

function onCurrentChange() {
  router.push({ path: "/", query: { page: currPage.value } });
}

fetchData();
</script>

<template>
  <div v-if="mainData?.data" class="home w-100vw lg-sm:px-90 lt-sm:px-5 pb-5">
    <PostsItem
      v-for="(item, index) in mainData.data"
      :item="item"
      :cover="postCoverArr[postCoverIndex[index]]" />
    <div class="f-c-e">
      <el-pagination
        background
        :layout="BleuVars.isPC() ? 'pager, next, jumper' : 'prev, next, jumper, total'"
        :total="mainData?.page"
        :page-count="mainData?.page"
        v-model:current-page="currPage"
        @current-change="onCurrentChange" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
