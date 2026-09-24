<template>
  <DefaultLayout>
    <!-- Title & Toggle Mode -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Monitoring Panel</h1>
      <p class="text-caption text-grey">Monitor agent activity and operational status in real-time</p>

      <!-- Toggle Mode Switch Call vs Chat -->
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

    <!-- ================= TAB CALL ================= -->
    <div v-if="activeTab === 'call'">
      <div class="text-subtitle-1 font-weight-bold mb-1">Call Overview</div>
      <p class="text-caption text-grey mb-3">Real-time call activity and agent status.</p>
      
      <!-- Summary Cards Call (Pakai Child Component) -->
      <SummaryCards :items="callOverviewCards" :col-width="2" />

      <!-- Section Charts Call (Pakai Child Component) -->
      <v-row class="mb-6">
        <!-- Call Status Donut Chart -->
        <v-col cols="12" md="6">
          <DoughnutChartCard
            title="Call Status"
            center-text="IN_IVR"
            :legend-items="callStatusLegend"
            :chart-data="callStatusChartData"
            :options="chartOptions"
            v-model:filter-value="callStatusFilter"
            :filter-options="['All', 'Today', 'This Week']"
          />
        </v-col>

        <!-- Agent Status Donut Chart -->
        <v-col cols="12" md="6">
          <DoughnutChartCard
            title="Agent Status"
            center-text="READY"
            :legend-items="agentStatusLegend"
            :chart-data="agentStatusChartData"
            :options="chartOptions"
            v-model:filter-value="agentStatusFilter"
            :filter-options="['All', 'Active', 'Inactive']"
          />
        </v-col>
      </v-row>

      <!-- Table Ongoing Call -->
      <v-card elevation="0" class="border rounded-xl pa-6 mb-6 bg-white">
        <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
          <div class="d-flex align-center gap-2">
            <div class="accent-bar"></div>
            <span class="text-subtitle-2 font-weight-bold">Ongoing Call</span>
          </div>
          <v-text-field
            v-model="searchOngoingCall"
            prepend-inner-icon="mdi-magnify"
            placeholder="Cari No. Call / Agent / Campaign..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 300px;"
          ></v-text-field>
        </div>
        <v-data-table
          v-model:page="pageOngoingCall"
          v-model:items-per-page="itemsPerPageOngoingCall"
          :headers="ongoingCallHeaders"
          :items="filteredOngoingCall"
          hide-default-footer
          density="comfortable"
          class="elevation-0"
        >
          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageOngoingCall"
              v-model:itemsPerPage="itemsPerPageOngoingCall"
              :total-items="filteredOngoingCall.length"
            />
          </template>
        </v-data-table>
      </v-card>

      <!-- Table List Agent Call -->
      <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
        <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
          <div class="d-flex align-center gap-2">
            <div class="accent-bar"></div>
            <span class="text-subtitle-2 font-weight-bold">List Agent</span>
          </div>
          <v-text-field
            v-model="searchListAgent"
            prepend-inner-icon="mdi-magnify"
            placeholder="Cari nama agent / status / campaign..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 300px;"
          ></v-text-field>
        </div>
        <v-data-table
          v-model:page="pageListAgent"
          v-model:items-per-page="itemsPerPageListAgent"
          :headers="listAgentHeaders"
          :items="filteredListAgent"
          hide-default-footer
          density="comfortable"
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <v-chip 
              size="x-small" 
              :color="item.status === 'READY' ? 'success' : item.status === 'IN SERVICE' ? 'info' : 'warning'" 
              variant="flat" 
              class="font-weight-bold"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Action Tombol Spy -->
          <template v-slot:item.action="{ item }">
            <v-btn
              size="x-small"
              color="primary"
              variant="outlined"
              rounded="md"
              prepend-icon="mdi-eye-outline"
              class="text-none font-weight-bold"
              @click="openSpyModal(item)"
            >
              Spy
            </v-btn>
          </template>

          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageListAgent"
              v-model:itemsPerPage="itemsPerPageListAgent"
              :total-items="filteredListAgent.length"
            />
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- ================= TAB CHAT ================= -->
    <div v-else>
      <div class="text-subtitle-1 font-weight-bold mb-1">Chat Overview</div>
      <p class="text-caption text-grey mb-3">Real-time chat activity and agent status.</p>

      <!-- Summary Cards Chat (Pakai Child Component) -->
      <SummaryCards :items="chatOverviewCards" :col-width="4" />

      <!-- Section Charts Chat (Pakai Child Component) -->
      <v-row class="mb-6">
        <!-- Chat Status Donut Chart -->
        <v-col cols="12" md="6">
          <DoughnutChartCard
            title="Chat Status"
            center-text="Chat Bot"
            :legend-items="chatStatusLegend"
            :chart-data="chatStatusChartData"
            :options="chartOptions"
            v-model:filter-value="chatStatusFilter"
            :filter-options="['All', 'Today', 'This Week']"
          />
        </v-col>

        <!-- Chat Agent Status Donut Chart -->
        <v-col cols="12" md="6">
          <DoughnutChartCard
            title="Chat Agent Status"
            center-text="LOGGED OUT"
            :legend-items="chatAgentStatusLegend"
            :chart-data="chatAgentStatusChartData"
            :options="chartOptions"
            v-model:filter-value="chatAgentStatusFilter"
            :filter-options="['All', 'Active', 'Inactive']"
          />
        </v-col>
      </v-row>

      <!-- Table On Going Chat -->
      <v-card elevation="0" class="border rounded-xl pa-6 mb-6 bg-white">
        <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
          <div class="d-flex align-center gap-2">
            <div class="accent-bar"></div>
            <span class="text-subtitle-2 font-weight-bold">On Going Chat</span>
          </div>
          <v-text-field
            v-model="searchOngoingChat"
            prepend-inner-icon="mdi-magnify"
            placeholder="Cari Customer / Agent / Username..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 300px;"
          ></v-text-field>
        </div>
        <v-data-table
          v-model:page="pageOngoingChat"
          v-model:items-per-page="itemsPerPageOngoingChat"
          :headers="ongoingChatHeaders"
          :items="filteredOngoingChat"
          hide-default-footer
          density="comfortable"
          class="elevation-0"
        >
          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageOngoingChat"
              v-model:itemsPerPage="itemsPerPageOngoingChat"
              :total-items="filteredOngoingChat.length"
            />
          </template>
        </v-data-table>
      </v-card>

      <!-- Table List Agent Chat -->
      <v-card elevation="0" class="border rounded-xl pa-6 bg-white">
        <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
          <div class="d-flex align-center gap-2">
            <div class="accent-bar"></div>
            <span class="text-subtitle-2 font-weight-bold">List Agent Chat</span>
          </div>
          <v-text-field
            v-model="searchListAgentChat"
            prepend-inner-icon="mdi-magnify"
            placeholder="Cari Agent / Status / Username..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="max-width: 300px;"
          ></v-text-field>
        </div>
        <v-data-table
          v-model:page="pageListAgentChat"
          v-model:items-per-page="itemsPerPageListAgentChat"
          :headers="listAgentChatHeaders"
          :items="filteredListAgentChat"
          hide-default-footer
          density="comfortable"
          class="elevation-0"
        >
          <template v-slot:item.status="{ item }">
            <v-chip 
              size="x-small" 
              :color="item.status === 'READY' ? 'success' : item.status === 'IN SERVICE' ? 'info' : 'warning'" 
              variant="flat" 
              class="font-weight-bold"
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:bottom>
            <CustomPagination
              v-model:page="pageListAgentChat"
              v-model:itemsPerPage="itemsPerPageListAgentChat"
              :total-items="filteredListAgentChat.length"
            />
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Modal Spy Agent (Pakai Child Component Baru) -->
    <SpyAgentModal v-model="showSpyModal" :agent-data="selectedAgent" />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CustomPagination from '../components/CustomPagination.vue'
