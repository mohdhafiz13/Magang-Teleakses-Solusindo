import { defineStore } from 'pinia'

export const useOutboundStore = defineStore('outbound', {
  state: () => ({
    outboundCalls: [
      {
        id: 1,
        customer: 'Customer A',
        phone: '081234567890',
        campaign: 'Marketing Product Campaign',
        agent: 'Agent Firya',
        status: 'CONNECTED',
        duration: '00:05:24',
        callTime: '2026-09-16 10:15:20'
      },
      {
        id: 2,
        customer: 'Customer B',
        phone: '081298765432',
        campaign: 'Marketing Product Campaign',
        agent: 'Agent Lisa',
        status: 'NO ANSWER',
        duration: '00:00:00',
        callTime: '2026-09-16 10:20:10'
      },
      {
        id: 3,
        customer: 'Customer C',
        phone: '082112223333',
        campaign: 'Survey Customer Campaign',
        agent: 'Agent Zahra',
        status: 'PENDING',
        duration: '00:00:00',
        callTime: '2026-09-16 10:25:45'
      }
    ],

    customers: [
      {
        id: 1,
        name: 'Customer A',
        phone: '081234567890',
        status: 'WAITING'
      },
      {
        id: 2,
        name: 'Customer B',
        phone: '081298765432',
        status: 'WAITING'
      }
    ],

    loading: false,
    error: null
  }),

  getters: {
    totalCall: (state) => state.outboundCalls.length,

    connectedCall: (state) =>
      state.outboundCalls.filter(
        call => call.status === 'CONNECTED'
      ).length,

    failedCall: (state) =>
      state.outboundCalls.filter(
        call => call.status === 'NO ANSWER'
      ).length,

    pendingCall: (state) =>
      state.outboundCalls.filter(
        call => call.status === 'PENDING'
      ).length,

      totalCustomer: (state) =>
        state.customers.length,

        waitingCustomer: (state) =>
        state.customers.filter(
            customer => customer.status === 'WAITING'
        ).length,
    },

  actions: {

  addOutboundCall(call) {
    this.outboundCalls.push(call)
  },


  addCustomers(customers) {
    this.customers.push(...customers)
  },


  updateCustomerStatus(id, status) {

    const customer = this.customers.find(
      item => item.id === id
    )

    if(customer){
      customer.status = status
    }

  },


  updateCallStatus(id, status) {

    const call = this.outboundCalls.find(
      item => item.id === id
    )

    if(call){
      call.status = status
    }

  },


  deleteOutboundCall(id) {

    this.outboundCalls =
      this.outboundCalls.filter(
        call => call.id !== id
      )

  }

}
})