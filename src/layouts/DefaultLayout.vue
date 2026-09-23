<template>
  <v-app class="bg-grey-lighten-4">
    <!-- Sidebar Kiri -->
    <v-navigation-drawer
      app
      v-model="drawer"
      width="260"
      elevation="0"
      class="border-e"
    >
      <!-- Header Sidebar: Logo TelAccess & Icon Toggle -->
      <div class="pa-4 d-flex align-center justify-space-between border-b">
        <div class="d-flex align-center ga-3">
          <img :src="logoImage" alt="TelAccess Logo" style="height: 32px; width: auto; object-fit: contain;" />
          <span class="font-weight-bold text-subtitle-1 text-grey-darken-4">Supervisor ACD</span>
        </div>

        <button 
          class="sidebar-toggle-btn d-flex align-center justify-center rounded pa-1"
          @click="drawer = !drawer"
          title="Toggle Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <polyline points="15 9 12 12 15 15"></polyline>
          </svg>
        </button>
      </div>

      <v-list density="compact" nav class="mt-2">
        <!-- GENERAL -->
        <v-list-subheader class="text-caption font-weight-bold text-grey">GENERAL</v-list-subheader>
        <v-list-item 
          to="/" 
          prepend-icon="mdi-view-dashboard-outline" 
          title="Dashboard" 
          value="dashboard" 
          active-color="primary" 
          rounded="lg"
        ></v-list-item>
        <v-list-item 
          to="/agent-panel" 
          prepend-icon="mdi-account-group-outline" 
          title="Agent Panel" 
          value="agent-panel" 
          active-color="primary" 
          rounded="lg"
        ></v-list-item>

        <!-- REPORTING -->
        <v-list-subheader class="text-caption font-weight-bold text-grey mt-4">REPORTING</v-list-subheader>
        <v-list-group value="agent-reporting">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-file-chart-outline"
              title="Agent Reporting"
              rounded="lg"
            ></v-list-item>
          </template>

          <!-- SUBMENU 1: Agent Statistics -->
          <v-list-item
            to="/agent-statistics"
            title="Agent Statistics"
            value="agent-statistics"
            active-color="primary"
            rounded="lg"
            class="pl-8"
          ></v-list-item>

          <!-- SUBMENU 2: Agent History -->
          <v-list-item
            to="/agent-history"
            title="Agent History"
            value="agent-history"
            active-color="primary"
            rounded="lg"
            class="pl-8"
          ></v-list-item>
        </v-list-group>

        <v-list-item 
          to="/job-reporting" 
          prepend-icon="mdi-phone-log-outline" 
          title="Job Reporting" 
          value="job-rep" 
          rounded="lg"
        ></v-list-item>
        <v-list-item 
          to="/call-reporting" 
          prepend-icon="mdi-phone-incoming-outline" 
          title="Call Reporting" 
          value="call-rep" 
          rounded="lg"
        ></v-list-item>

        <!-- CONVERSATION REPORTING DROPDOWN -->
        <v-list-group value="conversation-reporting">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-message-text-outline"
              title="Conversation Reporting"
              rounded="lg"
            ></v-list-item>
          </template>

          <v-list-item
            to="/conversation-statistics"
            title="Conversation Statistics"
            value="conv-stats"
            active-color="primary"
            rounded="lg"
            class="pl-8"
          ></v-list-item>

          <v-list-item
            to="/conversation-history"
            title="Conversation History"
            value="conv-hist"
            active-color="primary"
            rounded="lg"
            class="pl-8"
          ></v-list-item>
        </v-list-group>

       <!-- OUTBOUND -->
        <v-list-subheader class="text-caption font-weight-bold text-grey mt-4">
              OUTBOUND
        </v-list-subheader>

        <v-list-group value="outbound">

          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-phone-outgoing-outline"
              title="Outbound"
              rounded="lg"
            ></v-list-item>
          </template>
          <v-list-item
            to="/outbound"
            title="Upload Outbound"
            value="upload-outbound"
            rounded="lg"
            class="pl-8"
          ></v-list-item>
          <v-list-item
            to="/upload-report"
            title="Upload Report"
            value="upload-report"
            rounded="lg"
            class="pl-8"
          ></v-list-item>
          <v-list-item
            to="/outbound-call"
            title="Outbound Call"
            value="outbound-call"
            rounded="lg"
            class="pl-8"
          ></v-list-item>
        </v-list-group>

        <!-- MANAGEMENT -->
        <v-list-subheader class="text-caption font-weight-bold text-grey mt-4">MANAGEMENT</v-list-subheader>
        <v-list-item 
          to="/management-campaign" 
          prepend-icon="mdi-bullhorn-outline" 
          title="Management Campaign" 
          value="m-campaign" 
          rounded="lg"
        ></v-list-item>
        <v-list-item 
          to="/management-agent" 
          prepend-icon="mdi-account-cog-outline" 
          title="Management Agent" 
          value="m-agent" 
          rounded="lg"
        ></v-list-item>
        <v-list-item 
          to="/management-summary" 
          prepend-icon="mdi-chart-box-outline" 
          title="Management Summary" 
          value="m-summary" 
          rounded="lg"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Top Header Bar -->
    <v-app-bar app flat class="border-b bg-white px-4">
      <button 
        v-if="!drawer"
        class="sidebar-toggle-btn d-flex align-center justify-center rounded pa-1"
        @click="drawer = !drawer"
        title="Open Sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <polyline points="13 9 16 12 13 15"></polyline>
        </svg>
      </button>

      <v-spacer></v-spacer>

      <!-- Dropdown Profil & Logout -->
      <v-menu offset-y transition="scale-transition">
        <template v-slot:activator="{ props }">
          <div
            v-bind="props"
            class="d-flex align-center gap-3 cursor-pointer py-1 px-2 rounded-lg hover-bg"
            style="cursor: pointer;"
          >
            <div class="text-right mr-2">
              <div class="text-subtitle-2 font-weight-bold">
                {{ authStore.user?.username || 'John Doe' }}
              </div>
              <div class="text-caption text-grey mt-n1">
                {{ authStore.user?.role || 'Supervisor' }}
              </div>
            </div>
            <v-avatar color="primary" size="38">
              <v-icon icon="mdi-account" color="white"></v-icon>
            </v-avatar>
          </div>
        </template>

        <v-card min-width="200" class="rounded-lg elevation-3 mt-2">
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-account-outline"
              title="Profil Saya"
              value="profile"
              rounded="md"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-cog-outline"
              title="Pengaturan"
              value="settings"
              rounded="md"
            ></v-list-item>
            
            <v-divider class="my-1"></v-divider>

            <v-list-item
              prepend-icon="mdi-logout"
              title="Keluar (Logout)"
              value="logout"
              color="red"
              rounded="md"
              class="text-red"
              @click="handleLogout"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Content Utama -->
    <v-main class="pa-6 pt-16">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/cropped-Logo-Site.png'

const router = useRouter()
const authStore = useAuthStore()

const drawer = ref(true)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.hover-bg:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.sidebar-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.sidebar-toggle-btn:hover {
  background-color: #F1F5F9;
}
</style>