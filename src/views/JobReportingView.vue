<template>
  <DefaultLayout>
    <!-- Header Title & Subtitle -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Job Reporting</h1>
      <p class="text-caption text-grey-darken-1 mb-0">Monitor job activity, track progress, and review operational results.</p>
    </div>

    <!-- 1. FILTER CARD HEADER -->
    <v-card elevation="0" class="border custom-rounded pa-5 mb-5 bg-white">
      <v-row density="compact" class="align-center mb-4">
        <!-- Date Range -->
        <v-col cols="12" :md="activeTab === 'call' ? 4 : 6">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-calendar-outline" size="16" color="primary"></v-icon>
            Date Range
          </label>
          <v-menu v-model="menuDate" :close-on-content-click="false" location="bottom start">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="formattedDateRange"
                variant="outlined"
                density="compact"
                hide-details
                readonly
                rounded="lg"
                class="bg-white cursor-pointer"
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
        </v-col>

        <!-- Input Search Customer Number -->
        <v-col cols="12" :md="activeTab === 'call' ? 4 : 6">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-account-search-outline" size="16" color="primary"></v-icon>
            Input
          </label>
          <v-text-field
            v-model="filterInput"
            placeholder="Search customer number..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
          ></v-text-field>
        </v-col>

        <!-- Campaign (HANYA TAMPIL SAAT MODE CALL) -->
        <v-col v-if="activeTab === 'call'" cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-bullhorn-outline" size="16" color="primary"></v-icon>
            Campaign
          </label>
          <v-select
            v-model="filterCampaign"
            :items="['All Campaign', 'lang_id', 'marketing', 'support', 'sales', 'collection']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Action Buttons Right: Reset & Submit -->
      <div class="d-flex justify-end ga-3">
        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          class="text-none font-weight-bold px-6"
          @click="resetFilters"
        >
          Reset
        </v-btn>
        <v-btn
          color="primary"
          rounded="lg"
          elevation="0"
          class="text-none font-weight-bold px-6"
        >
          Submit
        </v-btn>
      </div>
    </v-card>

    <!-- 2. TOGGLE MODE SWITCH (CALL vs CHAT) -->
    <div class="d-flex ga-3 mb-6">
      <v-btn
        :variant="activeTab === 'call' ? 'flat' : 'outlined'"
        :color="activeTab === 'call' ? 'primary' : 'grey-darken-1'"
        rounded="lg"
        class="text-none font-weight-bold px-6"
        prepend-icon="mdi-phone-outline"
        @click="activeTab = 'call'"
      >
        Call
      </v-btn>
      <v-btn
        :variant="activeTab === 'chat' ? 'flat' : 'outlined'"
        :color="activeTab === 'chat' ? 'primary' : 'grey-darken-1'"
        rounded="lg"
        class="text-none font-weight-bold px-6"
        prepend-icon="mdi-message-text-outline"
        @click="activeTab = 'chat'"
      >
        Chat
      </v-btn>
    </div>

    <!-- 3. SECTION: LAST STATUS JOB (MODE CALL vs CHAT) -->
    <v-row v-if="activeTab === 'call'" class="mb-6" align="stretch">
      <!-- Donut Chart & Legend Kiri -->
      <v-col cols="12" lg="5">
        <DoughnutChartCard
          title="Last Status Job Call"
          subtitle="View the latest status of call-related jobs."
          center-text="1,401"
          :legend-items="callLegend"
          :chart-data="callChartData"
          :options="chartOptions"
          height="220px"
        />
      </v-col>

      <!-- Metric Cards Call -->
      <v-col cols="12" lg="7">
        <div class="border custom-rounded pa-6 bg-grey-lighten-4 fill-height d-flex align-center">
          <v-row density="comfortable" class="w-100">
            <v-col v-for="(card, i) in callMetricCards" :key="i" cols="12" sm="4">
              <v-card 
                elevation="0" 
                class="border custom-rounded pa-4 bg-white fill-height d-flex flex-column justify-space-between" 
                style="min-height: 140px;"
              >
                <div class="d-flex align-start ga-3 mb-2">
                  <v-avatar :color="card.bgColor" size="46" rounded="circle" class="flex-shrink-0">
                    <v-icon :icon="card.icon" :color="card.iconColor" size="22"></v-icon>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-caption font-weight-bold text-grey-darken-2 text-uppercase mb-0" style="font-size: 0.72rem;">
                      {{ card.title }}
                    </div>
                    <div class="text-h4 font-weight-bold leading-tight text-grey-darken-4">
                      {{ card.value }}
                    </div>
                  </div>
                </div>

                <div class="text-caption" style="font-size: 0.75rem; line-height: 1.2;">
                  <span :class="card.isUp ? 'text-success' : 'text-error'" class="font-weight-bold mr-1">
                    {{ card.isUp ? '↑' : '↓' }} {{ card.percentage }} %
                  </span>
                  <span class="text-grey-darken-1">vs previous period</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- MODE CHAT -->
    <v-row v-else class="mb-6" align="stretch">
      <v-col cols="12" lg="5">
        <DoughnutChartCard
          title="Last Status Job Chat"
          subtitle="View the latest status of chat-related jobs."
          center-text="1,145"
          :legend-items="chatLegend"
          :chart-data="chatChartData"
          :options="chartOptions"
          height="220px"
        />
      </v-col>

      <v-col cols="12" lg="7">
        <div class="border custom-rounded pa-6 bg-grey-lighten-4 fill-height d-flex align-center">
          <v-row density="comfortable" class="w-100">
            <v-col v-for="(card, i) in chatMetricCards" :key="i" cols="12" sm="4">
              <v-card 
                elevation="0" 
                class="border custom-rounded pa-4 bg-white fill-height d-flex flex-column justify-space-between" 
                style="min-height: 140px;"
              >
                <div class="d-flex align-start ga-3 mb-2">
                  <v-avatar :color="card.bgColor" size="46" rounded="circle" class="flex-shrink-0">
                    <v-icon :icon="card.icon" :color="card.iconColor" size="22"></v-icon>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-caption font-weight-bold text-grey-darken-2 mb-0" style="font-size: 0.72rem;">
                      {{ card.title }}
                    </div>
                    <div class="text-h4 font-weight-bold leading-tight text-grey-darken-4">
                      {{ card.value }}
                    </div>
                  </div>
                </div>

                <div class="text-caption" style="font-size: 0.75rem; line-height: 1.2;">
                  <span :class="card.isUp ? 'text-success' : 'text-error'" class="font-weight-bold mr-1">
                    {{ card.isUp ? '↑' : '↓' }} {{ card.percentage }} %
                  </span>
                  <span class="text-grey-darken-1">vs previous period</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- 4. SECTION: JOB RECORDS TABLE -->
    <v-card elevation="0" class="border custom-rounded pa-6 bg-white">
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-4">
        <div class="d-flex align-center gap-2">
          <div class="accent-bar"></div>
          <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Job Records</span>
        </div>

        <!-- Tombol Download CSV Tabel -->
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

      <!-- Row Per Page Selector -->
      <div class="d-flex align-center gap-2 mb-4">
        <span class="text-caption text-grey-darken-1">Row per page</span>
        <v-select
          v-model="itemsPerPage"
          :items="[50, 25, 10]"
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          style="max-width: 85px;"
        ></v-select>
      </div>

      <!-- Data Table Records -->
      <v-data-table
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :headers="activeTab === 'call' ? callTableHeaders : chatTableHeaders"
        :items="filteredJobRecords"
        hide-default-footer
        density="comfortable"
        class="elevation-0 border-top"
      >
        <template v-slot:item.lastStatusJob="{ item }">
          <v-chip
            size="x-small"
            class="font-weight-bold px-3"
            :color="getStatusColor(item.lastStatusJob)"
            variant="flat"
            rounded="pill"
          >
            ● {{ item.lastStatusJob }}
          </v-chip>
        </template>

        <template v-slot:item.action="{ item }">
          <v-btn
            variant="outlined"
            size="x-small"
            color="primary"
            rounded="md"
            prepend-icon="mdi-file-document-outline"
            class="text-none font-weight-bold px-3"
            @click="openDetailModal(item)"
          >
            Detail
          </v-btn>
        </template>

        <!-- CustomPagination Child Component -->
        <template v-slot:bottom>
          <CustomPagination
            v-model:page="page"
            v-model:itemsPerPage="itemsPerPage"
            :total-items="filteredJobRecords.length"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- ================= MODAL DIALOG: JOB DETAIL ================= -->
    <v-dialog v-model="dialogDetail" max-width="660" persistent scrollable>
      <v-card class="rounded-2xl pa-6 bg-white elevation-12">
        <div class="d-flex align-start justify-space-between mb-6">
          <div class="d-flex align-center ga-3">
            <v-avatar color="blue-lighten-5" size="48" rounded="circle">
              <v-icon icon="mdi-file-document-multiple-outline" color="primary" size="24"></v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold leading-tight mb-1">Job Detail</h2>
              <p class="text-caption text-grey mb-0">Listen to the conversation and see the job status history.</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="grey-darken-1" @click="dialogDetail = false"></v-btn>
        </div>

        <v-card-text class="pa-0">
          <div class="d-flex align-center pa-4 mb-6 rounded-xl border bg-grey-lighten-5 ga-2">
            <v-btn icon size="small" color="primary" elevation="0" class="mr-2 flex-shrink-0" @click="isPlaying = !isPlaying">
              <v-icon :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"></v-icon>
            </v-btn>
            <span class="text-caption font-weight-medium text-grey-darken-2 flex-shrink-0">0:00</span>
            <v-slider v-model="audioProgress" hide-details density="compact" color="primary" class="flex-grow-1 mx-3"></v-slider>
            <span class="text-caption font-weight-medium text-grey-darken-2 mr-3 flex-shrink-0">12:34</span>
            <v-btn icon variant="text" size="small" color="grey-darken-2" class="flex-shrink-0">
              <v-icon icon="mdi-volume-high"></v-icon>
            </v-btn>
            <v-slider v-model="audioVolume" hide-details density="compact" color="primary" style="max-width: 65px;" class="mr-3 flex-shrink-0"></v-slider>
            <v-btn variant="outlined" color="primary" size="small" rounded="lg" prepend-icon="mdi-download" class="text-none font-weight-bold flex-shrink-0">
              Download
            </v-btn>
          </div>

          <div class="mb-6">
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Job Information</span>
            </div>

            <div class="pa-5 bg-grey-lighten-5 rounded-2xl border text-caption text-grey-darken-3">
              <v-row density="comfortable" class="ga-y-3">
                <v-col cols="12" sm="6" class="d-flex align-center">
                  <v-icon icon="mdi-bullhorn-outline" size="18" class="mr-3 text-grey-darken-1"></v-icon>
                  <span class="text-grey-darken-1" style="min-width: 120px;">Campaign</span>
                  <span class="font-weight-bold text-grey-darken-4">: {{ selectedJob?.campaign || 'lang_id' }}</span>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center">
                  <v-icon icon="mdi-account-outline" size="18" class="mr-3 text-grey-darken-1"></v-icon>
                  <span class="text-grey-darken-1" style="min-width: 100px;">Agent</span>
                  <span class="font-weight-bold text-grey-darken-4">: {{ selectedJob?.agent || 'Agent Rani' }}</span>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center">
                  <v-icon icon="mdi-phone-outline" size="18" class="mr-3 text-grey-darken-1"></v-icon>
                  <span class="text-grey-darken-1" style="min-width: 120px;">Customer Number</span>
                  <span class="font-weight-bold text-grey-darken-4">: {{ selectedJob?.customerNumber || 'WRTC14' }}</span>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center">
                  <v-icon icon="mdi-clock-outline" size="18" class="mr-3 text-grey-darken-1"></v-icon>
                  <span class="text-grey-darken-1" style="min-width: 100px;">Duration</span>
                  <span class="font-weight-bold text-grey-darken-4">: {{ selectedJob?.duration || '00:05:03' }}</span>
                </v-col>
                <v-col cols="12" class="d-flex align-center">
                  <v-icon icon="mdi-calendar-clock-outline" size="18" class="mr-3 text-grey-darken-1"></v-icon>
                  <span class="text-grey-darken-1" style="min-width: 120px;">Date & Time</span>
                  <span class="font-weight-bold text-grey-darken-4">: {{ selectedJob?.dateTime || '11 Sep 2026 15:03:24' }}</span>
                </v-col>
              </v-row>
            </div>
          </div>

          <div>
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Last Status Job</span>
            </div>
            <div class="d-flex flex-column ga-3 text-caption">
              <div class="d-flex align-center justify-space-between pa-4 rounded-xl border bg-grey-lighten-5 ga-4">
                <v-chip color="green-lighten-4" class="text-green-darken-3 font-weight-bold flex-shrink-0" size="small" variant="flat">
                  ● DONE
                </v-chip>
                <span class="text-grey-darken-2 font-weight-medium flex-shrink-0">11 Sep 2026 15:03:24</span>
                <span class="text-grey-darken-1 text-right flex-grow-1">Jobs has been completed.</span>
              </div>
              <div class="d-flex align-center justify-space-between pa-4 rounded-xl border bg-grey-lighten-5 ga-4">
                <v-chip color="blue-lighten-4" class="text-blue-darken-3 font-weight-bold flex-shrink-0" size="small" variant="flat">
                  ● IN_SERVICE
                </v-chip>
                <span class="text-grey-darken-2 font-weight-medium flex-shrink-0">11 Sep 2026 15:03:24</span>
                <span class="text-grey-darken-1 text-right flex-grow-1">Agent is handling the conversation with customer.</span>
              </div>
              <div class="d-flex align-center justify-space-between pa-4 rounded-xl border bg-grey-lighten-5 ga-4">
                <v-chip color="amber-lighten-4" class="text-amber-darken-3 font-weight-bold flex-shrink-0" size="small" variant="flat">
                  ● IN_QUEUE
                </v-chip>
                <span class="text-grey-darken-2 font-weight-medium flex-shrink-0">11 Sep 2026 15:03:24</span>
                <span class="text-grey-darken-1 text-right flex-grow-1">Job in queue and waiting for an available agent.</span>
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
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CustomPagination from '../components/CustomPagination.vue'
import DoughnutChartCard from '../components/DoughnutChartCard.vue'

