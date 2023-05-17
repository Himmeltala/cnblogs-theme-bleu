<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
let archiveDate = route.params.date;
let archiveMode = route.params.mode;
const archiveList = shallowRef();
const images = BleuVars.config.images.arbeiten;
const imgsIndexs = shallowRef();

async function fetchData() {
  Broswer.startLoading();

  let fetchDataPromise;

  if (archiveMode == "a") {
    fetchDataPromise = WorksApi.getListByArchive(`${archiveDate}`, "article");
  } else if (archiveMode == "p") {
    fetchDataPromise = WorksApi.getListByArchive(`${archiveDate}`, "works");
  } else {
    fetchDataPromise = WorksApi.getListByDay(`${String(archiveDate).replaceAll("-", "/")}`);
  }

  archiveList.value = await fetchDataPromise;

  imgsIndexs.value = Random.get(images, archiveList.value.data.length);
  Broswer.setTitle(archiveList.value.hint);

  Broswer.endLoading();
}

await fetchData();

watch(route, async () => {
  if (route.name === RouterName.ArbeitenByArchive) {
    archiveMode = route.params.mode;
    archiveDate = route.params.date;
    await fetchData();
  }
});
</script>

<template>
  <div id="l-works-by-archive" class="page">
    <div class="content" v-if="archiveList">
      <Pagination @nexpr="fetchData" @next="fetchData" @prev="fetchData" :count="archiveList.page">
        <template #content>
          <el-page-header :icon="null" @back="Navigation.go({ path: 'back', router: $router })">
            <template #title>
              <div class="f-c-c">
                <i-ep-back />
              </div>
            </template>
            <template #content>
              <div class="text-1.2rem mb-5 mt-4">{{ archiveList.hint }}</div>
            </template>
          </el-page-header>
          <ArbeitenItem
            v-if="archiveList.data.length > 0"
            v-for="(item, index) in archiveList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :cover="images[imgsIndexs[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>
