<script setup lang="ts">
import { WorksApi } from "@/apis";

const route = useRoute();
const works = shallowRef();
const worksProps = shallowRef();
const worksPrevNext = shallowRef();
const worksViewPoint = shallowRef();
const worksIsLocked = ref(false);
const worksPassword = ref("");
const coverFilter = EcyConfig.__ECY_CONFIG__.covers.filter.works;
const coverMatte = EcyConfig.__ECY_CONFIG__.covers.matte.works;
const codeFontFamily = EcyConfig.__ECY_CONFIG__.font.code || `var(--el-font-family)`;
const worksCovers = EcyConfig.__ECY_CONFIG__.covers.works;
const eleComments = ref();
let worksId = route.params.id as string;

const getWorksCover = computed(() => {
  return worksCovers[Math.floor(Math.random() * worksCovers.length)];
});

async function fetchData(mouted?: boolean) {
  EcyUtils.startLoading();

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

  EcyUtils.setTitle(works.value.text);
  mouted && EcyUtils.endLoading();
}

async function submit() {
  const passed = await WorksApi.isPassed(worksPassword.value, worksId);
  if (passed) {
    works.value = await WorksApi.getLockedWorks(worksPassword.value, worksId);
    worksIsLocked.value = false;
  }
  ElMessage({ message: passed ? "密码正确！" : "密码错误！", grouping: true, type: passed ? "success" : "error" });
}

async function vote(type: BlogType.VoteType) {
  const res = await WorksApi.vote({ postId: parseInt(worksId), isAbandoned: false, voteType: type });
  if (res && res.isSuccess) {
    type == "Bury" ? worksViewPoint.value.buryCount++ : worksViewPoint.value.diggCount++;
  }
  ElMessage({ message: res.message, grouping: true, type: res.isSuccess ? "success" : "error" });
}

watch(route, async () => {
  if (route.name === RouterName.WORKS) {
    worksId = route.params.id as string;
    await fetchData(true);
    await eleComments.value.fetchData();
  }
});

onMounted(() => {
  const anchor = route.hash.match(/#.+/g);

  if (anchor) {
    setTimeout(() => {
      EcyUtils.scrollIntoView(`#${anchor[0].replace("#", "")}`);
    }, 500);
  }

  EcyUtils.endLoading();
});

await fetchData();
</script>

<template>
  <div v-show="!worksIsLocked" class="reception works-head-panel relative h-50vh w-100vw">
    <div class="cover z-999 absolute left-0 top-0 h-100% w-100%">
      <img class="h-100% w-100% rd-0" :src="getWorksCover" />
    </div>
    <div class="content z-999 absolute left-0 top-10vh w-100%">
      <div>
        <div class="l-size-13 text-ellipsis line-clamp-2 w-100%">{{ works.text }}</div>
        <div class="f-c-s mt-6 l-size-2">
          <div class="f-c-c mr-4">
            <i-ep-clock class="mr-1" />
            <span>{{ works.date }}</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-view class="mr-1" />
            <span>{{ works.view }}次阅读</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-chat-line-square class="mr-1" />
            <span>{{ works.comm }}条评论</span>
          </div>
          <div
            v-if="EcyConfig.isOwner"
            class="f-c-c hover"
            @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/EditPosts.aspx?postid=' + worksId })">
            <i-ep-edit-pen class="mr-1" />
            <span>编辑</span>
          </div>
        </div>
        <div class="mt-6">
          <div class="mb-4 flex-wrap l-size-2 f-c-s" v-if="worksProps.sorts.length > 0">
            <div class="f-c-c">
              <i-ep-folder-opened class="mr-1" />
              <span>分类：</span>
            </div>
            <div v-for="(item, index) in worksProps.sorts" :class="{ 'mr-2': index !== worksProps.sorts.length - 1 }">
              <HollowedBox
                line="dotted"
                hover
                round
                @click="EcyUtils.Router.go({ path: RouterPath.WORKS_BY_SORT(item.href), router: $router })">
                {{ item.text }}
              </HollowedBox>
            </div>
          </div>
          <div class="f-c-s flex-wrap l-size-2" v-if="worksProps.tags.length > 0">
            <div class="f-c-c">
              <i-ep-price-tag class="mr-1" />
              <span>标签：</span>
            </div>
            <div v-for="(item, index) in worksProps.tags" :class="{ 'mr-2': index !== worksProps.tags.length - 1 }">
              <HollowedBox
                line="dotted"
                hover
                round
                @click="EcyUtils.Router.go({ path: RouterPath.WORKS_BY_MARK(item.text), router: $router })">
                {{ item.text }}
              </HollowedBox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="z-999 absolute bottom-0 left-0 h-75px w-100% flow-hidden">
      <div class="wave-1 absolute h-100% w-200%"></div>
      <div class="wave-2 absolute h-100% w-200%"></div>
    </div>
  </div>
  <div id="l-works" class="page">
    <div class="content">
      <div v-show="!worksIsLocked">
        <div class="l-size-4" v-html="works.content" v-hljs="works.text" v-highslide="works.text" v-mathjax="works.text" v-catalog></div>
        <Highslide />
        <Catalog />
        <div class="divider flex-col"></div>
        <div class="l-color-2 f-c-e l-size-2">
          <div class="f-c-c mr-4">
            <i-ep-clock class="mr-1" />
            <span>{{ works.date }}</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-view class="mr-1" />
            <span>{{ works.view }}次阅读</span>
          </div>
          <div class="f-c-c">
            <i-ep-chat-line-square class="mr-1" />
            <span>{{ works.comm }}条评论</span>
          </div>
        </div>
        <div class="prev-next mt-10 l-size-2">
          <div class="hover f-c-s mb-2" v-if="worksPrevNext.prev.href">
            <i-ep-d-arrow-left />
            <a class="hover l-color-1" :href="worksPrevNext.prev.href"> 上一篇：{{ worksPrevNext.prev.text }} </a>
          </div>
          <div class="hover f-c-s" v-if="worksPrevNext.next.href">
            <i-ep-d-arrow-right />
            <a class="hover l-color-1" :href="worksPrevNext.next.href"> 下一篇：{{ worksPrevNext.next.text }} </a>
          </div>
        </div>
        <div class="viewpoint my-10 f-c-e">
          <div class="mr-5">
            <el-button plain @click="vote('Digg')">
              点赞 {{ worksViewPoint.diggCount }}
              <template #icon>
                <i-ep-caret-top />
              </template>
            </el-button>
          </div>
          <div>
            <el-button plain @click="vote('Bury')">
              反对 {{ worksViewPoint.buryCount }}
              <template #icon>
                <i-ep-caret-bottom />
              </template>
            </el-button>
          </div>
        </div>
        <Comment :post-id="worksId" ref="eleComments" />
      </div>
      <div v-if="worksIsLocked">
        <div class="modal fixed w-100vw h-100vh top-0 left-0 l-back-bg f-c-c z-999999">
          <el-form>
            <el-form-item label="密码：">
              <el-input show-password type="password" v-model="worksPassword" placeholder="输入博文阅读密码" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="submit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
code {
  margin: 0;
  --uno: rd-2 l-size-3;
  letter-spacing: 1.3px;
  color: var(--el-color-danger);
  font-family: v-bind(codeFontFamily);

  span {
    line-height: 1.7;
    font-family: v-bind(codeFontFamily);
  }
}

pre {
  --uno: rd-2;
  position: relative;

  code {
    background: var(--l-block-code-bg);
  }

  .code-tools {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
  }

  .modal {
    width: 100%;
    height: 3rem;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, var(--l-code-modal-bg) 100%);
  }
}