import SummaryCards from '../components/SummaryCards.vue'
import DoughnutChartCard from '../components/DoughnutChartCard.vue'
import SpyAgentModal from '../components/SpyAgentModal.vue'

const activeTab = ref('call')

// Spy Modal State
const showSpyModal = ref(false)
const selectedAgent = ref(null)

const openSpyModal = (agent) => {
  selectedAgent.value = agent
  showSpyModal.value = true
}

// Search inputs
const searchOngoingCall = ref('')
const searchListAgent = ref('')
const searchOngoingChat = ref('')
const searchListAgentChat = ref('')

// Pagination States
const pageOngoingCall = ref(1)
const itemsPerPageOngoingCall = ref(5)

const pageListAgent = ref(1)
const itemsPerPageListAgent = ref(5)

const pageOngoingChat = ref(1)
const itemsPerPageOngoingChat = ref(5)

const pageListAgentChat = ref(1)
const itemsPerPageListAgentChat = ref(5)

// Filter dropdown states
const callStatusFilter = ref('All')
const agentStatusFilter = ref('All')
const chatStatusFilter = ref('All')
const chatAgentStatusFilter = ref('All')

const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '68%'
}

// Cards Data (Disesuaikan untuk Child Component)
const callOverviewCards = [
  { title: 'IN_IVR', value: 0, icon: 'mdi-dialpad', color: '#8E24AA', bgColor: '#F3E5F5' },
  { title: 'IN_SERVICE', value: 2, icon: 'mdi-headset', color: '#1E88E5', bgColor: '#E3F2FD' },
  { title: 'SERVED', value: 1, icon: 'mdi-phone-incoming', color: '#43A047', bgColor: '#E8F5E9' },
  { title: 'IN_QUEUE', value: 3, icon: 'mdi-human-queue', color: '#FB8C00', bgColor: '#FFF3E0' },
  { title: 'NOT_ANSWERED', value: 5, icon: 'mdi-phone-missed', color: '#E53935', bgColor: '#FFEBEE' },
  { title: 'RINGING', value: 2, icon: 'mdi-phone-ring', color: '#00ACC1', bgColor: '#E0F7FA' },
]

