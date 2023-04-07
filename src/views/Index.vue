<script setup lang="ts">
import { useBaseAuthorData } from "@/store";

EcyUtils.startLoading();

const store = useBaseAuthorData();
const authorData = shallowRef();
const masterData = shallowRef();

store.$onAction(({ args }) => {
  authorData.value = args[0].author;
  masterData.value = args[0].master;
});

const router = useRouter();

onMounted(() => {
  EcyUtils.endLoading();
});
</script>

<template>
  <Card class="l-index min-height l-fiv-size">
    <div class="l-index__content">
      <div class="mb-6 f-s-c">
        <div class="w-40%">
          <div class="mb-6">
            <div class="font-bold mb-2 title">{{ EcyConfig.blogApp }} 的博客</div>
            <div :class="{ 'f-c-s': EcyConfig.pcDevice }">
              <img
                :class="{ 'mr-10': EcyConfig.pcDevice, 'mb-4': !EcyConfig.pcDevice }"
                class="w-25 h-25 rd-50"
                :src="EcyConfig.__ECY_CONFIG__.cabinet.avatar" />
              <div>
                <template v-if="authorData">
                  <div class="mb-1 hover">圆龄：{{ authorData[1]?.text || "" }}</div>
                  <div class="mb-1 hover">粉丝：{{ authorData[2]?.text || "" }}</div>
                  <div class="mb-1 hover">关注：{{ authorData[3]?.text || "" }}</div>
                </template>
                <template v-if="masterData">
                  <div class="mb-1 hover">随笔：{{ masterData[0]?.digg || "" }}</div>
                  <div class="mb-1 hover">阅读：{{ masterData[3]?.digg || "" }}</div>
                </template>
              </div>
            </div>
          </div>
          <div>
            <div class="mb-2 font-bold title">个人签名</div>
            <div class="hover" v-html="EcyConfig.__ECY_CONFIG__.cabinet.signature"></div>
          </div>
        </div>
        <div class="w-60% mb-6">
          <div class="mb-2 font-bold title">个人简介</div>
          <div v-html="EcyConfig.__ECY_CONFIG__.nameplate.intro"></div>
        </div>
      </div>
      <div class="mb-6">
        <div class="mb-4 font-bold title">个人标签</div>
        <div class="hobbies f-c-s flex-wrap">
          <LTag class="mr-2 mb-4" hover round v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.tags">{{ item }}</LTag>
        </div>
      </div>
      <div v-if="EcyConfig.pcDevice" class="f-s-b mb-6">
        <div class="w-50%">
          <div class="mb-6">
            <div class="mb-2 font-bold title">联系方式</div>
            <div class="f-s-s">
              <div class="mr-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.connection">
                <el-tooltip :content="item.name + ': ' + item.text">
                  <svg v-if="item.svg" class="w-6 h-6 hover" viewBox="0 0 1024 1024" v-html="item.svg"></svg>
                  <img v-else class="rd-50 w-6 h-6 hover" alt="FAILED" :src="item.img" />
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="mb-6">
            <div class="mb-2 font-bold title">闲言碎语</div>
            <div v-html="EcyConfig.__ECY_CONFIG__.nameplate.gossip"></div>
          </div>
          <div class="mb-6" v-if="!EcyConfig.__ECY_CONFIG__.nameplate.photo.disabled">
            <div class="mb-4 font-bold title">精选图片</div>
            <div class="f-c-b flex-wrap">
              <div v-for="(item, i) in EcyConfig.__ECY_CONFIG__.nameplate.photo.src" :class="{ ' h-28': i < 3 }" style="width: 32%">
                <el-image
                  v-if="i < 3"
                  class="w-100% h-100%"
                  :initial-index="i"
                  :src="item"
                  :preview-src-list="EcyConfig.__ECY_CONFIG__.nameplate.photo.src" />
              </div>
            </div>
          </div>
          <div class="f-s-b" v-else>
            <div class="mb-6 w-50%">
              <div class="mb-4 font-bold title">项目经历</div>
              <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.experience">
                <div class="mb-1">{{ item.date }}</div>
                <div>
                  {{ item.text }}
                </div>
              </div>
            </div>
            <div class="mb-6 w-50%">
              <div class="mb-4 font-bold title">精选仓库</div>
              <div>
                <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.warehouse">
                  <a :href="item.url" target="__blank">{{ item.text }}</a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!EcyConfig.__ECY_CONFIG__.nameplate.photo.disabled">
            <el-button type="primary" @click="EcyUtils.Router.go({ router, path: '/home' })">Get Started</el-button>
            <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts/edit' })">新建随笔</el-button>
            <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts' })">管理博客</el-button>
          </div>
        </div>
        <div class="w-48%">
          <div class="mb-6">
            <div class="font-bold title">我的技能</div>
            <SkillGraph />
          </div>
          <div class="f-s-b" v-if="!EcyConfig.__ECY_CONFIG__.nameplate.photo.disabled">
            <div class="mb-6 w-50%">
              <div class="mb-4 font-bold title">项目经历</div>
              <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.experience">
                <div class="mb-1">{{ item.date }}</div>
                <div>
                  {{ item.text }}
                </div>
              </div>
            </div>
            <div class="mb-6 w-50%">
              <div class="mb-4 font-bold title">精选仓库</div>
              <div>
                <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.warehouse">
                  <a :href="item.url" target="__blank">{{ item.text }}</a>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <el-button type="primary" @click="EcyUtils.Router.go({ router, path: '/home' })">Get Started</el-button>
            <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts/edit' })">新建随笔</el-button>
            <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts' })">管理博客</el-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="mb-6">
          <div class="mb-2 font-bold title">联系方式</div>
          <div class="f-s-s">
            <div class="mr-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.connection">
              <el-tooltip :content="item.name + ': ' + item.text">
                <svg v-if="item.svg" class="w-6 h-6" viewBox="0 0 1024 1024" v-html="item.svg"></svg>
                <template v-else>
                  <img class="rd-50 w-6 h-6" alt="FAILED" :src="item.img" />
                </template>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <el-button type="primary" @click="EcyUtils.Router.go({ router, path: '/home' })">Get Started</el-button>
          <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts/edit' })">新建随笔</el-button>
          <el-button text type="primary" @click="EcyUtils.Router.go({ path: 'https://i.cnblogs.com/posts' })">管理博客</el-button>
        </div>
        <div class="mb-6">
          <div class="mb-2 font-bold title">闲言碎语</div>
          <div v-html="EcyConfig.__ECY_CONFIG__.nameplate.gossip"></div>
        </div>
        <div class="mb-6">
          <div class="font-bold title">我的技能</div>
          <SkillGraph />
        </div>
        <div class="f-s-b">
          <div class="mb-6 w-50%">
            <div class="mb-4 font-bold title">精选仓库</div>
            <div>
              <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.warehouse">
                <a :href="item.url" target="__blank">{{ item.text }}</a>
              </div>
            </div>
          </div>
          <div class="mb-6 w-50%">
            <div class="mb-4 font-bold title">项目经历</div>
            <div class="hover mb-2" v-for="item in EcyConfig.__ECY_CONFIG__.nameplate.experience">
              <div class="mb-1">{{ item.date }}</div>
              <div>
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
        <div class="mb-6" v-if="!EcyConfig.__ECY_CONFIG__.nameplate.photo.disabled">
          <div class="mb-4 font-bold title">精选图片</div>
          <div class="f-s-b flex-wrap noscroll ofw-auto">
            <div v-for="(item, i) in EcyConfig.__ECY_CONFIG__.nameplate.photo.src" :class="{ ' h-28': i < 3 }" style="width: 32%">
              <el-image
                v-if="i < 3"
                class="w-100% h-100%"
                :initial-index="i"
                :src="item"
                :preview-src-list="EcyConfig.__ECY_CONFIG__.nameplate.photo.src" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.title {
  --uno: l-for-size;
}
</style>
