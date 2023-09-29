<script setup lang="ts">
import { PostsHttp } from "@/requests";

const loading = new Broswer.Loading();

const route = useRoute();
const mainPostList = shallowRef<PostsList2Model>();
const subPostList = shallowRef<SubPostModel[]>();
const postCoverArr = BleuVars.config.images.stochastic;
const postCoverIndex = shallowRef<number[]>();

const currPage = ref<number>(Number(route.query.page || 1));

function fetchData(id: any) {
  loading.startLoading();

  PostsHttp.getByL1(id, Number(currPage.value)).then(mainData => {
    mainPostList.value = mainData;
    postCoverIndex.value = Random.get(postCoverArr, mainPostList.value.data.length);
    Broswer.setTitle(mainPostList.value.hint);

    nextTick(() => {
      PostsHttp.getByL2(id, mainData.isArticle).then(subData => {
        subPostList.value = subData;
      });

      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  fetchData(updateGuard.query.id);
});

fetchData(route.query.id);
</script>

<template>
  <div class="posts-by-sort lg-sm:px-90 lt-sm:px-5 pb-5">
    <div class="text-1.2rem mb-4">{{ mainPostList?.hint || "" }}</div>
    <div
      class="mb-4 text-0.9rem text-text-regular"
      v-html="mainPostList?.desc2 || mainPostList?.desc || ''"></div>
    <div class="mb-10 text-0.9rem" v-if="subPostList?.length">
      <div
        class="hover f-c-s"
        v-for="(item, index) in subPostList"
        :class="{ 'mb-2': index != subPostList.length - 1 }">
        <div class="i-tabler-folder-plus mr-2"></div>
        <router-link :to="RouterPath.PostsBySort(item.id, '1', true)">
          {{ item.text }}
        </router-link>
      </div>
    </div>
    <div v-if="mainPostList?.data?.length">
      <PostsItem
        v-for="(item, index) in mainPostList.data"
        :item="item"
        :cover="postCoverArr[postCoverIndex[index]]" />
      <div class="f-c-e">
        <el-pagination
          background
          :layout="BleuVars.isPC() ? 'pager, next, jumper, total' : 'prev, next, jumper, total'"
          :total="mainPostList?.page"
          :page-count="mainPostList?.page"
          v-model:current-page="currPage"
          @current-change="fetchData($route.query.id)" />
      </div>
    </div>
    <div class="mt-50" v-else>
      <el-result title="没有随笔" sub-title="该分类没有随笔，请点击查看子分类"> </el-result>
    </div>
  </div>
</template>
