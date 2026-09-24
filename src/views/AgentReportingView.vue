<template>
  <DefaultLayout>
    <!-- Header Title & Description Sesuai Route Active -->
    <div class="mb-4">
      <h1 class="text-h5 font-weight-bold mb-1">
        {{ isHistoryPage ? 'Agent History' : 'Agent Statistics' }}
      </h1>
      <p class="text-caption text-grey-darken-1">
        {{
          isHistoryPage
            ? 'Review agent status changes, activity, and duration over time.'
            : 'Monitor agent activities, status distribution, and performance in real-time.'
        }}
      </p>
    </div>

    <!-- Toggle Mode Switch Call vs Chat -->
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

    <!-- ================================================================= -->
    <!-- TAMPILAN 1: AGENT STATISTICS (URL /agent-statistics atau /agent-reporting) -->
    <!-- ================================================================= -->
    <div v-if="!isHistoryPage">
      <!-- Mode Call Statistics -->
      <div v-if="activeTab === 'call'">
        <!-- Summary Cards Call (Pakai Child Component SummaryCards) -->
        <SummaryCards :items="callCards" :col-width="2" />

        <!-- Charts Row 1: Campaign Distribution, Conversation Topics, Total Data Calls (Pakai Child Components) -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <DoughnutChartCard
              title="Campaign Distribution"
              subtitle="View the distribution of call activity across campaigns."
              total-text="Total Campaign : 1,456"
              :chart-data="campaignChartData"
              :options="doughnutOptionsCampaign"
              :plugins="[centerTextPlugin]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <DoughnutChartCard
              title="Conversation Topics"
              subtitle="Analyze the most common topics identified during calls."
              total-text="Total Topics : 980"
              :chart-data="topicChartDataFormatted"
              :options="doughnutOptionsTopic"
              :plugins="[centerTextPlugin]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <BarChartCard
              title="Total Data Calls"
              subtitle="Monitor the total number of calls over time."
              total-text="Total Calls : 60"
              :chart-data="dataCallsChartData"
              :options="barOptions"
              height="220px"
            />
          </v-col>
        </v-row>

        <!-- Charts Row 2: Agent Status Duration Statistics (Pakai Child Component BarChartCard) -->
        <BarChartCard
          title="Agent Status Duration Statistics"
          subtitle="Monitor the duration of each agent status."
          :chart-data="statusDurationChartData"
          :options="horizontalBarOptions"
          :plugins="[barValueLabelsPlugin]"
          height="320px"
          class="mb-4"
        />
      </div>

      <!-- Mode Chat Statistics -->
      <div v-else>
        <!-- Summary Cards Chat (Pakai Child Component SummaryCards) -->
        <SummaryCards :items="chatCards" :col-width="2" />

        <!-- Grid 2x2 Charts Chat (Pakai Child Components) -->
        <v-row>
          <v-col cols="12" md="6">
            <BarChartCard
              title="Total chat per agent (top 10)"
              subtitle="Compare total chats handled by the top 10 agents."
              :chart-data="topChatAgentData"
              :options="topChatBarOptions"
              :plugins="[rawNumberLabelsPlugin]"
              height="280px"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-card elevation="0" border class="rounded-xl pa-4 bg-white h-100">
              <div class="d-flex align-center ga-3 mb-1">
                <div class="accent-bar"></div>
                <span class="font-weight-bold text-body-2 text-grey-darken-4">Trend Chat per Agent</span>
              </div>
              <p class="text-caption text-grey-darken-1 pl-4 mb-4">
                Monitor chat activity trends for each agent over time.
              </p>
              <div style="height: 280px;">
                <Line :data="trendChatData" :options="lineOptions" />
              </div>
            </v-card>
          </v-col>

          <!-- CARD 3: AGENT PEAK HOURS (HEATMAP MATRIX) -->
          <v-col cols="12" md="6">
            <v-card elevation="0" border class="rounded-xl pa-4 bg-white h-100 d-flex flex-column justify-space-between">
              <div>
                <div class="d-flex align-center ga-3 mb-1">
                  <div class="accent-bar"></div>
                  <span class="font-weight-bold text-body-2 text-grey-darken-4">Agent Peak Hours</span>
                </div>
                <p class="text-caption text-grey-darken-1 pl-4 mb-3">
                  Identify peak chat activity by day and hour.
                </p>

                <!-- Heatmap Grid Matrix -->
                <div class="heatmap-container">
                  <!-- Header Hours -->
                  <div class="heatmap-row header-row">
                    <div class="day-label"></div>
                    <div v-for="hour in hoursList" :key="hour" class="hour-label">
                      {{ hour }}
                    </div>
                  </div>

                  <!-- Rows Days (Fri to Mon) -->
                  <div v-for="dayData in heatmapData" :key="dayData.day" class="heatmap-row">
                    <div class="day-label">{{ dayData.day }}</div>
                    <div
                      v-for="(val, idx) in dayData.values"
                      :key="idx"
                      class="heatmap-cell"
                      :style="{ backgroundColor: getHeatmapBgColor(val) }"
                    >
                      {{ val }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Legend Low Activity to High Activity -->
              <div class="d-flex align-center justify-center ga-3 mt-4 pt-2">
                <span class="text-caption font-weight-medium text-grey-darken-2">Low Activity</span>
                <div class="d-flex flex-column align-center">
                  <div class="legend-bar"></div>
                  <div class="d-flex justify-space-between w-100 text-caption text-grey font-weight-medium mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
                <span class="text-caption font-weight-medium text-grey-darken-2">High Activity</span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <DoughnutChartCard
              title="Agent Chat Load Distribution"
              :chart-data="chatLoadDistributionData"
              :options="doughnutOptionsChatLoad"
              :plugins="[centerTextPlugin]"
              height="280px"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- TAMPILAN 2: AGENT HISTORY (URL /agent-history)                   -->
    <!-- ================================================================= -->
    <div v-else>
      <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
        <!-- Filter Bar & Download Header menggunakan Child Component TableSearchHeader -->
        <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-4">
          <div class="d-flex align-center flex-wrap ga-4">
            <!-- Date Range Picker -->
            <div class="d-flex align-center ga-2">
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
                  <v-date-picker
                    v-model="selectedDates"
                    multiple="range"
                    color="primary"
                    hide-header
                  ></v-date-picker>
                  <v-card-actions class="justify-end bg-grey-lighten-4 pa-2">
                    <v-btn size="small" variant="text" color="grey" @click="menuDate = false">Batal</v-btn>
                    <v-btn size="small" variant="flat" color="primary" class="rounded-lg" @click="menuDate = false">Pilih</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>

            <!-- Search Agent -->
            <div class="d-flex align-center ga-2">
              <span class="text-caption font-weight-bold text-grey-darken-1">Search</span>
              <v-combobox
                v-model="searchAgent"
                :items="agentList"
                :menu-props="{ maxHeight: '180px', offsetY: true }"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search agent name..."
                variant="outlined"
                density="compact"
                hide-details
                clearable
                rounded="lg"
                style="min-width: 240px;"
              ></v-combobox>
            </div>

            <v-btn
              color="primary"
              rounded="lg"
              elevation="0"
              class="text-none font-weight-bold px-5"
              @click="handleSubmit"
            >
              Submit
            </v-btn>
          </div>

          <!-- Tombol Download CSV Otomatis -->
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

        <!-- Table Data -->
        <v-data-table
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          :headers="activeTab === 'call' ? callHistoryHeaders : chatHistoryHeaders"
          :items="filteredHistoryRecords"
          hide-default-footer
          density="comfortable"
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              size="x-small"
              :color="getStatusColor(item.status)"
              variant="flat"
              class="font-weight-bold px-3"
            >
              ● {{ item.status }}
            </v-chip>
          </template>

          <!-- CustomPagination Child Component -->
          <template v-slot:bottom>
            <CustomPagination
              v-model:page="page"
              v-model:itemsPerPage="itemsPerPage"
              :total-items="filteredHistoryRecords.length"
            />
          </template>
        </v-data-table>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CustomPagination from '../components/CustomPagination.vue'
import SummaryCards from '../components/SummaryCards.vue'
import DoughnutChartCard from '../components/DoughnutChartCard.vue'
import BarChartCard from '../components/BarChartCard.vue'

// Import Chart.js Modules
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement
)

