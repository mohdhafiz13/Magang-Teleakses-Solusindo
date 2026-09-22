import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/agent-panel',
    name: 'AgentPanel',
    component: () => import('../views/AgentPanelView.vue'),
    meta: { requiresAuth: true },
  },

  // --- REPORTING SECTION ---
  {
    path: '/agent-reporting',
    name: 'AgentReporting',
    redirect: '/agent-statistics',
    meta: { requiresAuth: true },
  },
  {
    path: '/agent-statistics',
    name: 'AgentStatistics',
    component: () => import('../views/AgentReportingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/agent-history',
    name: 'AgentHistory',
    component: () => import('../views/AgentReportingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/job-reporting',
    name: 'JobReporting',
    component: () => import('../views/JobReportingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/call-reporting',
    name: 'CallReporting',
    component: () => import('../views/CallReportingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/conversation-reporting',
    name: 'ConversationReporting',
    redirect: '/conversation-statistics',
    meta: { requiresAuth: true },
  },
  {
    path: '/conversation-statistics',
    name: 'ConversationStatistics',
    component: () => import('../views/ConversationReportingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/conversation-history',
    name: 'ConversationHistory',
    component: () => import('../views/ConversationReportingView.vue'),
    meta: { requiresAuth: true },
  },

  // --- OUTBOUND SECTION ---
  {
    path: '/outbound',
    name: 'Outbound',
    component: () => import('../views/OutboundView.vue'),
    meta: { requiresAuth: true },
  },

  // --- MANAGEMENT SECTION ---
  {
    path: '/management-campaign',
    name: 'ManagementCampaign',
    component: () => import('../views/ManagementCampaignView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/management-agent',
    name: 'ManagementAgent',
    component: () => import('../views/ManagementAgentView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/management-summary',
    name: 'ManagementSummary',
    component: () => import('../views/ManagementSummaryView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token') || authStore.token

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresGuest && token) {
    next('/')
  } else {
    next()
  }
})

export default router