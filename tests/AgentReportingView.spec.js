import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AgentReportingView from '../src/views/AgentReportingView.vue'
describe('5. Agent Reporting View Unit Test', () => {
  const mountComponent = () => {
    return mount(AgentReportingView, {
      global: {
        stubs: [
          'DefaultLayout',
          'CustomPagination',
          'v-btn',
          'v-card',
          'v-text-field',
          'v-data-table',
          'v-chip',
          'v-combobox',
          'v-menu',
          'v-date-picker',
          'v-card-actions'
        ]
      }
    })
  }

  it('Step 5.1: Active tab awal harus Call', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.activeTab).toBe('call')
  })

  it('Step 5.2: Mengganti tab ke Chat akan menyesuaikan header tabel yang aktif', async () => {
    const wrapper = mountComponent()
    wrapper.vm.activeTab = 'chat'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.activeTab).toBe('chat')
    expect(wrapper.vm.filteredHistoryRecords.length).toBe(wrapper.vm.chatHistoryRecords.length)
  })

  it('Step 5.3: Filter pencarian nama/username agen berfungsi dengan benar', async () => {
    const wrapper = mountComponent()
    wrapper.vm.searchAgent = 'rani01'
    await wrapper.vm.$nextTick()

    const results = wrapper.vm.filteredHistoryRecords
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => (r.agent && r.agent.toLowerCase().includes('rani01')) || (r.username && r.username.toLowerCase().includes('rani01')))).toBe(true)
  })

  it('Step 5.4: Fungsi getStatusColor mengembalikan class warna yang tepat', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getStatusColor('READY')).toContain('green')
    expect(wrapper.vm.getStatusColor('LOGGED OUT')).toContain('red')
    expect(wrapper.vm.getStatusColor('PAUSE')).toContain('orange')
  })
})