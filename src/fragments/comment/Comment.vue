<script setup lang="ts">
import { useAnchorStore } from "@/store";
import { CommentApi } from "@/apis";

const props = defineProps({
  postId: { type: String, required: true }
});

const toRefPostId = toRef(props, "postId");

const level = ref();
const { anchor } = storeToRefs(useAnchorStore());
const commentInst = ref();
const comments = ref<BleuComment[]>();
const pageCount = ref(0);
const currIndex = ref(1);

async function fetchData() {
  comments.value = await CommentApi.getList(props.postId, currIndex.value, anchor.value);
  pageCount.value = await CommentApi.getCount(props.postId);
  // comments.value = [
  //   {
  //     commentId: '1',
  //     content: `<img src="https://img2.baidu.com/it/u=1086133751,3123293842&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1000" />`
  //   },
  //   {
  //     commentId: '2',
  //     content: `<img src="https://pics6.baidu.com/feed/78310a55b319ebc4782b85d7d9a5c3f41f1716bc.jpeg?token=f703c4c97660a1b94e97d150e397da6a&s=B284F1055CDA55DE46341CDA03008090" />
  //      <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202002%2F28%2F20200228194317_jnedt.thumb.1000_0.png&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1691427407&t=e72247284b87d0cc801f291fbcf87afc" />`
  //   }
  // ]
}

function onPost(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

function onReFinish(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

function onEdFinish(response: any) {
  comments.value = response.comments;
  pageCount.value = response.count;
}

watch(toRefPostId, async () => {
  await fetchData();
});

watch(level, () => {
  document.querySelector(`#level-${anchor.value}`).scrollIntoView();
  anchor.value = 0;
});

await fetchData();
</script>

<template>
  <div class="l-comment">
    <PostComment :post-id="postId" @on-post="onPost" />
    <div class="caption">
      <div class="i-tabler-list mr-2"></div>
      评论列表
    </div>
    <div class="mt-10" v-if="isLogined && comments?.length">
      <div
        class="clearfix mb-12"
        v-for="(item, index) in comments"
        :key="item.commentId"
        ref="commentInst">
        <div class="f-c-s">
          <img class="mr-4 rd-50% w-14 h-14 object-cover" :src="item.avatar" />
          <div>
            <div class="hover cursor-pointer" @click="Navigation.go(item.space)">
              {{ item.author }}
            </div>
            <div
              class="text-0.9rem text-b mt-2 f-c-c"
              :id="'level-' + item.commentId"
              v-if="anchor == item.commentId"
              ref="level">
              {{ item.layer }} {{ item.date }}
            </div>
            <div class="text-0.9rem text-b mt-2 f-c-c" :id="'level-' + item.commentId" v-else>
              {{ item.layer }} {{ item.date }}
            </div>
          </div>
        </div>
        <div class="mt-4 relative" style="margin-left: 4.5rem">
          <textarea class="z--1 opacity-0 absolute top-0 left-0" :id="'upload-img-' + index" />
          <Markdown
            :style-css="BleuVars.config.styleCss?.comment || 'f-c-s'"
            :str-html="item.content"
            :fancy-group="'comment-' + index" />
        </div>
        <div class="more-action float-right f-c-e" v-show="!item.isEditing && !item.isAnsling">
          <el-dropdown>
            <div class="f-c-e text-0.9rem text-b hover">
              <div class="i-tabler-dots-vertical mr-1"></div>
              <div>更多</div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <DiggComment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <BuryComment :comment="item" :post-id="postId" />
                </el-dropdown-item>
                <el-dropdown-item>
                  <DeleteComment
                    :comment="item"
                    :comments="comments"
                    :post-id="postId"
                    :item-index="index" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <EditComment
          @on-finish="onEdFinish"
          :post-id="postId"
          :curr-page-index="currIndex"
          :comment="item" />
        <AnswerComment
          @on-finish="onReFinish"
          :post-id="postId"
          :curr-page-index="currIndex"
          :comment="item" />
      </div>
      <div class="mt-10 f-c-e" v-if="pageCount > 1">
        <el-pagination
          @current-change="fetchData"
          layout="prev, pager, next"
          v-model:current-page="currIndex"
          :page-count="pageCount" />
      </div>
    </div>
    <el-empty v-else-if="isLogined && !comments?.length" description="来一条友善的评论吧~" />
    <el-empty v-else description="你没有登录或没有申请博客权限~" />
  </div>
</template>

<style scoped lang="scss">
@include pc() {
  .more-action {
    --uno: w-8%;
  }
}

@include mb() {
  .more-action {
    --uno: w-10%;
  }
}
</style>
