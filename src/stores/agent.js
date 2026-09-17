import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    agents: [
      {
        id: 1,
        name: 'Agent Lisa',
        username: 'lisa01',
        status: 'READY',
        campaign: 'Support'
      },
      {
        id: 2,
        name: 'Agent Firya',
        username: 'firya01',
        status: 'BUSY',
        campaign: 'Marketing'
      },
      {
        id: 3,
        name: 'Agent Zahra',
        username: 'zahra01',
        status: 'OFFLINE',
        campaign: '-'
      }
    ],

    loading: false,
    error: null
  }),

  getters: {
    totalAgent: (state) => state.agents.length,

    readyAgent: (state) =>
      state.agents.filter(
        agent => agent.status === 'READY'
      ).length,

    busyAgent: (state) =>
      state.agents.filter(
        agent => agent.status === 'BUSY'
      ).length
  },

  actions: {
    addAgent(agent) {
      this.agents.push(agent)
    },

    updateAgent(id, data) {
      const index = this.agents.findIndex(
        agent => agent.id === id
      )

      if (index !== -1) {
        this.agents[index] = {
          ...this.agents[index],
          ...data
        }
      }
    },

    deleteAgent(id) {
      this.agents = this.agents.filter(
        agent => agent.id !== id
      )
    }
  }
})