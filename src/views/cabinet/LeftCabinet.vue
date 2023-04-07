<script setup lang="ts">
import { useBaseAuthorData } from "@/store";
import { follow, unfollow, getCabinetColumn, getCabinetTopList } from "@/apis/remote-api";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: true
  }
});

const cabinet = EcyConfig.__ECY_CONFIG__.cabinet;
const store = useBaseAuthorData();
const setting = EcyUtils.getSetting();
const searchVal = ref("");
const tabActive = ref("first");
const commonCollActive = ref("1");
const topListCollActive = ref("1");
const settingCollActive = ref("1");
const authorData = shallowRef();
const masterData = shallowRef();
const columnData = shallowRef();
const topListData = shallowRef();

store.$onAction(({ args }) => {
  authorData.value = args[0].author;
  masterData.value = args[0].master;
});

getCabinetColumn().then(res => {
  columnData.value = res;
});

getCabinetTopList().then(res => {
  topListData.value = res;
});

function search() {
  window.open(`https://zzk.cnblogs.com/s?w=blog:${EcyConfig.blogApp}%${searchVal.value}`, "__blank");
}

async function subscribe() {
  const data = await follow();
  if (data) ElMessage({ message: "已经关注博主！", type: "success", grouping: true });
}

async function unsubscribe() {
  const data = await unfollow();
  if (data) ElMessage({ message: "取消关注博主！", type: "success", grouping: true });
}

const left = computed(() => {
  return setting.value.cabinet.left.pin && setting.value.cabinet.position.break ? setting.value.cabinet.position.left + "vw" : 0;
});

const block = computed(() => {
  return !props.disabled && !setting.value.cabinet.left.pin;
});

const hidden = computed(() => {
  return props.disabled && !setting.value.cabinet.left.pin;
});

const fixed = computed(() => {
  return setting.value.cabinet.left.pin && !setting.value.cabinet.position.break;
});
</script>