const route = useRoute()

// Deteksi apakah sedang di halaman history berdasarkan URL path
const isHistoryPage = computed(() => route.path.includes('agent-history'))

// Mode Toggle Button: 'call' atau 'chat'
const activeTab = ref('call')

// --- DATA & LOGIC HEATMAP PEAK HOURS ---
const hoursList = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const heatmapData = [
  { day: 'Fri', values: [18, 35, 55, 72, 58, 42, 65, 78, 52, 30] },
  { day: 'Thu', values: [28, 45, 68, 82, 62, 50, 80, 90, 70, 38] },
  { day: 'Wed', values: [20, 38, 60, 85, 70, 48, 75, 92, 58, 32] },
  { day: 'Tue', values: [30, 50, 75, 90, 68, 52, 78, 95, 65, 40] },
  { day: 'Mon', values: [25, 42, 65, 80, 55, 45, 72, 88, 60, 35] }
]

const getHeatmapBgColor = (val) => {
  if (val < 25) return '#BBDEFB'
  if (val < 50) return '#90CAF9'
  if (val < 75) return '#42A5F5'
  if (val < 90) return '#1E88E5'
  return '#1565C0'
}

// --- HELPER DURASI MENIT KE STR ---
const formatMinutes = (value) => {
  if (value === null || value === undefined) return ''
  if (value < 60) return `${value}m`
  const hours = Math.floor(value / 60)
  const mins = value % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// --- PLUGIN UNTUK DURASI DI UJUNG BAR (STATISTICS CALL) ---
const barValueLabelsPlugin = {
  id: 'barValueLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    ctx.save()
    ctx.font = '500 11px Inter, sans-serif'
    ctx.fillStyle = '#475569'
    ctx.textBaseline = 'middle'

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (meta.hidden) return

      meta.data.forEach((element, index) => {
        const rawValue = dataset.data[index]
        if (rawValue === null || rawValue === undefined) return

        const formattedText = formatMinutes(rawValue)
        const x = element.x + 6
        const y = element.y

        ctx.fillText(formattedText, x, y)
      })
    })

    ctx.restore()
  }
}

