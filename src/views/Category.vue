<script lang="ts" setup>
const loading = new Utils.Browser.Loading();
const route = useRoute();
const router = useRouter();
const posts = shallowRef<Posts2Model>();
const subPosts = shallowRef<SubPostModel[]>();
const currPage = ref<number>(Number(route.query.page));

function fetch(id: string | number | string[]) {
  loading.startLoading();

  Requests.Posts.getByL1(id, currPage.value).then(data => {
    posts.value = data;
    Utils.Browser.setTitle(posts.value.hint);

    nextTick(() => {
      Requests.Posts.getByL2(id, data.isArticle).then(data => {
        subPosts.value = data;
      });

      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  currPage.value = Number(updateGuard.query.page);
  fetch(updateGuard.query.id);
});

function onCurrentChange() {
  router.push(Consts.Paths.category(route.query.id, currPage.value));
}

fetch(route.query.id);
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
          :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
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
