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
  <!-- 反对评论 -->
  <div
    v-show="!comment.isEditing && !comment.isAnsling"
    class="hover f-c-c text-0.8rem text-b"
    @click="buryComment">
    <div class="i-tabler-thumb-down mr-1"></div>
    <div>反对{{ comment.bury }}</div>
  </div>
</template>
