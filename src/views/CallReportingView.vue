<template>
  <DefaultLayout>
    <!-- Header Title & Subtitle -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Call Reporting</h1>
      <p class="text-caption text-grey-darken-1 mb-0">Review call activity, status, duration, and service performance.</p>
    </div>

    <!-- 1. FILTER CARD HEADER -->
    <v-card elevation="0" class="border rounded-2xl pa-5 mb-6 bg-white">
      <!-- Baris 1 Filter: Date Range & Call Status -->
      <v-row density="compact" class="mb-2">
        <v-col cols="12" md="6">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-calendar" size="16" color="primary"></v-icon>
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

        <v-col cols="12" md="6">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-phone-outline" size="16" color="primary"></v-icon>
            Call Status
          </label>
          <v-select
            v-model="filterStatus"
            :items="['All Status', 'SERVED', 'IN_QUEUE', 'NOT_ANSWERED', 'IN_IVR', 'IN_SERVICE', 'RINGING']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Baris 2 Filter: Input, Campaign, Agent -->
      <v-row density="compact" class="mb-4">
        <v-col cols="12" md="4">
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

        <v-col cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-bullhorn-outline" size="16" color="primary"></v-icon>
            Campaign
          </label>
          <v-select
            v-model="filterCampaign"
            :items="['All Campaign', 'support', 'marketing', 'sales', 'collection']"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-flex align-center gap-1">
            <v-icon icon="mdi-account-outline" size="16" color="primary"></v-icon>
            Agent
          </label>
          <v-select
            v-model="filterAgent"
            :items="['All Agent', 'Agent Rani', 'Agent Dika', 'Agent Sinta', 'Agent Bima', 'Agent Zahra']"
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

    <!-- 2. SECTION: LAST STATUS CALL (MENGGUNAKAN CHILD COMPONENT DoughnutChartCard) -->
    <v-row class="mb-6" align="stretch">
      <!-- Donut Chart & Legend Card Kiri -->
      <v-col cols="12" lg="5">
        <DoughnutChartCard
          title="Last Status Call"
          subtitle="View the latest status of call activities."
          center-text="1,485"
          :legend-items="statusLegend"
          :chart-data="lastStatusChartData"
          :options="lastStatusChartOptions"
          height="220px"
        />
      </v-col>

      <!-- Grid Container Abu-Abu Kanan (6 Metric Cards) -->
      <v-col cols="12" lg="7">
        <div class="border custom-rounded pa-6 bg-grey-lighten-4 fill-height d-flex align-center">
          <v-row density="comfortable" class="w-100">
            <v-col v-for="(card, i) in metricCards" :key="i" cols="12" sm="4">
              <v-card 
                elevation="0" 
                class="border custom-rounded pa-5 bg-white fill-height d-flex flex-column justify-space-between" 
                style="min-height: 145px;"
              >
                <!-- Row Atas: Icon Kotak Tumpul + Judul Status & Angka Rata Kiri -->
                <div class="d-flex align-start ga-3 mb-3">
                  <v-avatar :color="card.bgColor" size="44" rounded="xl" class="flex-shrink-0">
                    <v-icon :icon="card.icon" :color="card.iconColor" size="22"></v-icon>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-caption font-weight-bold text-grey-darken-2 text-uppercase mb-0" style="font-size: 0.75rem; letter-spacing: 0.5px;">
                      {{ card.title }}
                    </div>
                    <div class="text-h5 font-weight-bold leading-tight text-grey-darken-4">
                      {{ card.value }}
                    </div>
                  </div>
                </div>

                <!-- Row Bawah: Persentase -->
                <div class="text-caption" style="font-size: 0.78rem; line-height: 1.3;">
                  <div>
                    <span :class="card.isUp ? 'text-success' : 'text-error'" class="font-weight-bold mr-1">
                      {{ card.isUp ? '↑' : '↓' }} {{ card.percentage }} %
                    </span>
                    <span class="text-grey-darken-1">vs previous</span>
                  </div>
                  <div class="text-grey-darken-1">period</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <!-- 3. SECTION: CALL RECORDS TABLE -->
    <v-card elevation="0" class="border rounded-2xl pa-6 bg-white">
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-4">
        <div class="d-flex align-center gap-2">
          <div class="accent-bar"></div>
          <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Call Records</span>
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

      <!-- Row Per Page Selector -->
      <div class="d-flex align-center gap-2 mb-4">
        <span class="text-caption text-grey-darken-1">Row per page</span>
        <v-select
          v-model="itemsPerPage"
          :items="[10, 25, 50, 100]"
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
        :headers="tableHeaders"
        :items="filteredCallRecords"
        hide-default-footer
        density="comfortable"
        class="elevation-0 border-top"
      >
        <!-- Custom Column: Last Call Status Badges -->
        <template v-slot:item.lastCallStatus="{ item }">
          <v-chip
            size="x-small"
            class="font-weight-bold px-3"
            :color="getStatusColor(item.lastCallStatus)"
            variant="flat"
            rounded="pill"
          >
            ● {{ item.lastCallStatus }}
          </v-chip>
        </template>

        <!-- Custom Column: Action Button (Detail) -->
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

        <!-- Custom Pagination Child Component -->
        <template v-slot:bottom>
          <CustomPagination
            v-model:page="page"
            v-model:itemsPerPage="itemsPerPage"
            :total-items="filteredCallRecords.length"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- ================= MODAL DIALOG: LAST STATUS CALL ACTIVITY ================= -->
    <v-dialog v-model="dialogDetail" max-width="680" persistent scrollable>
      <v-card class="rounded-2xl pa-6 bg-white elevation-12">
        <!-- Dialog Header Bar -->
        <div class="d-flex align-start justify-space-between mb-5">
          <div class="d-flex align-center gap-3">
            <v-avatar color="blue-lighten-5" size="44" rounded="lg">
              <v-icon icon="mdi-phone" color="primary" size="22"></v-icon>
            </v-avatar>
            <div>
              <h2 class="text-h6 font-weight-bold leading-tight">Last Status Call Activity</h2>
              <p class="text-caption text-grey mb-0">View call information, recording, and status history.</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="grey-darken-1" @click="dialogDetail = false"></v-btn>
        </div>

        <v-card-text class="pa-0">
          <!-- 1. Audio Player Recording Bar -->
          <div class="d-flex align-center pa-3 mb-6 rounded-xl border bg-grey-lighten-5">
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

          <!-- 2. Call Information Card Grid -->
          <div>
            <div class="d-flex align-center gap-2 mb-3">
              <div class="accent-bar"></div>
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Call Information</span>
            </div>

            <div class="pa-5 bg-grey-lighten-5 rounded-2xl border">
              <v-row density="compact" class="text-caption text-grey-darken-3">
                <!-- Kolom Kiri -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-account-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 120px;">Customer Number</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.customerNumber || 'WRTC14' }}</span>
                  </div>
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-bullhorn-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 120px;">Campaign</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.campaign || 'lang_id' }}</span>
                  </div>
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-clock-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 120px;">Duration</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.duration || '00:05:03' }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-calendar-clock-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 120px;">Date & Time</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.dateTime || '10 Sep 2026 07:20:29' }}</span>
                  </div>
                </v-col>

                <!-- Kolom Kanan -->
                <v-col cols="12" sm="6">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-headset" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 100px;">Agent</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.agent || 'Agent Rani' }}</span>
                  </div>
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-phone-incoming-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 100px;">Enqueue Time</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.enqueueTime || '00:00:07' }}</span>
                  </div>
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-phone-check-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 100px;">Served Time</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.servedTime || '00:04:08' }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-phone-off-outline" size="18" color="grey-darken-1" class="mr-3"></v-icon>
                    <span class="text-grey-darken-1" style="width: 100px;">End Call Time</span>
                    <span class="font-weight-bold text-grey-darken-4">: {{ selectedCallItem?.endCallTime || '10 Sep 2026 07:23:44' }}</span>
                  </div>
                </v-col>
              </v-row>
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