// --- PLUGIN UNTUK ANGKA BIASA DI UJUNG BAR (TOP 10 CHAT PER AGENT) ---
const rawNumberLabelsPlugin = {
  id: 'rawNumberLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    ctx.save()
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.fillStyle = '#0F172A'
    ctx.textBaseline = 'middle'

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (meta.hidden) return

      meta.data.forEach((element, index) => {
        const rawValue = dataset.data[index]
        if (rawValue === null || rawValue === undefined) return

        const x = element.x + 8
        const y = element.y

        ctx.fillText(rawValue.toString(), x, y)
      })
    })

    ctx.restore()
  }
}

// --- PLUGIN CUSTOM CHART.JS (POSISI SENTER TEPAT DI TENGAH DONUT) ---
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    if (chart.config.type !== 'doughnut') return
    const { ctx, chartArea } = chart
    if (!chartArea) return

    ctx.restore()

    const total = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0)
    const label = chart.config.options.plugins?.centerTextLabel || 'Total'

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    // Teks Angka Utama
    ctx.font = 'bold 20px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#0F172A'
    ctx.fillText(total.toLocaleString(), centerX, centerY - 7)

    // Teks Subtitle Label
    ctx.font = '500 12px Inter, sans-serif'
    ctx.fillStyle = '#64748B'
    ctx.fillText(label, centerX, centerY + 13)

    ctx.save()
  }
}

// --- CONFIG & OPTIONS CHART ---
const doughnutOptionsCampaign = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  layout: { padding: { left: 0, right: 0, top: 10, bottom: 10 } },
  plugins: {
    legend: {
      position: 'left',
      labels: {
        boxWidth: 16,
        boxHeight: 16,
        padding: 14,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        color: '#0F172A',
        font: { size: 13, weight: '700', family: 'Inter, sans-serif' }
      }
    },
    centerTextLabel: 'Total Campaign'
  }
}

// FORMAT LABEL MENJADI MULTILINE JIKA LEBIH DARI 15 KARAKTER
const topicChartDataFormatted = computed(() => {
  return {
    ...topicChartData,
    labels: topicChartData.labels.map(label => {
      if (label.length > 15) {
        const words = label.split(' ')
        const mid = Math.ceil(words.length / 2)
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
      }
      return label
    })
  }
})

