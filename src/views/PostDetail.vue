<script setup lang="ts">
const loading = new Utils.Browser.Loading();
const route = useRoute();
const postId = shallowRef<any>(route.params.id);
const postData = shallowRef<PostModel>();
const postInfo = shallowRef<PostInfoModel>();
const mdInst = shallowRef();
const mdRef = shallowRef();
const catalogRef = shallowRef();
const isShowDrawer = shallowRef(false);

function fetch() {
  loading.startLoading();

  Promise.all([Requests.Posts.getDetail(postId.value), Requests.Posts.getInfo(postId.value)]).then(
    ([detail, info]) => {
      postData.value = detail;
      postInfo.value = info;
      Utils.Browser.setTitle(postData.value.text);

      nextTick(() => {
        mdRef.value.mdRender((html: any) => {
          mdInst.value = html;
          if (Consts.isPC()) {
            catalogRef.value.catalogRender(mdInst.value);
          }
          loading.endLoading();
        });
      });
    }
  );
}

function convey(type: VoteType) {
  Requests.Posts.vote({
    postId: parseInt(postId.value),
    isAbandoned: false,
    voteType: type
  }).then(data => {
    if (data?.isSuccess) {
      if (type == "Bury") {
        postInfo.value.postStats.buryCount++;
      } else {
        postInfo.value.postStats.diggCount++;
      }
    }
  });
}

onBeforeRouteUpdate(updateGuard => {
  postId.value = updateGuard.params.id;
  fetch();
});

onMounted(() => {
  fetch();
});
</script>

