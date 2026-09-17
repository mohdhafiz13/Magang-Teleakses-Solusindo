<template>
  <DefaultLayout>
    <!-- Header Title & Subtitle Dinamis -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">
        {{ isHistoryPage ? 'Conversation History' : 'Conversation Statistics' }}
      </h1>
      <p class="text-caption text-grey mb-0">
        {{ isHistoryPage 
          ? 'View conversation history, response details, and agent activity.' 
          : 'Monitor conversation performance, agent activity, and topic trends.' }}
      </p>
    </div>

    <!-- ================= VIEW 1: CONVERSATION STATISTICS ================= -->
    <div v-if="!isHistoryPage">
      <!-- Filter Card Header -->
      <v-card elevation="0" class="border rounded-xl pa-5 mb-6 bg-white">
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center flex-wrap ga-4">
            <!-- Date Filter -->
            <div class="d-flex align-center ga-3">
              <span class="text-caption font-weight-bold text-grey-darken-1">Date</span>
              <v-menu v-model="menuDate" :close-on-content-click="false" location="bottom start">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="formattedDateRange"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    rounded="lg"
                    class="cursor-pointer"
                    style="min-width: 290px;"
                  ></v-text-field>
                </template>
                <v-card class="rounded-xl border elevation-4">
                  <v-date-picker v-model="selectedDates" multiple="range" color="primary" hide-header></v-date-picker>
                  <v-card-actions class="justify-end bg-grey-lighten-4 pa-2">
                    <v-btn size="small" variant="text" color="grey" @click="menuDate = false">Batal</v-btn>
                    <v-btn size="small" variant="flat" color="primary" class="rounded-lg" @click="menuDate = false">Pilih</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>

            <!-- Agent Filter Autocomplete -->
            <div class="d-flex align-center ga-3">
              <span class="text-caption font-weight-bold text-grey-darken-1">Agent</span>
              <v-combobox
                v-model="selectedAgent"
                :items="['All Agent', 'Agent Rani', 'Agent Dika', 'Agent Sinta', 'Agent Bima']"
                :menu-props="{ maxHeight: '180px' }"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                style="min-width: 250px;"
              ></v-combobox>
            </div>
          </div>

          <v-btn color="primary" rounded="lg" elevation="0" class="text-none font-weight-bold px-6">Submit</v-btn>
        </div>
      </v-card>

      <!-- Row 1 Charts: Response Time & Number of Calls -->
      <v-row class="mb-6">
        <!-- Horizontal Response Time per Agent (Presisi Figma) -->
        <v-col cols="12" md="6">
          <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
            <div class="d-flex align-center gap-2 mb-1">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold">Response Time per Agent</span>
            </div>
            <p class="text-caption text-grey mb-4 pl-3">Minimum, average, and maximum response time (seconds).</p>

            <div style="height: 230px;" class="position-relative">
              <Bar 
                :data="responseTimeChartData" 
                :options="responseTimeOptions" 
                :plugins="[datalabelsPlugin]"
              />
            </div>
          </v-card>
        </v-col>

        <!-- Line Chart: Number of Calls (Presisi Figma) -->
        <v-col cols="12" md="6">
          <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
            <div class="d-flex align-center justify-space-between mb-1">
              <div class="d-flex align-center gap-2">
                <div class="accent-bar"></div>
                <span class="text-subtitle-2 font-weight-bold">Number of Calls</span>
              </div>
              <v-select
                v-model="callPeriodFilter"
                :items="['All', 'Daily', 'Weekly']"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 100px;"
              ></v-select>
            </div>
            <p class="text-caption text-grey mb-4 pl-3">Total number of conversations in the selected period.</p>

            <div style="height: 230px;" class="position-relative">
              <Line 
                :data="numberOfCallsChartData" 
                :options="numberOfCallsOptions" 
                :plugins="[lineDatalabelsPlugin]"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Row 2 Charts: Topics of Conversation & Top 5 Topics (Presisi Figma) -->
      <v-card elevation="0" class="border rounded-xl pa-5 bg-white">
        <div class="d-flex align-center gap-2 mb-1">
          <div class="accent-bar"></div>
          <span class="text-subtitle-2 font-weight-bold">Topics of Conversation</span>
        </div>
        <p class="text-caption text-grey mb-6 pl-3">Distribution of Conversation Topics.</p>

        <v-row align="center">
          <!-- Donut & Legend Kiri -->
          <v-col cols="12" md="7">
            <div class="d-flex align-center justify-center" style="height: 300px;">
              <!-- Donut Center -->
              <div class="position-relative fill-height d-flex justify-center align-center mr-6" style="width: 260px;">
                <Doughnut :data="topicsChartData" :options="topicsChartOptions" />
                <div class="center-text text-center">
                  <div class="text-h6 font-weight-bold leading-tight">1,060</div>
                  <div class="text-caption text-grey">Total Calls</div>
                </div>
              </div>

              <!-- Legenda Kanan Donut -->
              <div class="d-flex flex-column gap-2" style="min-width: 180px;">
                <div v-for="(item, idx) in topicLegend" :key="idx" class="d-flex align-center">
                  <div class="legend-box mr-3" :style="{ backgroundColor: item.color }"></div>
                  <span class="text-caption text-grey-darken-3 font-weight-medium">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </v-col>

          <!-- Top 5 Topics Inner Box Card (Presisi Figma) -->
          <v-col cols="12" md="5">
            <v-card elevation="0" class="border rounded-2xl pa-6 bg-grey-lighten-5">
              <h3 class="text-subtitle-2 font-weight-bold mb-6 text-grey-darken-4">Top 5 Topics</h3>
              
              <div v-for="(top, i) in top5Topics" :key="i" class="mb-4">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption font-weight-bold text-grey-darken-3" style="min-width: 140px;">
                    {{ top.name }}
                  </span>
                  
                  <div class="flex-grow-1 mx-4">
                    <v-progress-linear
                      :model-value="top.percentage"
                      :color="top.color"
                      height="12"
                      rounded="lg"
                      bg-color="grey-lighten-2"
                      bg-opacity="1"
                    ></v-progress-linear>
                  </div>
                  
                  <span class="text-caption font-weight-bold text-grey-darken-3 text-right" style="min-width: 50px;">
                    {{ top.percentage }} %
                  </span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- ================= VIEW 2: CONVERSATION HISTORY ================= -->
    <div v-else>
      <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
        <!-- Filter Header Bar & Row Per Page -->
        <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-4">
          <div class="d-flex align-center ga-4 flex-wrap">
            <div class="d-flex align-center ga-2">
              <span class="text-caption font-weight-bold text-grey-darken-1">Date</span>
              <v-menu v-model="menuDateHistory" :close-on-content-click="false" location="bottom start">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="formattedDateRange"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    density="compact"
                    hide-details
                    readonly
                    rounded="lg"
                    class="cursor-pointer"
                    style="min-width: 290px;"
                  ></v-text-field>
                </template>
                <v-card class="rounded-xl border elevation-4">
                  <v-date-picker v-model="selectedDates" multiple="range" color="primary" hide-header></v-date-picker>
                  <v-card-actions class="justify-end bg-grey-lighten-4 pa-2">
                    <v-btn size="small" variant="text" color="grey" @click="menuDateHistory = false">Batal</v-btn>
                    <v-btn size="small" variant="flat" color="primary" class="rounded-lg" @click="menuDateHistory = false">Pilih</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>

            <v-btn color="primary" rounded="lg" elevation="0" class="text-none font-weight-bold px-5">Submit</v-btn>
          </div>

          <v-btn
            variant="outlined"
            color="success"
            rounded="lg"
            prepend-icon="mdi-download"
            class="text-none font-weight-bold"
          >
            Download
          </v-btn>
        </div>

        <div class="d-flex align-center gap-2 mb-4">
          <span class="text-caption text-grey-darken-1">Row per page</span>
          <v-select
            v-model="itemsPerPageHistory"
            :items="[10, 25, 50, 100]"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 85px;"
          ></v-select>
        </div>

        <!-- History Data Table -->
        <v-data-table
          v-model:page="pageHistory"
          v-model:items-per-page="itemsPerPageHistory"
          :headers="historyHeaders"
          :items="historyRecords"
          hide-default-footer
          density="comfortable"
          class="elevation-0 border-top"
        >
          <!-- Custom Action Buttons (Percakapan & Reset Summary) -->
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center ga-2">
              <v-btn
                variant="flat"
                size="x-small"
                color="blue-lighten-5 text-primary"
                rounded="md"
                class="text-none font-weight-bold px-3"
                @click="openConversationDialog(item)"
              >
                Percakapan
              </v-btn>
              <v-btn
                variant="flat"
                size="x-small"
                color="red text-white"
                rounded="md"
                class="text-none font-weight-bold px-3"
                @click="resetSummary(item)"
              >
                Reset Summary
              </v-btn>
            </div>
          </template>

          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageHistory"
              v-model:itemsPerPage="itemsPerPageHistory"
              :total-items="1250"
            />
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- ================= MODAL DIALOG: CONVERSATION DETAILS (PRESISI FIGMA) ================= -->
    <v-dialog v-model="dialogDetails" max-width="720" persistent scrollable>
      <v-card class="rounded-2xl pa-6 bg-white elevation-12">
        <!-- Dialog Header Bar -->
        <div class="d-flex align-start justify-space-between mb-5">
          <div class="d-flex align-center gap-3">
            <v-avatar color="blue-lighten-5" size="44" rounded="lg">
              <v-icon icon="mdi-message-text-outline" color="primary" size="22"></v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold leading-tight">Conversation Details</h2>
              <p class="text-caption text-grey mb-0">Listen to the audio, review the summary, and see the full conversation.</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="grey-darken-1" @click="dialogDetails = false"></v-btn>
        </div>

        <v-card-text class="pa-0">
          <!-- 1. Audio Recording Player Bar (Jarak Disesuaikan Rapi) -->
          <div class="mb-6">
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Audio Recording</span>
            </div>

            <div class="d-flex align-center pa-3 rounded-xl border bg-grey-lighten-5">
              <v-btn icon size="small" color="primary" elevation="0" class="mr-3" @click="isPlaying = !isPlaying">
                <v-icon :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-icon>
              </v-btn>
              
              <span class="text-caption font-weight-medium text-grey-darken-2 mr-3">0:00</span>
              
              <v-slider 
                v-model="audioProgress" 
                hide-details 
                density="compact" 
                color="primary" 
                track-color="grey-lighten-2" 
                class="flex-grow-1 mx-2"
              ></v-slider>
              
              <span class="text-caption font-weight-medium text-grey-darken-2 ml-3 mr-4">12:34</span>
              
              <v-btn icon variant="text" size="small" color="grey-darken-2" class="mr-1">
                <v-icon icon="mdi-volume-high"></v-icon>
              </v-btn>
              
              <v-slider 
                v-model="audioVolume" 
                hide-details 
                density="compact" 
                color="primary" 
                track-color="grey-lighten-2" 
                style="max-width: 65px;" 
                class="mr-3"
              ></v-slider>
              
              <v-btn variant="outlined" color="primary" size="small" rounded="lg" prepend-icon="mdi-download" class="text-none font-weight-bold ml-2">
                Download
              </v-btn>
            </div>
          </div>

          <!-- 2. Summary Section (Agent Performance Summary) -->
          <div class="mb-6">
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Summary</span>
            </div>

            <div class="pa-5 bg-grey-lighten-5 rounded-2xl border">
              <h4 class="text-subtitle-2 font-weight-bold mb-3 text-grey-darken-4">Agent Performance Summary</h4>
              
              <div class="summary-grid text-caption mb-4 text-grey-darken-3">
                <div class="d-flex"><span class="label">Agent Name</span><span class="colon">:</span><strong>Fitya</strong></div>
                <div class="d-flex"><span class="label">Conversation Date</span><span class="colon">:</span><strong>Monday, 13 September 2026</strong></div>
                <div class="d-flex"><span class="label">Conversation Time</span><span class="colon">:</span><strong>4:00:01</strong></div>
                <div class="d-flex"><span class="label">Evaluation Date</span><span class="colon">:</span><strong>Monday, 20 April 2026</strong></div>
              </div>

              <p class="text-caption text-grey-darken-2 mb-0 leading-relaxed">
                Agent telah memberikan respon yang ramah dan informatif. Percakapan dimulai dengan sapaan dan dilanjutkan dengan pemberian informasi terkait garansi AC. Agent menjelaskan ketentuan garansi dengan jelas dan menawarkan bantuan lebih lanjut. Secara keseluruhan, agent telah menangani percakapan dengan baik.
              </p>
            </div>
          </div>

          <!-- 3. Conversation Section (Bubble Chat Logs) -->
          <div>
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Conversation</span>
            </div>

            <div class="pa-5 bg-grey-lighten-5 rounded-2xl border d-flex flex-column gap-4" style="max-height: 280px; overflow-y: auto;">
              <!-- Chat Item 1: Agent -->
              <div class="d-flex align-start gap-3">
                <v-avatar color="blue-lighten-5" size="32" class="mt-1">
                  <v-icon icon="mdi-account" color="primary" size="18"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-caption font-weight-bold text-grey-darken-4 mb-1">
                    Agent Fitya (09006)
                  </div>
                  <div class="text-caption text-grey mb-2" style="font-size: 0.7rem;">
                    Topic: Default Welcome Intent | Score: 0.2 | 20 Apr 2026 13:59:50
                  </div>
                  <div class="pa-3 rounded-lg bg-white border text-caption text-grey-darken-3">
                    halo
                  </div>
                </div>
              </div>

              <!-- Chat Item 2: Customer -->
              <div class="d-flex align-start gap-3">
                <v-avatar color="green-lighten-5" size="32" class="mt-1">
                  <v-icon icon="mdi-account" color="success" size="18"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-caption font-weight-bold text-grey-darken-4 mb-1">
                    Customer (085135499752)
                  </div>
                  <div class="text-caption text-grey mb-2" style="font-size: 0.7rem;">
                    Topic: Warranty | Score: 0.0 | 20 Apr 2026 13:59:56
                  </div>
                  <div class="pa-3 rounded-lg bg-white border text-caption text-grey-darken-3">
                    Halo, saya ingin menanyakan tentang garansi AC.
                  </div>
                </div>
              </div>

              <!-- Chat Item 3: Agent -->
              <div class="d-flex align-start gap-3">
                <v-avatar color="blue-lighten-5" size="32" class="mt-1">
                  <v-icon icon="mdi-account" color="primary" size="18"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-caption font-weight-bold text-grey-darken-4 mb-1">
                    Agent Fitya (09006)
                  </div>
                  <div class="text-caption text-grey mb-2" style="font-size: 0.7rem;">
                    Topic: Warranty | Score: 0.8 | 20 Apr 2026 14:00:05
                  </div>
                  <div class="pa-3 rounded-lg bg-white border text-caption text-grey-darken-3">
                    Tentu, untuk produk AC kami memiliki garansi resmi 1 tahun untuk suku cadang dan 3 tahun untuk kompresor. Apakah ada informasi lain yang ingin Anda tanyakan?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CustomPagination from '../components/CustomPagination.vue'
