<script lang="ts" setup>
const val = ref("");
const options = Utils.Storage.getOptions();
const themeMode = ref(options.value.theme.mode === "dark");

function toggle() {
  if (themeMode.value) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    options.value.theme.mode = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    options.value.theme.mode = "light";
  }
}
</script>

<template>
  <div
    b="b-1 b-solid border-primary"
    class="top-header light:bg-#ffffffb3 dark:bg-#242424b3 h-15 fixed top-0 left-0 w-100vw z-999">
    <div class="content lt-lg:px-10 xl:px-40 f-c-b h-100%">
      <div class="f-c-s lt-sm:hidden">
        <div class="w-45">
          <el-input
            v-model="val"
            placeholder="输入关键字搜索"
            @keyup.enter="Utils.Native.search(val)">
            <template #suffix>
              <div class="i-tabler-search"></div>
            </template>
          </el-input>
        </div>
      </div>
      <div class="f-c-b">
        <div class="f-c-s text-text-regular">
          <div class="hover mr-4 relative" @click="$router.push(Consts.Paths.home())">首页</div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'Posts'
            }"
            class="hover mr-4 relative"
            @click="$router.push(Consts.Paths.posts())">
            随笔
          </div>
          <div class="hover mr-4" @click="Utils.Navigation.go('https://www.cnblogs.com/')">
            博客园
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'Zone'
            }"
            class="hover mr-4 relative"
            @click="$router.push(Consts.Paths.zone())">
            我的
          </div>
          <div
            :class="{
              'before:w-100% before:h-1 before:bg-theme-primary before:content-empty before:absolute before:left-0 before:bottom--1 before:rd-2':
                $route.name === 'LabelList'
            }"
            class="hover mr-4 relative lt-sm:hidden"
            @click="$router.push('/main/labels')">
            标签
          </div>
          <div class="hover" @click="Utils.Navigation.go('https://i.cnblogs.com')">管理</div>
        </div>
        <div class="tools ml-4">
          <el-switch
            v-model="themeMode"
            active-text="黑"
            inactive-text="白"
            inline-prompt
            @change="toggle" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-header {
  -webkit-backdrop-filter: saturate(50%) blur(8px);
  backdrop-filter: saturate(50%) blur(8px);
}

:deep(.el-input__wrapper) {
  border-radius: 10rem;
}
</style>