<template>
  <div class="page position-relative f-c-c" v-if="postData && postInfo">
    <div class="lg-sm:w-55vw lt-sm:w-90vw">
      <div class="text-1.5rem text-text-regular font-bold mb-2">{{ postData.text }}</div>
      <div class="f-c-s flex-wrap mb-4 text-0.9rem">
        <div class="f-c-c">
          <div class="i-tabler:calendar-stats mr-2"></div>
          发表于 {{ postData.date }}
        </div>
        <div class="mx-2">|</div>
        <div class="f-c-c">
          <div class="i-tabler:eye mr-2"></div>
          已有 {{ postData.view }} 人阅读
        </div>
        <div class="mx-2">|</div>
        <div class="f-c-c">
          <div class="i-tabler:message-2 mr-2"></div>
          留下 {{ postData.comm }} 条评论
        </div>
        <div class="mx-2">|</div>
        <div class="f-c-c">
          <div class="i-tabler:language mr-2"></div>
          全文字数 ≈ {{ postData.wordCount }}字
        </div>
        <a
          v-if="isBlogOwner"
          target="_blank"
          :href="'https://i.cnblogs.com/EditPosts.aspx?postid=' + postId">
          <div class="f-c-c">
            <div class="mx-2">|</div>
            <div class="f-c-c hover">
              <div class="i-tabler:pencil-minus mr-2"></div>
              编辑
            </div>
          </div>
        </a>
      </div>
      <div class="text-text-regular mb-4">
        <div class="f-c-s flex-wrap" v-if="postInfo.props.sorts.length">
          <div class="f-c-s">
            <div class="i-tabler:category-2 mr-2"></div>
            <span class="text-0.9rem">分类：</span>
          </div>
          <div
            v-for="(item, index) in postInfo.props.sorts"
            :class="{ 'mr-2': index !== postInfo.props.sorts.length - 1 }">
            <router-link :to="Consts.Paths.sort(item.id)">
              <el-tag round>
                {{ item.text }}
              </el-tag>
            </router-link>
          </div>
        </div>
        <div class="f-c-s flex-wrap mt-2" v-if="postInfo.props.tags.length">
          <div class="f-c-s">
            <div class="i-tabler:bookmarks mr-2"></div>
            <span class="text-0.9rem">标签：</span>
          </div>
          <div
            v-for="(item, index) in postInfo.props.tags"
            :class="{ 'mr-2': index !== postInfo.props.tags.length - 1 }">
            <router-link :to="Consts.Paths.label(item.text)">
              <el-tag round type="success">
                {{ item.text }}
              </el-tag>
            </router-link>
          </div>
        </div>
      </div>
      <CustMarkdown ref="mdRef" :fancy-group="'post-detail'" :content="postData.content" />
      <div v-if="!isBlogOwner && isLogined" class="mt-10 f-c-e">
        <el-button type="primary" plain round size="small">
          <span v-if="postInfo.postStats.isFollowed" @click="Requests.Posts.unfollow">
            - 取消关注
          </span>
          <span v-else @click="Requests.Posts.follow"> + 关注博主 </span>
        </el-button>
      </div>
      <div class="mt-10 f-c-c">
        <el-button round class="mr-4" type="primary" text bg @click="convey('Digg')">
          <div class="i-tabler:thumb-up mr-2"></div>
          赞成 {{ postInfo.postStats.diggCount }}
        </el-button>
        <el-button round class="mr-4" type="danger" text bg @click="convey('Bury')">
          <div class="i-tabler:thumb-down mr-2"></div>
          反对 {{ postInfo.postStats.buryCount }}
        </el-button>
        <el-button round type="success" text bg @click="Utils.Native.savePost(postId)">
          <div class="i-tabler:heart mr-2"></div>
          收藏
        </el-button>
      </div>
      <div class="text-0.9rem text-text-primary mt-10">
        <div class="f-s-s mb-4" v-if="postInfo.prevNext.prev.href">
          <router-link class="hover" :to="Consts.Paths.p(postInfo.prevNext.prev.href)">
            上一篇：{{ postInfo.prevNext.prev.text }}
          </router-link>
        </div>
        <div class="f-s-e" v-if="postInfo.prevNext.next.href">
          <router-link class="hover" :to="Consts.Paths.p(postInfo.prevNext.next.href)">
            下一篇：{{ postInfo.prevNext.next.text }}
          </router-link>
        </div>
      </div>
      <div class="text-0.9rem rd-2 text-text-primary mt-10">
        <div class="f-c-s flex-wrap">
          <div class="i-tabler:user mr-2"></div>
          作者：<span
            class="hover"
            @click="Utils.Navigation.go('https://home.cnblogs.com/u/' + Consts.getBlogApp())">
            {{ Consts.getBlogApp() }}
          </span>
        </div>
        <div class="f-c-s flex-wrap">
          <div class="i-tabler:sign-right mr-2"></div>
          出处：<span class="hover">
            https://www.cnblogs.com/{{ Consts.getBlogApp() }}/#/p/{{ postId }}
          </span>
        </div>
        <div class="f-c-s flex-wrap">
          <div class="i-tabler:license mr-2"></div>
          版权：本作品采用「<span
            class="hover"
            @click="Utils.Navigation.go('https://creativecommons.org/licenses/by-nc-sa/4.0/')">
            署名-非商业性使用-相同方式共享 4.0 国际 </span
          >」许可协议进行许可。
        </div>
      </div>
      <div class="mt-10 history-today" v-html="postInfo.historyToday"></div>
      <Comment class="mt-10" :post-id="postId" />
      <div class="mt-10" v-html="postInfo.aggTopPosts"></div>
      <div class="mt-10 mb-4" v-html="postInfo.headlines"></div>
    </div>
    <div v-if="!Consts.isPC()">
      <el-button round @click="isShowDrawer = !isShowDrawer" plain class="fixed right-5vw top-20">
        <template #icon>
          <div class="i-tabler:sign-right"></div>
        </template>
      </el-button>
      <el-drawer
        size="80%"
        @open="() => catalogRef.catalogRender(mdInst)"
        v-model="isShowDrawer"
        direction="rtl"
        :with-header="false">
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
  --uno: text-0.8rem text-text-primary;

  a {
    --uno: hover;
  }
}
</style>
