import { defineStore } from 'pinia'
import { useAgentStore } from './agent'
import { useCampaignStore } from './campaign'
import { useOutboundStore } from './outbound'

export const useSummaryStore = defineStore('summary', {

  getters: {

    dashboardSummary() {
      const agentStore = useAgentStore()
      const campaignStore = useCampaignStore()
      const outboundStore = useOutboundStore()

      return {
        totalAgent: agentStore.totalAgent,

        readyAgent: agentStore.readyAgent,

        busyAgent: agentStore.busyAgent,

        totalCampaign: campaignStore.totalCampaign,

        activeCampaign: campaignStore.activeCampaign,

        totalOutboundCall: outboundStore.totalCall,

        connectedCall: outboundStore.connectedCall,

        failedCall: outboundStore.failedCall,

        pendingCall: outboundStore.pendingCall
      }
    }

  }

})