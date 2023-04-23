<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
let sortId = route.params.id as string;
let sortMode = route.params.mode as "a" | "p";
const typeL2Works = shallowRef();
const typeL1Works = shallowRef();
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works;
const imgsIndex = shallowRef();

async function fetchData(index?: any) {
  let typeL2WorksPromise;
  EcyUtils.startLoading();

  switch (sortMode) {
    case "a":
      typeL2WorksPromise = WorksApi.getByTypeL2(`${sortId}`, "article");
      break;
    case "p":
      typeL2WorksPromise = WorksApi.getByTypeL2(`${sortId}`);
      break;
    default:
      typeL2WorksPromise = Promise.reject(new Error("Invalid archive mode provided."));
      break;
  }

  try {
    const [typeL1WorksResp, typeL2WorksResp] = await Promise.all([WorksApi.getByTypeL1(`${sortId}`, index), typeL2WorksPromise]);
    typeL1Works.value = typeL1WorksResp;
    typeL2Works.value = typeL2WorksResp;
    imgsIndex.value = EcyUtils.Random.get(worksImgs, typeL1Works.value.data.length);
    EcyUtils.setTitle(typeL1Works.value.hint);
  } catch (error) {
    ElMessage.error(error);
  } finally {
    EcyUtils.endLoading();
  }
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.WORKS_BY_SORT) {
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
              <div class="l-size-5 mb-5 mt-4">{{ typeL1Works.hint }}</div>
            </template>
          </el-page-header>
          <div class="l-sort__desc mb-10 l-size-2 l-color-3" v-html="typeL1Works.desc2 || typeL1Works.desc"></div>
          <div class="l-sort__child l-size-2" v-if="typeL2Works.length > 0">
            <div class="hover f-c-s" v-for="(item, index) in typeL2Works" :class="{ 'mb-3': index != typeL2Works.length - 1 }">
              <span class="mr-2">📁</span>
              <router-link :to="RouterPath.WORKS_BY_SORT(sortMode, item.id)">{{ item.text }}</router-link>
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
