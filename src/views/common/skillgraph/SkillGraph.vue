<script setup lang="ts">
import { useSkillGraph } from "./index";

const graph = ref<HTMLCanvasElement>();
const setting = EcyUtils.getLocalSetting();

watch(setting, (val, old) => {
  if (val.theme.color != old.theme.color) {
    useSkillGraph(110, graph.value, EcyConfig.__ECY_CONFIG__.graph);
  }
});

onMounted(() => {
  if (EcyConfig.__ECY_CONFIG__.graph) {
    useSkillGraph(110, graph.value, EcyConfig.__ECY_CONFIG__.graph);
  }
});
</script>

<template>
  <div class="skillgraph f-c-c" v-if="EcyConfig.__ECY_CONFIG__.graph">
    <canvas ref="graph" class="graph" width="220" height="220"></canvas>
  </div>
</template>