const chatOverviewCards = [
  { title: 'Handled by Chat Bot', value: 213, icon: 'mdi-robot-outline', color: '#8E24AA', bgColor: '#F3E5F5' },
  { title: 'Handled by WA Chat Agent', value: 124, icon: 'mdi-whatsapp', color: '#43A047', bgColor: '#E8F5E9' },
  { title: 'Handled by Web Chat Agent', value: 134, icon: 'mdi-web', color: '#00ACC1', bgColor: '#E0F7FA' },
]

// Legends & Chart Data
const callStatusLegend = [
  { label: 'IN_IVR', color: '#8E24AA' },
  { label: 'IN_SERVICE', color: '#1E88E5' },
  { label: 'SERVED', color: '#43A047' },
  { label: 'IN_QUEUE', color: '#FB8C00' },
  { label: 'NOT_ANSWERED', color: '#E53935' },
  { label: 'RINGING', color: '#00ACC1' },
]

const agentStatusLegend = [
  { label: 'LOGGED OUT', color: '#E53935' },
  { label: 'SUSPENDED', color: '#546E7A' },
  { label: 'LOGGING IN', color: '#C0CA33' },
  { label: 'PAUSE', color: '#FF7043' },
  { label: 'READY', color: '#43A047' },
  { label: 'IN SERVICE', color: '#1E88E5' },
  { label: 'BUSY', color: '#D81B60' },
]

const callStatusChartData = {
  labels: callStatusLegend.map(l => l.label),
  datasets: [{ backgroundColor: callStatusLegend.map(l => l.color), data: [1, 2, 1, 3, 5, 2] }]
}

const agentStatusChartData = {
  labels: agentStatusLegend.map(l => l.label),
  datasets: [{ backgroundColor: agentStatusLegend.map(l => l.color), data: [3, 1, 2, 1, 4, 2, 1] }]
}

const chatStatusLegend = [
  { label: 'Chat Bot', color: '#8E24AA' },
  { label: 'WA Chat Agent', color: '#43A047' },
  { label: 'Web Chat Agent', color: '#00ACC1' },
]

const chatAgentStatusLegend = [
  { label: 'LOGGED OUT', color: '#E53935' },
  { label: 'LOGGING IN', color: '#C0CA33' },
]

const chatStatusChartData = {
  labels: chatStatusLegend.map(l => l.label),
  datasets: [{ backgroundColor: chatStatusLegend.map(l => l.color), data: [213, 124, 134] }]
}

const chatAgentStatusChartData = {
  labels: chatAgentStatusLegend.map(l => l.label),
  datasets: [{ backgroundColor: chatAgentStatusLegend.map(l => l.color), data: [10, 5] }]
}

// Table Headers
const ongoingCallHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Call Number', key: 'callNumber' },
  { title: 'Start Time', key: 'startTime' },
  { title: 'Response Time', key: 'responseTime' },
  { title: 'Served Time', key: 'servedTime' },
  { title: 'Call Type', key: 'callType' },
  { title: 'Campaign', key: 'campaign' },
  { title: 'Agent', key: 'agent' },
]

const listAgentHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Name', key: 'name' },
  { title: 'Status Call', key: 'status' },
  { title: 'Campaign', key: 'campaign' },
  { title: 'Action', key: 'action', sortable: false }, // Kolom Action
]

const ongoingChatHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Customer', key: 'customer' },
  { title: 'Start Time', key: 'startTime' },
  { title: 'Duration', key: 'duration' },
  { title: 'Channel Type', key: 'channelType' },
  { title: 'Agent', key: 'agent' },
  { title: 'Username', key: 'username' },
]

const listAgentChatHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Agent', key: 'agent' },
  { title: 'Username', key: 'username' },
  { title: 'Status', key: 'status' },
  { title: 'Ongoing Chats', key: 'ongoingChats' },
  { title: 'Total Chats Today', key: 'totalChats' },
]