import {
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'vue-chartjs'

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler
)

const route = useRoute()
const isHistoryPage = computed(() => route.path === '/conversation-history')

const selectedAgent = ref('All Agent')
const callPeriodFilter = ref('All')

const menuDate = ref(false)
const menuDateHistory = ref(false)
const selectedDates = ref([new Date(2026, 8, 1), new Date(2026, 8, 7)])

const formattedDateRange = computed(() => {
  if (!selectedDates.value || !Array.isArray(selectedDates.value) || selectedDates.value.length === 0) {
    return '01 Sep 2026 - 07 September 2026'
  }
  const formatDate = (d) => {
    if (!d) return ''
    const dateObj = d instanceof Date ? d : new Date(d)
    return isNaN(dateObj) ? '' : dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  if (selectedDates.value.length === 1) return formatDate(selectedDates.value[0])
  const sorted = [...selectedDates.value].map(d => new Date(d)).filter(d => !isNaN(d)).sort((a, b) => a - b)
  return `${formatDate(sorted[0])} - ${formatDate(sorted[sorted.length - 1])}`
})

// 1. Plugin Custom Bar Chart
const datalabelsPlugin = {
  id: 'customBarLabels',
  afterDatasetsDraw(chart) {
    const { ctx, scales: { x } } = chart
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index]
        ctx.save()
        ctx.font = 'bold 13px sans-serif'
        ctx.fillStyle = '#0F172A'
        
        const targetX = value < 0 ? x.getPixelForValue(0) : bar.x
        const xPos = targetX + 8
        const yPos = bar.y + 4
        
        ctx.fillText(`${value}s`, xPos, yPos)
        ctx.restore()
      })
    })
  }
}

