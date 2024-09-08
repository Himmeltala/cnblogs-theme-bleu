<script lang="ts" setup>
const loading = new Utils.Browser.Loading();

const route = useRoute();
const imgList = shallowRef();
const albumn = shallowRef<PhotosModel>();

function fetch(id: any) {
  loading.startLoading();
  Requests.Datum.getAlbumn(id).then(data => {
    albumn.value = data;
    imgList.value = albumn.value.data.map(i => i.href);

    nextTick(() => {
      Hooks.Fancybox.use();
      loading.endLoading();
    });
  });
}

onBeforeRouteUpdate(updateGuard => {
  fetch(updateGuard.params.id);
});

fetch(route.params.id);
</script>

<template>
  <div v-if="albumn" class="page">
    <div class="text-1.2rem mb-4">相册 - {{ albumn.title }}</div>
    <div class="text-0.9rem mb-10 text-text-regular">{{ albumn.desc }}</div>
    <div class="f-c-b flex-wrap flex-gap-4">
      <a v-for="item in imgList" :data-download-src="item" :href="item" data-fancybox="bleu-albumn">
        <img :src="item" class="max-w-100%" />
      </a>
    </div>
  </div>
</template>
