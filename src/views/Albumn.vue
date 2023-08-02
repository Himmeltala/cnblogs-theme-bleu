<script setup lang="ts">
import { DatumApi } from "@/apis";
import { useFancybox } from "@/hooks/use-fancybox";

const route = useRoute();
const imgList = shallowRef();
const loading = new Broswer.Loading();
const albumn = shallowRef<BleuAlbumn>();

async function fetchData() {
  loading.startLoading();
  albumn.value = await DatumApi.getAlbumn(route.params.id as string);
  imgList.value = albumn.value.data.map((i: any) => i.src);
  useFancybox();
  loading.endLoading();
}

watch(route, async () => {
  if (route.name === RouterName.Albumn) {
    await fetchData();
  }
});

await fetchData();
</script>

<template>
  <div id="l-albumn" class="page">
    <div class="content" v-if="albumn">
      <el-page-header :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">相册 - {{ albumn.title }}</div>
        </template>
      </el-page-header>
      <div class="mb-4 text-0.9rem text-b">{{ albumn.desc }}</div>
      <div class="f-c-b flex-wrap">
        <a
          v-for="item in imgList"
          :href="item"
          data-fancybox="bleu-albumn"
          :data-download-src="item">
          <img class="mb-4 max-w-100%" :src="item" />
        </a>
      </div>
    </div>
  </div>
</template>
