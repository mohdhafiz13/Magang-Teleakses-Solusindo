<template>
  <DefaultLayout>
    <!-- Header Title & Subtitle -->
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
      <v-card elevation="0" class="border rounded-xl pa-5 mb-5 bg-white">
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
                    style="min-width: 280px;"
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

            <!-- Agent / Channel Filter -->
            <div class="d-flex align-center ga-3">
              <span class="text-caption font-weight-bold text-grey-darken-1">
                {{ activeTab === 'call' ? 'Agent' : 'Channel' }}
              </span>
              <v-combobox
                v-model="selectedFilter"
                :items="activeTab === 'call' ? agentList : channelList"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                style="min-width: 240px;"
              ></v-combobox>
            </div>
          </div>

          <v-btn color="primary" rounded="lg" elevation="0" class="text-none font-weight-bold px-6">Submit</v-btn>
        </div>
      </v-card>

      <!-- TOGGLE SWITCH CALL vs CHAT -->
      <div class="d-flex ga-3 mb-6">
        <v-btn
          :variant="activeTab === 'call' ? 'flat' : 'outlined'"
          :color="activeTab === 'call' ? 'primary' : 'grey-darken-1'"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-phone-outline"
          class="text-none font-weight-bold px-6"
          @click="activeTab = 'call'"
        >
          Call
        </v-btn>
        <v-btn
          :variant="activeTab === 'chat' ? 'flat' : 'outlined'"
          :color="activeTab === 'chat' ? 'primary' : 'grey-darken-1'"
          rounded="lg"
          elevation="0"
          prepend-icon="mdi-message-text-outline"
          class="text-none font-weight-bold px-6"
          @click="activeTab = 'chat'"
        >
          Chat
        </v-btn>
      </div>

      <!-- MODE CALL STATS -->
      <div v-if="activeTab === 'call'">
        <v-row class="mb-6" align="stretch">
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
              <div class="d-flex align-center gap-2 mb-1">
                <div class="accent-bar"></div>
                <span class="text-subtitle-2 font-weight-bold">Response Time per Agent</span>
              </div>
              <p class="text-caption text-grey mb-4 pl-3">Minimum, average, and maximum response time (seconds).</p>
              <div style="height: 230px;">
                <Bar :data="responseTimeChartData" :options="responseTimeOptions" :plugins="[datalabelsPlugin]" />
              </div>
            </v-card>
          </v-col>

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
              <div style="height: 230px;">
                <Line :data="numberOfCallsChartData" :options="numberOfCallsOptions" :plugins="[lineDatalabelsPlugin]" />
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Topics of Conversation & Top 5 Topics -->
        <v-card elevation="0" class="border rounded-xl pa-5 bg-white">
          <div class="d-flex align-center gap-2 mb-1">
            <div class="accent-bar"></div>
            <span class="text-subtitle-2 font-weight-bold">Topics of Conversation</span>
          </div>
          <p class="text-caption text-grey mb-6 pl-3">Distribution of Conversation Topics.</p>

          <v-row align="center">
            <v-col cols="12" md="7">
              <div class="d-flex align-center justify-center" style="height: 290px;">
                <div class="position-relative d-flex justify-center align-center mr-6" style="width: 230px; height: 230px;">
                  <Doughnut :data="topicsChartData" :options="topicsChartOptions" />
                  <div class="center-text text-center">
                    <div class="text-h6 font-weight-bold leading-tight">1,060</div>
                    <div class="text-caption text-grey">Total Calls</div>
                  </div>
                </div>
                <div class="d-flex flex-column gap-2" style="min-width: 180px;">
                  <div v-for="(item, idx) in topicLegend" :key="idx" class="d-flex align-center">
                    <div class="legend-box mr-2" :style="{ backgroundColor: item.color }"></div>
                    <span class="text-caption text-grey-darken-3 font-weight-medium" style="font-size: 0.72rem;">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="5">
              <v-card elevation="0" class="border rounded-2xl pa-6 bg-grey-lighten-5">
                <h3 class="text-subtitle-2 font-weight-bold mb-6 text-grey-darken-4">Top 5 Topics</h3>
                <div v-for="(top, i) in top5Topics" :key="i" class="mb-4">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption font-weight-bold text-grey-darken-3" style="min-width: 140px;">{{ top.name }}</span>
                    <div class="flex-grow-1 mx-3">
                      <v-progress-linear :model-value="top.percentage" :color="top.color" height="10" rounded="lg" bg-color="grey-lighten-2" bg-opacity="1"></v-progress-linear>
                    </div>
                    <span class="text-caption font-weight-bold text-grey-darken-3 text-right" style="min-width: 45px;">{{ top.percentage }} %</span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- MODE CHAT STATS -->
      <div v-else>
        <v-row class="mb-6" align="stretch">
          <!-- 1. Conversation per Channel -->
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
              <div class="d-flex align-center gap-2 mb-1">
                <div class="accent-bar"></div>
                <span class="text-subtitle-2 font-weight-bold">Conversation per Channel</span>
              </div>
              <p class="text-caption text-grey mb-4 pl-3">Compare conversation volume across communication channels.</p>
              
              <!-- Legenda Kiri, Donut Kanan Sesuai Figma -->
              <div class="d-flex align-center justify-center ga-6" style="height: 230px;">
                <div class="d-flex flex-column gap-2" style="min-width: 130px;">
                  <div v-for="(item, idx) in chatChannelLegend" :key="idx" class="d-flex align-center">
                    <div class="legend-box mr-2" :style="{ backgroundColor: item.color }"></div>
                    <span class="text-caption text-grey-darken-3 font-weight-medium">{{ item.label }}</span>
                  </div>
                </div>

                <div class="position-relative d-flex justify-center align-center" style="width: 200px; height: 200px;">
                  <Doughnut :data="chatChannelData" :options="topicsChartOptions" />
                  <div class="center-text text-center">
                    <div class="text-h6 font-weight-bold leading-tight">4,832</div>
                    <div class="text-caption text-grey" style="font-size: 0.7rem;">Total Conversations</div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- 2. Channel Distribution Over Time -->
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
              <div class="d-flex align-center justify-space-between mb-1">
                <div class="d-flex align-center gap-2">
                  <div class="accent-bar"></div>
                  <span class="text-subtitle-2 font-weight-bold">Channel Distribution Over Time</span>
                </div>
                <v-select v-model="chatPeriodFilter" :items="['30 Days', '7 Days']" variant="outlined" density="compact" hide-details style="max-width: 110px;"></v-select>
              </div>
              <p class="text-caption text-grey mb-4 pl-3">Monitor Conversation trends across channels over time.</p>
              <div style="height: 230px;">
                <Line :data="channelDistributionData" :options="areaChartOptions" />
              </div>
            </v-card>
          </v-col>

          <!-- 3. Conversations by Status -->
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height">
              <div class="d-flex align-center gap-2 mb-1">
                <div class="accent-bar"></div>
                <span class="text-subtitle-2 font-weight-bold">Conversations by Status</span>
              </div>
              <p class="text-caption text-grey mb-4 pl-3">View the distribution of conversations by their current status.</p>

              <!-- Legenda Kiri, Donut Kanan Sesuai Figma -->
              <div class="d-flex align-center justify-center ga-6" style="height: 230px;">
                <div class="d-flex flex-column gap-2" style="min-width: 150px;">
                  <div v-for="(item, idx) in chatStatusLegend" :key="idx" class="d-flex align-center">
                    <div class="legend-box mr-2" :style="{ backgroundColor: item.color }"></div>
                    <span class="text-caption text-grey-darken-3 font-weight-medium" style="font-size: 0.75rem;">{{ item.label }}</span>
                  </div>
                </div>

                <div class="position-relative d-flex justify-center align-center" style="width: 200px; height: 200px;">
                  <Doughnut :data="chatStatusData" :options="topicsChartOptions" />
                  <div class="center-text text-center">
                    <div class="text-h6 font-weight-bold leading-tight">4,832</div>
                    <div class="text-caption text-grey" style="font-size: 0.7rem;">Total Conversations</div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- 4. Conversation Volume -->
          <v-col cols="12" md="6">
            <v-card elevation="0" class="border rounded-xl pa-5 bg-white fill-height d-flex flex-column justify-space-between">
              <div>
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="d-flex align-center gap-2">
                    <div class="accent-bar"></div>
                    <span class="text-subtitle-2 font-weight-bold">Conversation Volume</span>
                  </div>
                  <v-select v-model="chatPeriodFilter2" :items="['30 Days', '7 Days']" variant="outlined" density="compact" hide-details style="max-width: 110px;"></v-select>
                </div>
                <p class="text-caption text-grey mb-4 pl-3">Monitor daily conversation volume over the selected period.</p>
                <div style="height: 200px;">
                  <Line :data="conversationVolumeData" :options="lineVolumeOptions" />
                </div>
              </div>
              <div class="text-right text-caption font-weight-bold text-success pt-2">
                Total: 4,832 ↑ 12% vs previous period
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- ================= VIEW 2: CONVERSATION HISTORY ================= -->
    <div v-else>
      <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
        <!-- Header Bar Table & Download Button -->
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
                    style="min-width: 280px;"
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

          <!-- Tombol Download CSV -->
          <v-btn
            variant="outlined"
            color="success"
            rounded="lg"
            prepend-icon="mdi-download"
            class="text-none font-weight-bold"
            @click="handleDownload"
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

          <!-- CustomPagination Child Component -->
          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageHistory"
              v-model:itemsPerPage="itemsPerPageHistory"
              :total-items="historyRecords.length"
            />
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- MODAL DIALOG DETAIL CONVERSATION -->
    <v-dialog v-model="dialogDetails" max-width="720" persistent scrollable>
      <v-card class="rounded-2xl pa-6 bg-white elevation-12">
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
              <v-slider v-model="audioProgress" hide-details density="compact" color="primary" track-color="grey-lighten-2" class="flex-grow-1 mx-2"></v-slider>
              <span class="text-caption font-weight-medium text-grey-darken-2 ml-3 mr-4">12:34</span>
              <v-btn icon variant="text" size="small" color="grey-darken-2" class="mr-1"><v-icon icon="mdi-volume-high"></v-icon></v-btn>
              <v-slider v-model="audioVolume" hide-details density="compact" color="primary" style="max-width: 65px;" class="mr-3"></v-slider>
              <v-btn variant="outlined" color="primary" size="small" rounded="lg" prepend-icon="mdi-download" class="text-none font-weight-bold ml-2">Download</v-btn>
            </div>
          </div>

          <div>
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Summary</span>
            </div>
            <div class="pa-5 bg-grey-lighten-5 rounded-2xl border">
              <h4 class="text-subtitle-2 font-weight-bold mb-3 text-grey-darken-4">Agent Performance Summary</h4>
              <p class="text-caption text-grey-darken-2 mb-0 leading-relaxed">
                Agent telah memberikan respon yang ramah dan informatif terkait garansi produk.
              </p>
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler)

