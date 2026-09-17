import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import JobReportingView from '../src/views/JobReportingView.vue'

describe('4. Job Reporting View Unit Test', () => {
  it('Step 4.1: Default active tab harus Call', () => {
    const wrapper = mount(JobReportingView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'Doughnut', 'v-icon', 'v-btn', 'v-card', 'v-row', 'v-col', 'v-avatar', 'v-select', 'v-text-field', 'v-data-table', 'v-chip', 'v-dialog', 'v-slider', 'v-menu', 'v-date-picker', 'v-card-actions', 'v-divider', 'v-card-text']
      }
    })
    expect(wrapper.vm.activeTab).toBe('call')
  })

  it('Step 4.2: Reset filter mengembalikan nilai input & campaign ke default', async () => {
    const wrapper = mount(JobReportingView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'Doughnut', 'v-icon', 'v-btn', 'v-card', 'v-row', 'v-col', 'v-avatar', 'v-select', 'v-text-field', 'v-data-table', 'v-chip', 'v-dialog', 'v-slider', 'v-menu', 'v-date-picker', 'v-card-actions', 'v-divider', 'v-card-text']
      }
    })

    // Ubah nilai filter
    wrapper.vm.filterInput = 'WRTC14'
    wrapper.vm.filterCampaign = 'marketing'
    
    // Panggil fungsi reset
    wrapper.vm.resetFilters()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filterInput).toBe('')
    expect(wrapper.vm.filterCampaign).toBe('All Campaign')
  })

  it('Step 4.3: Membuka dialog detail job dengan data yang benar', async () => {
    const wrapper = mount(JobReportingView, {
      global: {
        stubs: ['DefaultLayout', 'CustomPagination', 'Doughnut', 'v-icon', 'v-btn', 'v-card', 'v-row', 'v-col', 'v-avatar', 'v-select', 'v-text-field', 'v-data-table', 'v-chip', 'v-dialog', 'v-slider', 'v-menu', 'v-date-picker', 'v-card-actions', 'v-divider', 'v-card-text']
      }
    })

    const sampleJob = { no: 1, campaign: 'lang_id', customerNumber: 'WRTC14', agent: 'Agent Rani' }
    
    // Panggil method openDetailModal
    wrapper.vm.openDetailModal(sampleJob)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.dialogDetail).toBe(true)
    expect(wrapper.vm.selectedJob).toEqual(sampleJob)
  })
})