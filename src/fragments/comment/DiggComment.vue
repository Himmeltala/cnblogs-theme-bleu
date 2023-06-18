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

async function diggComment() {
  const data = await CommentApi.vote({
    isAbandoned: false,
    commentId: props.comment.commentId,
    postId: parseInt(props.postId),
    voteType: "Digg"
  });
  if (data.isSuccess) {
    props.comment.digg = props.comment.digg! + 1;
  }
}
</script>

<template>
  <!-- 同意评论 -->
  <div
    v-show="!comment.isEditing && !comment.isAnsling"
    class="hover f-c-c text-0.9rem text-b"
    @click="diggComment">
    <div class="i-tabler-thumb-up mr-1"></div>
    <div>支持{{ comment.digg }}</div>
  </div>
</template>
