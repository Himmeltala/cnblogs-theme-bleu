<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const posts = shallowRef<Posts2Model>();
const subPosts = shallowRef<SubPostModel[]>();
const currPage = ref<number>(Number(route.query.page));

async function fetch(id: string | number | string[]) {
  Utils.Browser.startLoading();

  posts.value = await Requests.Posts.getByL1(id, currPage.value);
  subPosts.value = await Requests.Posts.getByL2(id, posts.value.isArticle);

  Utils.Browser.setTitle(posts.value.hint);
  nextTick(() => {
    Utils.Browser.endLoading();
  });
}

onMounted(async () => {
  await fetch(route.query.id);
});

onBeforeRouteUpdate(async updateGuard => {
  currPage.value = Number(updateGuard.query.page);
  await fetch(updateGuard.query.id);
});

function onCurrentChange() {
  router.push(Consts.Paths.category(route.query.id, currPage.value));
}
</script>

<template>
  <div class="page">
    <div class="text-1.2rem mb-2 text-text-regular">{{ posts?.hint || "" }}</div>
    <div class="mb-5 text-0.9rem" v-html="posts?.desc2 || posts?.desc || ''"></div>
    <div v-if="subPosts?.length" class="mb-20 text-0.9rem">
      <div
        v-for="(item, index) in subPosts"
        :class="{ 'mb-2': index != subPosts.length - 1 }"
        class="hover f-c-s">
        <div class="i-tabler:folder-plus mr-2"></div>
        <router-link :to="Consts.Paths.category(item.id)">
          {{ item.text }}
        </router-link>
      </div>
    </div>
    <div v-if="posts?.data?.length">
      <PostItem :data="posts.data" />
      <div class="f-c-e">
        <el-pagination
          v-model:current-page="currPage"
          layout="pager, next"
          :page-count="posts?.page"
          :total="posts?.page"
          @current-change="onCurrentChange" />
      </div>
    </div>
    <div v-else class="mt-50">
      <el-result sub-title="该分类没有随笔，请点击查看子分类" title="没有随笔"></el-result>
    </div>
  </div>
</template>
