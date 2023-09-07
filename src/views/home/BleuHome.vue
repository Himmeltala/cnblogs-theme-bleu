<script setup lang="ts">
import { ArbeitenApi, DatumApi } from "@/apis";

const arbeList = shallowRef<BleuArbeitenList>();
const newsData = shallowRef<BleuMenuItemData[]>();
const statusData = shallowRef<BleuMenuItemData[]>();
const topListData = shallowRef<BleuTopList>();
const columnData = shallowRef<BleuMenuColumn>();
const markList = shallowRef<BleuMark[]>();
const loading = new Broswer.Loading();

async function fetchData() {
  loading.startLoading();

  const [val1, val2, val3, val4, val5, val6] = await Promise.all([
    ArbeitenApi.getList(),
    DatumApi.getNews(),
    DatumApi.getStats(),
    DatumApi.getTopList(),
    DatumApi.getColumn(),
    DatumApi.getMarkList()
  ]);

  val1.data.splice(4, 6);
  arbeList.value = val1;
  newsData.value = val2;
  statusData.value = val3;
  topListData.value = val4;
  columnData.value = val5;
  markList.value = val6;

  loading.endLoading();
}

await fetchData();
</script>

<template>
  <div id="l-home" class="xl:px-18vw lt-xl:px-15vw lt-lg:px-10vw lt-md:px-5vw lt-sm:px-1rem">
    <CornerMenu />
    <div class="lg:f-s-b">
      <RecentEssay class="lg:w-49% lg:h-100vh py-4" :data="arbeList.data" />
      <HomeCarousel class="lg:w-49% lt-lg:hidden" v-if="!BleuVars.config.images.home.disabled" />
      <BlogInfo
        v-else
        class="lg:w-49% flex-col flex justify-between lg:h-100vh py-4"
        :rankings="columnData.rankings"
        :news="newsData"
        :status="statusData" />
    </div>
    <MyTags class="mt-10" :data="markList" />
    <div class="sm:f-s-b mt-15">
      <EssayCategory class="sm:w-49%" :data="columnData.essaySort" />
      <ArticleCategory class="sm:w-49%" :data="columnData.articleSort" />
    </div>
    <EssayArchive class="mt-15" :data="columnData.essayArchive" />
    <ArticleArchive class="mt-15" :data="columnData.articleArchive" />
    <PhotoAlbumn class="mt-15" :data="columnData.albumn" />
  </div>
</template>

<style scoped lang="scss"></style>
