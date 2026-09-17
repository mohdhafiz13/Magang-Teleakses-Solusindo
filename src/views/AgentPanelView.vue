<template>
  <DefaultLayout>
    <!-- Header Title & Tab Toggle -->
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">Agent Panel</h1>
      <p class="text-caption text-grey">Manage and monitor agent status and campaign assignments.</p>

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

    <!-- ================= TAB AGENT CALL ================= -->
    <v-card v-if="activeTab === 'call'" elevation="0" class="border rounded-xl pa-6 bg-white">
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-4">
        <div>
          <h2 class="text-subtitle-1 font-weight-bold">Agent Call</h2>
          <p class="text-caption text-grey mb-0">Manage agent status and campaign assignments for call operations.</p>
        </div>
        <!-- Container Flex dengan Jarak Jelas (ga-4 & ml-4) -->
        <div class="d-flex align-center ga-4">
          <v-text-field
            v-model="searchCall"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search agent, extension, or campaign..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 280px;"
          ></v-text-field>
          <v-btn
            variant="outlined"
            color="success"
            rounded="lg"
            prepend-icon="mdi-download"
            class="text-none font-weight-bold ml-4"
          >
            Download
          </v-btn>
        </div>
      </div>

      <v-data-table
        v-model:page="pageCall"
        v-model:items-per-page="itemsPerPageCall"
        :headers="callHeaders"
        :items="filteredCallAgents"
        hide-default-footer
        density="comfortable"
        class="elevation-0"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            size="x-small"
            :color="item.status === 'LOGGING IN' ? 'warning' : 'error'"
            variant="flat"
            class="font-weight-bold"
          >
            ● {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.availableCampaigns="{ item }">
          <div class="d-flex flex-wrap gap-1 py-2">
            <v-chip
              v-for="(camp, idx) in item.availableCampaigns"
              :key="idx"
              size="x-small"
              variant="tonal"
              color="grey-darken-3"
              class="rounded-md font-weight-medium"
            >
              {{ camp }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.assignedCampaigns="{ item }">
          <div class="py-2" style="min-width: 260px;">
            <v-select
              v-model="item.assignedCampaigns"
              :items="allCampaignOptions"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              class="custom-select"
            ></v-select>
          </div>
        </template>

        <template v-slot:bottom>
          <CustomPagination
            v-model:page="pageCall"
            v-model:itemsPerPage="itemsPerPageCall"
            :total-items="filteredCallAgents.length"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- ================= TAB AGENT CHAT ================= -->
    <v-card v-else elevation="0" class="border rounded-xl pa-6 bg-white">
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-4">
        <div>
          <h2 class="text-subtitle-1 font-weight-bold">Agent Chat</h2>
          <p class="text-caption text-grey mb-0">Monitor chat agent status and availability in real-time.</p>
        </div>
        <!-- Container Flex dengan Jarak Jelas (ga-4 & ml-4) -->
        <div class="d-flex align-center ga-4">
          <v-text-field
            v-model="searchChat"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search agent or username..."
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            style="min-width: 280px;"
          ></v-text-field>
          <v-btn
            variant="outlined"
            color="success"
            rounded="lg"
            prepend-icon="mdi-download"
            class="text-none font-weight-bold ml-4"
          >
            Download
          </v-btn>
        </div>
      </div>

      <v-data-table
        v-model:page="pageChat"
        v-model:items-per-page="itemsPerPageChat"
        :headers="chatHeaders"
        :items="filteredChatAgents"
        hide-default-footer
        density="comfortable"
        class="elevation-0"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            size="x-small"
            :color="item.status === 'LOGGING IN' ? 'warning' : 'error'"
            variant="flat"
            class="font-weight-bold"
          >
            ● {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:bottom>
          <CustomPagination
            v-model:page="pageChat"
            v-model:itemsPerPage="itemsPerPageChat"
            :total-items="filteredChatAgents.length"
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
const searchCall = ref('')
const searchChat = ref('')

const pageCall = ref(1)
const itemsPerPageCall = ref(5)

const pageChat = ref(1)
const itemsPerPageChat = ref(5)

const allCampaignOptions = ['support', 'marketing', 'data_verification', 'sales', 'diskon', 'Livechat', 'Perbankan', 'lang_id']

const callHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Extension', key: 'extension' },
  { title: 'Agent', key: 'agent' },
  { title: 'Status', key: 'status' },
  { title: 'Available Campaign', key: 'availableCampaigns', sortable: false },
  { title: 'Assigned Campaign', key: 'assignedCampaigns', sortable: false },
]

const chatHeaders = [
  { title: 'No', key: 'no' },
  { title: 'Agent', key: 'agent' },
  { title: 'Username', key: 'username' },
  { title: 'Status', key: 'status' },
]

const callAgents = ref([
  { no: 1, extension: '09001', agent: 'Agent Lisa2', status: 'LOGGING IN', availableCampaigns: ['support', 'marketing'], assignedCampaigns: ['support', 'marketing'] },
  { no: 2, extension: '09002', agent: 'Agent Dika', status: 'LOGGED OUT', availableCampaigns: ['lang_id', 'support'], assignedCampaigns: ['lang_id'] },
  { no: 3, extension: '09003', agent: 'Agent Rani', status: 'LOGGED OUT', availableCampaigns: ['sales'], assignedCampaigns: ['sales'] }
])

const chatAgents = ref([
  { no: 1, agent: 'Agent Rani', username: 'rani01', status: 'LOGGING IN' },
  { no: 2, agent: 'Agent Dika', username: 'dika02', status: 'LOGGED OUT' }
])

const filteredCallAgents = computed(() => {
  if (!searchCall.value) return callAgents.value
  const q = searchCall.value.toLowerCase()
  return callAgents.value.filter(i => i.agent.toLowerCase().includes(q) || i.extension.toLowerCase().includes(q))
})

const filteredChatAgents = computed(() => {
  if (!searchChat.value) return chatAgents.value
  const q = searchChat.value.toLowerCase()
  return chatAgents.value.filter(i => i.agent.toLowerCase().includes(q) || i.username.toLowerCase().includes(q))
})
</script>

<style scoped>
.custom-select :deep(.v-field__input) {
  gap: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>