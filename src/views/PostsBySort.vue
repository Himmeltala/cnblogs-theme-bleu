<script setup lang="ts">
const loading = new Utils.Browser.Loading();
const route = useRoute();
const router = useRouter();
const posts = shallowRef<PostsList2Model>();
const subPosts = shallowRef<SubPostModel[]>();
const postCoverArr = Consts.config.images.stochastic;
const postCoverIdx = shallowRef<number[]>();
const currPage = ref<number>(Number(route.query.page));

function fetch(id: string | number | string[]) {
  loading.startLoading();

  Requests.Posts.getByL1(id, currPage.value).then(data => {
    posts.value = data;
    postCoverIdx.value = Utils.Random.get(postCoverArr, posts.value.data.length);
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
  router.push(Consts.Paths.sort(route.query.id, currPage.value));
}

fetch(route.query.id);
</script>

<template>
  <div class="page">
    <div class="text-1.2rem mb-2 text-text-regular">{{ posts?.hint || "" }}</div>
    <div class="mb-5 text-0.9rem" v-html="posts?.desc2 || posts?.desc || ''"></div>
    <div class="mb-10 text-0.9rem" v-if="subPosts?.length">
      <div
        class="hover f-c-s"
        v-for="(item, index) in subPosts"
        :class="{ 'mb-2': index != subPosts.length - 1 }">
        <div class="i-tabler:folder-plus mr-2"></div>
        <router-link :to="Consts.Paths.sort(item.id)">
          {{ item.text }}
        </router-link>
      </div>
    </div>
    <div v-if="posts?.data?.length">
      <PostItem
        v-for="(item, index) in posts.data"
        :item="item"
        :cover="postCoverArr[postCoverIdx[index]]" />
      <div class="f-c-e">
        <el-pagination
          :layout="Consts.isPC() ? 'pager, next' : 'prev, next'"
          :total="posts?.page"
          :page-count="posts?.page"
          v-model:current-page="currPage"
          @current-change="onCurrentChange" />
      </div>
    </div>
    <div class="mt-50" v-else>
      <el-result title="没有随笔" sub-title="该分类没有随笔，请点击查看子分类"> </el-result>
    </div>
  </div>
</template>