// Filters State
const menuDate = ref(false)
const selectedDates = ref([new Date(2026, 7, 31), new Date(2026, 8, 30)])
const filterStatus = ref('All Status')
const filterInput = ref('')
const filterCampaign = ref('All Campaign')
const filterAgent = ref('All Agent')

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
  filterStatus.value = 'All Status'
  filterInput.value = ''
  filterCampaign.value = 'All Campaign'
  filterAgent.value = 'All Agent'
}

// Donut Chart Data & Legend
const statusLegend = [
  { label: 'IN_IVR', color: '#8B5CF6' },
  { label: 'IN_SERVICE', color: '#2563EB' },
  { label: 'SERVED', color: '#10B981' },
  { label: 'IN_QUEUE', color: '#EAB308' },
  { label: 'NOT ANSWERED', color: '#EF4444' },
  { label: 'RINGING', color: '#06B6D4' }
]

const lastStatusChartData = {
  labels: statusLegend.map(s => s.label),
  datasets: [{
    backgroundColor: statusLegend.map(s => s.color),
    data: [180, 315, 620, 160, 90, 120],
    borderWidth: 2
  }]
}

const lastStatusChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '70%'
}

// 6 Metric Cards Data
const metricCards = [
  { title: 'IN_IVR', value: '180', percentage: '10.5', isUp: true, icon: 'mdi-dialpad', bgColor: 'purple-lighten-5', iconColor: 'purple' },
  { title: 'IN_SERVICE', value: '315', percentage: '9.4', isUp: true, icon: 'mdi-clock-outline', bgColor: 'blue-lighten-5', iconColor: 'blue' },
  { title: 'SERVED', value: '620', percentage: '2.4', isUp: true, icon: 'mdi-check-circle-outline', bgColor: 'green-lighten-5', iconColor: 'green' },
  { title: 'IN_QUEUE', value: '160', percentage: '4.1', isUp: false, icon: 'mdi-minus-circle-outline', bgColor: 'grey-lighten-3', iconColor: 'grey-darken-1' },
  { title: 'NOT ANSWERED', value: '90', percentage: '3.2', isUp: false, icon: 'mdi-help-box', bgColor: 'grey-lighten-3', iconColor: 'grey-darken-2' },
  { title: 'RINGING', value: '120', percentage: '7.4', isUp: false, icon: 'mdi-phone-ring', bgColor: 'cyan-lighten-5', iconColor: 'cyan' },
]

