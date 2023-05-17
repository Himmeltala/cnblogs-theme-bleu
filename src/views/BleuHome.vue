<script setup lang="ts">
import { useRadarChart, usePieChart, useLineChart } from "@/hooks/use-echarts";
import { WorksApi, MenuApi, getMarkList } from "@/apis";

const list = shallowRef();
const news = shallowRef();
const status = shallowRef();
const topList = shallowRef();
const column = shallowRef<BleuMenuColumn>();
const markList = shallowRef<BleuMark[]>();

async function fetchData() {
  Broswer.startLoading();

  const [val1, val2, val3, val4, val5, val6] = await Promise.all([
    WorksApi.getList(),
    MenuApi.getNews(),
    MenuApi.getStats(),
    MenuApi.getTopList(),
    MenuApi.getColumn(),
    getMarkList()
  ]);

  val1.data.splice(3, 7);
  list.value = val1;
  news.value = val2;
  status.value = val3;
  topList.value = val4;
  column.value = val5;
  markList.value = val6;

  Broswer.endLoading();
}

const radarInst = ref<HTMLElement>();
const pie1Inst = ref<HTMLElement>();
const pie2Inst = ref<HTMLElement>();
const lineInst = ref<HTMLElement>();
const isShowPieChart1 = ref(false);
const openPieChartCount1 = ref(0);
const isShowPieChart2 = ref(false);
const openPieChartCount2 = ref(0);
const isShowLineChart = ref(false);
const openLineChartCount = ref(0);

onMounted(() => {
  useRadarChart(radarInst.value);

  usePieChart(
    pie1Inst.value,
    markList.value.map((i, index) => {
      if (index <= 10) {
        return { value: i.count, name: i.text };
      }
    }),
    openPieChartCount1,
    "90%"
  );

  usePieChart(
    pie2Inst.value,
    column.value.essaySort.map((i, index) => {
      if (index <= 10) {
        return { value: i.count, name: i.text };
      }
    }),
    openPieChartCount2,
    ["40%", "70%"]
  );

  useLineChart(
    lineInst.value,
    column.value.essayArchive.map(i => i.count),
    column.value.essayArchive.map(i => i.id),
    openLineChartCount
  );
});

const carouselList = shallowRef(BleuVars.config.images.home.carousel);
const carouselIndex = ref(0);

setInterval(() => {
  carouselIndex.value++;
  if (carouselIndex.value > 3) {
    carouselIndex.value = 0;
  }
}, BleuVars.config.images.home.interval);

await fetchData();
</script>

