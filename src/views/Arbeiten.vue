<script setup lang="ts">
import { ArbeitenApi } from "@/apis";

const route = useRoute();
const id = ref(route.params.id as string);

const ArbeData = shallowRef<BleuArbeiten>();
const propsData = shallowRef<BleuArbeitenProps>();
const prevNextData = shallowRef<BleuArbeitenPrevNext>();
const viewPointData = shallowRef<BlogArbeitenViewPoint>();
const stateData = ref<BleuArbeitenState>();
const isLocked = ref(false);

const loading = new Broswer.Loading();

async function fetchData(isInMounted?: boolean) {
  loading.startLoading();

  const [val1, val2, val3, val4, val5] = await Promise.all([
    ArbeitenApi.getArbeiten(id.value),
    ArbeitenApi.getProps(id.value),
    ArbeitenApi.getPrevNext(id.value),
    ArbeitenApi.getViewPoint(id.value),
    ArbeitenApi.getArbeitenState(id.value)
  ]);

  ArbeData.value = val1;
  propsData.value = val2;
  prevNextData.value = val3;
  viewPointData.value = val4;
  stateData.value = val5;
  isLocked.value = val1.isLocked;

  Broswer.setTitle(ArbeData.value.text);
  !isInMounted && loading.endLoading();
}

const password = ref("");

async function submit() {
  const isPassed = await ArbeitenApi.isPassed(password.value, id.value);
  if (isPassed) {
    ArbeData.value = await ArbeitenApi.getLockedArbeiten(password.value, id.value);
    isLocked.value = false;
  }
}

async function vote(type: VoteType) {
  const response = await ArbeitenApi.vote({
    postId: parseInt(id.value),
    isAbandoned: false,
    voteType: type
  });
  if (response?.isSuccess) {
    type == "Bury" ? viewPointData.value.buryCount++ : viewPointData.value.diggCount++;
  }
}

watch(route, async () => {
  if (route.name === RouterName.Arbeiten) {
    id.value = route.params.id as string;
    await fetchData(false);
  }
});

onMounted(() => {
  loading.endLoading();
});

await fetchData(true);
</script>

<template>
  <div id="l-arbeiten" class="page">
    <div class="content mt-4" v-if="!isLocked">
      <div class="text-1.4rem w-100% font-bold">{{ ArbeData.text }}</div>
      <div class="f-c-s lt-sm:flex-wrap mt-4 text-0.9rem text-b">
        <div class="f-c-c mr-4">
          <div class="i-tabler-calendar-stats mr-2"></div>
          {{ ArbeData.date }}
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-eye mr-2"></div>
          {{ ArbeData.view }}次阅读
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-message-2 mr-2"></div>
          {{ ArbeData.comm }}条评论
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-language mr-2"></div>
          {{ ArbeData.wordCount }}字
        </div>
        <div
          v-if="isBlogOwner"
          class="f-c-c hover"
          @click="Navigation.go('https://i.cnblogs.com/EditPosts.aspx?postid=' + id)">
          <div class="i-tabler-pencil-minus mr-2"></div>
          编辑
        </div>
      </div>
      <div class="mt-4 mb-10">
        <div class="mb-2 f-c-s flex-wrap text-0.9rem" v-if="propsData?.sorts?.length">
          <div class="f-c-s mt-2 mr-2">
            <div class="i-tabler-category-2 mr-2"></div>
            分类：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in propsData.sorts"
            :class="{ 'mr-4': index !== propsData.sorts.length - 1 }">
            <router-link :to="RouterPath.ArbeitenBySort(item.id, '1', true)">
              <HollowedBox hover>
                {{ item.text }}
              </HollowedBox>
            </router-link>
          </div>
        </div>
        <div class="f-c-s flex-wrap text-0.9rem" v-if="propsData?.tags?.length">
          <div class="f-c-s mt-2 mr-2">
            <div class="i-tabler-bookmarks mr-2"></div>
            标签：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in propsData.tags"
            :class="{ 'mr-4': index !== propsData.tags.length - 1 }">
            <router-link :to="RouterPath.ArbeitenByMark(item.text)">
              <HollowedBox hover>
                {{ item.text }}
              </HollowedBox>
            </router-link>
          </div>
        </div>
      </div>
      <Markdown
        enable-catalog
        :unocss-img="BleuVars.config.unocss.ab.img || 'f-c-c'"
        :unocss-text="BleuVars.config.unocss.ab.text || 'text-1rem'"
        :fancy-group="'arbeiten'"
        :textual="ArbeData.content" />
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
            https://www.cnblogs.com/{{ BleuVars.getBlogApp() }}/#/p/{{ id }}
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
      <div class="mt-4 text-0.9rem">
        <div class="f-s-s mb-2" v-if="prevNextData?.prev?.href">
          <router-link class="hover" :to="RouterPath.Arbeiten(prevNextData.prev.href)">
            上一篇：{{ prevNextData.prev.text }}
          </router-link>
        </div>
        <div class="f-s-e" v-if="prevNextData?.next?.href">
          <router-link class="hover" :to="RouterPath.Arbeiten(prevNextData.next.href)">
            下一篇：{{ prevNextData.next.text }}
          </router-link>
        </div>
      </div>
      <div v-if="!isBlogOwner && isLogined" class="mt-10 f-c-e">
        <el-button type="primary" plain round size="small">
          <span v-if="stateData.isFollowed" @click="ArbeitenApi.unfollow">- 取消关注</span>
          <span v-else @click="ArbeitenApi.follow">+ 关注博主</span>
        </el-button>
      </div>
      <div class="mt-20 f-c-c">
        <el-button text type="primary" bg @click="vote('Digg')" class="mr-5">
          <div class="i-tabler-thumb-up mr-1"></div>
          赞成{{ viewPointData.diggCount }}
        </el-button>
        <el-button text type="danger" bg @click="vote('Bury')" class="mr-5">
          <div class="i-tabler-thumb-down mr-1"></div>
          反对{{ viewPointData.buryCount }}
        </el-button>
        <el-button text type="success" bg @click="Native.saveArbeiten(id)">
          <div class="i-tabler-heart mr-1"></div>
          收藏
        </el-button>
      </div>
      <div class="my-20 f-c-e text-0.9rem">
        分享：
        <div class="i-tabler-brand-wechat mr-2 hover" @click="Native.shareToWechat"></div>
      </div>
      <Comment :post-id="id" />
    </div>
    <div class="content" v-else>
      <div class="fixed-lt w-100vw h-100vh f-c-c z-99999">
        <el-form>
          <el-form-item label="密码：">
            <el-input
              show-password
              type="password"
              v-model="password"
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
