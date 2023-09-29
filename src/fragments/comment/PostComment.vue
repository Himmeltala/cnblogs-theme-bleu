<script setup lang="ts">
import { CommentHttp } from "@/requests";

const props = defineProps({
  postId: { type: String, required: true }
});

const emits = defineEmits(["onPost"]);

const comment = ref<BlogCommentModel>({
  postId: parseInt(props.postId),
  parentCommentId: 0,
  body: ""
});

const loading = ref(false);

function uploadImage(el: string) {
  Native.openImageUploadWindow(el, (imgUrl: any) => {
    comment.value.body += `\n\n${imgUrl}\n\n`;
  });
}

async function AddComment() {
  loading.value = true;
  if (comment.value.body) {
    const data = await CommentHttp.insert(comment.value);
    if (data.isSuccess) {
      const count = await CommentHttp.getCount(props.postId);
      const comments = await CommentHttp.getList(props.postId, 0);
      comment.value.body = "";
      emits("onPost", { count, comments });
    }
  } else ElMessage({ message: "评论字数不够！", grouping: true, type: "error" });
  loading.value = false;
}
</script>

<template>
  <div>
    <div class="caption f-c-s">
      <div class="i-tabler-mail-fast mr-2"></div>
      发表评论
    </div>
    <div class="mb-10 relative">
      <div class="tools mb-2 f-c-e">
        <el-tooltip effect="dark" content="插入图片" placement="top-start">
          <span class="hover" @click="uploadImage('main-upload-img')">
            <i-ep-picture-rounded />
          </span>
        </el-tooltip>
      </div>
      <div class="textarea">
        <textarea
          v-model="comment.body"
          placeholder="请发表一条友善的评论哦~😀支持 Markdown 语法"></textarea>
      </div>
      <div class="z--1 opacity-0 absolute top-0 left-0">
        <textarea id="main-upload-img" />
      </div>
      <div class="f-c-e">
        <el-button plain :disabled="!isLogined" :loading="loading" @click="AddComment">
          <template #icon>
            <div class="i-tabler-send"></div>
          </template>
          发送评论
        </el-button>
      </div>
    </div>
  </div>
</template>
