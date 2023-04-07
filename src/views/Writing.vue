<script setup lang="ts">
import {
  getLockedWriting,
  getIsUnlock,
  getWriting,
  getWritingProps,
  getWritingPrevNext,
  getWritingViewPoint,
  voteWriting
} from "@/apis/remote-api";

EcyUtils.startLoading();

const route = useRoute();
const router = useRouter();
const setting = EcyUtils.getSetting();
let postId = `${route.params.id}`;
const writing = shallowRef(await getWriting(postId));
const prevNext = shallowRef(await getWritingPrevNext(postId));
const writingProps = shallowRef(await getWritingProps(postId));
const viewPoint = shallowRef(await getWritingViewPoint(postId));
const isLock = ref(false);
const pwd = ref("");

if (!(writing.value.content && writing.value.text)) isLock.value = true;
document.querySelector("title").innerText = `${writing.value.text} - ${EcyConfig.blogApp} - 博客园`;

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
  const data = await getIsUnlock(pwd.value, postId + "");
  if (data) {
    writing.value = await getLockedWriting(pwd.value, postId);
    isLock.value = false;
  }
  ElMessage({ message: data ? "密码输入正确！" : "密码错误！", grouping: true, type: data ? "success" : "error" });
}

async function vote(voteType: BlogType.VoteType) {
  const data = await voteWriting({ postId: postId, isAbandoned: false, voteType });
  if (data) {
    if (data.isSuccess)
      if (voteType == "Bury") viewPoint.value.buryCount = viewPoint.value.buryCount + 1;
      else viewPoint.value.diggCount = viewPoint.value.diggCount + 1;
    ElMessage({ message: data.message, grouping: true, type: data.isSuccess ? "success" : "error" });
  }
}

watch(route, async () => {
  if (route.name === "Writing") {
    EcyUtils.startLoading();

    postId = `${route.params.id}`;
    writing.value = await getWriting(postId);
    writingProps.value = await getWritingProps(postId);
    prevNext.value = await getWritingPrevNext(postId);
    viewPoint.value = await getWritingViewPoint(postId);
    isLock.value = false;

    if (!(writing.value.content && writing.value.text)) isLock.value = true;
    document.querySelector("title").innerText = `${writing.value.text} - ${EcyConfig.blogApp} - 博客园`;
    EcyUtils.endLoading();
  }
});
</script>

<template>
  <ContextMenu id="l-writing" class="min-height">
    <Card :padding="setting.pages.writing.padding" :margin="setting.pages.writing.margin">
      <template v-if="!isLock">
        <el-page-header :icon="null" @back="EcyUtils.Router.go({ path: 'back', router })">
          <template #title>
            <div class="f-c-c">
              <i-ep-back />
            </div>
          </template>
          <template #content>
            <div class="l-pri-size">{{ writing.text }}</div>
          </template>
        </el-page-header>
        <div class="l-writing__tdesc l-sec-color f-c-s mt-4 l-fiv-size">
          <div class="f-c-c mr-4">
            <i-ep-clock class="mr-1" />
            <span>{{ writing.date }}</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-view class="mr-1" />
            <span>{{ writing.view }}次阅读</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-chat-line-square class="mr-1" />
            <span>{{ writing.comm }}条评论</span>
          </div>
          <div
            v-if="EcyConfig.isOwner"
            class="f-c-c hover"
            @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/EditPosts.aspx?postid=' + postId })">
            <i-ep-edit-pen class="mr-1" />
            <span>编辑</span>
          </div>
        </div>
        <div class="l-writing__props l-sec-color mt-4">
          <div class="mb-4 flex-wrap f-c-s" v-if="writingProps.sorts.length > 0">
            <div class="f-c-c l-fiv-size">
              <i-ep-folder-opened class="mr-1" />
              <span>分类：</span>
            </div>
            <div
              v-for="(item, index) in writingProps.sorts"
              class="l-fiv-size"
              :class="{ 'mr-2': index !== writingProps.sorts.length - 1 }">
              <LTag line="dotted" hover round @click="EcyUtils.Router.go({ path: '/sort/p/' + item.href, router })">
                {{ item.text }}
              </LTag>
            </div>
          </div>
          <div class="f-c-s flex-wrap" v-if="writingProps.tags.length > 0">
            <div class="f-c-c l-fiv-size">
              <i-ep-price-tag class="mr-1" />
              <span>标签：</span>
            </div>
            <div v-for="(item, index) in writingProps.tags" class="l-fiv-size" :class="{ 'mr-2': index !== writingProps.tags.length - 1 }">
              <LTag line="dotted" hover round @click="EcyUtils.Router.go({ path: '/mark/' + item.text, router })">
                {{ item.text }}
              </LTag>
            </div>
          </div>
        </div>
        <div class="l-writing__content mt-8 l-thr-size" v-html="writing.content" v-hljs v-catalog v-mathjax></div>
        <Highslide />
        <Catalog />
        <div class="divider flex-col"></div>
        <div class="l-writing__bdesc l-sec-color f-c-e l-fiv-size">
          <div class="f-c-c mr-4">
            <i-ep-clock class="mr-1" />
            <span>{{ writing.date }}</span>
          </div>
          <div class="f-c-c mr-4">
            <i-ep-view class="mr-1" />
            <span>{{ writing.view }}次阅读</span>
          </div>
          <div class="f-c-c">
            <i-ep-chat-line-square class="mr-1" />
            <span>{{ writing.comm }}条评论</span>
          </div>
        </div>
        <div class="l-writing__prev-next mt-10 l-fiv-size">
          <div class="prev hover f-c-s mb-2" v-if="prevNext.prev.href">
            <i-ep-d-arrow-left />
            <a class="hover l-pri-color" :href="prevNext.prev.href"> 上一篇：{{ prevNext.prev.text }} </a>
          </div>
          <div class="next hover f-c-s" v-if="prevNext.next.href">
            <i-ep-d-arrow-right />
            <a class="hover l-pri-color" :href="prevNext.next.href"> 下一篇：{{ prevNext.next.text }} </a>
          </div>
        </div>
        <div class="l-writing__viewpoint my-10 f-c-e">
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
        <Comment :post-id="postId" />
      </template>
      <template v-else>
        <div class="modal fixed w-100vw h-100vh top-0 left-0 l-box-bg f-c-c z-9999">
          <el-form>
            <el-form-item label="密码：">
              <el-input show-password type="password" v-model="pwd" placeholder="输入博文阅读密码" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="submit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </Card>
    <template #title>盒子模型设置</template>
    <template #content>
      <CodeStyleSetting />
      <BoxSetting :padding="setting.pages.writing.padding" :margin="setting.pages.writing.margin" />
    </template>
  </ContextMenu>
</template>

<style lang="scss">
code {
  --uno: rd-2;
  background: var(--l-code-bg);
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
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, var(--l-code-hidden) 100%);
  }
}

#l-writing {
  .l-writing__content {
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
      padding: {
        left: 0.5rem;
        top: 0.1rem;
        bottom: 0.1rem;
      }
      border: {
        radius: 0.25rem;
        left: {
          width: 0.3rem;
          color: var(--l-theme-color);
          style: solid;
        }
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
      margin: 0.7rem 0 !important;
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
        border: 1px dotted var(--l-divider-bg);
        border-radius: 0.5rem;
      }
    }

    strong {
      font-weight: 600;
    }
  }
}
</style>