const doughnutOptionsTopic = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  plugins: {
    legend: {
      position: 'left',
      labels: {
        boxWidth: 14,
        boxHeight: 14,
        padding: 6,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        color: '#0F172A',
        font: { size: 11, weight: '700', family: 'Inter, sans-serif' }
      }
    },
    centerTextLabel: 'Total Topics'
  }
}

const doughnutOptionsChatLoad = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  layout: { padding: { left: 0, right: 0, top: 10, bottom: 10 } },
  plugins: {
    legend: {
      position: 'left',
      labels: {
        boxWidth: 16,
        boxHeight: 16,
        padding: 12,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        color: '#0F172A',
        font: { size: 13, weight: '700', family: 'Inter, sans-serif' }
      }
    },
    centerTextLabel: 'Total Chats'
  }
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}

const horizontalBarOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { right: 50 } },
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: { boxWidth: 12, usePointStyle: true, pointStyle: 'rectRounded' }
    }
  },
  scales: {
    x: {
      min: 0,
      max: 150,
      ticks: {
        stepSize: 30,
        callback: function(value) {
          if (value === 0) return '0m'
          if (value === 30) return '30m'
          if (value === 60) return '1h'
          if (value === 90) return '1h 30m'
          if (value === 120) return '2h'
          if (value === 150) return '2h 30m'
          return value + 'm'
        }
      }
    }
  }
}

// OPTIONS KHUSUS "TOTAL CHAT PER AGENT (TOP 10)"
const topChatBarOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { right: 35 } },
  plugins: { legend: { display: false } },
  scales: {
    x: {
      min: 0,
      max: 130,
      ticks: { stepSize: 30 }
    }
  }
}

// OPTIONS KHUSUS "TREND CHAT PER AGENT"
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#0F172A',
        font: { size: 13, weight: '600', family: 'Inter, sans-serif' }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 200,
      ticks: { stepSize: 50 }
    }
  }
}

// --- DATA CHART ---
const campaignChartData = {
  labels: ['marketing', 'support', 'lang_id', 'sales'],
  datasets: [{ data: [642, 300, 250, 264], backgroundColor: ['#1E88E5', '#26C6DA', '#66BB6A', '#FFA726'] }]
}

const topicChartData = {
  labels: ['DefaultIntent Fallback', 'Default Welcome Intent', 'Menu', 'Default Fallback Intent', 'Nama Support', 'Nama Marketing', 'Support', 'Lainnya'],
  datasets: [{ data: [350, 180, 120, 100, 80, 60, 50, 40], backgroundColor: ['#1E88E5', '#26A69A', '#FFA726', '#FF7043', '#EF5350', '#AB47BC', '#8E24AA', '#EC407A'] }]
}

const dataCallsChartData = {
  labels: ['Jul', 'Aug', 'Sep'],
  datasets: [{ 
    label: 'Total Calls', 
    data: [28, 16, 26], 
    backgroundColor: '#42A5F5', 
    borderRadius: 4,
    barThickness: 28
  }]
}

const statusDurationChartData = {
  labels: ['Pause', 'Suspended', 'Busy', 'Ready', 'Logging In', 'Logged Out'],
  datasets: [
    { label: 'Min', data: [5, 3, 4, 2, 6, 4], backgroundColor: '#90CAF9', barThickness: 8 },
    { label: 'Avg', data: [52, 28, 45, 20, 65, 38], backgroundColor: '#2196F3', barThickness: 8 },
    { label: 'Max', data: [130, 85, 115, 75, 125, 110], backgroundColor: '#0D47A1', barThickness: 8 }
  ]
}

const topChatAgentData = {
  labels: ['Budi', 'Lisa', 'Andi', 'Sari', 'Dedi', 'Rina', 'Fahri', 'Maya', 'Toni', 'Putri'],
  datasets: [{ 
    label: 'Total Chat', 
    data: [120, 100, 95, 75, 60, 58, 52, 48, 42, 40], 
    backgroundColor: '#2196F3', 
    borderRadius: 4, 
    barThickness: 14 
  }]
}

