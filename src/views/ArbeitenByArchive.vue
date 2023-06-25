<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const route = useRoute();
let archiveDate = route.params.date as string;
let archiveMode = route.params.mode as string;
const archiveList = shallowRef();
const images = BleuVars.config.images?.arbeiten || [];
const imgsIndexs = shallowRef<number[]>();
const loading = new Broswer.Loading();

async function fetchData() {
  loading.startLoading();
  let promise;

  if (archiveMode == "a") {
    promise = ArbeitenApi.getListByArchive(`${archiveDate}`, "article");
  } else if (archiveMode == "p") {
    promise = ArbeitenApi.getListByArchive(`${archiveDate}`, "arbeiten");
  } else {
    promise = ArbeitenApi.getListByDay(`${archiveDate.replaceAll("-", "/")}`);
  }

  archiveList.value = await promise;
  imgsIndexs.value = Random.get(images, archiveList.value.data.length);

  Broswer.setTitle(archiveList.value.hint);
  loading.endLoading();
}

watch(route, async () => {
  if (route.name === RouterName.ArbeitenByArchive) {
    archiveMode = route.params.mode as string;
    archiveDate = route.params.date as string;
    await fetchData();
  }
});

await fetchData();
</script>

<template>
  <div id="l-arbeiten-by-archive" class="page">
    <div class="content" v-if="archiveList">
      <Pagination @change="fetchData" @next="fetchData" @prev="fetchData" :count="archiveList.page">
        <template #content>
          <el-page-header :icon="null" @back="$router.back()">
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
            v-if="archiveList?.data?.length"
            v-for="(item, index) in archiveList.data"
            :key="item.id"
            :item="item"
            :index="index"
            :length="archiveList.data.length"
            :cover="images[imgsIndexs[index]]" />
        </template>
      </Pagination>
    </div>
  </div>
</template>
