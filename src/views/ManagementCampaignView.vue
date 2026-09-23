<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h5 font-weight-bold">Management Campaign</h1>
      <p class="text-grey">
        Campaign management page
      </p>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useCampaignStore } from '../stores/campaign'

const campaignStore = useCampaignStore()

console.log('Management Campaign Loaded')
console.log('Campaign Data:', campaignStore.campaigns)
console.log('Total Campaign:', campaignStore.totalCampaign)
console.log('Active Campaign:', campaignStore.activeCampaign)
console.log('Outbound Campaign:', campaignStore.outboundCampaign)
</script>