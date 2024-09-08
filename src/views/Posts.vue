<script lang="ts" setup>
const loading = new Utils.Browser.Loading();

const postList = ref();
const currPage = ref(1);

function fetch() {
  loading.startLoading();

  Requests.Posts.getList(currPage.value).then(data => {
    postList.value = data;

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
    <PostItem :data="postList.data" />
    <div class="f-c-e">
      <el-pagination
        v-model:current-page="currPage"
        :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
        :page-count="postList?.page"
        @current-change="onCurrentChange" />
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
