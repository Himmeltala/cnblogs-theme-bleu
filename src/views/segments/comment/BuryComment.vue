<script setup lang="ts">
import { CommentApi } from "@/apis";

const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

async function buryComment() {
  const { isSuccess, message } = await CommentApi.vote({
    isAbandoned: false,
    commentId: parseInt(props.comment.commentId),
    postId: parseInt(props.postId),
    voteType: "Bury"
  });
  isSuccess && props.comment.bury++;
  ElMessage({ message: message, grouping: true, type: isSuccess ? "success" : "error" });
}
</script>

<template>
  <div v-show="!comment.isEditing && !comment.isAnsling" class="l-comment__bury hover l-size-1 l-color-2" @click="buryComment">
    <i-ep-caret-bottom class="mr-1" />
    <span>{{ comment.bury }}</span>
  </div>
</template>
