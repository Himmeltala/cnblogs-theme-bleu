<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const route = useRoute();
const arbeiten = shallowRef<BleuArbeiten>();
const arbProps = shallowRef<BleuArbeitenProps>();
const arbPrevNext = shallowRef<BleuArbeitenPrevNext>();
const arbViewPoint = shallowRef<BlogArbeitenViewPoint>();
const arbeitenState = ref<BleuArbeitenState>();
const arbIsLock = ref(false);
const arbeitenId = ref(route.params.id as string);
const loading = new Broswer.Loading();

async function fetchData(isInMounted?: boolean) {
  loading.startLoading();

  const [val1, val2, val3, val4, val5] = await Promise.all([
    ArbeitenApi.getArbeiten(arbeitenId.value),
    ArbeitenApi.getProps(arbeitenId.value),
    ArbeitenApi.getPrevNext(arbeitenId.value),
    ArbeitenApi.getViewPoint(arbeitenId.value),
    ArbeitenApi.getArbeitenState(arbeitenId.value)
  ]);

  arbeiten.value = val1;
  arbProps.value = val2;
  arbPrevNext.value = val3;
  arbViewPoint.value = val4;
  arbeitenState.value = val5;
  arbIsLock.value = val1.isLocked;

  Broswer.setTitle(arbeiten.value.text);
  !isInMounted && loading.endLoading();
}

const arbPassword = ref("");

async function submit() {
  const isPassed = await ArbeitenApi.isPassed(arbPassword.value, arbeitenId.value);
  if (isPassed) {
    arbeiten.value = await ArbeitenApi.getLockedArbeiten(arbPassword.value, arbeitenId.value);
    arbIsLock.value = false;
  }
}

async function vote(type: VoteType) {
  const response = await ArbeitenApi.vote({
    postId: parseInt(arbeitenId.value),
    isAbandoned: false,
    voteType: type
  });
  if (response?.isSuccess) {
    type == "Bury" ? arbViewPoint.value.buryCount++ : arbViewPoint.value.diggCount++;
  }
}

watch(route, async () => {
  if (route.name === RouterName.Arbeiten) {
    arbeitenId.value = route.params.id as string;
    await fetchData(false);
  }
});

onMounted(() => {
  const anchor = route.hash.match(/#.+/g);

  if (anchor) {
    setTimeout(() => {
      Broswer.scrollIntoView(`#${anchor[0].replace("#", "")}`);
    }, 500);
  }

  loading.endLoading();
});

const realHtml = ref<HTMLElement>();

await fetchData(true);
</script>

<template>
  <div id="l-arbeiten" class="page">
    <div class="content mt-4" v-if="!arbIsLock">
      <div class="text-1.4rem w-100%">{{ arbeiten.text }}</div>
      <div class="f-c-s lt-sm:flex-wrap mt-4 text-0.9rem">
        <div class="f-c-c mr-4">
          <div class="i-tabler-calendar-stats mr-2"></div>
          {{ arbeiten.date }}
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-eye mr-2"></div>
          {{ arbeiten.view }}次阅读
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-message-2 mr-2"></div>
          {{ arbeiten.comm }}条评论
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-language mr-2"></div>
          {{ arbeiten.wordCount }}字
        </div>
        <div
          v-if="isBlogOwner"
          class="f-c-c hover"
          @click="Navigation.go('https://i.cnblogs.com/EditPosts.aspx?postid=' + arbeitenId)">
          <div class="i-tabler-pencil-minus mr-2"></div>
          编辑
        </div>
      </div>
      <div class="mt-4 mb-10">
        <div class="mb-2 f-c-s flex-wrap text-0.9rem" v-if="arbProps?.sorts?.length">
          <div class="f-c-s mt-2 mr-2">
            <div class="i-tabler-category-2 mr-2"></div>
            分类：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in arbProps.sorts"
            :class="{ 'mr-4': index !== arbProps.sorts.length - 1 }">
            <router-link :to="RouterPath.ArbeitenBySort(item.id, '1', true)">
              <HollowedBox hover>
                {{ item.text }}
              </HollowedBox>
            </router-link>
          </div>
        </div>
        <div class="f-c-s flex-wrap text-0.9rem" v-if="arbProps?.tags?.length">
          <div class="f-c-s mt-2 mr-2">
            <div class="i-tabler-bookmarks mr-2"></div>
            标签：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in arbProps.tags"
            :class="{ 'mr-4': index !== arbProps.tags.length - 1 }">
            <router-link :to="RouterPath.ArbeitenByMark(item.text)">
              <HollowedBox hover>
                {{ item.text }}
              </HollowedBox>
            </router-link>
          </div>
        </div>
      </div>
      <Markdown
        :style-css="BleuVars.config.styleCss?.arbeiten || 'f-c-c'"
        :str-html="arbeiten.content"
        v-model:real-html="realHtml"
        :fancy-group="'arbeiten'" />
      <Catalog :str-html="arbeiten.content" :real-html="realHtml" />
      <div class="bg-b3 text-0.9rem p-5 text-b mt-10">
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
            https://www.cnblogs.com/{{ BleuVars.getBlogApp() }}/#/p/{{ arbeitenId }}
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
      <div class="mt-4 text-0.9rem text-b">
        <div class="f-s-s mb-2" v-if="arbPrevNext?.prev?.href">
          <router-link class="hover" :to="RouterPath.Arbeiten(arbPrevNext.prev.href)">
            上一篇：{{ arbPrevNext.prev.text }}
          </router-link>
        </div>
        <div class="f-s-e" v-if="arbPrevNext?.next?.href">
          <router-link class="hover" :to="RouterPath.Arbeiten(arbPrevNext.next.href)">
            下一篇：{{ arbPrevNext.next.text }}
          </router-link>
        </div>
      </div>
      <div v-if="!isBlogOwner && isLogined" class="mt-10 f-c-e">
        <el-button type="primary" plain round size="small">
          <span v-if="arbeitenState.isFollowed" @click="ArbeitenApi.unfollow">- 取消关注</span>
          <span v-else @click="ArbeitenApi.follow">+ 关注博主</span>
        </el-button>
      </div>
      <div class="mt-20 f-c-c">
        <el-button text type="primary" bg @click="vote('Digg')" class="mr-5">
          <div class="i-tabler-thumb-up mr-1"></div>
          赞成{{ arbViewPoint.diggCount }}
        </el-button>
        <el-button text type="danger" bg @click="vote('Bury')" class="mr-5">
          <div class="i-tabler-thumb-down mr-1"></div>
          反对{{ arbViewPoint.buryCount }}
        </el-button>
        <el-button text type="success" bg @click="Native.saveArbeiten(arbeitenId)">
          <div class="i-tabler-heart mr-1"></div>
          收藏
        </el-button>
      </div>
      <div class="my-20 f-c-e text-0.9rem">
        分享：
        <div class="i-tabler-brand-wechat mr-2 hover" @click="Native.shareToWechat"></div>
      </div>
      <Comment :post-id="arbeitenId" />
    </div>
    <div class="content" v-else>
      <div class="fixed-lt w-100vw h-100vh f-c-c z-99999">
        <el-form>
          <el-form-item label="密码：">
            <el-input
              show-password
              type="password"
              v-model="arbPassword"
              placeholder="输入博文阅读密码" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
