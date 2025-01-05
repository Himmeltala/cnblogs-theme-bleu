<script lang="ts" setup>
const postList = ref();
const currPage = ref(1);

async function fetch() {
  Utils.Browser.startLoading();

  postList.value = await Requests.Posts.getList(currPage.value);

  nextTick(() => {
    Utils.Browser.endLoading();
  });
}

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  currPage.value = Number(route.query.page);
  await fetch();
});

onBeforeRouteUpdate(async updateGuard => {
  currPage.value = Number(updateGuard.query.page);
  await fetch();
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
        layout="pager, next"
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
