<script lang="ts" setup>
const route = useRoute();
const archiveList = shallowRef();

let archiveDate = route.params.date as string;
let archiveMode = route.params.mode as string;

async function fetch() {
  Utils.Browser.startLoading();

  archiveList.value = await Requests.Posts.getListArchive(`${archiveDate}`, archiveMode);
  Utils.Browser.setTitle(archiveList.value.hint);

  nextTick(() => {
    Utils.Browser.endLoading();
  });
}

onMounted(async () => {
  await fetch();
});

onBeforeRouteUpdate(async updateGuard => {
  archiveMode = updateGuard.params.mode as string;
  archiveDate = updateGuard.params.date as string;
  await fetch();
});
</script>

<template>
  <div v-if="archiveList?.data" class="page">
    <div class="text-1.2rem mb-10 text-text-regular">{{ archiveList.hint }}</div>
    <PostItem :data="archiveList.data" />
  </div>
</template>
