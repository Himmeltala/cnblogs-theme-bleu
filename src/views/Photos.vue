<script lang="ts" setup>
const route = useRoute();
const imgList = shallowRef();
const albumn = shallowRef<PhotosModel>();

async function fetch(id: any) {
  Utils.Browser.startLoading();

  albumn.value = await Requests.Datum.getAlbumn(id);

  imgList.value = albumn.value.data.map(i => i.href);

  nextTick(() => {
    Hooks.Fancybox.use();

    Utils.Browser.endLoading();
  });
}

onMounted(async () => {
  await fetch(route.params.id);
});

onBeforeRouteUpdate(async updateGuard => {
  await fetch(updateGuard.params.id);
});
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
