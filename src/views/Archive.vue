<script lang="ts" setup>
const loading = new Utils.Browser.Loading();

const route = useRoute();
const archiveList = shallowRef();

let archiveDate = route.params.date as string;
let archiveMode = route.params.mode as string;

function fetch() {
  loading.startLoading();

  Requests.Posts.getListArchive(`${archiveDate}`, archiveMode).then(data => {
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
  <div v-if="archiveList?.data" class="page">
    <div class="text-1.2rem mb-10 text-text-regular">{{ archiveList.hint }}</div>
    <PostItem :data="archiveList.data" />
  </div>
</template>