// Data Dummy
const ongoingCallData = ref([
  { no: 1, callNumber: 'WRT003', startTime: '30 Jan 2026 16:29:53', responseTime: '00:00:05', servedTime: '221 days 19:53:30', callType: 'Incoming', campaign: 'Campaign', agent: 'Agent Firya' },
  { no: 2, callNumber: 'WRT005', startTime: '30 Jan 2026 16:06:34', responseTime: '00:00:06', servedTime: '221 days 19:43:29', callType: 'Incoming', campaign: 'Campaign', agent: 'Agent Firya' },
  { no: 3, callNumber: 'WRT017', startTime: '29 Jan 2026 13:36:21', responseTime: '00:00:05', servedTime: '222 days 22:14:02', callType: 'Incoming', campaign: 'Campaign', agent: 'Agent Firya' },
  { no: 4, callNumber: 'WRT008', startTime: '29 Jan 2026 12:42:39', responseTime: '00:00:04', servedTime: '222 days 23:08:39', callType: 'Incoming', campaign: 'Campaign', agent: 'Agent Zahra' },
  { no: 5, callNumber: 'WRT012', startTime: '29 Jan 2026 09:55:28', responseTime: '00:00:05', servedTime: '223 days 01:55:05', callType: 'Incoming', campaign: 'Campaign', agent: 'Agent Zahra' },
  { no: 6, callNumber: 'WRT021', startTime: '28 Jan 2026 11:20:12', responseTime: '00:00:03', servedTime: '224 days 03:12:00', callType: 'Outgoing', campaign: 'Sales', agent: 'Agent Bima' }
])

const listAgentData = ref([
  { no: 1, name: 'Agent Lisa2', status: 'LOGGING IN', campaign: 'support,marketing,lang_id,coba_lisa' },
  { no: 2, name: 'Agent Firya', status: 'IN SERVICE', campaign: 'support,marketing,lang_id,main_flw' },
  { no: 3, name: 'Agent Zahra', status: 'READY', campaign: 'support,lang_id,telemarketing' },
  { no: 4, name: 'Agent Bima', status: 'READY', campaign: 'sales_campaign,lang_id' }
])

const ongoingChatData = ref([
  { no: 1, customer: 'CUST-001', startTime: '26 Jan 2026 14:12:34', duration: '00:02:15', channelType: 'Website', agent: 'Agent Rani', username: 'rani01' },
  { no: 2, customer: 'CUST-002', startTime: '26 Jan 2026 14:15:21', duration: '00:01:03', channelType: 'WhatsApp', agent: 'Agent Dika', username: 'dika02' },
  { no: 3, customer: 'CUST-003', startTime: '26 Jan 2026 14:16:45', duration: '00:04:28', channelType: 'Website', agent: 'Agent Sinta', username: 'sinta01' }
])

const listAgentChatData = ref([
  { no: 1, agent: 'Agent Rani', username: 'rani01', status: 'IN SERVICE', ongoingChats: 5, totalChats: 24 },
  { no: 2, agent: 'Agent Dika', username: 'dika02', status: 'READY', ongoingChats: 2, totalChats: 18 }
])

// Filter Computed
const filteredOngoingCall = computed(() => {
  if (!searchOngoingCall.value) return ongoingCallData.value
  const q = searchOngoingCall.value.toLowerCase()
  return ongoingCallData.value.filter(i => i.callNumber.toLowerCase().includes(q) || i.agent.toLowerCase().includes(q))
})

const filteredListAgent = computed(() => {
  if (!searchListAgent.value) return listAgentData.value
  const q = searchListAgent.value.toLowerCase()
  return listAgentData.value.filter(i => i.name.toLowerCase().includes(q) || i.status.toLowerCase().includes(q))
})

const filteredOngoingChat = computed(() => {
  if (!searchOngoingChat.value) return ongoingChatData.value
  const q = searchOngoingChat.value.toLowerCase()
  return ongoingChatData.value.filter(i => i.customer.toLowerCase().includes(q) || i.agent.toLowerCase().includes(q))
})

const filteredListAgentChat = computed(() => {
  if (!searchListAgentChat.value) return listAgentChatData.value
  const q = searchListAgentChat.value.toLowerCase()
  return listAgentChatData.value.filter(i => i.agent.toLowerCase().includes(q) || i.username.toLowerCase().includes(q))
})
</script>

<style scoped>
.accent-bar { 
  width: 3px; 
  height: 16px; 
  background-color: #1E75FF; 
  border-radius: 2px; 
}
</style>