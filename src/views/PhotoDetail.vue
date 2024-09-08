<script lang="ts" setup>
const route = useRoute();
const imgUrl = shallowRef();
const loading = new Utils.Browser.Loading();

function fetch() {
  loading.startLoading();
  Requests.Datum.getAlbumnItem(`${route.params.id}`).then(data => {
    imgUrl.value = data;

    nextTick(() => {
      Hooks.Fancybox.use();
      loading.endLoading();
    });
  });
}

fetch();
</script>

<template>
  <div class="page">
    <div class="text-1.2rem mb-4">相册图片</div>
    <div class="f-c-c">
      <a :data-download-src="imgUrl" :href="imgUrl" data-fancybox="bleu-albumn">
        <img :src="imgUrl" class="max-w-100% max-h-70vh" />
      </a>
    </div>
  </div>
</template>
