<script setup lang="ts">
const colData = ref<ColumnDataModel>();
const stsData = ref<StatisticsModel[]>();
const radarRef = ref<HTMLElement>();

async function fetch() {
  Utils.Browser.startLoading();

  colData.value = await Requests.Datum.getColumnContent();
  stsData.value = await Requests.Datum.getStatistics();

  Utils.Browser.endLoading();
}

await fetch();

onMounted(() => {
  Hooks.Echarts.use({ dom: radarRef.value, options: Consts.config.diagram.technics });
});
</script>

<template>
  <div class="page">
    <div>
      <div class="f-s-s">
        <div class="relative w-30 h-30 mr-10">
          <img :src="Consts.config.avatar" class="w-100% h-100% object-cover rd-50%" />
          <div
            class="absolute bottom-0 right-0 f-c-c w-8 h-8 rd-50% dark:bg-#323232 light:bg-#f2f2f2">
            {{ Consts.config.status || "🐟" }}
          </div>
        </div>
        <div>
          <div class="mr-10">
            <div
              class="text-1.4rem cursor-pointer shine-text"
              @click="Utils.Navigation.go(stsData[0].href)">
              {{ Consts.getBlogApp() }}
            </div>
            <div class="f-c-s">
              <div v-for="item in colData.rankings" class="text-0.8rem mr-4">
                <div class="f-c-s">
                  <div class="i-tabler:star mr-2"></div>
                  <span>{{ item.text }}</span>
                </div>
              </div>
            </div>
            <div class="f-c-s">
              <div class="f-c-s hover mr-4" @click="Utils.Navigation.go(stsData[1].href)">
                <div class="i-tabler:calendar-time mr-2"></div>
                园龄：{{ stsData[1].text }}
              </div>
              <div class="f-c-s hover mr-4" @click="Utils.Navigation.go(stsData[2].href)">
                <div class="i-tabler:brand-twitch mr-2"></div>
                粉丝：{{ stsData[2].text }}
              </div>
              <div class="f-c-s hover mr-4" @click="Utils.Navigation.go(stsData[3].href)">
                <div class="i-tabler:heart mr-2"></div>
                关注：{{ stsData[3].text }}
              </div>
            </div>
          </div>
          <div>{{ Consts.config.signature }}</div>
        </div>
      </div>
    </div>
    <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
      <div class="i-tabler:radar mr-2"></div>
      技能雷达
    </div>
    <div class="f-s-s">
      <div class="text-0.9rem w-30%">
        <div class="f-c-s">
          <div class="i-tabler:pencil-minus mr-2"></div>
          发表的随笔：{{ stsData[4].digg }}
        </div>
        <div class="f-c-s mt-2">
          <div class="i-tabler:books mr-2"></div>
          发表的文章：{{ stsData[5].digg }}
        </div>
        <div class="f-c-s mt-2">
          <div class="i-tabler:chart-bar mr-2"></div>
          阅读的数量：{{ stsData[7].digg }}
        </div>
      </div>
      <div ref="radarRef" class="w-80% h-80"></div>
    </div>
    <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
      <div class="i-tabler:tag-starred mr-2"></div>
      博主标签
    </div>
    <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.markList" class="hover">
        <router-link :to="Consts.Paths.label(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:tag mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
      <div class="i-tabler:category-2 mr-2"></div>
      随笔分类
    </div>
    <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.essaySort" class="hover">
        <router-link :to="Consts.Paths.category(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:folder mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <template v-if="colData?.essayArchive?.length">
      <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
        <div class="i-tabler:archive mr-2"></div>
        随笔档案
      </div>
      <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
        <div v-for="item in colData.essayArchive" class="hover">
          <router-link :to="Consts.Paths.archive('posts', item.id)">
            <div class="f-c-s">
              <div class="i-tabler:calendar-stats mr-2"></div>
              {{ item.text }}
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <template v-if="colData?.articleSort?.length">
      <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
        <div class="i-tabler:category-plus mr-2"></div>
        文章分类
      </div>
      <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
        <div v-for="item in colData.articleSort" class="hover">
          <router-link :to="Consts.Paths.category(item.id)">
            <div class="f-c-s">
              <div class="i-tabler:bookmark mr-2"></div>
              {{ item.text }}
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <template v-if="colData?.articleArchive?.length">
      <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
        <div class="i-tabler:file-zip mr-2"></div>
        文章档案
      </div>
      <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
        <div v-for="item in colData.articleArchive" class="hover">
          <router-link :to="Consts.Paths.archive('articles', item.id)">
            <div class="f-c-s">
              <div class="i-tabler:calendar-event mr-2"></div>
              {{ item.text }}
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <template v-if="colData?.albumn?.length">
      <div class="text-text-regular f-c-s text-1.2rem mt-10 mb-5">
        <div class="i-tabler:photo-sensor-2 mr-2"></div>
        我的相册
      </div>
      <div class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
        <div v-for="item in colData.albumn" class="hover">
          <router-link :to="Consts.Paths.photos(item.id)">
            <div class="f-c-s">
              <div class="i-tabler:photo mr-2"></div>
              {{ item.text }}
            </div>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
