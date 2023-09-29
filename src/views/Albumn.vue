<script setup lang="ts">
import { DatumHttp } from "@/requests";
import { useFancybox } from "@/hooks/use-fancybox";

const loading = new Broswer.Loading();

const route = useRoute();
const imgList = shallowRef();
const albumn = shallowRef<AlbumnModel>();

function fetchData(id: any) {
  loading.startLoading();
  DatumHttp.getAlbumn(id).then(data => {
    albumn.value = data;
    imgList.value = albumn.value.data.map((i: any) => i.src);

    nextTick(() => {
      useFancybox();
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  fetchData(updateGuard.params.id);
});

fetchData(route.params.id);
</script>

<template>
  <div class="albumns lg-sm:px-90 lt-sm:px-5" v-if="albumn">
    <div class="text-1.2rem mb-5">相册 - {{ albumn.title }}</div>
    <div class="text-0.9rem mb-10 text-text-regular">{{ albumn.desc }}</div>
    <div class="f-c-b flex-wrap flex-gap-4">
      <a v-for="item in imgList" :href="item" data-fancybox="bleu-albumn" :data-download-src="item">
        <img class="max-w-100%" :src="item" />
      </a>
    </div>
  </div>
</template>
