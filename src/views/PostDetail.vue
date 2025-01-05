<script lang="ts" setup>
const route = useRoute();
const postId = shallowRef<any>(route.params.id);
const postData = shallowRef<PostModel>();
const postInfo = shallowRef<PostInfoModel>();
const mdInst = shallowRef();
const mdRef = shallowRef();
const catalogRef = shallowRef();

async function fetch() {
  Utils.Browser.startLoading();

  postData.value = await Requests.Posts.getDetail(postId.value);
  postInfo.value = await Requests.Posts.getInfo(postId.value);

  Utils.Browser.setTitle(postData.value.text);

  nextTick(() => {
    mdRef.value.initialize((html: any) => {
      mdInst.value = html;
      catalogRef.value.initialize(html);

      Utils.Browser.endLoading();
    });
  });
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

onBeforeRouteUpdate(async updateGuard => {
  postId.value = updateGuard.params.id;
  await fetch();
});

onMounted(async () => {
  await fetch();
});
</script>

<template>
  <div v-if="postData && postInfo" class="page relative">
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
        :href="'https://i.cnblogs.com/EditPosts.aspx?postid=' + postId"
        target="_blank">
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
      <div v-if="postInfo.props.sorts.length" class="f-c-s flex-wrap">
        <div class="f-c-s">
          <div class="i-tabler:category-2 mr-2"></div>
          <span class="text-0.9rem">分类：</span>
        </div>
        <div
          v-for="(item, index) in postInfo.props.sorts"
          :class="{ 'mr-2': index !== postInfo.props.sorts.length - 1 }">
          <router-link :to="Consts.Paths.category(item.id)">
            <el-tag round>
              {{ item.text }}
            </el-tag>
          </router-link>
        </div>
      </div>
      <div v-if="postInfo.props.tags.length" class="f-c-s flex-wrap mt-2">
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
    <Markdown ref="mdRef" :content="postData.content" :fancy-group="'post-detail'" />
    <div v-if="!isBlogOwner && isLogined" class="mt-10 f-c-e">
      <el-button plain round size="small" type="primary">
        <span v-if="postInfo.postStats.isFollowed" @click="Requests.Posts.unfollow">
          - 取消关注
        </span>
        <span v-else @click="Requests.Posts.follow"> + 关注博主 </span>
      </el-button>
    </div>
    <div class="mt-10 f-c-c">
      <el-button bg class="mr-4" round text type="primary" @click="convey('Digg')">
        <div class="i-tabler:thumb-up mr-2"></div>
        赞成 {{ postInfo.postStats.diggCount }}
      </el-button>
      <el-button bg class="mr-4" round text type="danger" @click="convey('Bury')">
        <div class="i-tabler:thumb-down mr-2"></div>
        反对 {{ postInfo.postStats.buryCount }}
      </el-button>
      <el-button bg round text type="success" @click="Utils.Native.savePost(postId)">
        <div class="i-tabler:heart mr-2"></div>
        收藏
      </el-button>
    </div>
    <div class="text-0.9rem text-text-primary mt-10">
      <div v-if="postInfo.prevNext.prev.href" class="f-s-s mb-4">
        <router-link :to="Consts.Paths.post(postInfo.prevNext.prev.href)" class="hover">
          上一篇：{{ postInfo.prevNext.prev.text }}
        </router-link>
      </div>
      <div v-if="postInfo.prevNext.next.href" class="f-s-e">
        <router-link :to="Consts.Paths.post(postInfo.prevNext.next.href)" class="hover">
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
    <Catalog ref="catalogRef" :html="mdInst" class="fixed left-80vw top-20 w-20vw" />
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