const route = useRoute()
const isHistoryPage = computed(() => route.path.includes('history'))

const activeTab = ref('call')
const selectedFilter = ref('All Agent')
const agentList = ['All Agent', 'Agent Rani', 'Agent Dika', 'Agent Sinta', 'Agent Bima']
const channelList = ['All Channel', 'Web', 'WhatsApp', 'Instagram', 'Facebook']

const callPeriodFilter = ref('All')
const chatPeriodFilter = ref('30 Days')
const chatPeriodFilter2 = ref('30 Days')

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

// RESPONSE TIME CHART
const datalabelsPlugin = {
  id: 'customBarLabels',
  afterDatasetsDraw(chart) {
    const { ctx, scales: { x } } = chart
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index]
        ctx.save()
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = '#0F172A'
        const targetX = value < 0 ? x.getPixelForValue(0) : bar.x
        ctx.fillText(`${value}s`, targetX + 8, bar.y + 4)
        ctx.restore()
      })
    })
  }
}

const responseTimeChartData = {
  labels: ['Max', 'Avg', 'Min'],
  datasets: [{ label: 'Response Time', data: [14, 6, -5], backgroundColor: ['#FFCC00', '#34C759', '#FF3B30'], barThickness: 20 }]
}

const responseTimeOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { min: -8, max: 16 }, y: { grid: { display: false } } }
}

