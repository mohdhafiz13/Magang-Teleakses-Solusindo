import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CallReportingView from '../src/views/CallReportingView.vue'

describe('6. Call Reporting View Unit Test', () => {
  const mountComponent = () => {
    return mount(CallReportingView, {
      global: {
        stubs: [
          'DefaultLayout',
          'CustomPagination',
          'Doughnut',
          'v-icon',
          'v-btn',
          'v-card',
          'v-row',
          'v-col',
          'v-avatar',
          'v-select',
          'v-text-field',
          'v-data-table',
          'v-chip',
          'v-menu',
          'v-date-picker',
          'v-card-actions',
          'v-divider',
          'v-slider',
          'v-card-text',
          'v-dialog'
        ]
      }
    })
  }

  it('Step 6.1: Inisialisasi filter awal bernilai default', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.filterInput).toBe('')
    expect(wrapper.vm.filterCampaign).toBe('All Campaign')
  })

  it('Step 6.2: Memastikan fungsi resetFilters mengosongkan input dan mengembalikan kampanye ke All Campaign', async () => {
    const wrapper = mountComponent()
    wrapper.vm.filterInput = 'WRT001'
    wrapper.vm.filterCampaign = 'marketing'
    await wrapper.vm.$nextTick()

    wrapper.vm.resetFilters()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.filterInput).toBe('')
    expect(wrapper.vm.filterCampaign).toBe('All Campaign')
  })

  it('Step 6.3: Format rentang tanggal terhitung dengan benar', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.formattedDateRange).toBeTruthy()
    expect(typeof wrapper.vm.formattedDateRange).toBe('string')
  })

  it('Step 6.4: Fungsi getStatusColor mengembalikan class warna status panggilan yang sesuai', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getStatusColor('SERVED')).toContain('green')
    expect(wrapper.vm.getStatusColor('NOT_ANSWERED')).toContain('red')
  })
})