<script setup lang="ts">
import { DatumHttp } from "@/requests";
import { useRadarChart } from "@/hooks/use-echarts";

const val = ref("");
const drawer = ref(false);
const options = BleuStorage.getOptions();
const separatrix = ref(options.value.theme.mode === "dark" ? true : false);
const colData = ref<ColumnDataModel>();
const stsData = ref<StatisticsModel[]>();
const radarEl = ref<HTMLElement>();

function toggle() {
  if (separatrix.value) {
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
    DatumHttp.getColumnContent().then(data => {
      colData.value = data;
    });

    DatumHttp.getStatistics().then(data => {
      stsData.value = data;
    });

    useRadarChart(radarEl.value);
  }

  flag.value++;
}
</script>

<template>
  <el-drawer
    @open="openedDrawer"
    v-model="drawer"
    direction="ltr"
    :size="BleuVars.isPC() ? '20%' : '80%'"
    :with-header="false">
    <div>
      <div class="f-c-s">
        <div class="relative w-25 h-25 mr-6">
          <img :src="BleuVars.config.avatar" class="w-100% h-100% object-cover rd-50%" />
          <div
            class="absolute bottom-0 right-0 f-c-c w-8 h-8 rd-50% dark:bg-#323232 light:bg-#f2f2f2">
            {{ BleuVars.config.status || "🐟" }}
          </div>
        </div>
        <div v-if="stsData" class="text-0.8rem text-text-regular">
          <div class="f-c-s hover mt-2" @click="Navigation.go(stsData[1].href)">
            <div class="i-tabler-calendar mr-2"></div>
            园龄：{{ stsData[1].text }}
          </div>
          <div class="f-c-s hover mt-2" @click="Navigation.go(stsData[2].href)">
            <div class="i-tabler-brand-twitch mr-2"></div>
            粉丝：{{ stsData[2].text }}
          </div>
          <div class="f-c-s hover mt-2" @click="Navigation.go(stsData[3].href)">
            <div class="i-tabler-heart mr-2"></div>
            关注：{{ stsData[3].text }}
          </div>
        </div>
      </div>
      <div
        class="text-1.4rem cursor-pointer mt-4 shine-text"
        @click="Navigation.go(stsData[0].href)">
        {{ BleuVars.getBlogApp() }}
      </div>
      <div
        v-if="colData"
        v-for="item in colData.rankings"
        class="text-0.8rem text-text-secondary mt-2">
        <div class="f-c-s">
          <div class="i-tabler-star mr-2"></div>
          {{ item.text }}
        </div>
      </div>
      <div class="text-0.9rem text-text-regular mt-4">{{ BleuVars.config.signature }}</div>
    </div>
    <div v-if="!BleuVars.isPC()">
      <el-divider>
        <span class="text-text-secondary">链接导航</span>
      </el-divider>
      <div>
        <div class="f-c-s flex-wrap">
          <div class="hover mr-6" @click="$router.push('/')">首页</div>
          <div class="hover mr-6" @click="Navigation.go('https://www.cnblogs.com/')">博客园</div>
          <div class="hover mr-6" @click="Navigation.go('https://news.cnblogs.com/')">新闻</div>
          <div class="hover mr-6" @click="$router.push(RouterPath.MarkList())">标签</div>
          <div class="hover mr-6" @click="$router.push(RouterPath.PostsByCalendar())">日历</div>
          <div class="hover mr-6" @click="Navigation.go('https://i.cnblogs.com')">管理</div>
        </div>
        <div class="mt-4 f-c-s flex-wrap">
          <div class="mr-6">
            <el-switch
              @change="toggle"
              v-model="separatrix"
              inline-prompt
              active-text="黑"
              inactive-text="白" />
          </div>
          <div
            class="hover mr-6"
            @click="Navigation.go(item.value)"
            v-for="item in BleuVars.config.header.links">
            <div class="i-tabler-brand-bilibili" v-if="item.name === 'bilibili'"></div>
            <div class="i-tabler-brand-github" v-else-if="item.name === 'github'"></div>
          </div>
        </div>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">技能雷达</span>
    </el-divider>
    <div ref="radarEl" class="w-100% h-80"></div>
    <el-divider>
      <span class="text-text-secondary">博主数据</span>
    </el-divider>
    <div v-if="stsData" class="text-0.9rem text-text-regular">
      <div class="f-c-s">
        <div class="i-tabler-pencil-minus mr-2"></div>
        发表的随笔：{{ stsData[4].digg }}
      </div>
      <div class="f-c-s mt-2">
        <div class="i-tabler-books mr-2"></div>
        发表的文章：{{ stsData[5].digg }}
      </div>
      <div class="f-c-s mt-2">
        <div class="i-tabler-chart-bar mr-2"></div>
        阅读的数量：{{ stsData[7].digg }}
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">博主标签</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.markList">
        <router-link :to="RouterPath.PostsByMark(item.id)">
          <div class="f-c-s">
            <div class="i-tabler-tag mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">随笔分类</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.essaySort">
        <router-link :to="RouterPath.PostsBySort(item.id, '1', true)">
          <div class="f-c-s">
            <div class="i-tabler-folder mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">随笔档案</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.essayArchive">
        <router-link :to="RouterPath.PostsByArchive('p', item.id)">
          <div class="f-c-s">
            <div class="i-tabler-calendar-stats mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">文章分类</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.articleSort">
        <router-link :to="RouterPath.PostsBySort(item.id, '1', true)">
          <div class="f-c-s">
            <div class="i-tabler-bookmark mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">文章档案</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.articleArchive">
        <router-link :to="RouterPath.PostsByArchive('a', item.id)">
          <div class="f-c-s">
            <div class="i-tabler-calendar-event mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
    <el-divider>
      <span class="text-text-secondary">我的相册</span>
    </el-divider>
    <div v-if="colData" class="f-c-s flex-wrap flex-gap-4 text-text-regular text-0.9rem">
      <div class="hover" v-for="item in colData.albumn">
        <router-link :to="RouterPath.Albumn(item.id)">
          <div class="f-c-s">
            <div class="i-tabler-photo mr-2"></div>
            {{ item.text }}
          </div>
        </router-link>
      </div>
    </div>
  </el-drawer>
  <div
    b="b-1 b-solid border-primary"
    class="top-header light:bg-#ffffffb3 dark:bg-#242424b3 h-15 fixed top-0 left-0 w-100vw z-999">
    <div class="content lg-sm:px-50 lt-sm:px-5 lg-sm:f-c-b lt-sm:f-c-s h-100%">
      <div class="f-c-s">
        <el-button round class="mr-6" @click="drawer = !drawer">
          <template #icon>
            <div class="i-tabler-menu"></div>
          </template>
        </el-button>
        <div class="w-45">
          <el-input @keyup.enter="Native.search(val)" placeholder="输入关键字搜索" v-model="val">
            <template #suffix>
              <div class="i-ep-search"></div>
            </template>
          </el-input>
        </div>
      </div>
      <div class="f-c-b" v-if="BleuVars.isPC()">
        <div class="f-c-s">
          <div class="hover mr-6" @click="$router.push('/')">首页</div>
          <div class="hover mr-6" @click="Navigation.go('https://www.cnblogs.com/')">博客园</div>
          <div class="hover mr-6" @click="Navigation.go('https://news.cnblogs.com/')">新闻</div>
          <div class="hover mr-6" @click="$router.push(RouterPath.MarkList())">标签</div>
          <div class="hover mr-6" @click="$router.push(RouterPath.PostsByCalendar())">日历</div>
          <div class="hover mr-6" @click="Navigation.go('https://i.cnblogs.com')">管理</div>
        </div>
        <div class="tools ml-6">
          <el-switch
            @change="toggle"
            v-model="separatrix"
            inline-prompt
            active-text="黑"
            inactive-text="白" />
        </div>
        <div class="f-c-s">
          <div
            class="hover ml-6"
            @click="Navigation.go(item.value)"
            v-for="item in BleuVars.config.header.links">
            <div class="i-tabler-brand-bilibili" v-if="item.name === 'bilibili'"></div>
            <div class="i-tabler-brand-github" v-else-if="item.name === 'github'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-header {
  -webkit-backdrop-filter: saturate(50%) blur(8px);
  backdrop-filter: saturate(50%) blur(8px);
}

:deep(.el-input__wrapper) {
  border-radius: 10rem;
}
</style>