a > code {
  color: var(--l-theme-color) !important;
}

#l-works {
  .content {
    z-index: 9;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 400 !important;
    }

    h1 {
      font-size: 1.5rem !important;
    }

    h2 {
      font-size: 1.4rem !important;
    }

    h3 {
      font-size: 1.3rem !important;
    }

    h4 {
      font-size: 1.2rem !important;
    }

    h5 {
      font-size: 1.1rem !important;
    }

    h6 {
      font-size: 1rem !important;
    }

    blockquote {
      background-color: var(--l-blockquote-bg);
      color: var(--l-color-2);
      margin: 0;
      border: {
        left: {
          width: 0.3rem;
          color: var(--l-theme-color);
          style: solid;
        }
      }
      padding: {
        top: 0.8rem;
        bottom: 0.8rem;
      }

      p {
        margin: 0 !important;
        padding-left: 1rem;
      }
    }

    u {
      text-decoration: none;
      padding-bottom: 1px;
      border-bottom: 1px dotted var(--l-color-1);
    }

    a {
      color: var(--l-theme-color);
    }

    p {
      margin-top: 1.4rem;
      margin-bottom: 1.4rem;
      line-height: 1.9;
    }

    img {
      cursor: zoom-in;
    }

    ol,
    ul {
      padding-left: 3rem;

      li {
        margin-bottom: 1.4rem;
        position: relative;
        line-height: 1.7;
        list-style-type: none;
        counter-increment: step-counter;

        &::before {
          content: counter(step-counter);
          border-radius: 50%;
          height: 2rem;
          width: 2rem;
          position: absolute;
          top: 0;
          left: -2.5rem;
          --uno: f-c-c;
          font-weight: 400;
          color: var(--l-color-1);
          background: var(--l-step-bg);
        }
      }

      li:last-child {
        margin-bottom: 0;
      }
    }

    table {
      th {
        font-weight: 600;
      }

      th,
      td {
        padding: 0.7rem 1.5rem;
        border: 1px dotted #464646;
        border-radius: 0.5rem;
      }
    }

    strong {
      font-weight: 600;
    }
  }
}
</style>

<style scoped lang="scss">
.reception {
  .cover::before {
    backdrop-filter: blur(v-bind(coverFilter));
    z-index: 1;
  }

  .cover::after {
    background-color: black;
    opacity: v-bind(coverMatte);
  }
}
</style>
