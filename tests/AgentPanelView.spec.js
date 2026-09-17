import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AgentPanelView from '../src/views/AgentPanelView.vue'

describe('3. Agent Panel View Unit Test', () => {
  it('Step 3.1: Default active tab harus Call', () => {
    const wrapper = mount(AgentPanelView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'v-btn', 'v-card', 'v-text-field', 'v-data-table', 'v-chip', 'v-select']
      }
    })
    expect(wrapper.vm.activeTab).toBe('call')
  })

  it('Step 3.2: Filter pencarian agen call berfungsi', async () => {
    const wrapper = mount(AgentPanelView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'v-btn', 'v-card', 'v-text-field', 'v-data-table', 'v-chip', 'v-select']
      }
    })

    // Ketik kata kunci 'Lisa'
    wrapper.vm.searchCall = 'Lisa'
    await wrapper.vm.$nextTick()

    // Hasil filter harus hanya menyisakan agen Lisa
    expect(wrapper.vm.filteredCallAgents.length).toBe(1)
    expect(wrapper.vm.filteredCallAgents[0].agent).toContain('Lisa')
  })
})