// Data Response Time Chart
const responseTimeChartData = {
  labels: ['Max', 'Avg', 'Min'],
  datasets: [{
    label: 'Response Time',
    data: [14, 6, -5],
    backgroundColor: ['#FFCC00', '#34C759', '#FF3B30'],
    borderRadius: 0,
    barThickness: 22
  }]
}

const responseTimeOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { right: 40, left: 10 }
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      min: -8,
      max: 16,
      ticks: { stepSize: 5, color: '#64748B' },
      grid: {
        color: (context) => context.tick.value === 0 ? '#94A3B8' : '#E2E8F0',
        borderDash: [4, 4],
        lineWidth: (context) => context.tick.value === 0 ? 1.5 : 1
      }
    },
    y: {
      ticks: { color: '#1E293B', font: { weight: '500' } },
      grid: { display: false }
    }
  }
}

// 2. Plugin Custom Line Chart
const lineDatalabelsPlugin = {
  id: 'customLineLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((point, index) => {
        const value = dataset.data[index]
        ctx.save()
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = '#1E293B'
        ctx.textAlign = 'center'
        
        ctx.fillText(value, point.x, point.y - 10)
        ctx.restore()
      })
    })
  }
}

// Data Line Chart Number of Calls
const numberOfCallsChartData = {
  labels: ['01 Sep', '02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep'],
  datasets: [{
    label: 'Total Calls',
    data: [8, 12, 15, 11, 14, 10, 17],
    borderColor: '#1E75FF',
    borderWidth: 2,
    backgroundColor: (context) => {
      const chart = context.chart
      const { ctx, chartArea } = chart
      if (!chartArea) return 'rgba(30, 117, 255, 0.1)'
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      gradient.addColorStop(0, 'rgba(30, 117, 255, 0.25)')
      gradient.addColorStop(1, 'rgba(30, 117, 255, 0.02)')
      return gradient
    },
    fill: true,
    tension: 0,
    pointBackgroundColor: '#1E75FF',
    pointBorderColor: '#FFFFFF',
    pointBorderWidth: 1.5,
    pointRadius: 4.5,
    pointHoverRadius: 6
  }]
}

const numberOfCallsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 20, right: 10 }
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    y: {
      min: 0,
      max: 20,
      ticks: { stepSize: 5, color: '#64748B' },
      grid: { color: '#F1F5F9' }
    },
    x: {
      ticks: { color: '#64748B' },
      grid: {
        color: '#E2E8F0',
        borderDash: [3, 3]
      }
    }
  }
}

// 3. Donut Chart Topics of Conversation
const topicLegend = [
  { label: 'DefaultIntent-fallback', color: '#1E75FF' },
  { label: 'Default Welcome Intent', color: '#00C853' },
  { label: 'Menu', color: '#FF3D00' },
  { label: 'Default Fallback Intent', color: '#FFC107' },
  { label: 'Nama Support', color: '#AA00FF' },
  { label: 'Nama Marketing', color: '#E91E63' },
  { label: 'Support', color: '#D50000' },
  { label: 'Deskripsi', color: '#78909C' },
  { label: 'Marketing', color: '#B0BEC5' },
  { label: 'Lainnya', color: '#37474F' }
]

const topicsChartData = {
  labels: topicLegend.map(t => t.label),
  datasets: [{
    backgroundColor: topicLegend.map(t => t.color),
    data: [595, 195, 91, 48, 22, 15, 10, 8, 5, 2],
    borderWidth: 2
  }]
}

const topicsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '72%'
}

// Top 5 Topics Data
const top5Topics = [
  { name: 'DefaultIntent-fallback', percentage: 56.2, color: '#1E75FF' },
  { name: 'Default Welcome Intent', percentage: 18.4, color: '#00C853' },
  { name: 'Menu', percentage: 8.6, color: '#FF3D00' },
  { name: 'Default Fallback Intent', percentage: 4.5, color: '#FFC107' },
  { name: 'Nama Support', percentage: 2.1, color: '#AA00FF' }
]

// History Table States
const pageHistory = ref(1)
const itemsPerPageHistory = ref(50)

const historyHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Phone Number', key: 'phoneNumber' },
  { title: 'Destination Number', key: 'destinationNumber' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Agent Avg', key: 'agentAvg' },
  { title: 'Agent Min', key: 'agentMin' },
  { title: 'Agent Max', key: 'agentMax' },
  { title: 'Customer Avg', key: 'customerAvg' },
  { title: 'Customer Min', key: 'customerMin' },
  { title: 'Customer Max', key: 'customerMax' },
  { title: 'Agent', key: 'agent' },
  { title: 'Duration', key: 'duration' },
  { title: 'Action', key: 'action', sortable: false },
]

const historyRecords = ref([
  { no: 1, phoneNumber: 'WRTC14', destinationNumber: '02150821450', dateTime: '13 Sep 2026 23:19:49', agentAvg: 2.4, agentMin: 2.3, agentMax: 2.7, customerAvg: 2.6, customerMin: 1.4, customerMax: 2.2, agent: 'Agent Rani', duration: '00:05:03' },
  { no: 2, phoneNumber: 'WRTC03', destinationNumber: '02150821453', dateTime: '11 Sep 2026 10:09:24', agentAvg: 4.2, agentMin: 2.0, agentMax: 7.1, customerAvg: 3.2, customerMin: 1.4, customerMax: 5.7, agent: 'Agent Dika', duration: '00:05:05' },
  { no: 3, phoneNumber: 'WRTC03', destinationNumber: '02150821454', dateTime: '10 Sep 2026 10:56:51', agentAvg: 2.9, agentMin: 1.3, agentMax: 5.0, customerAvg: 4.1, customerMin: 2.2, customerMax: 6.8, agent: 'Agent Sinta', duration: '00:05:05' },
  { no: 4, phoneNumber: '355693722354', destinationNumber: '02150821450', dateTime: '09 Sep 2026 23:19:49', agentAvg: 2.4, agentMin: 1.2, agentMax: 4.8, customerAvg: 3.1, customerMin: 1.5, customerMax: 5.6, agent: 'Agent Rani', duration: '00:05:02' },
  { no: 5, phoneNumber: '085135490752', destinationNumber: '02150821457', dateTime: '09 Sep 2026 10:27:17', agentAvg: 3.4, agentMin: 1.8, agentMax: 5.9, customerAvg: 2.5, customerMin: 1.1, customerMax: 4.3, agent: 'Agent Bima', duration: '00:00:20' },
])

// Modal Dialog States
const dialogDetails = ref(false)
const selectedConversation = ref(null)
const isPlaying = ref(false)
const audioProgress = ref(0)
const audioVolume = ref(80)

const openConversationDialog = (item) => {
  selectedConversation.value = item
  dialogDetails.value = true
}

const resetSummary = (item) => {
  console.log('Reset summary for', item)
}
</script>

<style scoped>
.accent-bar { width: 3px; height: 16px; background-color: #1E75FF; border-radius: 2px; }
.legend-box { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.center-text { position: absolute; pointer-events: none; }
.leading-tight { line-height: 1.1; }
.leading-relaxed { line-height: 1.6; }

.summary-grid .label {
  width: 130px;
  color: #64748B;
}
.summary-grid .colon {
  margin-right: 8px;
  color: #64748B;
}
</style>