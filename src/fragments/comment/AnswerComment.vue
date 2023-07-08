<script setup lang="ts">
import { CommentApi } from "@/apis";

const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  currPageIndex: {
    type: Number,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

const emits = defineEmits(["onBefore", "onFinish", "onCancel"]);

let htmlContent = "";
const content = ref("");

function uploadImage(el: string) {
  Native.openImageUploadWindow(el, (imgUrl: any) => {
    content.value += `\n${imgUrl}\n`;
  });
}

function before() {
  htmlContent = props.comment.content;
  props.comment.isAnsling = !props.comment.isAnsling;

  emits("onBefore");
}

async function finish() {
  const { isSuccess } = await CommentApi.answer({
    body:
      `回复 ${props.comment.layer} [@${props.comment.author}](${props.comment.space})\n\n` +
      content.value,
    postId: parseInt(props.postId),
    parentCommentId: parseInt(props.comment.commentId)
  });

  if (isSuccess) {
    content.value = "";
    props.comment.isAnsling = !props.comment.isAnsling;
    const count = await CommentApi.getCount(props.postId);
    const comments = await CommentApi.getList(props.postId, props.currPageIndex);
    emits("onFinish", { count, comments });
  }
}

function cancel() {
  props.comment.content = htmlContent;
  props.comment.isAnsling = !props.comment.isAnsling;

  emits("onCancel");
}
</script>

<template>
  <div>
    <div class="float-right w-100%" v-show="comment.isAnsling">
      <div class="mb-2 f-c-e">
        <el-tooltip content="插入图片" placement="top-start">
          <span class="hover" @click="uploadImage('upload-img-' + currPageIndex)">
            <i-ep-picture-rounded />
          </span>
        </el-tooltip>
      </div>
      <div class="textarea">
        <textarea v-model="content" placeholder="请回复一条友善的评论，支持 Markdown 语法" />
      </div>
    </div>
    <div
      class="float-right f-c-e text-0.9rem text-b"
      :class="{ 'answer-item': !comment.isAnsling, ' w-100%': comment.isAnsling }">
      <div v-show="!comment.isAnsling && !comment.isEditing" class="hover f-c-e" @click="before">
        <div class="i-tabler-message-circle mr-1"></div>
        <span>回复</span>
      </div>
      <div v-show="comment.isAnsling" class="hover f-c-e mr-4" @click="finish">
        <i-ep-check class="mr-1" />
        <span>完成回复</span>
      </div>
      <div v-show="comment.isAnsling" class="hover f-c-e" @click="cancel">
        <i-ep-close class="mr-1" />
        <span>取消回复</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include mixins.pc() {
  .answer-item {
    --uno: w-8%;
  }
}

@include mixins.mb() {
  .answer-item {
    --uno: w-18%;
  }
}
</style>
