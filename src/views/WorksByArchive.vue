<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const route = useRoute();
let archiveDate = route.params.date;
let archiveMode = route.params.mode;
const archiveWorks = shallowRef();
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works;
const imgsIndex = shallowRef();

async function fetchData() {
  let fetchDataPromise;
  EcyUtils.startLoading();

  switch (archiveMode) {
    case "a":
      fetchDataPromise = WorksApi.getListByArchive(`${archiveDate}`, "article");
      break;
    case "p":
      fetchDataPromise = WorksApi.getListByArchive(`${archiveDate}`, "works");
      break;
    case "d":
      fetchDataPromise = WorksApi.getListByDay(`${String(archiveDate).replaceAll("-", "/")}`);
      break;
    default:
      fetchDataPromise = Promise.reject(new Error("Invalid archive mode provided."));
  }

  try {
    archiveWorks.value = await fetchDataPromise;
    imgsIndex.value = EcyUtils.Random.get(worksImgs, archiveWorks.value.data.length);
    EcyUtils.setTitle(archiveWorks.value.hint);
  } catch (error) {
    ElMessage.error(error);
  } finally {
    EcyUtils.endLoading();
  }
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.WORKS_BY_ARCHIVE) {
    archiveMode = route.params.mode;
    archiveDate = route.params.date;
    await fetchData();
  }
});
</script>

<template>
  <div id="l-archive" class="min-height page">
    <div class="content">
      <Pagination @nexpr="fetchData" @next="fetchData" @prev="fetchData" :count="archiveWorks.page">
        <template #content>
          <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router: $router })">
            <template #title>
              <div class="f-c-c">
                <i-ep-back />
              </div>
            </template>
            <template #content>
              <div class="l-size-5 mb-5 mt-4">{{ archiveWorks.hint }}</div>
            </template>
          </el-page-header>
          <WorksItem
            v-if="archiveWorks.data.length > 0"
            v-for="(item, index) in archiveWorks.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="worksImgs[imgsIndex[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>