<template>
  <div id="l-home" class="xl:px-18vw lt-xl:px-15vw lt-lg:px-10vw lt-md:px-5vw lt-sm:px-1rem">
    <!-- area-1：开屏 -->
    <div class="f-c-b">
      <div class="sm:w-49% f-c-c">
        <div class="h-100vh">
          <div m="t-5">
            <div text="start 10" class="shine-text font-art">
              {{ BleuVars.getBlogApp() }} 的博客
            </div>
            <div
              text="start 4 ellipsis"
              class="line-clamp-2 line-height-1.2 letter-spacing-0.1 font-art"
              m="t-3">
              {{ BleuVars.config.signature }}
            </div>
          </div>
          <div m="t-15">
            <div m="b-8" v-if="list?.data" v-for="item in list.data">
              <div p="b-4">
                <div class="f-c-s text-b text-0.9rem mb-6">
                  <div class="i-tabler-clock-hour3 mr-2"></div>
                  {{ item.date }}
                </div>
                <div
                  class="text-ellipsis line-clamp-2 hover"
                  @click="
                    Navigation.go({
                      path: RouterPath.Arbeiten(item.id),
                      router: $router
                    })
                  ">
                  {{ item.text }}
                </div>
                <div class="f-c-e" text="0.8rem c" m="t-6">
                  <div
                    m="r-2"
                    text="b"
                    class="hover"
                    @click="
                      Navigation.go({
                        path: RouterPath.Arbeiten(item.id),
                        router: $router
                      })
                    ">
                    阅读全文
                  </div>
                  <div class="f-c-e">
                    <div m="r-2" class="f-c-c">
                      <div class="i-tabler-message2" m="r-1"></div>
                      <div>
                        {{ item.comm }}
                      </div>
                    </div>
                    <div m="r-2" class="f-c-c">
                      <div class="i-tabler-brand-tinder" m="r-1"></div>
                      <div>
                        {{ item.digg }}
                      </div>
                    </div>
                    <div class="f-c-c">
                      <div class="i-tabler-eye" m="r-1"></div>
                      <div>
                        {{ item.view }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div text="end" class="f-c-e">
              <div
                @click="Navigation.go({ path: RouterPath.ArbeitenList(), router: $router })"
                class="w-20 cursor-pointer hover:text-primary transition-all-300 font-art"
                p="x-1 y-1"
                text="center 0.8rem"
                b="rd-4 solid 1 hover:primary">
                MORE
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div class="sm:w-49% lt-sm:hidden h-100vh f-c-b relative">
        <!-- 图片 -->
        <img
          v-for="(item, index) in carouselList"
          :style="
            carouselIndex == index
              ? { zIndex: 9, opacity: BleuVars.config.images.home.opacity }
              : { zIndex: 0, opacity: 0 }
          "
          class="w-100% h-100% transition-all-800 absolute top-0 left-0 object-cover"
          :src="item" />
      </div>
    </div>
    <!-- area-2：基本信息展示 -->
    <div class="sm:f-s-b mt-20">
      <div class="sm:w-49%">
        <div class="caption mb-10">
          <div class="i-tabler-info-square-rounded mr-2"></div>
          博主数据
        </div>
        <div class="f-c-b mb-10 text-1rem text-c">
          <img class="w-25 h-25 rd-50" :src="BleuVars.config.avatar" />
          <div v-if="column?.rankings?.length > 0" class="f-c-e">
            <div>
              <div v-for="item in column.rankings" class="mt-2">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
        <div class="f-c-b text-1rem">
          <div v-if="news?.length > 0">
            <div>
              <div class="f-c-s">
                <div class="i-tabler-user mr-2"></div>
                博主：{{ news[0].text }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-calendar mr-2"></div>
                园龄：{{ news[1].text }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-brand-twitch mr-2"></div>
                粉丝：{{ news[2].text }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-heart mr-2"></div>
                关注：{{ news[3].text }}
              </div>
            </div>
          </div>
          <div v-if="status?.length > 0">
            <div>
              <div class="f-c-s">
                <div class="i-tabler-pencil-minus mr-2"></div>
                发表的随笔：{{ status[0].digg }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-books mr-2"></div>
                发表的文章：{{ status[1].digg }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-message-circle mr-2"></div>
                拥有的评论：{{ status[2].digg }}
              </div>
              <div class="f-c-s" m="t-5">
                <div class="i-tabler-chart-bar mr-2"></div>
                被阅读：{{ status[3].digg }}次
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sm:w-49% lt-sm:mt-20">
        <div class="text-primary font-art text-1.4rem letter-spacing-0.2 f-c-s" m="b-5">
          <div class="i-tabler-chart-radar mr-2"></div>
          我的技能
        </div>
        <div class="f-c-c w-100%">
          <div ref="radarInst" class="w-100% h-90"></div>
        </div>
      </div>
    </div>
    <!-- area-3：随笔标签 -->
    <div class="mt-20 relative">
      <div
        class="transition-all-500"
        :class="{ 'opacity-100': !isShowPieChart1, 'opacity-30': isShowPieChart1 }">
        <div class="f-c-b mb-10">
          <div id="tags-nail" class="caption">
            <div class="i-tabler-bookmarks mr-2"></div>
            我的标签
          </div>
          <div
            @click="
              () => {
                openPieChartCount1++;
                isShowPieChart1 = !isShowPieChart1;
              }
            "
            class="f-c-c cursor-pointer hover text-c text-1rem">
            <div class="i-tabler-zoom-in mr-2"></div>
            图表
          </div>
        </div>
        <div v-if="markList?.length > 0" class="f-s-b flex-wrap overflow-auto scroll-none">
          <HollowedBox
            v-for="item in markList"
            line="dotted"
            hover
            round
            class="mr-4 mb-6"
            @click="Navigation.go({ path: RouterPath.ArbeitenByMark(item.text), router: $router })">
            {{ item.text }}({{ item.count }})
          </HollowedBox>
        </div>
      </div>
      <!-- 图表 -->
      <div
        :class="{ 'scale-0': !isShowPieChart1, 'scale-100': isShowPieChart1 }"
        class="transition-all-300 z-9 rd-2 bg-drop-primary absolute left-0 top-0">
        <div text="c 1rem">
          <div p="r-4 t-4" class="f-c-e hover" @click="isShowPieChart1 = !isShowPieChart1">
            <div class="i-tabler-arrows-minimize mr-2"></div>
            关闭
          </div>
        </div>
        <div class="f-c-c">
          <div ref="pie1Inst" class="sm:w-64vw lt-sm:w-93vw h-50vh"></div>
        </div>
      </div>
    </div>
    <!-- area-4：随笔分类 -->
    <div class="sm:f-s-b mt-15 relative">
      <!-- 随笔分类 -->
      <div class="sm:w-49%">
        <div
          class="transition-all-500"
          :class="{ 'opacity-100': !isShowPieChart2, 'opacity-30': isShowPieChart2 }">
          <div class="f-c-b mb-10">
            <div id="essay-nail" class="caption">
              <div class="i-tabler-category-2 mr-2"></div>
              随笔分类
            </div>
            <div
              @click="
                () => {
                  openPieChartCount2++;
                  isShowPieChart2 = !isShowPieChart2;
                }
              "
              class="f-c-c cursor-pointer hover text-c text-1rem mr-4">
              <div class="i-tabler-zoom-in mr-2"></div>
              图表
            </div>
          </div>
          <div v-if="column?.essaySort?.length > 0" class="f-c-b flex-wrap">
            <div
              @click="Navigation.go({ path: RouterPath.ArbeitenBySort(item.id), router: $router })"
              class="mb-6 mr-4 cursor-pointer hover"
              v-for="item in column.essaySort">
              {{ item.text }}
            </div>
          </div>
        </div>
        <!-- 图表 -->
        <div
          :class="{ 'scale-0': !isShowPieChart2, 'scale-100': isShowPieChart2 }"
          class="transition-all-300 z-9 rd-2 bg-drop-primary absolute left-0 top-0">
          <div text="c 1rem">
            <div p="r-4 t-4" class="f-c-e hover" @click="isShowPieChart2 = !isShowPieChart2">
              <div class="i-tabler-arrows-minimize mr-2"></div>
              关闭
            </div>
          </div>
          <div class="f-c-c sm:w-32vw lt-sm:w-93vw">
            <div ref="pie2Inst" class="w-100% h-30vh"></div>
          </div>
        </div>
      </div>
      <!-- 文章分类 -->
      <div class="sm:w-49% lt-sm:mt-15">
        <div id="article-nail" class="caption mb-10">
          <div class="i-tabler-sort-a-z mr-2"></div>
          文章分类
        </div>
        <div v-if="column?.articleSort?.length > 0" class="f-c-b flex-wrap">
          <div
            @click="Navigation.go({ path: RouterPath.ArbeitenBySort(item.id), router: $router })"
            class="mb-6 mr-4 cursor-pointer hover"
            v-for="item in column.articleSort">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <!-- area-5：随笔归档 -->
    <div class="mt-15 relative">
      <div>
        <div
          class="transition-all-500"
          :class="{ 'opacity-100': !isShowLineChart, 'opacity-10': isShowLineChart }">
          <div class="mb-10 f-c-b">
            <div id="essay-archive-nail" class="caption">
              <div class="i-tabler-archive-filled mr-2"></div>
              随笔归档
            </div>
            <div
              @click="
                () => {
                  openLineChartCount++;
                  isShowLineChart = !isShowLineChart;
                }
              "
              class="f-c-c cursor-pointer hover text-c text-1rem mr-4">
              <div class="i-tabler-zoom-in mr-2"></div>
              图表
            </div>
          </div>
          <div v-if="column?.essayArchive?.length > 0" class="f-c-b flex-wrap">
            <div
              @click="
                Navigation.go({ path: RouterPath.ArbeitenByArchive('p', item.id), router: $router })
              "
              class="mb-6 mr-4 cursor-pointer hover"
              v-for="item in column.essayArchive">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div
        :class="{ 'scale-0': !isShowLineChart, 'scale-100': isShowLineChart }"
        class="transition-all-300 z-9 rd-2 bg-drop-primary absolute left-0 top-0">
        <div text="c 1rem">
          <div p="r-4 t-4" class="f-c-e hover" @click="isShowLineChart = !isShowLineChart">
            <div class="i-tabler-arrows-minimize mr-2"></div>
            关闭
          </div>
        </div>
        <div class="f-c-c">
          <div ref="lineInst" class="sm:w-64vw lt-sm:w-93vw h-45vh"></div>
        </div>
      </div>
    </div>
    <!-- area-6：文章归档 -->
    <div class="mt-15">
      <div id="article-archive-nail" class="caption mb-10">
        <div class="i-tabler-folder-check mr-2"></div>
        文章归档
      </div>
      <div v-if="column?.articleArchive?.length > 0" class="f-c-b flex-wrap">
        <div
          @click="
            Navigation.go({ path: RouterPath.ArbeitenByArchive('a', item.id), router: $router })
          "
          class="mb-6 mr-4 cursor-pointer hover"
          v-for="item in column.articleArchive">
          {{ item.text }}
        </div>
      </div>
    </div>
    <!-- area-7：相册列表 -->
    <div class="mt-15">
      <div id="my-pohoto-nail" class="caption mb-10">
        <div class="i-tabler-photo mr-2"></div>
        我的相册
      </div>
      <div v-if="column?.albumn?.length > 0" class="f-c-b flex-wrap">
        <div
          @click="Navigation.go({ path: RouterPath.Albumn(item.id), router: $router })"
          class="mb-6 cursor-pointer hover text-ellipsis line-clamp-2"
          v-for="item in column.albumn">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
