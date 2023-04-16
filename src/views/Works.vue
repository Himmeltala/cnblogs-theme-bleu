<script setup lang="ts">
import { WorksApi } from "@/apis";

EcyUtils.startLoading();

const route = useRoute();
const works = shallowRef();
const props = shallowRef();
const prevNext = shallowRef();
const viewPoint = shallowRef();
const isLocked = ref();
const password = ref("");
const worksImgs = EcyConfig.__ECY_CONFIG__.covers.works || ["https://img.tt98.com/d/file/tt98/201909171800581/001.jpg"];
let worksId = route.params.id as string;

async function fetchData() {
  works.value = await WorksApi.getWorks(worksId);
  props.value = await WorksApi.getProps(worksId);
  prevNext.value = await WorksApi.getPrevNext(worksId);
  viewPoint.value = await WorksApi.getViewPoint(worksId);

  isLocked.value = works.value.isLocked;
  EcyUtils.setTitle(works.value.text);
}

await fetchData();

onMounted(() => {
  const anchor = route.hash.match(/#.+/g);
  if (anchor) {
    setTimeout(() => {
      document.querySelector(`#${anchor[0].replace("#", "")}`).scrollIntoView();
    }, 500);
  }

  EcyUtils.endLoading();
});

async function submit() {
  const passed = await WorksApi.isPassed(password.value, worksId);
  if (passed) {
    works.value = await WorksApi.getLockedWorks(password.value, worksId);
    isLocked.value = false;
  }
  ElMessage({ message: passed ? "密码输入正确！" : "密码错误！", grouping: true, type: passed ? "success" : "error" });
}

async function vote(type: BlogType.VoteType) {
  const res = await WorksApi.vote({ postId: worksId, isAbandoned: false, voteType: type });
  if (res) {
    if (res.isSuccess)
      if (type == "Bury") viewPoint.value.buryCount = viewPoint.value.buryCount + 1;
      else viewPoint.value.diggCount = viewPoint.value.diggCount + 1;
    ElMessage({ message: res.message, grouping: true, type: res.isSuccess ? "success" : "error" });
  }
}

watch(route, async () => {
  if (route.name === RouterName.Works) {
    EcyUtils.startLoading();
    worksId = route.params.id as string;
    await fetchData();
    EcyUtils.setTitle(works.value.text);
    EcyUtils.endLoading();
  }
});
</script>

<template>
  <div v-if="!isLocked" class="welcome relative h-50vh w-100vw">
    <div class="cover z-999 absolute left-0 top-0 h-100% w-100%">
      <img class="h-100% w-100% rd-0" :src="worksImgs[Math.floor(Math.random() * worksImgs.length)]" />
    </div>
    <div class="z-999 f-c-c absolute left-0 top-10vh w-100%">
      <div class="w-55vw">
        <div class="size-2rem text-ellipsis line-clamp-2 w-100%">{{ works.text }}</div>
        <div class="f-c-s mt-6 l-fiv-size">
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
          <div class="mb-4 flex-wrap l-fiv-size f-c-s" v-if="props.sorts.length > 0">
            <div class="f-c-c">
              <i-ep-folder-opened class="mr-1" />
              <span>分类：</span>
            </div>
            <div v-for="(item, index) in props.sorts" :class="{ 'mr-2': index !== props.sorts.length - 1 }">
              <LTag
                line="dotted"
                hover
                round
                @click="EcyUtils.Router.go({ path: RouterPath.worksBySort('p', item.href), router: $router })">
                {{ item.text }}
              </LTag>
            </div>
          </div>
          <div class="f-c-s flex-wrap l-fiv-size" v-if="props.tags.length > 0">
            <div class="f-c-c">
              <i-ep-price-tag class="mr-1" />
              <span>标签：</span>
            </div>
            <div v-for="(item, index) in props.tags" :class="{ 'mr-2': index !== props.tags.length - 1 }">
              <LTag line="dotted" hover round @click="EcyUtils.Router.go({ path: RouterPath.worksByMark(item.text), router: $router })">
                {{ item.text }}
              </LTag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="z-999 absolute bottom-0 left-0 h-75px w-100% ofw-hidden">
      <div class="wave-1 absolute h-100% w-200%"></div>
      <div class="wave-2 absolute h-100% w-200%"></div>
    </div>
  </div>
  <div id="l-works" class="page">
    <div class="content">
      <div v-show="!isLocked">
        <div class="l-thr-size" v-html="works.content" v-hljs v-highslide v-catalog v-mathjax></div>
        <Highslide />
        <Catalog v-if="EcyConfig.pcDevice" />
        <div class="divider flex-col"></div>
        <div class="l-sec-color f-c-e l-fiv-size">
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
        <div class="prev-next mt-10 l-fiv-size">
          <div class="hover f-c-s mb-2" v-if="prevNext.prev.href">
            <i-ep-d-arrow-left />
            <a class="hover l-pri-color" :href="prevNext.prev.href"> 上一篇：{{ prevNext.prev.text }} </a>
          </div>
          <div class="hover f-c-s" v-if="prevNext.next.href">
            <i-ep-d-arrow-right />
            <a class="hover l-pri-color" :href="prevNext.next.href"> 下一篇：{{ prevNext.next.text }} </a>
          </div>
        </div>
        <div class="viewpoint my-10 f-c-e">
          <div class="mr-5">
            <el-button plain @click="vote('Digg')">
              点赞 {{ viewPoint.diggCount }}
              <template #icon>
                <i-ep-caret-top />
              </template>
            </el-button>
          </div>
          <div>
            <el-button plain @click="vote('Bury')">
              反对 {{ viewPoint.buryCount }}
              <template #icon>
                <i-ep-caret-bottom />
              </template>
            </el-button>
          </div>
        </div>
        <Comment :post-id="worksId" />
      </div>
      <div v-if="isLocked">
        <div class="modal fixed w-100vw h-100vh top-0 left-0 l-box-bg f-c-c z-999999">
          <el-form>
            <el-form-item label="密码：">
              <el-input show-password type="password" v-model="password" placeholder="输入博文阅读密码" />
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
  --uno: rd-2;
  background: #22222299;
  color: var(--el-color-danger-light-3);
  padding: 0.15rem 0.4rem;
  margin: 0;
}

a > code {
  color: var(--l-theme-color) !important;
}

pre {
  --uno: rd-2;
  position: relative;

  .code-block {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
  }

  .hight-code-modal {
    width: 100%;
    height: 3rem;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, var(--l-code-hidden-bg) 100%);
  }
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
      background-color: var(--l-code-bg);
      color: var(--l-sec-color);
      margin: 0;
      border: {
        radius: 0.25rem;
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
        padding-left: 0.5rem;
      }
    }

    u {
      text-decoration: none;
      padding-bottom: 1px;
      border-bottom: 1px dotted var(--l-pri-color);
    }

    a {
      color: var(--l-theme-color);
    }

    p {
      line-height: 1.7;
    }

    img {
      cursor: zoom-in;
    }

    ol,
    ul {
      li {
        line-height: 1.7;
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
.welcome {
  .cover::after {
    backdrop-filter: blur(10px);
  }
}
</style>
