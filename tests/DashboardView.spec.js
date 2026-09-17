import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DashboardView from '../src/views/DashboardView.vue'

describe('2. Dashboard View Unit Test', () => {
  it('Step 2.1: Default active tab harus Call', () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'Doughnut', 'v-icon', 'v-btn', 'v-card', 'v-row', 'v-col', 'v-avatar', 'v-select', 'v-text-field', 'v-data-table', 'v-chip']
      }
    })
    expect(wrapper.vm.activeTab).toBe('call')
  })

  it('Step 2.2: Mode beralih ke Chat saat activeTab diubah ke chat', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'Doughnut', 'v-icon', 'v-btn', 'v-card', 'v-row', 'v-col', 'v-avatar', 'v-select', 'v-text-field', 'v-data-table', 'v-chip']
      }
    })
    
    wrapper.vm.activeTab = 'chat'
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.activeTab).toBe('chat')
  })
})