const trendChatData = {
  labels: ['Sep 1', 'Sep 8', 'Sep 15', 'Sep 22', 'Sep 29'],
  datasets: [
    { label: 'Budi', data: [150, 130, 165, 170, 165], borderColor: '#2196F3', backgroundColor: '#2196F3', tension: 0.4, fill: false },
    { label: 'Lisa', data: [120, 95, 125, 130, 135], borderColor: '#26A69A', backgroundColor: '#26A69A', tension: 0.4, fill: false },
    { label: 'Andi', data: [100, 85, 110, 105, 112], borderColor: '#FFB300', backgroundColor: '#FFB300', tension: 0.4, fill: false },
    { label: 'Sari', data: [62, 60, 78, 70, 88], borderColor: '#AB47BC', backgroundColor: '#AB47BC', tension: 0.4, fill: false },
    { label: 'Dedi', data: [45, 42, 60, 40, 58], borderColor: '#FF5252', backgroundColor: '#FF5252', tension: 0.4, fill: false }
  ]
}

const chatLoadDistributionData = {
  labels: ['Budi', 'Lisa', 'Andi', 'Sari', 'Dedi', 'Others'],
  datasets: [{ data: [130, 110, 95, 80, 65, 240], backgroundColor: ['#2196F3', '#66BB6A', '#FFCA28', '#FFA726', '#EF5350', '#EC407A'] }]
}

// --- DATA CARDS CALL & CHAT ---
const callCards = [
  { title: 'Total Calls', value: '256', icon: 'mdi-phone-outline', color: 'primary' },
  { title: 'Total Ready', value: '130', icon: 'mdi-check-circle-outline', color: 'success' },
  { title: 'Total Prayer Break', value: '1350', icon: 'mdi-cog-outline', color: 'warning' },
  { title: 'Total Toilet Break', value: '560', icon: 'mdi-account-clock-outline', color: 'info' },
  { title: 'Total Busy', value: '125', icon: 'mdi-phone-in-talk-outline', color: 'error' },
  { title: 'Total Others', value: '57', icon: 'mdi-dots-horizontal', color: 'grey' }
]

const chatCards = [
  { title: 'Total Logged In', value: '152', icon: 'mdi-login', color: 'success' },
  { title: 'Total Busy', value: '45', icon: 'mdi-message-processing-outline', color: 'error' },
  { title: 'Total Toilet', value: '123', icon: 'mdi-human-male-female', color: 'info' },
  { title: 'Total Break', value: '42', icon: 'mdi-coffee-outline', color: 'warning' },
  { title: 'Total Logged Out', value: '18', icon: 'mdi-logout', color: 'grey' }
]

// --- AGENT HISTORY LOGIC ---
const searchAgent = ref(null)
const page = ref(1)
const itemsPerPage = ref(5)

const agentList = ['agentta', 'bima03', 'zahra01', 'dika02', 'rani01', 'firya02', 'lisa01']

const menuDate = ref(false)
const selectedDates = ref([new Date(2026, 7, 31), new Date(2026, 8, 30)])

const formattedDateRange = computed(() => {
  if (!selectedDates.value || selectedDates.value.length === 0) return 'Select Date Range'
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return ''
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  if (selectedDates.value.length === 1) return formatDate(new Date(selectedDates.value[0]))
  const sorted = [...selectedDates.value].map(d => new Date(d)).sort((a, b) => a - b)
  return `${formatDate(sorted[0])} - ${formatDate(sorted[sorted.length - 1])}`
})

const handleSubmit = () => {}

// FUNGSI DOWNLOAD CSV UNTUK AGENT HISTORY
const handleDownload = () => {
  const currentRecords = filteredHistoryRecords.value
  const currentHeaders = activeTab.value === 'call' ? callHistoryHeaders : chatHistoryHeaders
  const filename = activeTab.value === 'call' ? 'Agent_Call_History.csv' : 'Agent_Chat_History.csv'

  if (!currentRecords || currentRecords.length === 0) {
    alert('Tidak ada data history untuk di-download!')
    return
  }

  // 1. Header CSV
  const headerRow = currentHeaders.map(h => `"${h.title}"`).join(',')

  // 2. Baris Data CSV
  const dataRows = currentRecords.map(row => {
    return currentHeaders
      .map(h => {
        let val = row[h.key]
        val = val !== undefined && val !== null ? val : ''
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // 3. Trigger Download File
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'READY': return 'green-lighten-4 text-green-darken-4'
    case 'IN SERVICE': return 'blue-lighten-4 text-blue-darken-4'
    case 'LOGGING IN': return 'yellow-lighten-4 text-yellow-darken-4'
    case 'LOGGED OUT': return 'red-lighten-4 text-red-darken-4'
    case 'PAUSE': return 'orange-lighten-4 text-orange-darken-4'
    case 'BUSY': return 'pink-lighten-4 text-pink-darken-4'
    default: return 'grey-lighten-3 text-grey-darken-3'
  }
}

const callHistoryHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Extension', key: 'extension' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Agent', key: 'agent' },
  { title: 'Status', key: 'status' },
  { title: 'Status Duration', key: 'statusDuration' },
  { title: 'Campaign', key: 'campaign' },
  { title: 'Reason', key: 'reason' },
]

const chatHistoryHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Extension', key: 'extension' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Agent', key: 'agent' },
  { title: 'Username', key: 'username' },
  { title: 'Status', key: 'status' },
  { title: 'Duration', key: 'duration' },
]

