<template>
  <v-card elevation="0" border class="rounded-xl pa-5 bg-white h-100">
    <!-- Header Card & Filter / Total Text -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center ga-2">
        <div class="accent-bar"></div>
        <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">{{ title }}</span>
      </div>

      <!-- Filter Dropdown (Untuk Dashboard) -->
      <v-select
        v-if="filterOptions && filterOptions.length"
        :model-value="filterValue"
        @update:model-value="$emit('update:filterValue', $event)"
        :items="filterOptions"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 110px;"
        class="text-caption rounded-lg"
      ></v-select>

      <!-- Total Text (Untuk Agent Reporting) -->
      <span v-else-if="totalText" class="text-caption font-weight-bold text-slate-800">{{ totalText }}</span>
    </div>

    <!-- Subtitle Jika Ada -->
    <p v-if="subtitle" class="text-caption text-grey-darken-1 pl-4 mb-2">{{ subtitle }}</p>

    <!-- Area Chart Container -->
    <div class="d-flex align-center" :style="{ height: height }">
      <!-- Legenda Samping (Khusus Dashboard) -->
      <div v-if="legendItems && legendItems.length" class="d-flex flex-column ga-2 mr-6" style="min-width: 150px;">
        <div v-for="(item, idx) in legendItems" :key="idx" class="d-flex align-center">
          <div class="legend-box mr-3" :style="{ backgroundColor: item.color }"></div>
          <span class="text-caption text-grey-darken-2 font-weight-medium">{{ item.label }}</span>
        </div>
      </div>

      <!-- Chart Canvas & Absolut Center Text -->
      <div class="flex-grow-1 position-relative fill-height d-flex justify-center align-center">
        <Doughnut :data="chartData" :options="options" :plugins="plugins" />
        
        <!-- Center Text Posisi Absolut (Khusus Dashboard) -->
        <div v-if="centerText" class="center-text text-subtitle-2 font-weight-bold">
          {{ centerText }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  totalText: { type: String, default: '' },
  centerText: { type: String, default: '' },
  legendItems: { type: Array, default: () => [] },
  chartData: { type: Object, required: true },
  options: { type: Object, required: true },
  plugins: { type: Array, default: () => [] },
  height: { type: String, default: '240px' },
  filterValue: { type: String, default: '' },
  filterOptions: { type: Array, default: () => [] }
})

defineEmits(['update:filterValue'])
</script>

<style scoped>
.accent-bar { 
  width: 3px; 
  height: 16px; 
  background-color: #1E75FF; 
  border-radius: 2px; 
  flex-shrink: 0;
}

.legend-box { 
  width: 12px; 
  height: 12px; 
  border-radius: 3px; 
  flex-shrink: 0;
}

.center-text { 
  position: absolute; 
  pointer-events: none; 
  color: #212121; 
}

.text-slate-800 {
  color: #1e293b;
}
</style>