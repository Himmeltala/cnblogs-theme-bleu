<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
let sortId = route.params.id as string;
const typeL2Works = shallowRef();
const typeL1Works = shallowRef();
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works;
const imgsIndex = shallowRef();

async function fetchData(index?: any) {
  EcyUtils.startLoading();
  typeL1Works.value = await WorksApi.getByL1(`${sortId}`, index);
  EcyUtils.endLoading();
  typeL2Works.value = await WorksApi.getByL2(`${sortId}`, typeL1Works.value.isArticle);
  imgsIndex.value = EcyUtils.Random.get(worksImgs, typeL1Works.value.data.length);
  EcyUtils.setTitle(typeL1Works.value.hint);
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.WORKS_BY_SORT) {
    sortId = route.params.id as string;
    await fetchData();
  }
});
</script>

<template>
  <div id="l-works-by-sort" class="page">
    <div class="content">
      <Pagination @nexpr="fetchData" @next="fetchData" @prev="fetchData" :count="typeL1Works.page" :disabled="!typeL1Works.data.length">
        <template #content>
          <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
            <template #title>
              <div class="f-c-c">
                <i-ep-back />
              </div>
            </template>
            <template #content>
              <div class="l-size-5 mb-5 mt-4">{{ typeL1Works.hint }}</div>
            </template>
          </el-page-header>
          <div class="mb-10 l-size-2 l-color-3" v-html="typeL1Works.desc2 || typeL1Works.desc"></div>
          <div class="l-size-2" v-if="typeL2Works.length > 0">
            <div class="hover f-c-s" v-for="(item, index) in typeL2Works" :class="{ 'mb-3': index != typeL2Works.length - 1 }">
              <span class="mr-2">📁</span>
              <router-link :to="RouterPath.WORKS_BY_SORT(item.id)">{{ item.text }}</router-link>
            </div>
          </div>
          <WorksItem
            v-if="typeL1Works.data.length > 0"
            v-for="(item, index) in typeL1Works.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="worksImgs[imgsIndex[index]]" />
        </template>
      </Pagination>
      <div class="mt-35" v-if="!typeL1Works.data.length">
        <el-result title="没有随笔" sub-title="该分类没有随笔，请点击查看子分类"> </el-result>
      </div>
    </div>
  </div>
</template>