<template>
  <ContextMenu
    id="l-lcabinet"
    class="fixed top-0 left-0"
    :style="{ left: left }"
    :class="{ 'show-lcabinet z-4': block, 'hidden-lcabinet': hidden, 'fixed-lcabinet': fixed }"
    style="width: var(--cabinet-width)">
    <Card
      class="l-fiv-size"
      :class="{ 'l-box-bg px-2': !setting.card.open }"
      :padding="setting.cabinet.left.padding"
      :margin="setting.cabinet.left.margin">
      <div class="noscroll ofw-auto h-100vh">
        <ExpandableBox text="博客信息" disabled>
          <template #icon>
            <i-ep-house />
          </template>
          <div v-if="cabinet?.avatar" class="f-c-c mb-5">
            <el-tooltip effect="dark" placement="right">
              <router-link to="/">
                <img class="h-25 w-25 cursor-pointer rd-50" alt="FAILED" :src="cabinet?.avatar" />
              </router-link>
              <template #content>
                <div v-if="cabinet?.signature" v-html="cabinet.signature" />
                <div v-else>这个人很懒，什么也没有留下</div>
              </template>
            </el-tooltip>
          </div>
          <div class="f-c-c mb-4" v-if="!EcyConfig.isOwner">
            <el-popconfirm @confirm="unsubscribe" confirm-button-text="确定" cancel-button-text="取消" title="确定取消关注？">
              <template #reference>
                <el-button v-if="EcyConfig.isFollow" type="danger" text bg> -取消关注 </el-button>
              </template>
            </el-popconfirm>
            <el-button @click="subscribe" v-if="!EcyConfig.isFollow" type="primary" text bg> +关注博主 </el-button>
          </div>
          <div class="hover mb-4" v-if="authorData" v-for="(item, index) in authorData" @click="EcyUtils.Router.go({ path: item.href })">
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
            <span class="mr-3" v-if="masterData" v-for="item in masterData"> {{ item.text }} - {{ item.digg }} </span>
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
              <template v-if="columnData">
                <div class="mb-2" v-for="item in columnData.rankings">{{ item.text }}</div>
                <router-link to="/calendar">
                  <div class="my-4 f-c-s hover l-pri-color">
                    <i-ep-calendar class="mr-2" />
                    博客日历
                  </div>
                </router-link>
                <el-collapse v-model="commonCollActive" accordion>
                  <el-collapse-item v-if="columnData.essaySort.length">
                    <template #title>
                      <i-ep-files class="mr-2" />
                      随笔分类
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-1': index != columnData.essaySort.length - 1 }"
                      v-for="(item, index) in columnData.essaySort">
                      <router-link :to="'/sort/p/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item v-if="columnData.essayArchive.length">
                    <template #title>
                      <i-ep-collection class="mr-2" />
                      随笔档案
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-1': index != columnData.essayArchive.length - 1 }"
                      v-for="(item, index) in columnData.essayArchive">
                      <router-link :to="'/archive/p/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item v-if="columnData.articleSort.length">
                    <template #title>
                      <i-ep-folder-opened class="mr-2" />
                      文章分类
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-1': index != columnData.articleSort.length - 1 }"
                      v-for="(item, index) in columnData.articleSort">
                      <router-link :to="'/sort/a/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="文章档案" v-if="columnData.articleArchive.length">
                    <template #title>
                      <i-ep-management class="mr-2" />
                      文章档案
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-1': index != columnData.articleArchive.length - 1 }"
                      v-for="(item, index) in columnData.articleArchive">
                      <router-link :to="'/archive/a/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="标签分类" v-if="columnData.tagList.length">
                    <template #title>
                      <i-ep-price-tag class="mr-2" />
                      标签分类
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-1': index != columnData.tagList.length - 1 }"
                      v-for="(item, index) in columnData.tagList">
                      <router-link :to="'/mark/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                    <div>
                      <router-link to="/marks">更多...</router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="最新随笔" v-if="columnData.latestEssayList.length">
                    <template #title>
                      <i-ep-document-remove class="mr-2" />
                      最新随笔
                    </template>
                    <div
                      class="hover"
                      :class="{ 'mb-4': index != columnData.latestEssayList.length - 1 }"
                      v-for="(item, index) in columnData.latestEssayList">
                      <router-link :to="'/p/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="最新评论" v-if="columnData.latestComments.length">
                    <template #title>
                      <i-ep-comment class="mr-2" />
                      最新评论
                    </template>
                    <div
                      :class="{ 'mb-4': index != columnData.latestComments.length - 1 }"
                      v-for="(item, index) in columnData.latestComments">
                      <div class="hover">
                        <router-link :to="'/p/' + item.id">
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
                    <div :class="{ 'mb-2': index != columnData.albumn.length - 1 }" v-for="(item, index) in columnData.albumn" :key="index">
                      <router-link class="hover" :to="'/albumn/' + item.id">{{ item.text }}</router-link>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-tab-pane>
            <el-tab-pane label="排行榜数据" name="second">
              <template v-if="topListData">
                <el-collapse v-model="topListCollActive" accordion>
                  <el-collapse-item title="评论排行榜">
                    <template #title>
                      <i-ep-chat-square class="mr-2" />
                      评论排行榜
                    </template>
                    <div class="mb-2 hover" v-for="item in topListData.topComments">
                      <router-link :to="'/p/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template #title>
                      <i-ep-pointer class="mr-2" />
                      点赞排行榜
                    </template>
                    <div class="mb-2 hover" v-for="item in topListData.topDigg">
                      <router-link :to="'/p/' + item.id">
                        {{ item.text }}
                      </router-link>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template #title>
                      <i-ep-view class="mr-2" />
                      阅读排行榜
                    </template>
                    <div class="mb-2 hover" v-for="item in topListData.topView">
                      <router-link :to="'/p/' + item.id">
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
    </Card>
    <template #title> 左陈列柜设置 </template>
    <template #content>
      <el-collapse v-model="settingCollActive" accordion>
        <el-collapse-item title="统一设置">
          <div class="ml-4">
            <CabinetSetting />
          </div>
        </el-collapse-item>
        <el-collapse-item title="盒子模型">
          <div class="ml-4">
            <BoxSetting :padding="setting.cabinet.left.padding" :margin="setting.cabinet.left.margin" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
  </ContextMenu>
</template>

<style scoped lang="scss">
$quota: 10;

#l-lcabinet {
  transition: var(--l-transition);
}

.fixed-lcabinet {
  left: calc(calc(var(--content-width) / 2) - calc(var(--cabinet-width) + 2rem)) !important;
}

.show-lcabinet {
  animation: showlcabinet 0.2s ease-in;
  transform: translateX(0);
}

@keyframes showlcabinet {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX(calc(calc(-1 * var(--cabinet-width)) + calc($i * calc(var(--cabinet-width) / 10))));
    }
  }
}

.hidden-lcabinet {
  animation: hiddenlcabinet 0.2s ease-out;
  transform: translateX(calc(-1 * var(--cabinet-width)));
}

@keyframes hiddenlcabinet {
  @for $i from 0 to $quota {
    #{$i * 10%} {
      transform: translateX(calc($i * calc(calc(-1 * var(--cabinet-width)) / 10)));
    }
  }
}
</style>
