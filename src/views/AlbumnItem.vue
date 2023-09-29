<script setup lang="ts">
import { DatumHttp } from "@/requests";
import { useFancybox } from "@/hooks/use-fancybox";

const route = useRoute();
const imgUrl = shallowRef();
const loading = new Broswer.Loading();

function fetchData() {
  loading.startLoading();
  DatumHttp.getAlbumnItem(`${route.params.id}`).then(data => {
    imgUrl.value = data;

    nextTick(() => {
      useFancybox();
      loading.endLoading();
    });
  });
}

fetchData();
</script>

<template>
  <div class="albumn-item lg-sm:px-90 lt-sm:px-5">
    <div class="text-1.2rem mb-5">相册图片</div>
    <div class="f-c-c">
      <a :href="imgUrl" data-fancybox="bleu-albumn" :data-download-src="imgUrl">
        <img class="max-w-100% max-h-70vh" :src="imgUrl" />
      </a>
    </div>
  </div>
</template>
