<script setup lang="ts">
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
  Utils.Native.openImageUploadWindow(el, (imgUrl: any) => {
    content.value += `\n${imgUrl}\n`;
  });
}

function before() {
  htmlContent = props.comment.content;
  props.comment.isAnsling = !props.comment.isAnsling;

  emits("onBefore");
}

async function finish() {
  const { isSuccess } = await Requests.Comment.answer({
    body:
      `回复 ${props.comment.layer} [@${props.comment.author}](${props.comment.space})\n\n` +
      content.value,
    postId: parseInt(props.postId),
    parentCommentId: parseInt(props.comment.commentId)
  });

  if (isSuccess) {
    content.value = "";
    props.comment.isAnsling = !props.comment.isAnsling;
    const count = await Requests.Comment.getCount(props.postId);
    const comments = await Requests.Comment.getList(props.postId, props.currPageIndex);
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
            <div class="i-tabler-photo-circle"></div>
          </span>
        </el-tooltip>
      </div>
      <div class="comment-area">
        <textarea
          v-model="content"
          placeholder="请回复一条友善的评论，支持 Markdown 语法"></textarea>
      </div>
    </div>
    <div
      class="float-right f-c-e text-0.9rem text-thirdly"
      :class="{ 'answer-item': !comment.isAnsling, ' w-100%': comment.isAnsling }">
      <div v-show="!comment.isAnsling && !comment.isEditing" class="hover f-c-e" @click="before">
        <div class="i-tabler:message-circle mr-2"></div>
        <span>回复</span>
      </div>
      <div v-show="comment.isAnsling" class="hover f-c-e mr-4" @click="finish">
        <div class="i-tabler-check mr-2"></div>
        <span>完成回复</span>
      </div>
      <div v-show="comment.isAnsling" class="hover f-c-e" @click="cancel">
        <div class="i-tabler-x mr-2"></div>
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
