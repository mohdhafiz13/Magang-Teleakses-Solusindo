import { defineStore } from 'pinia'

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaigns: [
      {
        id: 1,
        name: 'Customer Support Campaign',
        type: 'Inbound',
        status: 'ACTIVE',
        totalAgent: 5,
        startDate: '2026-09-01',
        endDate: '2026-09-30'
      },
      {
        id: 2,
        name: 'Marketing Product Campaign',
        type: 'Outbound',
        status: 'ACTIVE',
        totalAgent: 8,
        startDate: '2026-09-05',
        endDate: '2026-10-05'
      },
      {
        id: 3,
        name: 'Survey Customer Campaign',
        type: 'Outbound',
        status: 'INACTIVE',
        totalAgent: 3,
        startDate: '2026-08-01',
        endDate: '2026-08-31'
      }
    ],

    loading: false,
    error: null
  }),

  getters: {
    totalCampaign: (state) => state.campaigns.length,

    activeCampaign: (state) =>
      state.campaigns.filter(
        campaign => campaign.status === 'ACTIVE'
      ).length,

    inactiveCampaign: (state) =>
      state.campaigns.filter(
        campaign => campaign.status === 'INACTIVE'
      ).length,

    outboundCampaign: (state) =>
      state.campaigns.filter(
        campaign => campaign.type === 'Outbound'
      ).length
  },

  actions: {
    addCampaign(campaign) {
      this.campaigns.push(campaign)
    },

    updateCampaign(id, data) {
      const index = this.campaigns.findIndex(
        campaign => campaign.id === id
      )

      if (index !== -1) {
        this.campaigns[index] = {
          ...this.campaigns[index],
          ...data
        }
      }
    },

    deleteCampaign(id) {
      this.campaigns = this.campaigns.filter(
        campaign => campaign.id !== id
      )
    }
  }
})