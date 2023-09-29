<script setup lang="ts">
import { CommentHttp } from "@/requests";

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
  const { isSuccess } = await CommentHttp.vote({
    isAbandoned: false,
    commentId: parseInt(props.comment.commentId),
    postId: parseInt(props.postId),
    voteType: "Bury"
  });
  isSuccess && props.comment.bury++;
}
</script>

<template>
  <div
    v-show="!comment.isEditing && !comment.isAnsling"
    class="hover f-c-c text-0.8rem text-thirdly"
    @click="buryComment">
    <div class="i-tabler-thumb-down mr-1"></div>
    <div>反对{{ comment.bury }}</div>
  </div>
</template>
