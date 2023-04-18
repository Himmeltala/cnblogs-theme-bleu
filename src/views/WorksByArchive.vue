<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const route = useRoute();
let archiveDate = route.params.date;
let archiveMode = route.params.mode;
const archiveWorks = shallowRef();
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
const covers = shallowRef();

async function fetchData() {
  EcyUtils.startLoading();

  if (archiveMode === "a") {
    archiveWorks.value = await WorksApi.getListByArchive(`${archiveDate}`, "article");
  } else if (archiveMode === "p") {
    archiveWorks.value = await WorksApi.getListByArchive(`${archiveDate}`, "works");
  } else if (archiveMode === "d") {
    archiveWorks.value = await WorksApi.getListByDay(`${String(archiveDate).replaceAll("-", "/")}`);
  }

  covers.value = EcyUtils.Random.get(worksImgs, archiveWorks.value.data.length);
  EcyUtils.setTitle(archiveWorks.value.hint);
  EcyUtils.endLoading();
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.WorksByArchive) {
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
            :cover="worksImgs[covers[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>