// NUMBER OF CALLS CHART (GARIS LURUS / TENSION 0 DARI FIGMA)
const lineDatalabelsPlugin = {
  id: 'customLineLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((point, index) => {
        ctx.save()
        ctx.font = 'bold 11px sans-serif'
        ctx.fillStyle = '#1E293B'
        ctx.textAlign = 'center'
        ctx.fillText(dataset.data[index], point.x, point.y - 10)
        ctx.restore()
      })
    })
  }
}

const numberOfCallsChartData = {
  labels: ['01 Sep', '02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep'],
  datasets: [{ 
    label: 'Total Calls', 
    data: [8, 12, 15, 11, 14, 10, 17], 
    borderColor: '#1E75FF', 
    backgroundColor: 'rgba(30, 117, 255, 0.1)', 
    fill: true, 
    tension: 0 
  }]
}

const numberOfCallsOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }

// TOPICS OF CONVERSATION (10 ITEM LEGENDA FIGMA)
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
    data: [595, 195, 91, 48, 22, 15, 10, 8, 5, 2] 
  }]
}

const topicsChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '72%' }

const top5Topics = [
  { name: 'DefaultIntent-fallback', percentage: 56.2, color: '#1E75FF' },
  { name: 'Default Welcome Intent', percentage: 18.4, color: '#00C853' },
  { name: 'Menu', percentage: 8.6, color: '#FF3D00' },
  { name: 'Default Fallback Intent', percentage: 4.5, color: '#FFC107' },
  { name: 'Nama Support', percentage: 2.1, color: '#AA00FF' }
]

