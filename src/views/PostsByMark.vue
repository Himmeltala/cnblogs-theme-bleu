<script setup lang="ts">
import { PostsHttp } from "@/requests";

const route = useRoute();
const mainList = shallowRef<PostsList2Model>();
const currPage = ref(1);
const loading = new Broswer.Loading();

function fetchData(name: any) {
  loading.startLoading();
  PostsHttp.getListByMark(name, currPage.value).then(data => {
    mainList.value = data;
    Broswer.setTitle(mainList.value.hint);

    nextTick(() => {
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  fetchData(updateGuard.query.name);
});

fetchData(route.query.name);
</script>

<template>
  <div class="posts-by-mark lg-sm:px-90 lt-sm:px-5 pb-5" v-if="mainList">
    <div class="mb-15" v-for="item of mainList.data">
      <div class="text-1.2rem">
        <router-link class="hover" :to="'/p/' + item.id">
          {{ item.text }}
        </router-link>
      </div>
      <div class="mt-4 f-c-s text-0.9rem text-text-regular">
        <div class="mr-4 f-c-c">
          <i-ep-clock class="mr-2" />
          {{ item.date }}
        </div>
        <div class="mr-4 f-c-c">
          <i-ep-view class="mr-2" />
          {{ item.view }}
        </div>
        <div class="mr-4 f-c-c">
          <i-ep-chat-line-square class="mr-2" />
          {{ item.comm }}
        </div>
        <div class="f-c-c">
          <i-ep-star class="mr-2" />
          {{ item.digg }}
        </div>
      </div>
    </div>
    <div class="f-c-e">
      <el-pagination
        background
        :layout="BleuVars.isPC() ? 'pager, next, jumper, total' : 'prev, next, jumper, total'"
        :page-count="mainList?.page"
        v-model:current-page="currPage"
        @current-change="fetchData" />
    </div>
  </div>
</template>
