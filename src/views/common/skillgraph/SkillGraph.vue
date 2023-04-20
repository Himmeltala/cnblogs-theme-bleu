<script setup lang="ts">
import { useSkillGraph } from "./index";

const graph = ref<HTMLCanvasElement>();

onMounted(() => {
  if (EcyConfig.__ECY_CONFIG__.graph) {
    useSkillGraph(110, graph.value, EcyConfig.__ECY_CONFIG__.graph);
  }
});
</script>

<template>
  <div class="skillgraph f-c-c">
    <canvas ref="graph" class="graph" width="220" height="220"></canvas>
  </div>
</template>
