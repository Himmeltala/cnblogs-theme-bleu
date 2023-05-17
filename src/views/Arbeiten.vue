<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
const works = shallowRef();
const worksProps = shallowRef();
const worksPrevNext = shallowRef();
const worksViewPoint = shallowRef();
const worksIsLocked = ref(false);
const worksPassword = ref("");
const markdownRef = ref();
const eleComments = ref();
let worksId = route.params.id as string;

async function fetchData(mouted?: boolean) {
  Broswer.startLoading();

  const [worksVal, worksPropsVal, worksPrevNextVal, worksViewPointVal] = await Promise.all([
    WorksApi.getWorks(worksId),
    WorksApi.getProps(worksId),
    WorksApi.getPrevNext(worksId),
    WorksApi.getViewPoint(worksId)
  ]);

  works.value = worksVal;
  worksProps.value = worksPropsVal;
  worksPrevNext.value = worksPrevNextVal;
  worksViewPoint.value = worksViewPointVal;
  worksIsLocked.value = worksVal.isLocked;

  Broswer.setTitle(works.value.text);
  mouted && Broswer.endLoading();
}

async function submit() {
  const passed = await WorksApi.isPassed(worksPassword.value, worksId);
  if (passed) {
    works.value = await WorksApi.getLockedWorks(worksPassword.value, worksId);
    worksIsLocked.value = false;
  }
  ElMessage({
    message: passed ? "密码正确！" : "密码错误！",
    grouping: true,
    type: passed ? "success" : "error"
  });
}

async function vote(type: VoteType) {
  const res = await WorksApi.vote({
    postId: parseInt(worksId),
    isAbandoned: false,
    voteType: type
  });
  if (res && res.isSuccess) {
    type == "Bury" ? worksViewPoint.value.buryCount++ : worksViewPoint.value.diggCount++;
  }
  ElMessage({ message: res.message, grouping: true, type: res.isSuccess ? "success" : "error" });
}

watch(route, async () => {
  if (route.name === RouterName.Arbeiten) {
    worksId = route.params.id as string;
    await fetchData(true);
    await eleComments.value.fetchData();
  }
});

onMounted(() => {
  const anchor = route.hash.match(/#.+/g);

  if (anchor) {
    setTimeout(() => {
      Broswer.scrollIntoView(`#${anchor[0].replace("#", "")}`);
    }, 500);
  }

  Broswer.endLoading();
});

await fetchData();
</script>

<template>
  <div id="l-works" class="page">
    <div class="content" v-if="!worksIsLocked">
      <div class="text-1.6rem font-bold text-ellipsis line-clamp-2 w-100%">{{ works.text }}</div>
      <div class="f-c-s lt-sm:flex-wrap mt-6 text-0.9rem">
        <!-- 发表日期 -->
        <div class="f-c-c mr-6">
          <div class="i-tabler-calendar-stats mr-2"></div>
          {{ works.date }}
        </div>
        <!-- 阅读次数 -->
        <div class="f-c-c mr-6">
          <div class="i-tabler-eye mr-2"></div>
          {{ works.view }}次阅读
        </div>
        <!-- 评论条数 -->
        <div class="f-c-c mr-6">
          <div class="i-tabler-message-2 mr-2"></div>
          {{ works.comm }}条评论
        </div>
        <div
          v-if="isBlogOwner"
          class="f-c-c hover"
          @click="
            Navigation.go({ path: 'https://i.cnblogs.com/EditPosts.aspx?postid=' + worksId })
          ">
          <div class="i-tabler-pencil-minus mr-2"></div>
          编辑
        </div>
      </div>
      <div class="mt-6 mb-15">
        <div class="mb-4 f-c-s flex-wrap" v-if="worksProps.sorts.length > 0">
          <div class="f-c-s mt-2 mr-2 text-1rem">
            <div class="i-tabler-category-2 mr-2"></div>
            分类：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in worksProps.sorts"
            :class="{ 'mr-4': index !== worksProps.sorts.length - 1 }">
            <HollowedBox
              line="dotted"
              hover
              round
              @click="
                Navigation.go({ path: RouterPath.ArbeitenBySort(item.href), router: $router })
              ">
              {{ item.text }}
            </HollowedBox>
          </div>
        </div>
        <div class="f-c-s flex-wrap" v-if="worksProps.tags.length > 0">
          <div class="f-c-s mt-2 mr-2 text-1rem">
            <div class="i-tabler-bookmarks mr-2"></div>
            标签：
          </div>
          <div
            class="mt-2"
            v-for="(item, index) in worksProps.tags"
            :class="{ 'mr-4': index !== worksProps.tags.length - 1 }">
            <HollowedBox
              line="dotted"
              hover
              round
              @click="
                Navigation.go({ path: RouterPath.ArbeitenByMark(item.text), router: $router })
              ">
              {{ item.text }}
            </HollowedBox>
          </div>
        </div>
      </div>
      <MarkdownContent :html-str="works.content" v-model:real-html="markdownRef" />
      <div class="text-b mt-15 f-c-e text-0.9rem">
        <div class="f-c-c mr-4">
          <div class="i-tabler-calendar-stats mr-2"></div>
          {{ works.date }}
        </div>
        <div class="f-c-c mr-4">
          <div class="i-tabler-eye mr-2"></div>
          {{ works.view }}次阅读
        </div>
        <div class="f-c-c">
          <div class="i-tabler-message-2 mr-2"></div>
          {{ works.comm }}条评论
        </div>
      </div>
      <div class="prev-next mt-15 text-0.9rem">
        <div class="hover f-c-s mb-2" v-if="worksPrevNext.prev.href">
          <div class="i-tabler-arrow-autofit-up mr-1"></div>
          <a class="hover text-color-a" :href="worksPrevNext.prev.href">
            上一篇：{{ worksPrevNext.prev.text }}
          </a>
        </div>
        <div class="hover f-c-s" v-if="worksPrevNext.next.href">
          <div class="i-tabler-arrow-autofit-down mr-1"></div>
          <a class="hover text-color-a" :href="worksPrevNext.next.href">
            下一篇：{{ worksPrevNext.next.text }}
          </a>
        </div>
      </div>
      <div class="my-10 f-c-e">
        <div class="mr-5">
          <el-button plain @click="vote('Digg')">
            点赞 {{ worksViewPoint.diggCount }}
            <template #icon>
              <div class="i-tabler-thumb-up"></div>
            </template>
          </el-button>
        </div>
        <div>
          <el-button plain @click="vote('Bury')">
            反对 {{ worksViewPoint.buryCount }}
            <template #icon>
              <div class="i-tabler-thumb-down"></div>
            </template>
          </el-button>
        </div>
      </div>
      <Katalog :real-html="markdownRef" />
      <ImgAmplifier :real-html="markdownRef" />
      <Comment :post-id="worksId" ref="eleComments" />
    </div>
    <div class="content" v-else>
      <div class="modal fixed-lt w-100vw h-100vh l-back-bg f-c-c z-999999">
        <el-form>
          <el-form-item label="密码：">
            <el-input
              show-password
              type="password"
              v-model="worksPassword"
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
