<script setup lang="ts">
import { useRadarChart, usePieChart, useLineChart } from "@/hooks/use-echarts";
import { ArbeitenApi, DatumApi } from "@/apis";
import { useWheelRollsUpAndDown } from "@/hooks/use-mouse";
import {} from "@/utils/native";

const list = shallowRef();
const news = shallowRef();
const status = shallowRef();
const topList = shallowRef();
const column = shallowRef<BleuMenuColumn>();
const markList = shallowRef<BleuMark[]>();

async function fetchData() {
  Broswer.startLoading();

  const [val1, val2, val3, val4, val5, val6] = await Promise.all([
    ArbeitenApi.getList(),
    DatumApi.getNews(),
    DatumApi.getStats(),
    DatumApi.getTopList(),
    DatumApi.getColumn(),
    DatumApi.getMarkList()
  ]);

  val1.data.splice(4, 6);
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

const isWinUp = ref(false);
const isActiveMenu = ref(false);

onMounted(() => {
  useRadarChart(radarInst.value);

  usePieChart(
    pie1Inst.value,
    markList.value.map((i, index) => {
      if (index <= (BleuVars.config.chart.mark?.count || 10)) {
        return { value: i.count, name: i.text };
      }
    }),
    openPieChartCount1,
    "90%"
  );

  usePieChart(
    pie2Inst.value,
    column.value.essaySort.map((i, index) => {
      if (index <= (BleuVars.config.chart.category?.count || 10)) {
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

  useWheelRollsUpAndDown(
    () => {
      isWinUp.value = false;
    },
    () => {
      isWinUp.value = true;
    },
    {
      throttle: 50
    }
  );
});

const carouselList = shallowRef(BleuVars.config.images.home.carousel);
const carouselIndex = ref(0);

setInterval(() => {
  carouselIndex.value++;
  if (carouselIndex.value > BleuVars.config.images.home.carousel.length) {
    carouselIndex.value = 0;
  }
}, BleuVars.config.images.home.interval);

const searchVal = ref("");

await fetchData();
</script>

<template>
  <div id="l-home" class="xl:px-18vw lt-xl:px-15vw lt-lg:px-10vw lt-md:px-5vw lt-sm:px-1rem">
    <!-- area-1：菜单栏 -->
    <div class="l-menu">
      <div
        @click="isActiveMenu = !isActiveMenu"
        class="transition-all-300 select-none cursor-pointer f-c-c w-20 h-20 fixed-t top-0 z-99"
        :class="{
          'static-menu': !isActiveMenu,
          'active-menu': isActiveMenu,
          'left--20': !isWinUp,
          'left-0': isWinUp || isActiveMenu
        }"
        b="rd-rb-4">
        <div v-show="!isActiveMenu">
          <div class="i-tabler-menu2 text-2.2rem"></div>
          <div text="center 0.9rem">菜单</div>
        </div>
        <div v-show="isActiveMenu">
          <div text="15" class="i-tabler-x cursor-pointer" />
        </div>
      </div>
      <div
        class="transition-all-300 fixed-lt w-70 h-100vh z-90 bg-drop-primary"
        :class="{ 'close-menu-body': !isActiveMenu, 'open-menu-body': isActiveMenu }">
        <div class="flow-auto select-none scroll-none h-100% mt-30">
          <div class="menu-list ml-10">
            <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#l-top-nail')">
              回到顶部
            </div>
            <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#tags-nail')">
              我的标签
            </div>
            <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#essay-nail')">
              随笔分类
            </div>
            <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#article-nail')">
              文章分类
            </div>
            <div
              class="hover mb-10 font-art"
              @click="Broswer.scrollIntoView('#essay-archive-nail')">
              随笔归档
            </div>
            <div
              class="hover mb-10 font-art"
              @click="Broswer.scrollIntoView('#article-archive-nail')">
              文章归档
            </div>
            <div class="hover mb-10 font-art" @click="Broswer.scrollIntoView('#my-pohoto-nail')">
              我的相册
            </div>
            <div
              class="hover mb-10 font-art"
              @click="$router.push(RouterPath.ArbeitenByCalendar())">
              我的日历
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- area-2：GitHub -->
    <div v-show="!isActiveMenu" class="l-github lt-sm:hidden fixed-lb z-9 ml-2">
      <div
        class="f-c-c flex-col"
        @click="Navigation.go('http://github.com/' + BleuVars.getBlogApp())">
        <div class="write-vertical-left text-0.9rem text-b bounce shine-text hover mb-4">
          {{ BleuVars.getBlogApp() }}'s github
        </div>
        <div class="i-tabler-brand-github hover mb-4 text-1.2rem text-b"></div>
      </div>
    </div>
    <!-- area-3：开屏 -->
    <div class="lg:f-s-b">
      <div class="lg:w-49% lg:h-100vh py-4">
        <div class="f-c-b flex-col h-100%">
          <!-- 随笔列表 -->
          <div class="lt-lg:mb-15" v-if="list?.data" v-for="item in list.data">
            <!-- 日期 -->
            <div class="f-c-s text-b text-0.9rem mb-2">
              <div class="i-tabler-clock-hour3 mr-2"></div>
              {{ item.date }}
            </div>
            <!-- 标题 -->
            <div class="text-ellipsis lg:line-clamp-2 mb-2">
              <router-link class="hover" :to="RouterPath.Arbeiten(item.id)">
                {{ item.text }}
              </router-link>
            </div>
            <!-- 简介 -->
            <div class="text-ellipsis lg:line-clamp-1 lt-lg:line-clamp-3 text-0.9rem text-b ml-10">
              {{ item.desc }}
            </div>
            <!-- 简要信息 -->
            <div class="f-c-e" text="0.8rem c" m="t-5">
              <div class="mr-2 text-b">
                <router-link class="hover" :to="RouterPath.Arbeiten(item.id)">
                  阅读全文
                </router-link>
              </div>
              <div class="f-c-e">
                <div class="f-c-c mr-2">
                  <div class="i-tabler-message2 mr-1"></div>
                  {{ item.comm }}
                </div>
                <div class="f-c-c mr-2">
                  <div class="i-tabler-brand-tinder mr-1"></div>
                  {{ item.digg }}
                </div>
                <div class="f-c-c">
                  <div class="i-tabler-eye mr-1"></div>
                  {{ item.view }}
                </div>
              </div>
            </div>
          </div>
          <div class="f-c-e">
            <HollowedBox round dotted hover @click="$router.push(RouterPath.ArbeitenList())">
              <router-link :to="RouterPath.ArbeitenList()">MORE</router-link>
            </HollowedBox>
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div
        v-if="!BleuVars.config.images.home.disabled"
        class="lg:w-49% lt-lg:hidden h-100vh f-c-b relative">
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
      <!-- area-4：不开启轮播图，个人数据 -->
      <div
        v-else
        class="lg:w-49% lg:ml-10 lg:h-100vh"
        :class="{ 'py-4': BleuVars.config.images.home.disabled }">
        <div>
          <div class="caption mb-10">
            <div class="i-tabler-info-square-rounded mr-2"></div>
            博客信息
          </div>
          <div class="f-c-s h-30 mb-10 text-1rem text-b">
            <!-- 头像 -->
            <img
              class="w-25 h-25 rd-50% lt-lg:mr-8 lg:mr-10 object-cover"
              :src="BleuVars.config.avatar" />
            <div class="f-s-b flex-col h-100%">
              <!-- 积分和排名 -->
              <div v-if="column?.rankings?.length" class="f-c-s text-0.8rem text-b">
                <div
                  v-for="(item, index) in column.rankings"
                  :class="{ 'mr-4': index != column.rankings.length - 1 }">
                  {{ item.text }}
                </div>
              </div>
              <div class="text-0.8rem text-ellipsis line-clamp-1 shine-text">
                个签：{{ BleuVars.config.signature }}
              </div>
              <div class="w-60">
                <el-input
                  v-model="searchVal"
                  @keyup.enter="Native.searchArbeiten(searchVal)"
                  placeholder="输入关键字"
                  clearable>
                  <template #prefix>
                    <div class="i-tabler-search"></div>
                  </template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="f-c-b text-1rem">
            <div v-if="news?.length" class="text-0.9rem">
              <div class="f-c-s cursor-pointer shine-text" @click="Navigation.go(news[0].href)">
                <div class="i-tabler-user mr-2"></div>
                昵称：{{ news[0].text }}
              </div>
              <div class="f-c-s hover mt-5" @click="Navigation.go(news[1].href)">
                <div class="i-tabler-calendar mr-2"></div>
                园龄：{{ news[1].text }}
              </div>
              <div class="f-c-s hover mt-5" @click="Navigation.go(news[2].href)">
                <div class="i-tabler-brand-twitch mr-2"></div>
                粉丝：{{ news[2].text }}
              </div>
              <div class="f-c-s hover mt-5" @click="Navigation.go(news[3].href)">
                <div class="i-tabler-heart mr-2"></div>
                关注：{{ news[3].text }}
              </div>
            </div>
            <div v-if="status?.length" class="text-0.9rem">
              <div class="f-c-s">
                <div class="i-tabler-pencil-minus mr-2"></div>
                发表的随笔：{{ status[0].digg }}
              </div>
              <div class="f-c-s mt-5">
                <div class="i-tabler-books mr-2"></div>
                发表的文章：{{ status[1].digg }}
              </div>
              <div class="f-c-s mt-5">
                <div class="i-tabler-message-circle mr-2"></div>
                拥有的评论：{{ status[2].digg }}
              </div>
              <div class="f-c-s mt-5">
                <div class="i-tabler-chart-bar mr-2"></div>
                阅读的数量：{{ status[3].digg }}次
              </div>
            </div>
          </div>
        </div>
        <!-- 技能雷达图 -->
        <div class="lg:mt-5 lt-lg:mt-15">
          <div class="caption mb-5">
            <div class="i-tabler-chart-radar mr-2"></div>
            我的技能
          </div>
          <div class="f-c-c w-100%">
            <div ref="radarInst" class="w-100% h-80"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- area-4：开启轮播图，个人数据 -->
    <div v-if="!BleuVars.config.images.home.disabled" class="sm:f-s-b mt-20">
      <div class="sm:w-49%">
        <div class="caption mb-10">
          <div class="i-tabler-info-square-rounded mr-2"></div>
          博客信息
        </div>
        <div class="f-c-s h-30 mb-10 text-1rem text-b">
          <!-- 头像 -->
          <img
            class="w-25 h-25 rd-50% lt-lg:mr-8 lg:mr-10 object-cover"
            :src="BleuVars.config.avatar" />
          <div class="f-s-b flex-col h-100%">
            <!-- 积分和排名 -->
            <div v-if="column?.rankings?.length" class="f-c-s text-0.8rem text-b">
              <div
                v-for="(item, index) in column.rankings"
                :class="{ 'mr-4': index != column.rankings.length - 1 }">
                {{ item.text }}
              </div>
            </div>
            <div class="text-0.8rem text-ellipsis line-clamp-1 shine-text">
              个签：{{ BleuVars.config.signature }}
            </div>
            <div class="w-60">
              <el-input
                v-model="searchVal"
                @keyup.enter="Native.searchArbeiten(searchVal)"
                placeholder="输入关键字"
                clearable>
                <template #prefix>
                  <div class="i-tabler-search"></div>
                </template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="f-c-b text-1rem">
          <div v-if="news?.length" class="text-0.9rem">
            <div class="f-c-s cursor-pointer shine-text" @click="Navigation.go(news[0].href)">
              <div class="i-tabler-user mr-2"></div>
              昵称：{{ news[0].text }}
            </div>
            <div class="f-c-s hover mt-5" @click="Navigation.go(news[1].href)">
              <div class="i-tabler-calendar mr-2"></div>
              园龄：{{ news[1].text }}
            </div>
            <div class="f-c-s hover mt-5" @click="Navigation.go(news[2].href)">
              <div class="i-tabler-brand-twitch mr-2"></div>
              粉丝：{{ news[2].text }}
            </div>
            <div class="f-c-s hover mt-5" @click="Navigation.go(news[3].href)">
              <div class="i-tabler-heart mr-2"></div>
              关注：{{ news[3].text }}
            </div>
          </div>
          <div v-if="status?.length" class="text-0.9rem">
            <div class="f-c-s">
              <div class="i-tabler-pencil-minus mr-2"></div>
              发表的随笔：{{ status[0].digg }}
            </div>
            <div class="f-c-s mt-5">
              <div class="i-tabler-books mr-2"></div>
              发表的文章：{{ status[1].digg }}
            </div>
            <div class="f-c-s mt-5">
              <div class="i-tabler-message-circle mr-2"></div>
              拥有的评论：{{ status[2].digg }}
            </div>
            <div class="f-c-s mt-5">
              <div class="i-tabler-chart-bar mr-2"></div>
              阅读的数量：{{ status[3].digg }}次
            </div>
          </div>
        </div>
      </div>
      <!-- 技能雷达图 -->
      <div class="sm:w-49% lt-sm:mt-15">
        <div class="caption mb-5">
          <div class="i-tabler-chart-radar mr-2"></div>
          我的技能
        </div>
        <div class="f-c-c w-100%">
          <div ref="radarInst" class="w-100% h-80"></div>
        </div>
      </div>
    </div>
    <!-- area-5：随笔标签 -->
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
        <div v-if="markList?.length" class="f-s-b flex-wrap overflow-auto scroll-none">
          <HollowedBox v-for="item in markList" hover line="dotted" round class="mr-4 mb-6">
            <router-link :to="RouterPath.ArbeitenByMark(item.text)">
              {{ item.text }}
            </router-link>
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
    <!-- area-6：随笔分类 -->
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
          <div v-if="column?.essaySort?.length" class="f-c-b flex-wrap">
            <div class="mb-6 mr-4 hover" v-for="item in column.essaySort">
              <router-link :to="RouterPath.ArbeitenBySort(item.id)">
                {{ item.text }}
              </router-link>
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
        <div v-if="column?.articleSort?.length" class="f-c-b flex-wrap">
          <div class="mb-6 mr-4 hover" v-for="item in column.articleSort">
            <router-link :to="RouterPath.ArbeitenBySort(item.id)">
              {{ item.text }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- area-7：随笔归档 -->
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
          <div v-if="column?.essayArchive?.length" class="f-c-b flex-wrap">
            <div class="mb-6 mr-4 hover" v-for="item in column.essayArchive">
              <router-link :to="RouterPath.ArbeitenByArchive('p', item.id)">
                {{ item.text }}
              </router-link>
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
    <!-- area-8：文章归档 -->
    <div class="mt-15">
      <div id="article-archive-nail" class="caption mb-10">
        <div class="i-tabler-folder-check mr-2"></div>
        文章归档
      </div>
      <div v-if="column?.articleArchive?.length" class="f-c-b flex-wrap">
        <div class="mb-6 mr-4 hover" v-for="item in column.articleArchive">
          <router-link :to="RouterPath.ArbeitenBySort(item.id)">
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
    <!-- area-9：相册列表 -->
    <div class="mt-15">
      <div id="my-pohoto-nail" class="caption mb-10">
        <div class="i-tabler-photo mr-2"></div>
        我的相册
      </div>
      <div v-if="column?.albumn?.length" class="f-c-b flex-wrap">
        <div class="mb-6 text-ellipsis line-clamp-2 hover" v-for="item in column.albumn">
          <router-link :to="RouterPath.Albumn(item.id)">
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.l-menu {
  .static-menu {
    background-color: var(--text-primary);
    color: white;
  }

  .active-menu {
    background-color: white;
    color: var(--text-primary);
  }

  .close-menu-body {
    left: -17.5rem;

    .menu-list > div {
      opacity: 0;
    }
  }

  .open-menu-body {
    left: 0;

    @for $i from 0 to 9 {
      .menu-list > div:nth-child(#{$i}) {
        opacity: 1;
        transition-delay: #{$i * 0.06}s !important;
      }
    }
  }
}
</style>