const activeTab = ref('call')

const menuDate = ref(false)
const selectedDates = ref([new Date(2026, 7, 31), new Date(2026, 8, 30)])
const filterInput = ref('')
const filterCampaign = ref('All Campaign')

const formattedDateRange = computed(() => {
  if (!selectedDates.value || !Array.isArray(selectedDates.value) || selectedDates.value.length === 0) {
    return '31 Aug 2026 - 30 September 2026'
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

const resetFilters = () => {
  filterInput.value = ''
  filterCampaign.value = 'All Campaign'
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '70%'
}

const callLegend = [
  { label: 'BUSY', color: '#FF0000' },
  { label: 'IN_SERVICE', color: '#2563EB' },
  { label: 'DONE', color: '#10B981' },
  { label: 'UNAVAILABLE', color: '#9CA3AF' },
  { label: 'NOT_FOUND', color: '#374151' }
]

const callChartData = {
  labels: callLegend.map(s => s.label),
  datasets: [{
    backgroundColor: callLegend.map(s => s.color),
    data: [210, 315, 620, 156, 100],
    borderWidth: 2
  }]
}

const callMetricCards = ref([
  { title: 'BUSY', value: '210', percentage: '12.4', isUp: true, icon: 'mdi-calendar-remove', bgColor: 'red-lighten-5', iconColor: 'red' },
  { title: 'IN_SERVICE', value: '315', percentage: '8.4', isUp: true, icon: 'mdi-timer-outline', bgColor: 'blue-lighten-5', iconColor: 'blue' },
  { title: 'DONE', value: '620', percentage: '9.3', isUp: true, icon: 'mdi-file-document-check-outline', bgColor: 'green-lighten-5', iconColor: 'green' },
  { title: 'UNAVAILABLE', value: '156', percentage: '3.2', isUp: false, icon: 'mdi-cancel', bgColor: 'grey-lighten-4', iconColor: 'grey-darken-1' },
  { title: 'NOT_FOUND', value: '100', percentage: '5.2', isUp: false, icon: 'mdi-shield-search', bgColor: 'grey-lighten-3', iconColor: 'grey-darken-3' }
])

const chatLegend = [
  { label: 'Bot', color: '#8B5CF6' },
  { label: 'WA Agent', color: '#10B981' },
  { label: 'Web Chat Agent', color: '#06B6D4' }
]

const chatChartData = {
  labels: chatLegend.map(s => s.label),
  datasets: [{
    backgroundColor: chatLegend.map(s => s.color),
    data: [210, 620, 315],
    borderWidth: 2
  }]
}

const chatMetricCards = ref([
  { title: 'Bot', value: '210', percentage: '12.4', isUp: true, icon: 'mdi-robot-happy-outline', bgColor: 'purple-lighten-5', iconColor: 'purple' },
  { title: 'WA Agent', value: '620', percentage: '7.7', isUp: true, icon: 'mdi-whatsapp', bgColor: 'green-lighten-5', iconColor: 'green' },
  { title: 'Web Chat Agent', value: '315', percentage: '8.4', isUp: false, icon: 'mdi-message-text-outline', bgColor: 'cyan-lighten-5', iconColor: 'cyan' }
])

const page = ref(1)
const itemsPerPage = ref(50)

const callTableHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Campaign', key: 'campaign' },
  { title: 'Customer Number', key: 'customerNumber' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Agent', key: 'agent' },
  { title: 'Duration', key: 'duration' },
  { title: 'Last Status Job', key: 'lastStatusJob' },
  { title: 'Action', key: 'action', sortable: false }
]

const chatTableHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Customer Number', key: 'customerNumber' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Agent', key: 'agent' },
  { title: 'Duration', key: 'duration' }
]

const callJobRecords = ref([
  { no: 1, campaign: 'lang_id', customerNumber: 'WRTC14', dateTime: '11 Sep 2026 15:03:24', agent: 'Agent Rani', duration: '00:05:03', lastStatusJob: 'DONE' },
  { no: 2, campaign: 'marketing', customerNumber: 'WRTC03', dateTime: '11 Sep 2026 10:09:26', agent: 'Agent Bima', duration: '00:05:03', lastStatusJob: 'IN_SERVICE' },
  { no: 3, campaign: 'support', customerNumber: 'WRTC17', dateTime: '10 Sep 2026 10:56:53', agent: 'Agent Dika', duration: '00:04:12', lastStatusJob: 'DONE' },
  { no: 4, campaign: 'sales', customerNumber: 'WRTC112', dateTime: '10 Sep 2026 02:26:47', agent: 'Agent Sinta', duration: '00:04:12', lastStatusJob: 'IN_SERVICE' },
  { no: 5, campaign: 'collection', customerNumber: 'WRTC08', dateTime: '10 Sep 2026 02:25:09', agent: 'Agent Zahra', duration: '00:04:12', lastStatusJob: 'DONE' }
])

const chatJobRecords = ref([
  { no: 1, customerNumber: 'WRTC14', dateTime: '11 Sep 2026 15:03:24', agent: 'Agent Rani', duration: '00:05:03' },
  { no: 2, customerNumber: 'WRTC03', dateTime: '11 Sep 2026 10:09:26', agent: 'Agent Bima', duration: '00:04:23' },
  { no: 3, customerNumber: 'WRTC17', dateTime: '10 Sep 2026 10:56:53', agent: 'Agent Dika', duration: '00:02:22' },
  { no: 4, customerNumber: 'WRTC112', dateTime: '10 Sep 2026 02:26:47', agent: 'Agent Sinta', duration: '00:03:32' },
  { no: 5, customerNumber: 'WRTC08', dateTime: '10 Sep 2026 02:25:09', agent: 'Agent Zahra', duration: '00:04:02' }
])

// Filter Data Berdasarkan Input Search & Campaign
const filteredJobRecords = computed(() => {
  const records = activeTab.value === 'call' ? callJobRecords.value : chatJobRecords.value
  return records.filter(item => {
    const matchInput = !filterInput.value || item.customerNumber.toLowerCase().includes(filterInput.value.toLowerCase())
    const matchCampaign = activeTab.value === 'chat' || filterCampaign.value === 'All Campaign' || item.campaign === filterCampaign.value
    return matchInput && matchCampaign
  })
})

// FUNGSI UTAMA DOWNLOAD FILE CSV
const handleDownload = () => {
  const currentRecords = filteredJobRecords.value
  const currentHeaders = activeTab.value === 'call' ? callTableHeaders : chatTableHeaders
  const filename = activeTab.value === 'call' ? 'Job_Reporting_Call.csv' : 'Job_Reporting_Chat.csv'

  if (!currentRecords || currentRecords.length === 0) {
    alert('Tidak ada data untuk di-download!')
    return
  }

  // 1. Ekstrak Header (Kecuali Kolom Action)
  const validHeaders = currentHeaders.filter(h => h.key !== 'action')
  const headerRow = validHeaders.map(h => `"${h.title}"`).join(',')

  // 2. Format Baris Data
  const dataRows = currentRecords.map(row => {
    return validHeaders
      .map(h => {
        let val = row[h.key]
        val = val !== undefined && val !== null ? val : ''
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // 3. Gabungkan & Trigger Download
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
    case 'DONE': return 'green-lighten-4 text-green-darken-3'
    case 'IN_SERVICE': return 'blue-lighten-4 text-blue-darken-3'
    case 'BUSY': return 'red-lighten-4 text-red-darken-3'
    case 'UNAVAILABLE': return 'grey-lighten-3 text-grey-darken-3'
    case 'NOT_FOUND': return 'grey-lighten-2 text-grey-darken-4'
    default: return 'grey-lighten-3 text-grey-darken-3'
  }
}

const dialogDetail = ref(false)
const selectedJob = ref(null)
const isPlaying = ref(false)
const audioProgress = ref(0)
const audioVolume = ref(80)

const openDetailModal = (item) => {
  selectedJob.value = item
  dialogDetail.value = true
}
</script>

<style scoped>
.accent-bar { width: 3px; height: 16px; background-color: #1E75FF; border-radius: 2px; }
.leading-tight { line-height: 1.1; }

.custom-rounded {
  border-radius: 20px !important;
}
</style>