// CHAT MODE DATA
const chatChannelLegend = [
  { label: 'Web', color: '#E65100' },
  { label: 'WhatsApp', color: '#2E7D32' },
  { label: 'Instagram', color: '#1565C0' },
  { label: 'Facebook', color: '#0D47A1' }
]

const chatChannelData = {
  labels: chatChannelLegend.map(c => c.label),
  datasets: [{ backgroundColor: chatChannelLegend.map(c => c.color), data: [1800, 1500, 1000, 532] }]
}

const chatStatusLegend = [
  { label: 'Waiting', color: '#FFB300' },
  { label: 'Handled by Agent', color: '#1E88E5' },
  { label: 'Closed', color: '#FB8C00' },
  { label: 'Closed by Customer', color: '#43A047' }
]

const chatStatusData = {
  labels: chatStatusLegend.map(s => s.label),
  datasets: [{ backgroundColor: chatStatusLegend.map(s => s.color), data: [600, 2200, 1200, 832] }]
}

const channelDistributionData = {
  labels: ['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30'],
  datasets: [
    { label: 'Facebook', data: [30, 35, 40, 45, 50, 55, 60], backgroundColor: '#1E88E5', fill: true },
    { label: 'Instagram', data: [40, 45, 50, 55, 60, 65, 70], backgroundColor: '#26A69A', fill: true },
    { label: 'WhatsApp', data: [50, 60, 55, 70, 80, 75, 85], backgroundColor: '#66BB6A', fill: true },
    { label: 'Web', data: [30, 40, 35, 45, 55, 50, 60], backgroundColor: '#EF6C00', fill: true }
  ]
}

const areaChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } }

const conversationVolumeData = {
  labels: ['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30'],
  datasets: [{ label: 'Total Conversations', data: [50, 100, 70, 150, 220, 140, 120], borderColor: '#1E88E5', tension: 0.4 }]
}

const lineVolumeOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }

// HISTORY TABLE STATES & DATA
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
  { title: 'Action', key: 'action', sortable: false }
]

const historyRecords = ref([
  { no: 1, phoneNumber: 'WRTC14', destinationNumber: '02150821450', dateTime: '13 Sep 2026 23:19:49', agentAvg: 2.4, agentMin: 2.3, agentMax: 2.7, customerAvg: 2.6, customerMin: 1.4, customerMax: 2.2, agent: 'Agent Rani', duration: '00:05:03' },
  { no: 2, phoneNumber: 'WRTC03', destinationNumber: '02150821453', dateTime: '11 Sep 2026 10:09:24', agentAvg: 4.2, agentMin: 2.0, agentMax: 7.1, customerAvg: 3.2, customerMin: 1.4, customerMax: 5.7, agent: 'Agent Dika', duration: '00:05:05' },
  { no: 3, phoneNumber: 'WRTC03', destinationNumber: '02150821454', dateTime: '10 Sep 2026 10:56:51', agentAvg: 2.9, agentMin: 1.3, agentMax: 5.0, customerAvg: 4.1, customerMin: 2.2, customerMax: 6.8, agent: 'Agent Sinta', duration: '00:05:05' },
  { no: 4, phoneNumber: '355693722354', destinationNumber: '02150821450', dateTime: '09 Sep 2026 23:19:49', agentAvg: 2.4, agentMin: 1.2, agentMax: 4.8, customerAvg: 3.1, customerMin: 1.5, customerMax: 5.6, agent: 'Agent Rani', duration: '00:05:02' },
  { no: 5, phoneNumber: '085135490752', destinationNumber: '02150821457', dateTime: '09 Sep 2026 10:27:17', agentAvg: 3.4, agentMin: 1.8, agentMax: 5.9, customerAvg: 2.5, customerMin: 1.1, customerMax: 4.3, agent: 'Agent Bima', duration: '00:00:20' }
])

const handleDownload = () => {
  const records = historyRecords.value
  if (!records || records.length === 0) return alert('Tidak ada data history untuk di-download!')

  const validHeaders = historyHeaders.filter(h => h.key !== 'action')
  const headerRow = validHeaders.map(h => `"${h.title}"`).join(',')
  const dataRows = records.map(row => validHeaders.map(h => `"${String(row[h.key] || '').replace(/"/g, '""')}"`).join(','))

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'Conversation_History.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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
  alert(`Summary for ${item.phoneNumber} has been reset.`)
}
</script>

<style scoped>
/* Tambahan margin-right: 8px agar accent-bar punya jarak tegas dari teks judul */
.accent-bar { 
  width: 3px; 
  height: 16px; 
  background-color: #1E75FF; 
  border-radius: 2px; 
  margin-right: 8px; 
}
.legend-box { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.center-text { position: absolute; pointer-events: none; }
.leading-tight { line-height: 1.1; }
.leading-relaxed { line-height: 1.6; }
</style>