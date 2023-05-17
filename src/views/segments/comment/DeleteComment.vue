<script setup lang="ts">
import { CommentApi } from "@/apis";

const props = defineProps({
  comment: {
    type: Object as PropType<any>,
    required: true
  },
  comments: {
    type: Array as PropType<BleuComment[]>,
    required: true
  },
  itemIndex: {
    type: Number,
    required: true
  },
  postId: {
    type: String,
    required: true
  }
});

async function confirmDeleteComment() {
  const data = await CommentApi.del({
    commentId: props.comment.commentId,
    parentId: parseInt(props.postId)
  });
  if (data) {
    props.comments.splice(props.itemIndex, 1);
    ElMessage({ message: "删除评论成功！", grouping: true, type: "success" });
  } else {
    ElMessage({ message: "这不是你的评论，没有权限删除！", grouping: true, type: "error" });
  }
}
</script>

<template>
  <!-- 删除评论 -->
  <div class="text-b text-0.9rem" v-show="!comment.isEditing && !comment.isAnsling">
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      title="确定删除该评论？"
      @confirm="confirmDeleteComment">
      <template #reference>
        <div class="hover f-c-e">
          <div class="i-tabler-trash mr-1"></div>
          <div>删除评论</div>
        </div>
      </template>
    </el-popconfirm>
  </div>
</template>
