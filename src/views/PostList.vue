<script setup lang="ts">
const loading = new Utils.Browser.Loading();

const postList = ref();
const postCoverIdx = shallowRef<number[]>();
const postCoverArr = Consts.config.images.stochastic;
const currPage = ref(1);

function fetch() {
  loading.startLoading();

  Requests.Posts.getList(currPage.value).then(data => {
    postList.value = data;
    postCoverIdx.value = Utils.Random.get(postCoverArr, postList.value.data.length);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  currPage.value = Number(route.query.page);
  fetch();
});

onBeforeRouteUpdate(updateGuard => {
  currPage.value = Number(updateGuard.query.page);
  fetch();
});

function onCurrentChange() {
  router.push(Consts.Paths.posts(currPage.value));
}
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
