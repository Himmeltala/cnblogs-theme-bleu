<script setup lang="ts">
import { PostsHttp } from "@/requests";

const loading = new Broswer.Loading();

const route = useRoute();
const postId = ref<any>(route.params.id);
const postData = shallowRef<PostModel>();
const postInfo = shallowRef<PostInfoModel>();
const markdownInst = shallowRef();

const markdownRef = ref();
const catalogRef = ref();

function fetchData() {
  loading.startLoading();

  Promise.all([PostsHttp.getArbeiten(postId.value), PostsHttp.getArticleInfo(postId.value)]).then(
    ([val1, val2]) => {
      postData.value = val1;
      postInfo.value = val2;
      Broswer.setTitle(postData.value.text);

      nextTick(() => {
        markdownRef.value.renderMarkdownFnc((inst: any) => {
          loading.endLoading();
          markdownInst.value = inst;
          catalogRef.value.renderCatalogFnc(inst);
        });
      });
    }
  );
}

function convey(type: VoteType) {
  PostsHttp.vote({
    postId: parseInt(postId.value),
    isAbandoned: false,
    voteType: type
  }).then(data => {
    if (data?.isSuccess) {
      type == "Bury" ? postInfo.value.postStats.buryCount++ : postInfo.value.postStats.diggCount++;
    }
  });
}

onBeforeRouteUpdate(updateGuard => {
  postId.value = updateGuard.params.id;
  fetchData();
});

const drawer = ref(false);

function openDrawer() {
  catalogRef.value.renderCatalogFnc(markdownInst.value);
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="post-detail relative f-c-c" v-if="postData && postInfo">
    <div class="lg-sm:w-55vw lt-sm:w-90vw">
      <div class="text-1.5rem font-bold mb-4">{{ postData.text }}</div>
      <div class="f-c-s flex-wrap text-text-regular mb-4">
        <div class="f-c-c mr-4">
          <div class="i-tabler-calendar-stats mr-2"></div>
          {{ postData.date }}
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-eye mr-2"></div>
          {{ postData.view }}次阅读
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-message-2 mr-2"></div>
          {{ postData.comm }}条评论
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-language mr-2"></div>
          {{ postData.wordCount }}字
        </div>
        <div
          v-if="isBlogOwner"
          class="f-c-c hover"
          @click="Navigation.go('https://i.cnblogs.com/EditPosts.aspx?postid=' + postId)">
          <div class="i-tabler-pencil-minus mr-2"></div>
          编辑
        </div>
      </div>
      <div class="text-text-regular mb-4">
        <div class="f-c-s flex-wrap" v-if="postInfo.props.sorts.length">
          <div class="f-c-s">
            <div class="i-tabler-category-2 mr-2"></div>
            分类：
          </div>
          <div
            v-for="(item, index) in postInfo.props.sorts"
            :class="{ 'mr-4': index !== postInfo.props.sorts.length - 1 }">
            <router-link :to="RouterPath.PostsBySort(item.id, '1', true)">
              <el-tag>
                {{ item.text }}
              </el-tag>
            </router-link>
          </div>
        </div>
        <div class="f-c-s flex-wrap mt-4" v-if="postInfo.props.tags.length">
          <div class="f-c-s">
            <div class="i-tabler-bookmarks mr-2"></div>
            标签：
          </div>
          <div
            v-for="(item, index) in postInfo.props.tags"
            :class="{ 'mr-4': index !== postInfo.props.tags.length - 1 }">
            <router-link :to="RouterPath.PostsByMark(item.text)">
              <el-tag type="success">
                {{ item.text }}
              </el-tag>
            </router-link>
          </div>
        </div>
      </div>
      <Markdown
        catalog
        ref="markdownRef"
        :fancy-group="'post-detail'"
        :content="postData.content" />
      <div v-if="!isBlogOwner && isLogined" class="mt-10 f-c-e">
        <el-button type="primary" plain round size="small">
          <span v-if="postInfo.postStats.isFollowed" @click="PostsHttp.unfollow"> - 取消关注 </span>
          <span v-else @click="PostsHttp.follow"> + 关注博主 </span>
        </el-button>
      </div>
      <div class="text-0.9rem mt-10">
        <div class="f-s-s mb-4" v-if="postInfo.prevNext.prev.href">
          <router-link class="hover" :to="RouterPath.PostDetail(postInfo.prevNext.prev.href)">
            上一篇：{{ postInfo.prevNext.prev.text }}
          </router-link>
        </div>
        <div class="f-s-e" v-if="postInfo.prevNext.next.href">
          <router-link class="hover" :to="RouterPath.PostDetail(postInfo.prevNext.next.href)">
            下一篇：{{ postInfo.prevNext.next.text }}
          </router-link>
        </div>
      </div>
      <div class="bg-bg-overlay text-0.9rem p-5 rd-2 text-text-secondary mt-5">
        <div class="f-c-s flex-wrap">
          <div class="i-tabler-user mr-2"></div>
          作者：<span
            class="hover"
            @click="Navigation.go('https://home.cnblogs.com/u/' + BleuVars.getBlogApp())">
            {{ BleuVars.getBlogApp() }}
          </span>
        </div>
        <div class="f-c-s flex-wrap">
          <div class="i-tabler-sign-right mr-2"></div>
          出处：<span class="hover">
            https://www.cnblogs.com/{{ BleuVars.getBlogApp() }}/#/p/{{ postId }}
          </span>
        </div>
        <div class="f-c-s flex-wrap">
          <div class="i-tabler-license mr-2"></div>
          版权：本作品采用「<span
            class="hover"
            @click="Navigation.go('https://creativecommons.org/licenses/by-nc-sa/4.0/')">
            署名-非商业性使用-相同方式共享 4.0 国际 </span
          >」许可协议进行许可。
        </div>
      </div>
      <div class="mt-10" v-html="postInfo.historyToday"></div>
      <div class="mt-10 f-c-c">
        <el-button class="mr-5" type="primary" text bg @click="convey('Digg')">
          <div class="i-tabler-thumb-up mr-1"></div>
          赞成 {{ postInfo.postStats.diggCount }}
        </el-button>
        <el-button class="mr-5" type="danger" text bg @click="convey('Bury')">
          <div class="i-tabler-thumb-down mr-1"></div>
          反对 {{ postInfo.postStats.buryCount }}
        </el-button>
        <el-button type="success" text bg @click="Native.savePost(postId)">
          <div class="i-tabler-heart mr-1"></div>
          收藏
        </el-button>
      </div>
      <div class="mt-10" v-html="postInfo.aggTopPosts"></div>
      <div class="mt-10" v-html="postInfo.headlines"></div>
      <Comment class="mt-10" :post-id="postId" />
    </div>
    <div v-if="!BleuVars.isPC()">
      <el-button @click="drawer = !drawer" type="primary" plain class="fixed right-5vw top-20">
        <template #icon>
          <div class="i-tabler-sign-right"></div>
        </template>
      </el-button>
      <el-drawer
        @open="openDrawer"
        v-model="drawer"
        direction="rtl"
        :with-header="false"
        :size="BleuVars.isPC() ? '20%' : '80%'">
        <div class="mt-15">
          <Catalog ref="catalogRef" />
        </div>
      </el-drawer>
    </div>
    <div v-else>
      <Catalog ref="catalogRef" class="fixed left-80vw top-20 w-20vw" />
    </div>
  </div>
</template>

<style lang="scss">
.under-post-card,
.history-today {
  b {
    --uno: text-text-secondary !important;
  }

  a {
    --uno: hover text-0.8rem text-text-secondary !important;
  }
}
</style>
