<script setup lang="ts">
import { PostsHttp } from "@/requests";

const loading = new Broswer.Loading();

const route = useRoute();
const archiveList = shallowRef();
const postCoverArr = BleuVars.config.images.stochastic;
const postCoverIndex = shallowRef<number[]>();

let archiveDate = route.params.date as string;
let archiveMode = route.params.mode as string;

async function fetchData() {
  loading.startLoading();
  let promise;

  if (archiveMode == "a") {
    promise = PostsHttp.getListByArchive(`${archiveDate}`, "article");
  } else if (archiveMode == "p") {
    promise = PostsHttp.getListByArchive(`${archiveDate}`, "arbeiten");
  } else {
    promise = PostsHttp.getListByDay(`${archiveDate.replaceAll("-", "/")}`);
  }

  promise.then(data => {
    archiveList.value = data;
    postCoverIndex.value = Random.get(postCoverArr, archiveList.value.data.length);
    Broswer.setTitle(archiveList.value.hint);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  archiveMode = updateGuard.params.mode as string;
  archiveDate = updateGuard.params.date as string;
  fetchData();
});

fetchData();
</script>

<template>
  <div class="posts-by-archive lg-sm:px-90 lt-sm:px-5 pb-5" v-if="archiveList?.data">
    <div class="text-1.2rem mb-5 mt-4">{{ archiveList.hint }}</div>
    <PostsItem
      v-for="(item, index) in archiveList.data"
      :item="item"
      :cover="postCoverArr[postCoverIndex[index]]" />
  </div>
</template>
