<template>
  <DefaultLayout>
    <!-- Header Title & Tab Toggle -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Agent History</h1>
      <p class="text-caption text-grey">Review agent status changes, activity, and duration over time.</p>

      <!-- Toggle Mode Switch Call vs Chat Berjarak & Outlined -->
      <div class="d-flex ga-3 mt-4">
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
    </div>

    <!-- Main Card Content -->
    <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
      <!-- Filter Bar (Date, Search Autocomplete, Submit, Download) -->
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-4">
        <!-- Group Filter Kiri -->
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

          <!-- Search Agent Autocomplete/List -->
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

          <!-- Submit Button -->
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

        <!-- Download Button Kanan -->
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

      <!-- Table Section -->
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

        <template v-slot:bottom>
          <CustomPagination
            v-model:page="page"
            v-model:itemsPerPage="itemsPerPage"
            :total-items="filteredHistoryRecords.length"
          />
        </template>
      </v-data-table>
    </v-card>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CustomPagination from '../components/CustomPagination.vue'

const activeTab = ref('call')
const searchAgent = ref(null)

const page = ref(1)
const itemsPerPage = ref(5)

// List agen untuk opsi dropdown search
const agentList = [
  'agentta',
  'bima03',
  'zahra01',
  'dika02',
  'rani01',
  'firya02',
  'lisa01'
]

// Date Range Picker State
const menuDate = ref(false)
const selectedDates = ref([
  new Date(2026, 7, 31),
  new Date(2026, 8, 30)
])

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

const handleSubmit = () => {
  // Action submit filter
}

const handleDownload = () => {
  alert('Downloading Agent History Report...')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'READY':
      return 'green-lighten-4 text-green-darken-4'
    case 'IN SERVICE':
      return 'blue-lighten-4 text-blue-darken-4'
    case 'LOGGING IN':
      return 'yellow-lighten-4 text-yellow-darken-4'
    case 'LOGGED OUT':
      return 'red-lighten-4 text-red-darken-4'
    case 'PAUSE':
      return 'orange-lighten-4 text-orange-darken-4'
    case 'BUSY':
      return 'pink-lighten-4 text-pink-darken-4'
    default:
      return 'grey-lighten-3 text-grey-darken-3'
  }
}

// Table Headers
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

// Data Dummy Call History
const callHistoryRecords = ref([
  { no: 1, extension: 'agent-ta', dateTime: '31 Aug 2026 15:18:14', agent: 'agentta', status: 'PAUSE', statusDuration: '00:03:00', campaign: 'lang_id', reason: 'Personal break' },
  { no: 2, extension: 'agent-bd', dateTime: '31 Aug 2026 15:15:14', agent: 'bima03', status: 'LOGGED OUT', statusDuration: '00:01:42', campaign: 'support_id', reason: 'End of shift' },
  { no: 3, extension: 'agent-za', dateTime: '31 Aug 2026 15:12:33', agent: 'zahra01', status: 'LOGGING IN', statusDuration: '00:00:40', campaign: 'sales_id', reason: 'System restart' },
  { no: 4, extension: 'agent-di', dateTime: '13 Aug 2026 08:29:02', agent: 'dika02', status: 'PAUSE', statusDuration: '00:00:09', campaign: 'collection_id', reason: 'Meeting' },
  { no: 5, extension: 'agent-ra', dateTime: '13 Aug 2026 08:28:09', agent: 'rani01', status: 'BUSY', statusDuration: '00:00:01', campaign: 'sales_id', reason: 'On a call' },
  { no: 6, extension: 'agent-fi', dateTime: '12 Aug 2026 14:10:00', agent: 'firya02', status: 'READY', statusDuration: '00:15:20', campaign: 'lang_id', reason: 'Available' },
  { no: 7, extension: 'agent-li', dateTime: '12 Aug 2026 11:45:12', agent: 'lisa01', status: 'IN SERVICE', statusDuration: '00:05:40', campaign: 'support_id', reason: 'Handling call' }
])

// Data Dummy Chat History
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