// Table Data
const page = ref(1)
const itemsPerPage = ref(50)

const tableHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Customer Number', key: 'customerNumber' },
  { title: 'Agent', key: 'agent' },
  { title: 'Campaign', key: 'campaign' },
  { title: 'Date & Time', key: 'dateTime' },
  { title: 'Duration', key: 'duration' },
  { title: 'Last Call Status', key: 'lastCallStatus' },
  { title: 'Enqueue Time', key: 'enqueueTime' },
  { title: 'Served Time', key: 'servedTime' },
  { title: 'End Call Time', key: 'endCallTime' },
  { title: 'Action', key: 'action', sortable: false }
]

const callRecords = ref([
  { no: 1, customerNumber: 'WRTC100', agent: 'Agent Rani', campaign: 'support', dateTime: '10 Sep 2026 07:20:29', duration: '00:05:02', lastCallStatus: 'SERVED', enqueueTime: '00:00:08', servedTime: '00:04:54', endCallTime: '10 Sep 2026 07:23:44' },
  { no: 2, customerNumber: 'WRTC103', agent: 'Agent Dika', campaign: 'marketing', dateTime: '10 Sep 2026 07:15:18', duration: '00:03:26', lastCallStatus: 'IN_QUEUE', enqueueTime: '00:00:06', servedTime: '00:03:20', endCallTime: '10 Sep 2026 07:18:44' },
  { no: 3, customerNumber: 'WRTC109', agent: 'Agent Sinta', campaign: 'sales', dateTime: '10 Sep 2026 07:12:05', duration: '00:00:18', lastCallStatus: 'NOT_ANSWERED', enqueueTime: '00:00:18', servedTime: '00:00:00', endCallTime: '10 Sep 2026 07:12:23' },
  { no: 4, customerNumber: 'WRTC112', agent: 'Agent Bima', campaign: 'support', dateTime: '10 Sep 2026 07:08:51', duration: '00:04:12', lastCallStatus: 'SERVED', enqueueTime: '00:00:09', servedTime: '00:04:03', endCallTime: '10 Sep 2026 07:13:03' },
  { no: 5, customerNumber: 'WRTC118', agent: 'Agent Zahra', campaign: 'collection', dateTime: '10 Sep 2026 07:05:33', duration: '00:02:45', lastCallStatus: 'SERVED', enqueueTime: '00:00:05', servedTime: '00:02:40', endCallTime: '10 Sep 2026 07:08:18' },
])

// Filter Data Sesuai Input Header Filter
const filteredCallRecords = computed(() => {
  return callRecords.value.filter(item => {
    const matchStatus = filterStatus.value === 'All Status' || item.lastCallStatus === filterStatus.value
    const matchInput = !filterInput.value || item.customerNumber.toLowerCase().includes(filterInput.value.toLowerCase())
    const matchCampaign = filterCampaign.value === 'All Campaign' || item.campaign === filterCampaign.value
    const matchAgent = filterAgent.value === 'All Agent' || item.agent === filterAgent.value
    return matchStatus && matchInput && matchCampaign && matchAgent
  })
})

// FUNGSI DOWNLOAD FILE CSV
const handleDownload = () => {
  const currentRecords = filteredCallRecords.value

  if (!currentRecords || currentRecords.length === 0) {
    alert('Tidak ada data Call Records untuk di-download!')
    return
  }

  // 1. Ambil Header kecuali kolom Action
  const validHeaders = tableHeaders.filter(h => h.key !== 'action')
  const headerRow = validHeaders.map(h => `"${h.title}"`).join(',')

  // 2. Petakan Baris Data
  const dataRows = currentRecords.map(row => {
    return validHeaders
      .map(h => {
        let val = row[h.key]
        val = val !== undefined && val !== null ? val : ''
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // 3. Gabung dan Trigger Pengunduhan
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'Call_Reporting_Records.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'SERVED': return 'green-lighten-4 text-green-darken-3'
    case 'IN_QUEUE': return 'amber-lighten-4 text-amber-darken-3'
    case 'NOT_ANSWERED': return 'red-lighten-4 text-red-darken-3'
    case 'IN_IVR': return 'purple-lighten-4 text-purple-darken-3'
    case 'IN_SERVICE': return 'blue-lighten-4 text-blue-darken-3'
    default: return 'grey-lighten-3 text-grey-darken-3'
  }
}

// Modal Detail States
const dialogDetail = ref(false)
const selectedCallItem = ref(null)
const isPlaying = ref(false)
const audioProgress = ref(0)
const audioVolume = ref(80)

const openDetailModal = (item) => {
  selectedCallItem.value = item
  dialogDetail.value = true
}
</script>

<style scoped>
.accent-bar { width: 3px; height: 16px; background-color: #1E75FF; border-radius: 2px; }
.leading-tight { line-height: 1.1; }

.custom-rounded {
  border-radius: 24px !important;
}
</style>