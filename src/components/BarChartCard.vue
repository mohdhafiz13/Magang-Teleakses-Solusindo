<template>
  <v-card elevation="0" border class="rounded-xl pa-4 bg-white h-100">
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="d-flex align-center ga-3">
        <div class="accent-bar"></div>
        <span class="font-weight-bold text-body-2 text-grey-darken-4">{{ title }}</span>
      </div>
      <span v-if="totalText" class="text-caption font-weight-bold text-slate-800">{{ totalText }}</span>
    </div>
    <p v-if="subtitle" class="text-caption text-grey-darken-1 pl-4 mb-4">{{ subtitle }}</p>

    <div :style="{ height: height }">
      <Bar :data="chartData" :options="options" :plugins="plugins" />
    </div>
  </v-card>
</template>

<script setup>
import { Bar } from 'vue-chartjs'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  totalText: { type: String, default: '' },
  chartData: { type: Object, required: true },
  options: { type: Object, required: true },
  plugins: { type: Array, default: () => [] },
  height: { type: String, default: '240px' }
})
</script>

<style scoped>
.accent-bar {
  width: 4px;
  height: 18px;
  background-color: #1976D2;
  border-radius: 2px;
  flex-shrink: 0;
}
.text-slate-800 {
  color: #1e293b;
}
</style>