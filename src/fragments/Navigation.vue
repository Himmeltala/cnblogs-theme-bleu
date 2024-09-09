<script lang="ts" setup>
const val = ref("");
const drawer = ref(false);
const options = Utils.Storage.getOptions();
const themeMode = ref(options.value.theme.mode === "dark");
const colData = ref<ColumnDataModel>();
const stsData = ref<StatisticsModel[]>();
const radarRef = ref<HTMLElement>();

function toggle() {
  if (themeMode.value) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    options.value.theme.mode = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    options.value.theme.mode = "light";
  }
}

const flag = ref(0);

function openedDrawer() {
  if (flag.value < 1) {
    Requests.Datum.getColumnContent().then(data => {
      colData.value = data;
    });

    Requests.Datum.getStatistics().then(data => {
      stsData.value = data;
    });

    Hooks.Echarts.use({ dom: radarRef.value, options: Consts.config.diagram.technics });
  }

  flag.value++;
}
</script>

<template>
  <el-drawer
    v-model="drawer"
    :size="Consts.isPC() ? '20%' : '80%'"
    :with-header="false"
    direction="ltr"
    @open="openedDrawer">
    <div>
      <div class="f-c-s">
        <div class="position-relative w-25 h-25 mr-4">
          <img :src="Consts.config.avatar" class="w-100% h-100% object-cover rd-50%" />
          <div
            class="position-absolute bottom-0 right-0 f-c-c w-8 h-8 rd-50% dark:bg-#323232 light:bg-#f2f2f2">
            {{ Consts.config.status || "🐟" }}
          </div>
        </div>
        <div v-if="stsData" class="text-0.9rem">
          <div class="f-c-s hover mt-2" @click="Utils.Navigation.go(stsData[1].href)">
            <div class="i-tabler:calendar-time mr-2"></div>
            园龄：{{ stsData[1].text }}
          </div>
          <div class="f-c-s hover mt-2" @click="Utils.Navigation.go(stsData[2].href)">
            <div class="i-tabler:brand-twitch mr-2"></div>
            粉丝：{{ stsData[2].text }}
          </div>
          <div class="f-c-s hover mt-2" @click="Utils.Navigation.go(stsData[3].href)">
            <div class="i-tabler:heart mr-2"></div>
            关注：{{ stsData[3].text }}
          </div>
        </div>
      </div>
      <div
        class="text-1.2rem cursor-pointer mt-4 shine-text"
        @click="Utils.Navigation.go(stsData[0].href)">
        {{ Consts.getBlogApp() }}
      </div>
      <div v-for="item in colData.rankings" v-if="colData" class="text-0.8rem mt-2">
        <div class="f-c-s">
          <div class="i-tabler:star mr-2"></div>
          {{ item.text }}
        </div>
      </div>
      <div class="text-0.9rem mt-4">{{ Consts.config.signature }}</div>
    </div>
    <div v-if="!Consts.isPC()">
      <el-divider>
        <div class="text-text-secondary f-c-s">
          <div class="i-tabler:link mr-2"></div>
          链接导航
        </div>
      </el-divider>
      <div>
        <div class="f-c-s flex-wrap">
          <div class="hover mr-4 position-relative" @click="$router.push(Consts.Paths.home())">
            首页
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:position-absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'Posts'
            }"
            class="hover mr-4 position-relative"
            @click="$router.push(Consts.Paths.posts())">
            随笔
          </div>
          <div class="hover mr-4" @click="Utils.Navigation.go('https://www.cnblogs.com/')">
            博客园
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:position-absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'LabelList'
            }"
            class="hover mr-4 position-relative"
            @click="$router.push(Consts.Paths.labels())">
            标签
          </div>
          <div class="hover" @click="Utils.Navigation.go('https://i.cnblogs.com')">管理</div>
        </div>
        <div class="mt-4 f-c-s flex-wrap">
          <div class="mr-4">
            <el-switch
              v-model="themeMode"
              active-text="黑"
              inactive-text="白"
              inline-prompt
              @change="toggle" />
          </div>
          <div
            v-for="item in Consts.config.header.paths"
            class="hover mr-4"
            @click="Utils.Navigation.go(item.value)">
            <div v-if="item.name === 'bilibili'" class="i-tabler:brand-bilibili"></div>
            <div v-else-if="item.name === 'github'" class="i-tabler:brand-github"></div>
            <div v-else-if="!item.name && item.icon">
              <div v-html="item.icon"></div>
            </div>
            <div v-else>
              <img :src="item.src" class="w-8 h-8 object-cover rd-50%" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-divider>
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:radar mr-2"></div>
        技能雷达
      </div>
    </el-divider>
    <div ref="radarRef" class="w-100% h-80"></div>
    <el-divider>
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:info-hexagon mr-2"></div>
        博主数据
      </div>
    </el-divider>
    <div v-if="stsData" class="text-0.9rem">
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
    <el-divider>
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:tag-starred mr-2"></div>
        博主标签
      </div>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.markList" class="hover">
        <router-link :to="Consts.Paths.label(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:tag mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:category-2 mr-2"></div>
        随笔分类
      </div>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.essaySort" class="hover">
        <router-link :to="Consts.Paths.category(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:folder mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider v-if="colData?.essayArchive?.length">
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:archive mr-2"></div>
        随笔档案
      </div>
    </el-divider>
    <div v-if="colData?.essayArchive" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.essayArchive" class="hover">
        <router-link :to="Consts.Paths.archive('posts', item.id)">
          <div class="f-c-s">
            <div class="i-tabler:calendar-stats mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider v-if="colData?.articleSort?.length">
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:category-plus mr-2"></div>
        文章分类
      </div>
    </el-divider>
    <div v-if="colData?.articleSort" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.articleSort" class="hover">
        <router-link :to="Consts.Paths.category(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:bookmark mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider v-if="colData?.articleArchive?.length">
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:file-zip mr-2"></div>
        文章档案
      </div>
    </el-divider>
    <div v-if="colData?.articleArchive?.length" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.articleArchive" class="hover">
        <router-link :to="Consts.Paths.archive('articles', item.id)">
          <div class="f-c-s">
            <div class="i-tabler:calendar-event mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider v-if="colData?.albumn?.length">
      <div class="text-text-secondary f-c-s">
        <div class="i-tabler:photo-sensor-2 mr-2"></div>
        我的相册
      </div>
    </el-divider>
    <div v-if="colData?.albumn" class="f-c-s flex-wrap flex-gap-4 text-0.9rem">
      <div v-for="item in colData.albumn" class="hover">
        <router-link :to="Consts.Paths.photos(item.id)">
          <div class="f-c-s">
            <div class="i-tabler:photo mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
  </el-drawer>
  <div
    b="b-1 b-solid border-primary"
    class="top-header light:bg-#ffffffb3 dark:bg-#242424b3 h-15 fixed top-0 left-0 w-100vw z-999">
    <div class="content lg-sm:px-50 lt-sm:px-4 lg-sm:f-c-b lt-sm:f-c-s h-100%">
      <div class="f-c-s">
        <el-button class="mr-4" round @click="drawer = !drawer">
          <template #icon>
            <div class="i-tabler:menu"></div>
          </template>
        </el-button>
        <div class="w-45">
          <el-input
            v-model="val"
            placeholder="输入关键字搜索"
            @keyup.enter="Utils.Native.search(val)">
            <template #suffix>
              <div class="i-tabler-search"></div>
            </template>
          </el-input>
        </div>
      </div>
      <div v-if="Consts.isPC()" class="f-c-b">
        <div class="f-c-s text-text-regular">
          <div class="hover mr-4 position-relative" @click="$router.push(Consts.Paths.home())">
            首页
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:position-absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'Posts'
            }"
            class="hover mr-4 position-relative"
            @click="$router.push(Consts.Paths.posts())">
            随笔
          </div>
          <div class="hover mr-4" @click="Utils.Navigation.go('https://www.cnblogs.com/')">
            博客园
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:position-absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'LabelList'
            }"
            class="hover mr-4 position-relative"
            @click="$router.push('/main/labels')">
            标签
          </div>
          <div class="hover" @click="Utils.Navigation.go('https://i.cnblogs.com')">管理</div>
        </div>
        <div class="tools ml-4">
          <el-switch
            v-model="themeMode"
            active-text="黑"
            inactive-text="白"
            inline-prompt
            @change="toggle" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-header {
  -webkit-backdrop-filter: saturate(50%) blur(8px);
  backdrop-filter: saturate(50%) blur(8px);
}

:deep(.el-input__wrapper) {
  border-radius: 10rem;
}
</style>
