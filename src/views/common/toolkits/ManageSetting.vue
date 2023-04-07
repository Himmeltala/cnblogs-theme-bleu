<script setup lang="ts">
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";

const upload = ref<UploadInstance>();
const setting = EcyUtils.getSetting();
const uploadDialog = ref(false);
const resetDialog = ref(false);
const readerResult = shallowRef();

function exportJson() {
  const blob = new Blob([JSON.stringify(setting.value, null, 2)], { type: "text/json" });
  const a = document.createElement("a");
  const timestamp = useDateFormat(useNow(), "YYYYMMDDHHmmss");
  a.download = `setting-${timestamp.value}.json`;
  a.href = URL.createObjectURL(blob);
  a.click();
}

function confirm() {
  setting.value = EcyUtils.reloadObjProps(JSON.parse(readerResult.value), EcyUtils.getSettingTemp());
  uploadDialog.value = !uploadDialog.value;
  ElMessage({ message: "导入成功！", type: "success" });
}

const exceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const importJson: UploadProps["onChange"] = async file => {
  if (file.raw) {
    const reader = new FileReader();
    reader.readAsText(file.raw);
    reader.onload = () => {
      uploadDialog.value = !uploadDialog.value;
      readerResult.value = reader.result;
    };
  }
};

function reset() {
  setting.value = EcyUtils.getSettingTemp();
  ElMessage({ message: "成功恢复默认设置！", type: "success" });
  resetDialog.value = !resetDialog.value;
}
</script>

<template>
  <div class="mb-4 f-c-b">
    <el-button size="small" plain type="primary" @click="exportJson">导出设置</el-button>
    <el-button size="small" plain @click="resetDialog = !resetDialog">恢复默认</el-button>
  </div>
  <el-upload drag ref="upload" :limit="1" :auto-upload="false" :on-change="importJson" :on-exceed="exceed">
    点击导入 (可拖拽上传)
  </el-upload>
  <el-dialog draggable align-center v-model="uploadDialog" width="20rem" title="操作提示">
    <div class="mb-10">该操作会覆盖之前的设置，是否继续执行本次操作？</div>
    <div class="f-c-c">
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
      <el-button size="small" @click="uploadDialog = !uploadDialog">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog draggable align-center v-model="resetDialog" width="20rem" title="操作提示">
    <div class="mb-10">建议先导出一份设置做备份，本次操作会恢复所有设置到默认状态。</div>
    <div class="f-c-c">
      <el-button size="small" type="primary" @click="reset">确定</el-button>
      <el-button size="small" @click="resetDialog = !resetDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
