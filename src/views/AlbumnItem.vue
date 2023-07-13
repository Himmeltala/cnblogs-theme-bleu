<script setup lang="ts">
import { DatumApi } from "@/apis";
import { useFancybox } from "@/hooks/use-fancybox";

const route = useRoute();
const imgUrl = shallowRef<string>();
const loading = new Broswer.Loading();

async function fetchData() {
  loading.startLoading();
  imgUrl.value = await DatumApi.getAlbumnItem(`${route.params.id}`);
  useFancybox();
  loading.endLoading();
}

await fetchData();
</script>

<template>
  <div id="l-albumn-item" class="page">
    <div class="content">
      <el-page-header :icon="null" @back="$router.back()">
        <template #title>
          <div class="f-c-c">
            <i-ep-back />
          </div>
        </template>
        <template #content>
          <div class="text-1.2rem mb-5 mt-4">相册图片</div>
        </template>
      </el-page-header>
      <div class="f-c-c">
        <a :href="imgUrl" data-fancybox="bleu-albumn" :data-download-src="imgUrl">
          <img class="max-w-100%" :src="imgUrl" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.albumn-item {
  img {
    max-height: 70vh !important;
  }
}
</style>
