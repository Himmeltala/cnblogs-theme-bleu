<script setup lang="ts">
const loading = new Utils.Browser.Loading();

const route = useRoute();
const archiveList = shallowRef();

let archiveDate = route.params.date as string;
let archiveMode = route.params.mode as string;

function fetch() {
  loading.startLoading();
  let promise;

  if (archiveMode == "a") {
    promise = Requests.Posts.getListByArchive(`${archiveDate}`, "article");
  } else if (archiveMode == "p") {
    promise = Requests.Posts.getListByArchive(`${archiveDate}`, "arbeiten");
  } else {
    promise = Requests.Posts.getListByDay(`${archiveDate.replaceAll("-", "/")}`);
  }

  promise.then(data => {
    archiveList.value = data;
    Utils.Browser.setTitle(archiveList.value.hint);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  archiveMode = updateGuard.params.mode as string;
  archiveDate = updateGuard.params.date as string;
  fetch();
});

fetch();
</script>

<template>
  <div class="page" v-if="archiveList?.data">
    <div class="text-1.2rem mb-10 text-text-regular">{{ archiveList.hint }}</div>
    <PostItem :data="archiveList.data" />
  </div>
</template>
