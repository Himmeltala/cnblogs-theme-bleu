<script setup lang="ts">
import { MenuApi } from "@/apis";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: true
  }
});

const searchVal = ref("");
const tabActive = ref("first");
const commonCollActive = ref("1");
const topListCollActive = ref("1");
const news = shallowRef();
const stats = shallowRef();
const columnList = shallowRef();
const topList = shallowRef();

MenuApi.getNews().then(res => {
  news.value = res;
});

MenuApi.getStats().then(res => {
  stats.value = res;
});

MenuApi.getColumn().then(res => {
  columnList.value = res;
});

MenuApi.getTopList().then(res => {
  topList.value = res;
});

function search() {
  window.open(`https://zzk.cnblogs.com/s?w=blog:${EcyConfig.blogApp}%${searchVal.value}`, "__blank");
}

async function subscribe() {
  const data = await MenuApi.follow();
  if (data) ElMessage({ message: "已经关注博主！", type: "success", grouping: true });
}

async function unsubscribe() {
  const data = await MenuApi.unfollow();
  if (data) ElMessage({ message: "取消关注博主！", type: "success", grouping: true });
}

const block = computed(() => {
  return !props.disabled;
});

const hidden = computed(() => {
  return props.disabled;
});
</script>

<template>
  <div
    id="l-lmenu"
    class="l-fiv-size fixed top-0 left-0 noscroll ofw-auto h-100vh bg-#191919 p-3 w-17.5rem"
    :class="{ 'show-lcabinet z-99': block, 'hidden-lcabinet': hidden }">
    <ExpandableBox text="博客信息" disabled>
      <template #icon>
        <i-ep-house />
      </template>
      <div class="f-c-c mb-4" v-if="!EcyConfig.isOwner">
        <el-popconfirm @confirm="unsubscribe" confirm-button-text="确定" cancel-button-text="取消" title="确定取消关注？">
          <template #reference>
            <el-button v-if="EcyConfig.isFollow" type="danger" text bg> -取消关注 </el-button>
          </template>
        </el-popconfirm>
        <el-button @click="subscribe" v-if="!EcyConfig.isFollow" type="primary" text bg> +关注博主 </el-button>
      </div>
      <div class="hover mb-4" v-if="news" v-for="(item, index) in news" @click="EcyUtils.Router.go({ path: item.href })">
        <div class="f-c-s" v-if="index === 0">
          <i-ep-user-filled class="mr-2" />
          昵称：{{ item.text }}
        </div>
        <div class="f-c-s" v-else-if="index === 1">
          <i-ep-clock class="mr-2" />
          园龄：{{ item.text }}
        </div>
        <div class="f-c-s" v-else-if="index === 2">
          <i-ep-star-filled class="mr-2" />
          粉丝：{{ item.text }}
        </div>
        <div class="f-c-s" v-else>
          <i-ep-bell-filled class="mr-2" />
          关注：{{ item.text }}
        </div>
      </div>
      <div class="mb-4">
        <span class="mr-3" v-if="stats" v-for="item in stats"> {{ item.text }} - {{ item.digg }} </span>
      </div>
      <el-input clearable @keyup.enter="search" v-model="searchVal">
        <template #prefix>
          <i-ep-search />
        </template>
      </el-input>
    </ExpandableBox>
    <ExpandableBox text="博客数据" disabled>
      <template #icon>
        <i-ep-data-analysis />
      </template>
      <el-tabs v-model="tabActive" stretch>
        <el-tab-pane label="博客常用项" name="first">
          <template v-if="columnList">
            <div class="mb-2" v-for="item in columnList.rankings">{{ item.text }}</div>
            <router-link :to="RouterPath.worksByCalendar()">
              <div class="my-4 f-c-s hover l-pri-color">
                <i-ep-calendar class="mr-2" />
                博客日历
              </div>
            </router-link>
            <el-collapse v-model="commonCollActive" accordion>
              <el-collapse-item v-if="columnList.essaySort.length">
                <template #title>
                  <i-ep-files class="mr-2" />
                  随笔分类
                </template>
                <div
                  class="hover"
                  :class="{ 'mb-1': index != columnList.essaySort.length - 1 }"
                  v-for="(item, index) in columnList.essaySort">
                  <router-link :to="RouterPath.worksBySort('p', item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="columnList.essayArchive.length">
                <template #title>
                  <i-ep-collection class="mr-2" />
                  随笔档案
                </template>
                <div
                  class="hover"
                  :class="{ 'mb-1': index != columnList.essayArchive.length - 1 }"
                  v-for="(item, index) in columnList.essayArchive">
                  <router-link :to="RouterPath.worksByArchive('p', item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item v-if="columnList.articleSort.length">
                <template #title>
                  <i-ep-folder-opened class="mr-2" />
                  文章分类
                </template>
                <div
                  class="hover"
                  :class="{ 'mb-1': index != columnList.articleSort.length - 1 }"
                  v-for="(item, index) in columnList.articleSort">
                  <router-link :to="RouterPath.worksBySort('a', item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item title="文章档案" v-if="columnList.articleArchive.length">
                <template #title>
                  <i-ep-management class="mr-2" />
                  文章档案
                </template>
                <div
                  class="hover"
                  :class="{ 'mb-1': index != columnList.articleArchive.length - 1 }"
                  v-for="(item, index) in columnList.articleArchive">
                  <router-link :to="RouterPath.worksByArchive('a', item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item title="标签分类" v-if="columnList.tagList.length">
                <template #title>
                  <i-ep-price-tag class="mr-2" />
                  标签分类
                </template>
                <div class="hover" :class="{ 'mb-1': index != columnList.tagList.length - 1 }" v-for="(item, index) in columnList.tagList">
                  <router-link :to="RouterPath.worksByMark(item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
                <div>
                  <router-link :to="RouterPath.markList()">更多...</router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item title="最新随笔" v-if="columnList.latestEssayList.length">
                <template #title>
                  <i-ep-document-remove class="mr-2" />
                  最新随笔
                </template>
                <div
                  class="hover"
                  :class="{ 'mb-4': index != columnList.latestEssayList.length - 1 }"
                  v-for="(item, index) in columnList.latestEssayList">
                  <router-link :to="RouterPath.works(item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item title="最新评论" v-if="columnList.latestComments.length">
                <template #title>
                  <i-ep-comment class="mr-2" />
                  最新评论
                </template>
                <div :class="{ 'mb-4': index != columnList.latestComments.length - 1 }" v-for="(item, index) in columnList.latestComments">
                  <div class="hover">
                    <router-link :to="RouterPath.works(item.id)">
                      {{ item.title }}
                    </router-link>
                  </div>
                  <div class="pl-4">{{ item.content }}</div>
                  <div class="f-c-e mt-4">
                    <a class="hover" :href="'https://www.cnblogs.com/' + item.author" target="_blank">by {{ item.author }}</a>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="我的相册">
                <template #title>
                  <i-ep-picture class="mr-2" />
                  我的相册
                </template>
                <div :class="{ 'mb-2': index != columnList.albumn.length - 1 }" v-for="(item, index) in columnList.albumn" :key="index">
                  <router-link class="hover" :to="'/albumn/' + item.id">{{ item.text }}</router-link>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-tab-pane>
        <el-tab-pane label="排行榜数据" name="second">
          <template v-if="topList">
            <el-collapse v-model="topListCollActive" accordion>
              <el-collapse-item title="评论排行榜">
                <template #title>
                  <i-ep-chat-square class="mr-2" />
                  评论排行榜
                </template>
                <div class="mb-2 hover" v-for="item in topList.topComments">
                  <router-link :to="RouterPath.works(item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template #title>
                  <i-ep-pointer class="mr-2" />
                  点赞排行榜
                </template>
                <div class="mb-2 hover" v-for="item in topList.topDigg">
                  <router-link :to="RouterPath.works(item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template #title>
                  <i-ep-view class="mr-2" />
                  阅读排行榜
                </template>
                <div class="mb-2 hover" v-for="item in topList.topView">
                  <router-link :to="RouterPath.works(item.id)">
                    {{ item.text }}
                  </router-link>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ExpandableBox>
  </div>
</template>

<style scoped lang="scss">
$quota: 10;

#l-lmenu {
  transition: var(--l-transition);
}

.show-lcabinet {
  animation: showlcabinet 0.3s linear;
  transform: translateX(0);
}

@keyframes showlcabinet {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX(calc(-17.5rem + $i * 1.75rem));
    }
  }
}

.hidden-lcabinet {
  animation: hiddenlcabinet 0.3s linear;
  transform: translateX(-17.5rem);
}

@keyframes hiddenlcabinet {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX(calc($i * -1.75rem));
    }
  }
}
</style>
