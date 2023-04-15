<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
let sortId = route.params.id as string;
let sortMode = route.params.mode as "a" | "p";
const typeL2Works = shallowRef();
const typeL1Works = shallowRef();
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const covers = shallowRef();

async function fetchData(index?: any) {
  EcyUtils.startLoading();

  if (sortMode === "a") {
    typeL2Works.value = await WorksApi.getByTypeL2(`${sortId}`, "article");
  } else if (sortMode === "p") {
    typeL2Works.value = await WorksApi.getByTypeL2(`${sortId}`);
  }

  typeL1Works.value = await WorksApi.getByTypeL1(`${sortId}`, index);
  covers.value = EcyUtils.Random.get(worksImgs, typeL1Works.value.data.length);

  EcyUtils.setTitle(typeL1Works.value.hint);
  EcyUtils.endLoading();
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.WorksBySort) {
    sortId = route.params.id as string;
    sortMode = route.params.mode as "a" | "p";
    await fetchData();
  }
});
</script>

<template>
  <div id="l-sort" class="min-height page">
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
              <div class="l-sec-size mb-5 mt-4">{{ typeL1Works.hint }}</div>
            </template>
          </el-page-header>
          <div class="l-sort__desc mb-4 l-for-size l-sec-color" v-html="typeL1Works.desc2 || typeL1Works.desc"></div>
          <div class="l-sort__child l-fiv-size" v-if="typeL2Works.length > 0">
            <div class="hover f-c-s" v-for="(item, index) in typeL2Works" :class="{ 'mb-3': index != typeL2Works.length - 1 }">
              <span class="mr-2">📁</span>
              <router-link :to="RouterPath.worksBySort(sortMode, item.id)">{{ item.text }}</router-link>
            </div>
          </div>
          <WorksItem
            v-if="typeL1Works.data.length > 0"
            v-for="(item, index) in typeL1Works.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="worksImgs[covers[index]]" />
        </template>
      </Pagination>
      <div class="mt-35" v-if="!typeL1Works.data.length">
        <el-result title="没有随笔" sub-title="该分类没有随笔，请点击查看子分类"> </el-result>
      </div>
    </div>
  </div>
</template>