const callHistoryRecords = ref([
  { no: 1, extension: 'agent-ta', dateTime: '31 Aug 2026 15:18:14', agent: 'agentta', status: 'PAUSE', statusDuration: '00:03:00', campaign: 'lang_id', reason: 'Personal break' },
  { no: 2, extension: 'agent-bd', dateTime: '31 Aug 2026 15:15:14', agent: 'bima03', status: 'LOGGED OUT', statusDuration: '00:01:42', campaign: 'support_id', reason: 'End of shift' },
  { no: 3, extension: 'agent-za', dateTime: '31 Aug 2026 15:12:33', agent: 'zahra01', status: 'LOGGING IN', statusDuration: '00:00:40', campaign: 'sales_id', reason: 'System restart' },
  { no: 4, extension: 'agent-di', dateTime: '13 Aug 2026 08:29:02', agent: 'dika02', status: 'PAUSE', statusDuration: '00:00:09', campaign: 'collection_id', reason: 'Meeting' },
  { no: 5, extension: 'agent-ra', dateTime: '13 Aug 2026 08:28:09', agent: 'rani01', status: 'BUSY', statusDuration: '00:00:01', campaign: 'sales_id', reason: 'On a call' },
  { no: 6, extension: 'agent-fi', dateTime: '12 Aug 2026 14:10:00', agent: 'firya02', status: 'READY', statusDuration: '00:15:20', campaign: 'lang_id', reason: 'Available' },
  { no: 7, extension: 'agent-li', dateTime: '12 Aug 2026 11:45:12', agent: 'lisa01', status: 'IN SERVICE', statusDuration: '00:05:40', campaign: 'support_id', reason: 'Handling call' }
])

const chatHistoryRecords = ref([
  { no: 1, extension: 'agent-rani', dateTime: '04 Sep 2026 20:08:47', agent: 'Agent Rani', username: 'rani01', status: 'LOGGING IN', duration: '00:00:24' },
  { no: 2, extension: 'agent-dika', dateTime: '04 Sep 2026 19:52:44', agent: 'Agent Dika', username: 'dika02', status: 'LOGGED OUT', duration: '00:02:24' }
])

const filteredHistoryRecords = computed(() => {
  const records = activeTab.value === 'call' ? callHistoryRecords.value : chatHistoryRecords.value
  if (!searchAgent.value) return records
  const q = searchAgent.value.toLowerCase()
  return records.filter(i => 
    (i.agent && i.agent.toLowerCase().includes(q)) ||
    (i.username && i.username.toLowerCase().includes(q))
  )
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

/* STYLING HEATMAP GRID */
.heatmap-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  overflow-x: auto;
}

.heatmap-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.day-label {
  width: 32px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-align: right;
  padding-right: 6px;
}

.hour-label {
  flex: 1;
  font-size: 10px;
  font-weight: 500;
  color: #94a3b8;
  text-align: center;
  min-width: 28px;
}

.heatmap-cell {
  flex: 1;
  height: 28px;
  min-width: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  transition: transform 0.15s ease;
}

.heatmap-cell:hover {
  transform: scale(1.08);
  z-index: 2;
  cursor: pointer;
}

/* LEGENDA BAR */
.legend-bar {
  width: 220px;
  height: 10px;
  border-radius: 12px;
  background: linear-gradient(to right, #bbdefb, #90caf9, #42a5f5, #1e88e5, #1565c0);
}
</style>